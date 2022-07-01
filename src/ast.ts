export type IProgram = IDecl[];

export type IComponentDecl = {
  _: "component";
  name: string;
  fields: IField[];
};
export type ITagDecl = { _: "tag"; name: string };
export type ISystemDecl = {
  _: "system";
  name: string;
  params: IParam[];
  code: ICode;
};
export type IFnDecl = {
  _: "fn";
  name: string;
  params: IParam[];
  code: ICode;
};
export type IDecl = IComponentDecl | ITagDecl | ISystemDecl | IFnDecl;

export type IField = { _: "field"; name: string; type: string };
export type IConstraint = { _: "constraint"; type: string };
export type IParam = IField | IConstraint;

export type ICode = IStatement[];
export type IStatement = ICall | IAssignment;

export type ICall = { _: "call"; name: string; args: IExpr[] };

export type IAssignment = {
  _: "assignment";
  name: IQName;
  op: IAssignmentOp;
  expr: IExpr;
};
export type IAssignmentOp = "=" | "+=";

export type IExpr = IQName | IMatch | IECall | IValue | IUnary;

export type IECall = { _: "call"; name: IIdent; args: IExpr[] };

export type IIdent = { _: "id"; value: string };

export type IMatch = { _: "match"; expr: IExpr; matches: ICase[] };
export type ICase = { _: "case"; expr: IExpr; value: IExpr };

export type IQName = { _: "qname"; chain: string[] };

export type IUnary = { _: "unary"; op: IUnaryOp; value: IExpr };
export type IUnaryOp = "-";

export type IValue = IChar | IStr | IInt;
export type IChar = { _: "char"; value: string };
export type IStr = { _: "str"; value: string };
export type IInt = { _: "int"; value: number };
