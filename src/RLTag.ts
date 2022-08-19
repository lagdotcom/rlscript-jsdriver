import RLObjectType from "./RLObjectType";
import { RLTagName } from "./implTypes";
import Serializer from "./Serializer";

export default class RLTag {
  static type: RLObjectType = "tag";
  type: "tag";

  constructor(public typeName: RLTagName) {
    this.type = "tag";
  }
}

Serializer.instance.add(
  "tag",
  (t: RLTag) => t.typeName,
  (data: string) => new RLTag(data)
);
