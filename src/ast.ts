export type ASTProgram = ASTDecl[];

export type ASTComponentDecl = {
  _: "component";
  name: string;
  fields: ASTField[];
};
export type ASTTagDecl = { _: "tag"; name: string };
export type ASTSystemDecl = {
  _: "system";
  name: string;
  params: ASTParam[];
  code: ASTCode;
};
export type ASTFnDecl = {
  _: "fn";
  name: string;
  params: ASTField[];
  code: ASTCode;
};
export type ASTDecl = ASTComponentDecl | ASTTagDecl | ASTSystemDecl | ASTFnDecl;

export type ASTField = { _: "field"; name: string; type: string };
export type ASTConstraint = { _: "constraint"; type: string };
export type ASTParam = ASTField | ASTConstraint;

export type ASTCode = ASTStatement[];
export type ASTStatement = ASTCall | ASTAssignment;

export type ASTCall = { _: "call"; name: ASTIdent | ASTQName; args: ASTExpr[] };

export type ASTAssignment = {
  _: "assignment";
  name: ASTQName;
  op: ASTAssignmentOp;
  expr: ASTExpr;
};
export type ASTAssignmentOp = "=" | "+=";

export type ASTExpr = ASTQName | ASTMatch | ASTECall | ASTValue | ASTUnary;

export type ASTECall = { _: "call"; name: ASTIdent; args: ASTExpr[] };

export type ASTIdent = { _: "id"; value: string };

export type ASTMatch = { _: "match"; expr: ASTExpr; matches: ASTCase[] };
export type ASTCase = { _: "case"; expr: ASTExpr; value: ASTExpr };

export type ASTQName = { _: "qname"; chain: string[] };

export type ASTUnary = { _: "unary"; op: ASTUnaryOp; value: ASTExpr };
export type ASTUnaryOp = "-";

export type ASTValue = ASTChar | ASTStr | ASTInt;
export type ASTChar = { _: "char"; value: string };
export type ASTStr = { _: "str"; value: string };
export type ASTInt = { _: "int"; value: number };
