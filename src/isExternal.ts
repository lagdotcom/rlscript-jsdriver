import RLFnParam from "./RLFnParam";
import RLSystemParam from "./RLSystemParam";
import isConstraint from "./isConstraint";

export default function isExternal(p: RLSystemParam): p is RLFnParam {
  return p.typeName !== "entity" && !isConstraint(p);
}
