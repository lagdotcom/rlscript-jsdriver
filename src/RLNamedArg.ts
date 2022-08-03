import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";

type RLNamedArg = { type: "named"; name: RLObjectType; value: RLObject };
export default RLNamedArg;
