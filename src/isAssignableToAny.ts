import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";
import isAssignableTo from "./isAssignableTo";

export default function isAssignableToAny(o: RLObject, types: RLObjectType[]) {
  for (const type of types) {
    if (isAssignableTo(o, type)) return true;
  }

  return false;
}
