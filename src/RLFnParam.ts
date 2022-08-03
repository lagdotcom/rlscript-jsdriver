import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";

type RLFnParam = {
  type: "param";
  name: string;
  typeName: RLObjectType;
  default?: RLObject;
};
export default RLFnParam;
