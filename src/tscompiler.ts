import {
  ASTComponentDecl,
  ASTECall,
  ASTExpr,
  ASTFnDecl,
  ASTIdent,
  ASTProgram,
  ASTQName,
  ASTSystemDecl,
  ASTTagDecl,
} from "./ast";
import { readFileSync, writeFileSync } from "fs";
import Stack from "./Stack";
import { join } from "path";

export class CannotResolveError extends Error {
  constructor(name: string, scope: TSScope) {
    super(`Cannot resolve: ${name} in ${scope.name}`);
  }
}

export class CoerceCallError extends Error {
  constructor(expr: ASTECall) {
    super(`Cannot coerce: ${JSON.stringify(expr)}`);
  }
}

export class RedefinitionError extends Error {
  constructor(name: string, type: string) {
    super(`Tried to redefine: ${name} (was ${type})`);
  }
}

export class UnknownTypeError extends Error {
  constructor(type: string) {
    super(`Unknown type: ${type}`);
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

const builtinTypes = new Set<string>([
  "char",
  "component",
  "fn",
  "int",
  "str",
  "system",
  "tag",

  "entity",
  "KeyEvent",
]);
function fixType(n: string) {
  if (builtinTypes.has(n)) return n;
  return fixName(n);
}

const read = (fn: string) => readFileSync(fn, { encoding: "utf-8" });
const write = (fn: string, data: string) =>
  writeFileSync(fn, data, { encoding: "utf-8" });

const implTemplate = read("src/impl.template.ts");
const rlTemplate = read("src/RL.template.ts");

type TSScope = {
  name: string;
  members: Map<string, string>;
  parent?: TSScope;
};

class FnScope implements TSScope {
  name: string;
  constructor(public parent: TSScope, public fn: ASTFnDecl | ASTSystemDecl) {
    this.name = `fn[${fn.name}]`;
  }

  get members() {
    const m: Map<string, string> = new Map();
    for (const p of this.fn.params) {
      if (p._ === "field") m.set(p.name, p.type);
    }

    return m;
  }
}

class EntityScope implements TSScope {
  name: "entity";
  constructor(public parent: TSScope, public compiler: TSCompiler) {
    this.name = "entity";
  }

  get members() {
    const m: Map<string, string> = new Map([
      ["id", "str"],
      ["add", "builtin"],
      ["has", "builtin"],
      ["remove", "builtin"],
    ]);

    for (const c of this.compiler.componentNames) m.set(c, fixName(c));
    for (const t of this.compiler.tagNames) m.set(t, "bool");

    return m;
  }
}

class ComponentScope implements TSScope {
  name: string;
  constructor(public parent: TSScope, public component: ASTComponentDecl) {
    this.name = component.name;
  }

  get members() {
    return new Map<string, string>(
      this.component.fields.map((f) => [f.name, fixType(f.type)])
    );
  }
}

class KeyEventScope implements TSScope {
  members: Map<string, string>;
  name: "KeyEvent";

  constructor(public parent: TSScope) {
    this.name = "KeyEvent";
    this.members = new Map<string, string>([["key", "str"]]);
  }
}

export default class TSCompiler implements TSScope {
  name: "global";
  members: Map<string, string>;
  components: ASTComponentDecl[];
  functions: ASTFnDecl[];
  scopes: Stack<TSScope>;
  systems: ASTSystemDecl[];
  tags: ASTTagDecl[];

  constructor() {
    this.name = "global";
    this.components = [];
    this.functions = [];
    this.scopes = new Stack([this]);
    this.systems = [];
    this.tags = [];

    this.members = new Map<string, string>([
      ["draw", "global"],
      ["pushKeyHandler", "global"],
      ["setSize", "global"],
      ["spawn", "global"],
    ]);
  }

  feed(ast: ASTProgram) {
    for (const d of ast) {
      if (d._ === "component") {
        this.components.push(d);
        this.define(d.name, fixType(d.name));
      } else if (d._ === "fn") {
        this.functions.push(d);
        this.define(d.name, "fn");
      } else if (d._ === "system") {
        this.systems.push(d);
        this.define(d.name, "system");
      } else if (d._ === "tag") {
        this.tags.push(d);
        this.define(d.name, "tag");
      }
    }
  }

  define(name: string, type: string) {
    const old = this.members.get(name);
    if (old) throw new RedefinitionError(name, old);

    this.members.set(name, type);
  }

  get componentNames() {
    return this.components.map((c) => c.name);
  }
  get tagNames() {
    return this.tags.map((t) => t.name);
  }

  write(dir: string) {
    write(join(dir, "implTypes.ts"), this.generateImplTypes());
    write(join(dir, "RL.ts"), this.generateRL());
    write(join(dir, "impl.ts"), this.generateImpl());
  }

  template(template: string, values: Map<string, string>) {
    let filled = template;
    for (const [name, value] of values)
      filled = filled.replace(`//#${name}`, value);

    return filled;
  }

  generateImplTypes() {
    return this.components
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
      .join("\n");
  }

  generateRL() {
    return this.template(
      rlTemplate,
      new Map([
        ["IMPLTYPES", this.getImplImport(true)],
        ["ISCONSTRAINT", this.getIsConstraint()],
        ["ENTITYFIELDS", this.getEntityFields()],
        ["ENTITYCONSTRUCTOR", this.getEntityConstructor()],
      ])
    );
  }

  generateImpl() {
    return this.template(
      implTemplate,
      new Map([
        ["IMPLTYPES", this.getImplImport()],
        ["TAGTYPES", this.getTagTypes()],
        ["COMPONENTMAKERS", this.getComponentMakers()],
        ["FUNCTIONS", this.getFunctions()],
        ["SYSTEMS", this.getSystems()],
        ["ENV", this.getEnv()],
      ])
    );
  }

  getImplImport(meta = false) {
    return `import { ${this.componentNames.join(", ")}${
      meta ? ", RLComponent, RLComponentName, RLTagName" : ""
    } } from "./implTypes";`;
  }

  getIsConstraint() {
    return `return [${this.componentNames
      .concat(this.tagNames)
      .map((name) => `"${fixName(name)}"`)
      .join(", ")}].includes(p.typeName);`;
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

  getFunctions() {
    return this.functions
      .map(
        (f) =>
          `function ${fixName(f.name)}(${this.getParams(f)}) {
        ${this.getCode(f)}
      }
      const fn_${fixName(f.name)} = new RLFn("${fixName(f.name)}", ${fixName(
            f.name
          )}, [
        ${this.getStructArgs(f)}
      ])`
      )
      .join("\n\n");
  }

  getSystems() {
    return this.systems
      .map(
        (s) =>
          `function ${fixName(s.name)}(${this.getParams(s)}) {
        ${this.getCode(s)}
      }
      const system_${s.name} = new RLSystem("${fixName(s.name)}", ${fixName(
            s.name
          )}, [
        ${this.getStructArgs(s)}
      ])`
      )
      .join("\n\n");
  }

  getCode(x: ASTFnDecl | ASTSystemDecl) {
    this.scopes.push(new FnScope(this.scopes.top, x));
    const result = x.code
      .map((s) => {
        switch (s._) {
          case "assignment":
            return `${this.getQName(s.name)} ${s.op} ${this.getExpr(s.expr)};`;
          case "call":
            return `${this.getCall(s.name, s.args)};`;

          default:
            return `// invalid? ${JSON.stringify(s)}`;
        }
      })
      .join("\n");

    this.scopes.pop();
    return result;
  }

  getQName(q: ASTQName) {
    // check it exists, first
    this.resolveTypeChain(q);

    return q.chain.map(fixName).join(".");
  }

  getCall(x: ASTQName | ASTIdent, args: ASTExpr[]): string {
    const s =
      x._ === "id" ? this.resolveType(x.value) : this.resolveTypeChain(x);
    const n = x._ === "id" ? x.value : this.getQName(x);

    if (s === "tag") return fixName(n);
    if (this.componentNames.includes(s))
      return `mk${fixName(n)}(${this.getArgs(args)})`;

    if (s === "builtin") return `${n}(${this.getArgs(args)})`;

    return `RL.instance.callNamedFunction("${n}", ${this.getWrappedArgs(
      args
    )})`;
  }

  getArgs(args: ASTExpr[]) {
    return args.map((a) => this.getExpr(a)).join(", ");
  }

  getWrappedArgs(args: ASTExpr[]) {
    return args
      .map((a) => {
        switch (a._) {
          case "char":
            return `{ type: "char", value: "${a.value}" }`;
          case "str":
            return `{ type: "str", value: "${a.value}" }`;
          case "int":
            return `{ type: "int", value: ${a.value} }`;

          case "qname": {
            const type = this.resolveTypeChain(a);
            const name = this.getQName(a);

            if (type === "tag") return fixName(name);
            else if (type === "system") return "system_" + name;
            else if (this.componentNames.includes(type)) return fixName(name);
            return `{ type: "${type}", value: ${name} }`;
          }

          case "call": {
            const type = this.resolveType(a.name.value);
            if (this.componentNames.includes(type))
              return this.getCall(a.name, a.args);

            throw new CoerceCallError(a);
          }

          default:
            return `/* TODO: ${JSON.stringify(a)} */`;
        }
      })
      .map((v) => `{ type: "positional", value: ${v} }`)
      .join(",\n");
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
        return `{ type: "param", name: "${p.name}", typeName: "${p.type}" }`;
      })
      .join(",\n");
  }

  getEnv() {
    return this.functions
      .map((f) => `["${f.name}", fn_${f.name}],`)
      .concat(this.systems.map((s) => `["${s.name}", system_${s.name}],`))
      .concat(this.tagNames.map((t) => `["${t}", ${t}],`))
      .join("\n");
  }

  getTSType(t: string) {
    switch (t) {
      case "int":
        return "number";
      case "str":
        return "string";
      case "char":
        return "string";

      case "entity":
        return "RLEntity";
      case "KeyEvent":
        return "RLKeyEvent";

      default:
        if (this.componentNames.includes(t) || this.tagNames.includes(t))
          return fixType(t);

        throw new UnknownTypeError(t);
    }
  }

  getExpr(e: ASTExpr): string {
    switch (e._) {
      case "qname":
        return this.getQName(e);
      case "call":
        return this.getCall(e.name, e.args);

      case "int":
        return e.value.toString();
      case "char":
      case "str":
        return `"${e.value}"`;

      case "unary":
        return `${e.op}(${this.getExpr(e.value)})`;

      case "match":
        return `((matchvar) => {
            ${e.matches
              .map(
                (m) =>
                  `if (matchvar === ${this.getExpr(
                    m.expr
                  )}) return ${this.getExpr(m.value)};`
              )
              .join("\n else ")}
          })(${this.getExpr(e.expr)})`;

      default:
        return `/* invalid? ${JSON.stringify(e)} */`;
    }
  }

  resolveType(name: string, scope: TSScope | undefined = this.scopes.top) {
    while (scope) {
      const known = scope.members;
      if (known.has(name)) return known.get(name) as string;

      scope = scope.parent;
    }

    throw new CannotResolveError(name, scope || this.scopes.top);
  }

  resolveTypeChain(q: ASTQName) {
    let scope = this.scopes.top;
    let type = "scope";

    for (const name of q.chain) {
      type = this.resolveType(name, scope);

      // TODO generalise this
      if (type === "entity") scope = new EntityScope(scope, this);
      else if (type === "KeyEvent") scope = new KeyEventScope(scope);
      else if (this.componentNames.includes(type))
        scope = new ComponentScope(
          scope,
          this.components.find((c) => c.name === type) as ASTComponentDecl
        );
    }

    return type;
  }
}
