//#IMPLTYPES
import Stack from "./Stack";
import { nanoid } from "nanoid";

export type RLFnParam = {
  type: "param";
  name: string;
  typeName: RLObjectType;
  default?: RLObject;
};
type RLConstraint = { type: "constraint"; typeName: RLObjectType };
export type RLSystemParam = RLFnParam | RLConstraint;

type RLNamedArg = { type: "named"; name: RLObjectType; value: RLObject };
type RLPositionalArg = { type: "positional"; value: RLObject };
type RLTypedArg = { type: "typed"; typeName: RLObjectType; value: RLObject };
export type RLArg = RLNamedArg | RLPositionalArg | RLTypedArg;

export class RLComponentType {
  static type: RLObjectType = "component";
  type: "component";

  constructor(public name: string, public data: RLFnParam[]) {
    this.type = "component";
  }
}

export class RLFn {
  static type: RLObjectType = "fn";
  type: "fn";

  constructor(
    public name: string,
    private code: CallableFunction,
    public params: RLFnParam[],
    public variadic: RLObjectType[] = []
  ) {
    this.type = "fn";
  }

  apply(args: RLArg[]) {
    const resolved = resolveArgs(args, this.params, this.variadic);
    this.code(...resolved);
  }
}

export class RLKeyEvent {
  static type: RLObjectType = "KeyEvent";
  type: "KeyEvent";

  constructor(public key: string) {
    this.type = "KeyEvent";
  }
}

function isConstraint(p: RLSystemParam) {
  //#ISCONSTRAINT
}
function isExternal(p: RLSystemParam): p is RLFnParam {
  return p.typeName !== "entity" && !isConstraint(p);
}
export class RLSystem {
  static type: RLObjectType = "system";
  type: "system";
  params: RLFnParam[];
  query!: RLQuery;
  componentTypes: RLObjectType[];
  externals: RLFnParam[];

  constructor(
    public name: string,
    private code: CallableFunction,
    public allParams: RLSystemParam[]
  ) {
    this.type = "system";
    this.componentTypes = allParams.filter(isConstraint).map((p) => p.typeName);
    this.externals = allParams.filter(isExternal);
    this.params = allParams.filter((p) => p.type === "param") as RLFnParam[];
  }

  apply(args: RLArg[]) {
    const resolved = resolveArgs(args, this.params, []);
    this.code(...resolved);
  }
}

export class RLTag {
  static type: RLObjectType = "tag";
  type: "tag";

  constructor(public typeName: RLTagName) {
    this.type = "tag";
  }
}

export type RLChar = { type: "char"; value: string };
export type RLInt = { type: "int"; value: number };
export type RLStr = { type: "str"; value: string };
export type RLTemplate = {
  type: "template";
  name: string;
  get: () => (RLTag | RLComponent)[];
};

type ParamPredicate = (p: RLFnParam) => boolean;
function getParam(
  params: RLFnParam[],
  predicate: ParamPredicate
): [number, RLFnParam | undefined] {
  const i = params.findIndex(predicate);
  return [i, i < 0 ? undefined : params[i]];
}

export function isAssignableTo(o: RLObject, type: RLObjectType) {
  if (o.type === type) return true;

  // specific components/tags must match their component type
  if ((o.type === "component" || o.type === "tag") && o.typeName === type)
    return true;

  // chars can be upgraded to strs for free
  if (o.type === "char" && type === "str") return true;

  return false;
}
function isAssignableToAny(o: RLObject, types: RLObjectType[]) {
  for (const type of types) {
    if (isAssignableTo(o, type)) return true;
  }

  return false;
}

function resolveArgs(
  args: RLArg[],
  params: RLFnParam[],
  variadic: RLObjectType[]
): RLObject[] {
  const results = params.map((p) => p.default);
  const filled = new Set<number>();

  const get = (predicate: ParamPredicate) => getParam(params, predicate);
  const set = (i: number, value: RLObject) => {
    if (filled.has(i)) throw new Error(`Param #${i} set twice`);

    if (i >= results.length) {
      if (variadic.length === 0)
        throw new Error(`Function only has ${results.length} params`);

      if (!isAssignableToAny(value, variadic))
        throw new Error(
          `Function variadic type is '${variadic.join("|")}', got ${value.type}`
        );
    } else if (!isAssignableTo(value, params[i].typeName))
      throw new Error(
        `Param #${i} expects type '${params[i].typeName}, got ${value.type}`
      );

    results[i] = value;
    filled.add(i);
  };

  let pos = 0;
  for (const a of args) {
    switch (a.type) {
      case "typed": {
        const [i, p] = get((p) => p.typeName === a.typeName);
        if (!p) throw new Error(`No param of type ${a.typeName}`);
        set(i, a.value);
        break;
      }

      case "named": {
        const [i, p] = get((p) => p.name === a.name);
        if (!p) throw new Error(`No param with name ${a.name}`);
        set(i, a.value);
        break;
      }

      case "positional": {
        set(pos, a.value);
        pos++;
        break;
      }
    }
  }

  const entity = args.find((p) => p.value.type === "entity")?.value as
    | RLEntity
    | undefined;
  for (let i = 0; i < results.length; i++) {
    if (typeof results[i] === "undefined") {
      if (entity && entity.has(params[i].typeName)) {
        results[i] = entity.get(params[i].typeName as RLComponentName);
        continue;
      }

      throw new Error(`Param #${i} not filled`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return results as RLObject[];
}

export class RLEntity {
  static type: RLObjectType = "entity";
  type: "entity";
  id: string;

  components: Set<string>;
  //#ENTITYFIELDS

  constructor() {
    this.type = "entity";
    this.id = nanoid();
    this.components = new Set();
    //#ENTITYCONSTRUCTOR
  }

  has(name: RLObjectType) {
    return this.components.has(name);
  }

  add(thing?: RLTag | RLComponent) {
    if (!thing) return;

    if (thing.type === "component") {
      // TODO what is going on here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[thing.typeName] = thing;
    } else this[thing.typeName] = true;

    this.components.add(thing.typeName);
  }

  remove(thing?: RLTag | RLComponent) {
    if (!thing) return;

    if (thing.type === "component") delete this[thing.typeName];
    else this[thing.typeName] = false;

    this.components.delete(thing.typeName);
  }

  get(name: RLComponentName) {
    if (this.components.has(name)) return this[name];

    throw new Error(`Tried to access empty entity.${name}`);
  }
}

export type RLObject =
  | RLChar
  | RLComponent
  | RLEntity
  | RLFn
  | RLInt
  | RLKeyEvent
  | RLStr
  | RLSystem
  | RLTag
  | RLTemplate;
export type RLObjectType = RLObject["type"] | RLComponentName | RLTagName;
export type RLEnv = Map<string, RLObject>;

class RLQuery {
  constructor(public parent: RL, public system: RLSystem) {}

  get() {
    return Array.from(this.parent.entities.values()).filter((e) =>
      this.match(e)
    );
  }

  match(e: RLEntity) {
    for (const c of this.system.componentTypes) {
      if (!e.has(c)) return false;
    }

    return true;
  }
}

export default class RL {
  static instance: RL;
  entities: Map<string, RLEntity>;
  env: RLEnv;
  keyHandlers: Stack<RLSystem>;
  systems: RLSystem[];

  constructor(...envs: RLEnv[]) {
    RL.instance = this;

    this.env = new Map();
    for (const env of envs) {
      for (const [key, value] of env) this.env.set(key, value);
    }

    this.entities = new Map();
    this.keyHandlers = new Stack();
    this.systems = Array.from(this.env.values()).filter(
      (o) => o.type === "system"
    ) as RLSystem[];
    for (const sys of this.systems) sys.query = this.makeQuery(sys);
  }

  makeQuery(sys: RLSystem) {
    return new RLQuery(this, sys);
  }

  callNamedFunction(name: string, ...args: RLArg[]) {
    const fn = this.env.get(name);
    if (!fn) throw new Error(`Unknown function: ${name}`);
    if (fn.type !== "fn") throw new Error(`Not a function: ${name}`);
    fn.apply(args);
  }

  runSystem(sys: RLSystem, ...args: RLArg[]) {
    sys.apply(args);
  }
}
