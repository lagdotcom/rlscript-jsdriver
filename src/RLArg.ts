import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";

export type RLNamedArg = { type: "named"; name: RLObjectType; value: RLObject };

export type RLPositionalArg = { type: "positional"; value: RLObject };

export type RLTypedArg = {
  type: "typed";
  typeName: RLObjectType;
  value: RLObject;
};

type RLArg = RLNamedArg | RLPositionalArg | RLTypedArg;
export default RLArg;
