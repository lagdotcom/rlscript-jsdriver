import RLObjectType from "./RLObjectType";
import { RLTagName } from "./implTypes";

export default class RLTag {
  static type: RLObjectType = "tag";
  type: "tag";

  constructor(public typeName: RLTagName) {
    this.type = "tag";
  }
}
