import RLArg from "./RLArg";
import RLFnParam from "./RLFnParam";
import RLObjectType from "./RLObjectType";
import resolveArgs from "./resolveArgs";

export default class RLFn<A extends any[] = any[], V = any> {
  static type: RLObjectType = "fn";
  type: "fn";

  constructor(
    public name: string,
    private code: (...args: A) => V,
    public params: RLFnParam[],
    public variadic: RLObjectType[] = []
  ) {
    this.type = "fn";
  }

  apply(args: RLArg[]): V {
    const resolved = resolveArgs(args, this.params, this.variadic);
    return this.code(...resolved);
  }
}
