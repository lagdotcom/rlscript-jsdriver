import RLArg from "./RLArg";
import RLEntity from "./RLEntity";
import RLEnv from "./RLEnv";
import RLQuery from "./RLQuery";
import RLSystem from "./RLSystem";
import Stack from "./Stack";
import libtype from "./libtype";

export default class RL {
  static instance: RL;
  entities: Map<string, RLEntity>;
  env: RLEnv;
  keyHandlers: Stack<RLSystem>;
  mouseHandlers: Stack<RLSystem>;
  systems: RLSystem[];

  constructor(public lib: libtype, ...envs: RLEnv[]) {
    RL.instance = this;

    this.env = new Map();
    for (const env of envs) {
      for (const [key, value] of env) this.env.set(key, value);
    }

    this.entities = new Map();
    this.keyHandlers = new Stack();
    this.mouseHandlers = new Stack();
    this.systems = Array.from(this.env.values()).filter(
      (o) => o.type === "system"
    ) as RLSystem[];
    for (const sys of this.systems) sys.query = this.makeQuery(sys);
  }

  makeQuery(sys: RLSystem) {
    return new RLQuery(this, sys.componentTypes);
  }

  callNamedFunction(name: string, ...args: RLArg[]) {
    const fn = this.env.get(name);
    if (!fn) throw new Error(`Unknown function: ${name}`);
    if (fn.type !== "fn") throw new Error(`Not a function: ${name}`);
    return fn.apply(args);
  }

  runSystem(sys: RLSystem, ...args: RLArg[]) {
    return sys.apply(args);
  }
}
