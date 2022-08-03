import RLArg from "./RLArg";
import RLFnParam from "./RLFnParam";
import RLObjectType from "./RLObjectType";
import RLQuery from "./RLQuery";
import RLSystemParam from "./RLSystemParam";
import isConstraint from "./isConstraint";
import isExternal from "./isExternal";
import resolveArgs from "./resolveArgs";

export default class RLSystem<A extends Array<unknown> = unknown[]> {
  static type: RLObjectType = "system";
  type: "system";
  params: RLFnParam[];
  query!: RLQuery;
  componentTypes: RLObjectType[];
  externals: RLFnParam[];

  constructor(
    public name: string,
    private code: (...args: A) => false | void,
    public allParams: RLSystemParam[],
    public enabled = true
  ) {
    this.type = "system";
    this.componentTypes = allParams.filter(isConstraint).map((p) => p.typeName);
    this.externals = allParams.filter(isExternal);
    this.params = allParams.filter((p) => p.type === "param") as RLFnParam[];
  }

  apply(args: RLArg[]) {
    const resolved = resolveArgs(args, this.params, []);
    return this.code(...resolved);
  }

  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
}
