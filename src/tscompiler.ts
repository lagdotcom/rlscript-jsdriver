import {
  ASTComponentDecl,
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
    const m: Map<string, string> = new Map();
    m.set("id", "str");
    m.set("add", "builtin");
    m.set("has", "builtin");
    m.set("remove", "builtin");

    for (const c of this.compiler.componentNames) m.set(c, c);
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
    const m: Map<string, string> = new Map();

    for (const f of this.component.fields) m.set(f.name, f.type);

    return m;
  }
}

export default class TSCompiler implements TSScope {
  name: "global";
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
  }
  get members() {
    const m: Map<string, string> = new Map();
    m.set("draw", "global");
    m.set("pushKeyHandler", "global");
    m.set("setSize", "global");
    m.set("spawn", "global");

    for (const c of this.components) m.set(c.name, c.name);
    for (const f of this.functions) m.set(f.name, "fn");
    for (const s of this.systems) m.set(s.name, "system");
    for (const t of this.tags) m.set(t.name, "tag");

    return m;
  }

  feed(ast: ASTProgram) {
    for (const d of ast) {
      if (d._ === "component") this.components.push(d);
      else if (d._ === "fn") this.functions.push(d);
      else if (d._ === "system") this.systems.push(d);
      else if (d._ === "tag") this.tags.push(d);
    }
  }

  get componentNames() {
    return this.components.map((c) => c.name);
  }
  get tagNames() {
    return this.tags.map((t) => t.name);
  }

  write(dir: string) {
    write(join(dir, "implTypes.ts"), this.getImplTypes());

    this.templateWrite(
      join(dir, "RL.ts"),
      rlTemplate,
      new Map([
        ["IMPLTYPES", this.getImplImport(true)],
        ["ISCONSTRAINT", this.getIsConstraint()],
        ["ENTITYFIELDS", this.getEntityFields()],
        ["ENTITYCONSTRUCTOR", this.getEntityConstructor()],
      ])
    );

    this.templateWrite(
      join(dir, "impl.ts"),
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

  templateWrite(fn: string, template: string, values: Map<string, string>) {
    let filled = template;
    for (const [name, value] of values)
      filled = filled.replace(`//#${name}`, value);

    write(fn, filled);
  }

  getImplTypes() {
    return this.components
      .map(
        (c) => `export type ${c.name} = {
      type: "component";
      typeName: "${c.name}";
      ${c.fields.map((f) => `${f.name}: ${this.getTSType(f.type)};`).join("\n")}
    }`
      )
      .concat(`export type RLComponent = ${this.componentNames.join(" | ")};`)
      .concat(`export type RLComponentName = RLComponent["typeName"];`)
      .concat(
        `export type RLTagName = ${this.tagNames
          .map((n) => `"${n}"`)
          .join(" | ")};`
      )
      .join("\n");
  }

  getImplImport(meta = false) {
    return `import { ${this.componentNames.join(", ")}${
      meta ? ", RLComponent, RLComponentName, RLTagName" : ""
    } } from "./implTypes";`;
  }

  getIsConstraint() {
    return `return [${this.componentNames
      .concat(this.tagNames)
      .map((name) => `"${name}"`)
      .join(", ")}].includes(p.typeName);`;
  }

  getEntityFields() {
    return this.componentNames
      .map((name) => `${name}?: ${name};`)
      .concat(this.tagNames.map((name) => `${name}: boolean;`))
      .join("\n");
  }

  getEntityConstructor() {
    return this.tagNames.map((name) => `this.${name} = false;`).join("\n");
  }

  getTagTypes() {
    return this.tagNames
      .map((name) => `const ${name} = new RLTag("${name}");`)
      .join("\n");
  }

  getComponentMakers() {
    return this.components
      .map(
        (c) => `const mk${c.name} = (${this.getComponentArgs(c)}): ${
          c.name
        } => ({
      type: "component",
      typeName: "${c.name}",
      ${this.getComponentFields(c)}
    });`
      )
      .join("\n");
  }

  getComponentArgs(c: ASTComponentDecl) {
    return c.fields
      .map((f) => `${f.name}: ${this.getTSType(f.type)}`)
      .join(", ");
  }

  getComponentFields(c: ASTComponentDecl) {
    return c.fields.map((f) => f.name).join(", ");
  }

  getFunctions() {
    return this.functions
      .map(
        (f) =>
          `function ${f.name}(${this.getParams(f)}) {
        ${this.getCode(f)}
      }
      const fn_${f.name} = new RLFn("${f.name}", ${f.name}, [
        ${this.getStructArgs(f)}
      ])`
      )
      .join("\n\n");
  }

  getSystems() {
    return this.systems
      .map(
        (s) =>
          `function ${s.name}(${this.getParams(s)}) {
        ${this.getCode(s)}
      }
      const system_${s.name} = new RLSystem("${s.name}", ${s.name}, [
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
    return q.chain.join(".");
  }

  getCall(x: ASTQName | ASTIdent, args: ASTExpr[]): string {
    const s =
      x._ === "id" ? this.resolveType(x.value) : this.resolveTypeChain(x);
    const n = x._ === "id" ? x.value : x.chain.join(".");

    if (s === "tag") return n;
    if (this.componentNames.includes(s)) return `mk${n}(${this.getArgs(args)})`;

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
            const name = a.chain.join(".");

            if (type === "tag") return name;
            else if (type === "system") return "system_" + name;
            else if (this.componentNames.includes(type)) return name;
            return `{ type: "${type}", value: ${name} }`;
          }

          case "call": {
            const type = this.resolveType(a.name.value);
            if (this.componentNames.includes(type))
              return this.getCall(a.name, a.args);

            throw new Error(`How to coerce ${JSON.stringify(a)}?`);
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
        return `${p.name}: ${this.getTSType(p.type)}`;
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
        // TODO throw error if really unknown
        return t;
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

    throw new Error(`Could not resolve "${name}" in ${this.scopes.top.name}`);
  }

  resolveTypeChain(q: ASTQName) {
    let scope = this.scopes.top;
    let type = "scope";

    for (const name of q.chain) {
      type = this.resolveType(name, scope);

      if (type === "entity") scope = new EntityScope(scope, this);
      else if (this.componentNames.includes(type))
        scope = new ComponentScope(
          scope,
          this.components.find((c) => c.name === type) as ASTComponentDecl
        );
    }

    return type;
  }
}
