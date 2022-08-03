import RLFnParam from "./RLFnParam";
import RLObjectType from "./RLObjectType";

export default class RLComponentType {
  static type: RLObjectType = "component";
  type: "component";

  constructor(public name: string, public data: RLFnParam[]) {
    this.type = "component";
  }
}
