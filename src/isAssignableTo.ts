import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";

export default function isAssignableTo(o: RLObject, type: RLObjectType) {
  if (o.type === type) return true;

  // specific components/tags must match their component type
  if ((o.type === "component" || o.type === "tag") && o.typeName === type)
    return true;

  // chars can be upgraded to strs for free
  if (o.type === "char" && type === "str") return true;

  return false;
}
