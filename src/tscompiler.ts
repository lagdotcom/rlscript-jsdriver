import {
  ASTArg,
  ASTBinaryCase,
  ASTBinaryOp,
  ASTCall,
  ASTCode,
  ASTComponentDecl,
  ASTEnumDecl,
  ASTExpr,
  ASTExprCase,
  ASTFnDecl,
  ASTGlobalDecl,
  ASTIdent,
  ASTProgram,
  ASTQName,
  ASTQuery,
  ASTSystemDecl,
  ASTTagDecl,
  ASTTemplateDecl,
  ASTTileTypeDecl,
  ASTType,
  ASTUnaryOp,
} from "./ast";
import library, { LibFunction, LibFunctionParam } from "./libdefs";
import { readFileSync, writeFileSync } from "fs";

import Stack from "./Stack";
import { join } from "path";

export class BadCallError extends Error {
  constructor(fn: ASTFnDecl | LibFunction, details: string) {
    super(`Error calling ${fn.name}: ${details}`);
  }
}

export class CannotResolveError extends Error {
  constructor(name: string, scope: TSScope) {
    super(`Cannot resolve: ${name} in ${scope.name}`);
  }
}

export class CoerceCallError extends Error {
  constructor(expr: ASTCall) {
    super(`Cannot coerce: ${JSON.stringify(expr)}`);
  }
}

export class RedefinitionError extends Error {
  constructor(name: string, type: ASTType) {
    super(
      `Tried to redefine: ${name} (was ${type.value}${
        type.optional ? "?" : ""
      })`
    );
  }
}

export class UnknownTypeError extends Error {
  constructor(type: ASTType) {
    super(`Unknown type: ${type.value}`);
  }
}

const reserved = new Set<string>([
  // reserved words
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",

  // strict mode reserved words
  "as",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",
  "symbol",
  "type",
  "from",
  "of",

  // contextual keywords
  "any",
  "boolean",
  "constructor",
  "declare",
  "get",
  "module",
  "require",
  "number",
  "set",
  "string",
]);
function fixName(n: string) {
  if (reserved.has(n)) return "_" + n;
  return n;
}

function asType(n: string): ASTType {
  return { _: "type", value: fixName(n) };
}
const boolType = asType("bool");
const builtinType = asType("builtin");
const charType = asType("char");
const enumType = asType("enum");
const fnType = asType("fn");
const globalType = asType("global");
const intType = asType("int");
const floatType = asType("float");
const strType = asType("str");
const systemType = asType("system");
const tagType = asType("tag");
const templateType = asType("template");
const tileType = asType("tile");

const builtinTypes = new Set<string>([
  "bag",
  "char",
  "component",
  "entity",
  "fn",
  "grid",
  "int",
  "KeyEvent",
  "messages",
  "MouseEvent",
  "str",
  "system",
  "tag",
  "template",
  "tile",
  "xy",
]);
function fixType(n: string | ASTType) {
  if (typeof n === "string") return fixName(n);

  const base = builtinTypes.has(n.value) ? n.value : fixName(n.value);
  return n.optional ? `(${base})|undefined` : base;
}

const read = (fn: string) => readFileSync(fn, { encoding: "utf-8" });
const write = (fn: string, data: string) =>
  writeFileSync(fn, data, { encoding: "utf-8" });

const entityTemplate = read("src/RLEntity.template.ts");
const implTemplate = read("src/impl.template.ts");
const tileTemplate = read("src/RLTile.template.ts");

type TSScope = {
  name: string;
  members: Map<string, ASTType>;
  parent?: TSScope;
};

class FnScope implements TSScope {
  name: string;
  members: Map<string, ASTType>;

  constructor(public parent: TSScope, public fn: ASTFnDecl | ASTSystemDecl) {
    this.name = `fn[${fn.name}]`;

    this.members = new Map<string, ASTType>();
    for (const p of this.fn.params) {
      if (p._ === "field") this.members.set(p.name, p.type);
    }
  }
}

class ForScope implements TSScope {
  name: string;
  members: Map<string, ASTType>;

  constructor(public parent: TSScope, public loopvar: string) {
    this.name = `for[${loopvar}]`;

    this.members = new Map<string, ASTType>([[loopvar, intType]]);
  }
}

class QueryScope implements TSScope {
  name: string;
  members: Map<string, ASTType>;

  constructor(public parent: TSScope, public query: ASTQuery) {
    this.name = `query[${query.params.map((p) => fixType(p.type)).join(" ")}]`;

    this.members = new Map<string, ASTType>();
    for (const p of query.params) {
      if (p._ === "field") this.members.set(p.name, p.type);
    }
  }
}

class EntityScope implements TSScope {
  name: "entity";
  constructor(public parent: TSScope, public compiler: TSCompiler) {
    this.name = "entity";
  }

  get members() {
    const m: Map<string, ASTType> = new Map([
      ["id", strType],
      ["add", builtinType],
      ["has", builtinType],
      ["remove", builtinType],
    ]);

    for (const c of this.compiler.componentNames) m.set(c, asType(c));
    for (const t of this.compiler.tagNames) m.set(t, boolType);

    return m;
  }
}

class ComponentScope implements TSScope {
  name: string;
  constructor(public parent: TSScope, public component: ASTComponentDecl) {
    this.name = component.name;
  }

  get members() {
    return new Map<string, ASTType>(
      this.component.fields.map((f) => [f.name, f.type])
    );
  }
}

class KeyEventScope implements TSScope {
  members: Map<string, ASTType>;
  name: "KeyEvent";

  constructor(public parent: TSScope) {
    this.name = "KeyEvent";
    this.members = new Map<string, ASTType>([
      ["key", strType],
      // TODO this isn't strictly true, it could be undefined
      ["char", charType],
      ["shift", boolType],
      ["ctrl", boolType],
      ["alt", boolType],
    ]);
  }
}

class MouseEventScope implements TSScope {
  members: Map<string, ASTType>;
  name: "MouseEvent";

  constructor(public parent: TSScope) {
    this.name = "MouseEvent";
    this.members = new Map<string, ASTType>([
      ["event", strType],
      ["x", intType],
      ["y", intType],
      ["button", intType],
    ]);
  }
}

class GridScope implements TSScope {
  members: Map<string, ASTType>;
  name: "grid";

  constructor(public parent: TSScope) {
    this.name = "grid";
    this.members = new Map<string, ASTType>([
      ["width", intType],
      ["height", intType],
      ["contains", builtinType],
      ["at", builtinType],
      ["clear", builtinType],
      ["draw", builtinType],
      ["fill", builtinType],
      ["findInRegion", builtinType],
      ["line", builtinType],
      ["put", builtinType],
      ["rect", builtinType],
    ]);
  }
}

class RectScope implements TSScope {
  members: Map<string, ASTType>;
  name: "rect";

  constructor(public parent: TSScope) {
    this.name = "rect";
    this.members = new Map<string, ASTType>([
      ["x", intType],
      ["y", intType],
      ["width", intType],
      ["height", intType],
      ["cx", intType],
      ["cy", intType],
      ["x2", intType],
      ["y2", intType],
      ["intersects", builtinType],
    ]);
  }
}

class XYScope implements TSScope {
  members: Map<string, ASTType>;
  name: "xy";

  constructor(public parent: TSScope) {
    this.name = "xy";
    this.members = new Map<string, ASTType>([
      ["x", intType],
      ["y", intType],
      ["equals", builtinType],
      ["plus", builtinType],
    ]);
  }
}

class EnumScope implements TSScope {
  members: Map<string, ASTType>;
  name: string;

  constructor(public parent: TSScope, public source: ASTEnumDecl) {
    this.name = `enum[${source.name}]`;
    this.members = new Map<string, ASTType>(
      source.values.map((ev) => [ev.name.value, intType])
    );
  }
}

class TileScope implements TSScope {
  name: "tile";

  constructor(public parent: TSScope, public compiler: TSCompiler) {
    this.name = "tile";
  }

  get members() {
    const fields: [string, ASTType][] = [["ch", charType]];
    for (const [name, type] of this.compiler.tileFields)
      fields.push([name, type]);

    return new Map<string, ASTType>(fields);
  }
}

class SystemScope implements TSScope {
  name: string;
  members: Map<string, ASTType>;

  constructor(public parent: TSScope, public source: ASTSystemDecl) {
    this.name = `system[${source.name}]`;
    this.members = new Map<string, ASTType>([
      ["enabled", boolType],
      ["enable", builtinType],
      ["disable", builtinType],
    ]);
  }
}

class MessagesScope implements TSScope {
  members: Map<string, ASTType>;
  name: "messages";

  constructor(public parent: TSScope) {
    this.name = "messages";
    this.members = new Map<string, ASTType>([
      ["dirty", boolType],
      ["length", intType],
      ["add", builtinType],
      ["clear", builtinType],
    ]);
  }
}

class BagScope implements TSScope {
  members: Map<string, ASTType>;
  name: "bag";

  constructor(public parent: TSScope) {
    this.name = "bag";
    this.members = new Map<string, ASTType>([
      ["capacity", intType],
      ["count", intType],
      ["add", builtinType],
      ["contains", builtinType],
      ["get", builtinType],
      ["has", builtinType],
      ["remove", builtinType],
    ]);
  }
}

export default class TSCompiler implements TSScope {
  name: "global";
  members: Map<string, ASTType>;
  components: ASTComponentDecl[];
  enums: ASTEnumDecl[];
  functions: ASTFnDecl[];
  globals: ASTGlobalDecl[];
  scopes: Stack<TSScope>;
  systems: ASTSystemDecl[];
  tags: ASTTagDecl[];
  templates: ASTTemplateDecl[];
  tileFields: Map<string, ASTType>;
  tileTypes: ASTTileTypeDecl[];

  constructor() {
    this.name = "global";
    this.components = [];
    this.enums = [];
    this.functions = [];
    this.globals = [];
    this.scopes = new Stack([this]);
    this.systems = [];
    this.tags = [];
    this.templates = [];
    this.tileFields = new Map();
    this.tileTypes = [];

    this.members = new Map<string, ASTType>(
      library.map((fn) => [fn.name, globalType])
    );
  }

  feed(ast: ASTProgram) {
    for (const d of ast) {
      if (d._ === "component") {
        this.components.push(d);
        this.define(d.name, asType(d.name));
      } else if (d._ === "enum") {
        this.enums.push(d);
        this.define(d.name, enumType);
      } else if (d._ === "fn") {
        this.functions.push(d);
        this.define(d.name, fnType);
      } else if (d._ === "system") {
        this.systems.push(d);
        this.define(d.name, systemType);
      } else if (d._ === "tag") {
        this.tags.push(d);
        this.define(d.name, tagType);
      } else if (d._ === "template") {
        this.templates.push(d);
        this.define(d.name, templateType);
      } else if (d._ === "global") {
        this.globals.push(d);
        this.define(d.name, d.type);
      } else if (d._ === "tiletype") {
        for (const f of d.fields) {
          const type = f._ === "flag" ? boolType : this.getExprType(f.expr);

          const old = this.tileFields.get(f.name);
          if (old && old !== type)
            throw new RedefinitionError(`tile.${f.name}`, old);

          this.tileFields.set(f.name, type);
        }

        this.tileTypes.push(d);
        this.define(d.name, tileType);
      }
    }
  }

  define(name: string, type: ASTType) {
    const old = this.members.get(name);
    if (old) throw new RedefinitionError(name, old);

    this.members.set(name, type);
  }

  checkArgumentMatch(
    i: number,
    types: ASTType[],
    optional: boolean,
    valid: string[]
  ) {
    for (const type of types) {
      if (type.optional && optional)
        throw new Error(`arg #${i} might be optional`);

      let matched = false;
      for (const accepted of valid) {
        if (accepted === type.value) matched = true;
        else if (
          accepted === "component" &&
          this.componentNames.includes(type.value)
        )
          matched = true;
        else if (accepted === "tag" && this.tagNames.includes(type.value))
          matched = true;
        else if (accepted === "any") matched = true;
      }

      if (!matched)
        throw new Error(
          `arg #${i} is ${type.value}${
            type.optional ? "?" : ""
          }, does not match ${valid.join("|")}${optional ? "?" : ""}`
        );
    }
  }

  checkLibraryCall(fn: LibFunction, args: ASTArg[]) {
    const minArgs = fn.params.filter((p) => !p.optional).length;
    const maxArgs = fn.params.length + (fn.variadic ? Infinity : 0);

    if (args.length < minArgs)
      throw new BadCallError(fn, "not enough arguments");
    if (args.length > maxArgs) throw new BadCallError(fn, "too many arguments");

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const param = (
        i >= fn.params.length ? fn.variadic : fn.params[i]
      ) as LibFunctionParam;

      const types = this.getExprTypes(arg);
      this.checkArgumentMatch(i, types, param.optional || false, param.types);
    }
  }

  checkFnCall(fn: ASTFnDecl, args: ASTArg[]) {
    const minArgs = fn.params.length;
    const maxArgs = fn.params.length;

    if (args.length < minArgs)
      throw new BadCallError(fn, "not enough arguments");
    if (args.length > maxArgs) throw new BadCallError(fn, "too many arguments");

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const match = fn.params[i];

      const types = this.getExprTypes(arg);
      this.checkArgumentMatch(i, types, match.type.optional || false, [
        match.type.value,
      ]);
    }
  }
  get componentNames() {
    return this.components.map((c) => c.name);
  }
  get tagNames() {
    return this.tags.map((t) => t.name);
  }

  writeAll(dir: string) {
    this.write(join(dir, "implTypes.ts"), this.generateImplTypes());
    this.write(join(dir, "isConstraint.ts"), this.generateIsConstraint());
    this.write(join(dir, "RLEntity.ts"), this.generateRLEntity());
    this.write(join(dir, "RLTile.ts"), this.generateRLTile());
    this.write(join(dir, "impl.ts"), this.generateImpl());
  }

  write(fn: string, value: string) {
    write(fn, value);
    console.log("Wrote:", fn);
  }

  template(template: string, values: Map<string, string>) {
    let filled = template;
    for (const [name, value] of values)
      filled = filled.replace(`//#${name}`, value);

    return filled;
  }

  generateImplTypes() {
    // TODO make these dynamic
    return `import RLBag from "./RLBag";
import RLEntity from "./RLEntity";
import RLTag from "./RLTag";

    ${this.components
      .map(
        (c) => `export type ${fixName(c.name)} = {
  type: "component";
  typeName: "${c.name}";
  ${c.fields
    .map((f) => `${fixName(f.name)}: ${this.getTSType(f.type)};`)
    .join("\n")}
}`
      )
      .concat(
        `export type RLComponent = ${
          this.componentNames.length
            ? this.componentNames.map(fixName).join(" | ")
            : "never"
        };`
      )
      .concat(`export type RLComponentName = RLComponent["typeName"];`)
      .concat(
        `export type RLTagName = ${
          this.tagNames.length
            ? this.tagNames.map((n) => `"${n}"`).join(" | ")
            : "never"
        };`
      )
      .join("\n")}`;
  }

  generateRLEntity() {
    return this.template(
      entityTemplate,
      new Map([
        ["IMPLTYPES", this.getImplImport(true)],
        ["ENTITYFIELDS", this.getEntityFields()],
        ["ENTITYCONSTRUCTOR", this.getEntityConstructor()],
      ])
    );
  }

  generateRLTile() {
    return this.template(
      tileTemplate,
      new Map([["TILECONSTRUCTOR", this.getTileConstructor()]])
    );
  }

  generateImpl() {
    return this.template(
      implTemplate,
      new Map([
        ["IMPLTYPES", this.getImplImport()],
        ["ENUMS", this.getEnumTypes()],
        ["TAGTYPES", this.getTagTypes()],
        ["COMPONENTMAKERS", this.getComponentMakers()],
        ["TEMPLATES", this.getTemplates()],
        ["FUNCTIONS", this.getFunctions()],
        ["SYSTEMS", this.getSystems()],
        ["TILETYPES", this.getTileTypes()],
        ["GLOBALS", this.getGlobals()],
        ["ENV", this.getEnv()],
      ])
    );
  }

  generateIsConstraint() {
    return `import RLSystemParam from "./RLSystemParam";

    export default function isConstraint(p: RLSystemParam) {
      return [${this.componentNames
        .concat(this.tagNames)
        .map((name) => `"${fixName(name)}"`)
        .join(", ")}].includes(p.typeName);
    }
    `;
  }

  getImplImport(meta = false) {
    return `import type { ${this.componentNames.join(", ")}${
      meta ? ", RLComponent, RLComponentName, RLTagName" : ""
    } } from "./implTypes";`;
  }

  getEntityFields() {
    return this.componentNames
      .map((name) => `${fixName(name)}?: ${fixName(name)};`)
      .concat(this.tagNames.map((name) => `${fixName(name)}: boolean;`))
      .join("\n");
  }

  getEntityConstructor() {
    return this.tagNames
      .map((name) => `this.${fixName(name)} = false;`)
      .join("\n");
  }

  getTileConstructor() {
    return Array.from(this.tileFields.entries())
      .map(([name, type]) => `public ${name}: ${this.getTSType(type)}`)
      .join(", ");
  }

  getEnumTypes() {
    return this.enums
      .map(
        (en) => `enum ${en.name} {
      ${en.values
        .map((ev) =>
          ev.value
            ? `${ev.name.value} = ${this.getExpr(ev.value)},`
            : `${ev.name.value},`
        )
        .join("\n")}
    };`
      )
      .join("\n");
  }

  getTagTypes() {
    return this.tagNames
      .map((name) => `const ${fixName(name)} = new RLTag("${name}");`)
      .join("\n");
  }

  getComponentMakers() {
    return this.components
      .map(
        (c) => `const mk${fixName(c.name)} = (${this.getComponentArgs(
          c
        )}): ${fixName(c.name)} => ({
      type: "component",
      typeName: "${fixName(c.name)}",
      ${this.getComponentFields(c)}
    });`
      )
      .join("\n");
  }

  getComponentArgs(c: ASTComponentDecl) {
    return c.fields
      .map((f) => `${fixName(f.name)}: ${this.getTSType(f.type)}`)
      .join(", ");
  }

  getComponentFields(c: ASTComponentDecl) {
    return c.fields.map((f) => fixName(f.name)).join(", ");
  }

  getTemplates() {
    return this.templates
      .map((t) => {
        return `const tm${t.name}: RLTemplate = {
  type: "template",
  name: "${t.name}",
  get: () => [${t.fields
    .map((f) => {
      if (f._ === "tag") {
        const thing = this.resolveType(f.name.value);
        if (thing.value === "tag") return `${fixName(f.name.value)}`;
        else if (thing.value === "template") return `tm${f.name.value}`;

        throw new Error(`Cannot add ${thing.value} to template`);
      }
      const name = f.name._ === "id" ? f.name.value : this.getQName(f.name);
      return `mk${name}(${f.args.map((a) => this.getExpr(a)).join(", ")})`;
    })
    .join(", ")}],
};`;
      })
      .join("\n");
  }

  getFunctions() {
    return this.functions
      .map(
        (f) =>
          `function ${fixName(f.name)}(${this.getParams(f)}) {
        ${this.getCode(f.code, new FnScope(this.scopes.top, f))}
      }
      const fn_${fixName(f.name)} = new RLFn("${fixName(f.name)}", ${fixName(
            f.name
          )}, [
        ${this.getStructArgs(f)}
      ]);`
      )
      .join("\n\n");
  }

  getSystems() {
    return this.systems
      .map(
        (s) =>
          `function code_${fixName(s.name)}(${this.getParams(s)}) {
        ${this.getCode(s.code, new FnScope(this.scopes.top, s))}
      }
      const ${s.name} = new RLSystem("${fixName(s.name)}", code_${fixName(
            s.name
          )}, [
        ${this.getStructArgs(s)}
      ])`
      )
      .join("\n\n");
  }

  getCode(code: ASTCode, scope?: TSScope): string {
    if (scope) this.scopes.push(scope);
    const result = code
      .map((s) => {
        switch (s._) {
          case "assignment":
            return `${this.getQName(s.name)} ${s.op} ${this.getExpr(s.expr)};`;
          case "call":
            return `${this.getCall(s.name, s.args)};`;

          case "local": {
            let str = `let ${s.name}: ${this.getTSType(s.type)}`;
            if (s.expr) str += ` = ${this.getExpr(s.expr)};`;
            else str += ";";

            this.scopes.top.members.set(s.name, s.type);
            return str;
          }

          case "if": {
            const code = `if (${this.getExpr(s.expr)}) {${this.getCode(
              s.code
            )}}`;
            if (s.code2) return code + ` else {${this.getCode(s.code2)}}`;
            return code;
          }

          case "return":
            // TODO check expr type against containing function
            return `return ${s.expr ? this.getExpr(s.expr) : ""};`;

          case "for":
            return `for (let ${s.name.value} = ${this.getExpr(s.start)}; ${
              s.name.value
            } <= ${this.getExpr(s.end)}; ${s.name.value}++) {${this.getCode(
              s.code,
              new ForScope(this.scopes.top, s.name.value)
            )}}`;

          case "query":
            return `for (const ${this.getQueryEntityVar(
              s
            )} of new RLQuery(RL.instance, ${this.getQueryTypes(s)}).get()) {
              ${this.getQueryDestructure(s)}
              ${this.getCode(s.code, new QueryScope(this.scopes.top, s))}
            }`;

          default:
            throw new Error(`Unknown statement: ${JSON.stringify(s)}`);
        }
      })
      .join("\n");

    if (scope) this.scopes.pop();
    return result;
  }

  getQName(q: ASTQName) {
    // check it exists, first
    this.resolveTypeChain(q);

    // TODO this seems wildly wrong
    return q.chain.join(".");
  }

  getCall(x: ASTQName | ASTIdent, args: ASTArg[]): string {
    const s =
      x._ === "id" ? this.resolveType(x.value) : this.resolveTypeChain(x);
    const n = x._ === "id" ? x.value : this.getQName(x);

    if (s.value === "tag") return fixName(n);
    if (this.componentNames.includes(s.value))
      return `mk${fixName(n)}(${this.getArgs(args)})`;

    if (s.value === "builtin") return `${n}(${this.getArgs(args)})`;

    if (s.value === "global") {
      const lib = library.find((fn) => fn.name === n);
      if (!lib) throw new Error(`Invalid global entry for ${n}`);
      this.checkLibraryCall(lib, args);

      if (n === "grid") return `new RLGrid(${this.getArgs(args)})`;
      else if (n === "rect") return `new RLRect(${this.getArgs(args)})`;
      else if (n === "xy") return `new RLXY(${this.getArgs(args)})`;
      else if (n === "messages") return `new RLMessages(${this.getArgs(args)})`;
      else if (n === "bag") return `new RLBag(${this.getArgs(args)})`;
    }

    if (s.value === "fn") {
      const fn = this.functions.find((fn) => fn.name === n);
      if (fn) this.checkFnCall(fn, args);
      // TODO else console.warn(`Cannot check fn call for ${n}`);

      return `${fixName(n)}(${this.getArgs(args)})`;
    }

    return `__lib.${n}(${this.getWrappedArgs(args)})`;
  }

  getArgs(args: ASTArg[]) {
    return args.map((a) => this.getExpr(a)).join(", ");
  }

  getWrappedArgs(args: ASTArg[]): string {
    return args.map((a) => this.getWrappedArg(a)).join(",\n");
  }

  getWrappedArg(e: ASTExpr): string {
    switch (e._) {
      case "char":
        return `{ type: "char", value: "${e.value}" }`;
      case "str":
        return `{ type: "str", value: "${e.value}" }`;
      case "int":
        return `{ type: "int", value: ${e.value} }`;

      case "qname": {
        const type = this.resolveTypeChain(e);
        const name = this.getQName(e);

        switch (type.value) {
          case "fn":
            return `fn_${name}`;

          case "template":
            return `tm${name}`;

          case "bag":
          case "entity":
          case "grid":
          case "messages":
          case "system":
          case "tag":
          case "tile":
          case "xy":
            return fixName(name);
        }

        if (this.componentNames.includes(type.value)) return `"${type.value}"`;

        return `{ type: "${type.value}", value: ${name} }`;
      }

      case "call": {
        const type = this.getExprType(e);
        const value = this.getCall(e.name, e.args);

        if (
          this.componentNames.includes(type.value) ||
          this.tagNames.includes(type.value) ||
          ["grid", "xy"].includes(type.value)
        )
          return value;

        return `{ type: "${type.value}", value: ${value} }`;
      }

      case "binary": {
        const type = this.getExprType(e);
        return `{ type: "${type.value}", value: ${this.getExpr(e)} }`;
      }

      case "match":
        return `((__match) => {
        ${e.matches
          .map((m) =>
            m._ === "else"
              ? `return ${this.getWrappedArg(m.value)}`
              : `if (${this.getMatchCase(m)}) return ${this.getWrappedArg(
                  m.value
                )};`
          )
          .join("\n else ")}
      })(${this.getExpr(e.expr)})`;

      default:
        throw new Error(`Cannot unwrap: ${JSON.stringify(e)}`);
    }
  }

  getParams(x: ASTFnDecl | ASTSystemDecl) {
    return x.params
      .map((p) => {
        if (p._ === "constraint") return "";
        return `${fixName(p.name)}: ${this.getTSType(p.type)}`;
      })
      .filter((x) => x)
      .join(", ");
  }

  getStructArgs(x: ASTFnDecl | ASTSystemDecl) {
    return x.params
      .map((p) => {
        if (p._ === "constraint")
          return `{ type: "constraint", typeName: "${p.type}" }`;
        return `{ type: "param", name: "${p.name}", typeName: "${p.type.value}" }`;
      })
      .join(",\n");
  }

  getTileTypes() {
    return this.tileTypes
      .map(
        (t) =>
          `const ${fixName(t.name)} = new RLTile('${t.char}', ${Array.from(
            this.tileFields.entries()
          )
            .map(([name, type]) => {
              const f = t.fields.find((f) => f.name === name);
              if (f) {
                if (f._ === "flag") return "true";
                return this.getExpr(f.expr);
              } else {
                switch (type.value) {
                  case "bool":
                    return "false";
                  default:
                    if (type.optional) return "undefined";

                    throw new Error(
                      `Unknown default for type "${type.value}}"`
                    );
                }
              }
            })
            .join(", ")});`
      )
      .join("\n");
  }

  getQueryEntityVar(q: ASTQuery) {
    for (const p of q.params) {
      if (p._ === "field" && p.type.value === "entity") return p.name;
    }

    return "_entity";
  }

  getQueryDestructure(q: ASTQuery) {
    const vars: string[] = [];
    for (const p of q.params) {
      if (p._ === "field" && p.type.value !== "entity")
        vars.push(`${p.type.value}: ${p.name}`);
    }

    return `const { ${vars.join(", ")} } = ${this.getQueryEntityVar(q)};`;
  }

  getQueryTypes(q: ASTQuery) {
    return `[${q.params
      .map((p) => `"${p._ === "field" ? p.type.value : p.type}"`)
      .filter((p) => p !== '"entity"')
      .join(", ")}]`;
  }

  getGlobals() {
    return this.globals
      .map(
        (g) =>
          `let ${g.name}: ${this.getTSType(g.type)}${
            g.expr ? ` = ${this.getExpr(g.expr)}` : ""
          };`
      )
      .join("\n");
  }

  getEnv() {
    return this.functions
      .map((f) => `["${f.name}", fn_${f.name}],`)
      .concat(this.systems.map((s) => `["${s.name}", ${s.name}],`))
      .concat(this.tagNames.map((t) => `["${t}", ${t}],`))
      .concat(this.templates.map((t) => `["${t.name}", tm${t.name}],`))
      .join("\n");
  }

  getTSOp(s: ASTUnaryOp | ASTBinaryOp) {
    switch (s) {
      case "and":
        return "&&";
      case "or":
        return "||";

      case "not":
        return "!";

      case "==":
        return "===";
      case "!=":
        return "!==";

      default:
        return s;
    }
  }

  getTSType(t: ASTType): string {
    const suffix = t.optional ? "|undefined" : "";

    switch (t.value) {
      case "int":
      case "float":
        return "number" + suffix;

      case "str":
      case "char":
        return "string" + suffix;

      case "bool":
        return "boolean" + suffix;

      case "fn":
        return "CallableFunction" + suffix;

      case "bag":
        return "RLBag" + suffix;
      case "entity":
        return "RLEntity" + suffix;
      case "grid":
        return "RLGrid" + suffix;
      case "KeyEvent":
        return "RLKeyEvent" + suffix;
      case "messages":
        return "RLMessages" + suffix;
      case "MouseEvent":
        return "RLMouseEvent" + suffix;
      case "rect":
        return "RLRect" + suffix;
      case "tag":
        return "RLTag" + suffix;
      case "tile":
        return "RLTile" + suffix;
      case "xy":
        return "RLXY" + suffix;

      default:
        if (
          this.componentNames.includes(t.value) ||
          this.tagNames.includes(t.value) ||
          this.enums.find((en) => en.name === t.value)
        )
          return fixType(t);

        throw new UnknownTypeError(t);
    }
  }

  getExpr(e: ASTExpr): string {
    switch (e._) {
      case "qname": {
        const name = this.getQName(e);

        if (this.componentNames.includes(name)) return `"${name}"`;
        return name;
      }
      case "call":
        return this.getCall(e.name, e.args);

      case "int":
      case "float":
        return e.value.toString();
      case "char":
      case "str":
        return `"${e.value.replace('"', '\\"')}"`;
      case "bool":
        return e.value ? "true" : "false";

      case "unary":
        return `${this.getTSOp(e.op)}(${this.getExpr(e.value)})`;
      case "binary":
        return `(${this.getExpr(e.left)} ${this.getTSOp(e.op)} ${this.getExpr(
          e.right
        )})`;

      case "match":
        return `((__match) => {
            ${e.matches
              .map((m) =>
                m._ === "else"
                  ? `return ${this.getExpr(m.value)}`
                  : `if (${this.getMatchCase(m)}) return ${this.getExpr(
                      m.value
                    )};`
              )
              .join("\n else ")}
          })(${this.getExpr(e.expr)})`;

      default:
        throw new Error(`Unknown expression: ${JSON.stringify(e)}`);
    }
  }

  getMatchCase(e: ASTExprCase | ASTBinaryCase) {
    const type = this.getExprType(e.expr);

    if (e._ === "binary") {
      return `__match ${this.getTSOp(e.op)} ${this.getExpr(e.expr)}`;
    }

    switch (type.value) {
      case "tag":
        return `__match.has(${this.getExpr(e.expr)}.typeName)`;

      case "bool":
      case "int":
      case "char":
      case "str":
      case "template":
        return `__match === ${this.getExpr(e.expr)}`;
    }

    throw new Error(`Unknown case type: ${JSON.stringify(e)}`);
  }

  coerce(op: ASTBinaryOp, left: ASTType, right: ASTType): ASTType | undefined {
    switch (op) {
      case "+":
      case "-":
      case "*":
      case "/":
        if (left.optional || right.optional) return;

        if (left.value === "int" && right.value === "int") return intType;
        if (left.value === "float" && right.value === "int") return floatType;
        if (left.value === "int" && right.value === "float") return floatType;
        if (left.value === "float" && right.value === "float") return floatType;
        return;

      case "<":
      case "<=":
      case ">":
      case ">=":
        if (left.optional || right.optional) return;

        if (left.value !== "int" && left.value !== "float") return;
        if (right.value !== "int" && right.value !== "float") return;
        return boolType;
    }
  }

  getExprType(e: ASTExpr, scope: TSScope | undefined = this.scopes.top) {
    const types = this.getExprTypes(e, scope);
    if (types.length > 1) throw new Error(`cannot accept multiple types here`);

    return types[0];
  }

  getExprTypes(
    e: ASTExpr,
    scope: TSScope | undefined = this.scopes.top
  ): ASTType[] {
    switch (e._) {
      case "bool":
      case "char":
      case "int":
      case "str":
        return [asType(e._)];

      case "qname":
        return [this.resolveTypeChain(e)];

      case "unary":
        switch (e.op) {
          case "-": {
            const right = this.getExprTypes(e.value, scope);

            for (const type of right) {
              if (type.value !== "int" && type.value !== "float")
                throw new Error(`Cannot negate a ${type.value}`);
            }

            return right;
          }

          case "not":
            return [boolType];

          default:
            throw new Error(`Invalid unary operator: ${JSON.stringify(e)}`);
        }

      case "binary": {
        const lefts = this.getExprTypes(e.left, scope);
        const rights = this.getExprTypes(e.right, scope);
        const types: ASTType[] = [];

        for (const left of lefts) {
          for (const right of rights) {
            const type = this.coerce(e.op, left, right);
            if (!type)
              throw new Error(
                `Cannot apply operator ${e.op} to types "${left.value}${
                  left.optional ? "?" : ""
                }" and "${right.value}${right.optional ? "?" : ""}"`
              );
            types.push(type);
          }
        }

        return types;
      }

      case "call": {
        const name = e.name._ === "id" ? e.name.value : this.getQName(e.name);
        const type =
          e.name._ === "id"
            ? this.resolveType(e.name.value, scope)
            : this.resolveTypeChain(e.name);

        if (type.value === "global") {
          const lib = library.find((fn) => fn.name === name);
          if (!lib) throw new Error(`Invalid global entry for ${name}`);
          this.checkLibraryCall(lib, e.args);
          if (!lib.returns) throw new Error(`${name} does not return a value`);

          // TODO hax detected
          if (lib.name === "clamp") {
            let hasFloat = false;
            for (const arg of e.args) {
              const types = this.getExprTypes(arg, scope);
              if (types.find((t) => t.value === "float")) {
                hasFloat = true;
                break;
              }
            }

            return hasFloat ? [floatType] : [intType];
          }

          return lib.returns.types.map(asType);
        } else if (type.value === "fn") {
          const fn = this.functions.find((fn) => fn.name === name);
          if (!fn) throw new Error(`Invalid fn entry for ${name}`);
          this.checkFnCall(fn, e.args);
          if (!fn.type) throw new Error(`${name} does not return a value`);

          return [fn.type];
        } else if (this.componentNames.includes(name)) return [type];

        throw new Error(`Cannot determine type: ${JSON.stringify(e)}`);
      }

      case "match":
        return e.matches.flatMap((m) => this.getExprTypes(m.value, scope));

      default:
        throw new Error(`Cannot determine type: ${JSON.stringify(e)}`);
    }
  }

  resolveType(
    name: string,
    scope: TSScope | undefined = this.scopes.top
  ): ASTType {
    const topScope = scope;

    while (scope) {
      const known = scope.members;
      const sub = known.get(name);
      if (sub) return sub;

      scope = scope.parent;
    }

    throw new CannotResolveError(name, topScope);
  }

  resolveTypeChain(q: ASTQName, scope: TSScope | undefined = this.scopes.top) {
    let type: ASTType = asType("scope");

    for (const name of q.chain) {
      type = this.resolveType(name, scope);

      // TODO generalise this
      if (type.value === "entity") scope = new EntityScope(scope, this);
      else if (type.value === enumType.value)
        scope = new EnumScope(
          scope,
          this.enums.find((en) => en.name === name) as ASTEnumDecl
        );
      else if (type.value === "grid") scope = new GridScope(scope);
      else if (type.value === "rect") scope = new RectScope(scope);
      else if (type.value === "system")
        scope = new SystemScope(
          scope,
          this.systems.find((s) => s.name === name) as ASTSystemDecl
        );
      else if (type.value === "tile") scope = new TileScope(scope, this);
      else if (type.value === "xy") scope = new XYScope(scope);
      else if (type.value === "messages") scope = new MessagesScope(scope);
      else if (type.value === "bag") scope = new BagScope(scope);
      else if (type.value === "KeyEvent") scope = new KeyEventScope(scope);
      else if (type.value === "MouseEvent") scope = new MouseEventScope(scope);
      else if (this.componentNames.includes(type.value))
        scope = new ComponentScope(
          scope,
          this.components.find((c) => c.name === type.value) as ASTComponentDecl
        );
    }

    return type;
  }
}
