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
  type?: ASTType;
  code: ASTCode;
};
export type ASTTemplateDecl = {
  _: "template";
  name: string;
  fields: ASTTemplateField[];
};
export type ASTTileTypeDecl = {
  _: "tiletype";
  name: string;
  char: string;
  fields: ASTTileMember[];
};
export type ASTGlobalDecl = {
  _: "global";
  name: string;
  type: ASTType;
};
export type ASTEnumDecl = {
  _: "enum";
  name: string;
  values: ASTEnumValue[];
};
export type ASTDecl =
  | ASTComponentDecl
  | ASTTagDecl
  | ASTSystemDecl
  | ASTFnDecl
  | ASTTemplateDecl
  | ASTTileTypeDecl
  | ASTGlobalDecl
  | ASTEnumDecl;

export type ASTField = { _: "field"; name: string; type: ASTType };
export type ASTConstraint = { _: "constraint"; type: string };
export type ASTParam = ASTField | ASTConstraint;

export type ASTCall = { _: "call"; name: ASTIdent | ASTQName; args: ASTExpr[] };
export type ASTTemplateTag = { _: "tag"; name: ASTIdent };
export type ASTTemplateField = ASTCall | ASTTemplateTag;

export type ASTTileFlag = { _: "flag"; name: string };
export type ASTTileField = { _: "field"; name: string; expr: ASTExpr };
export type ASTTileMember = ASTTileFlag | ASTTileField;

export type ASTEnumValue = { name: ASTIdent; value?: ASTExpr };

export type ASTCode = ASTStatement[];
export type ASTStatement =
  | ASTCall
  | ASTAssignment
  | ASTLocal
  | ASTIf
  | ASTReturn
  | ASTFor
  | ASTQuery;

export type ASTAssignment = {
  _: "assignment";
  name: ASTQName;
  op: ASTAssignmentOp;
  expr: ASTExpr;
};
export type ASTAssignmentOp = "=" | "+=" | "-=" | "*-" | "/=" | "^=";

export type ASTLocal = {
  _: "local";
  name: string;
  type: ASTType;
  expr?: ASTExpr;
};

export type ASTIf = { _: "if"; expr: ASTExpr; code: ASTCode; code2?: ASTCode };

export type ASTReturn = { _: "return"; expr?: ASTExpr };

export type ASTFor = {
  _: "for";
  name: ASTIdent;
  start: ASTExpr;
  end: ASTExpr;
  code: ASTCode;
};

export type ASTQuery = { _: "query"; params: ASTParam[]; code: ASTCode };

export type ASTType = { _: "type"; value: string; optional?: boolean };

export type ASTExpr =
  | ASTQName
  | ASTMatch
  | ASTCall
  | ASTValue
  | ASTUnary
  | ASTBinary;

export type ASTIdent = { _: "id"; value: string };

export type ASTMatch = { _: "match"; expr: ASTExpr; matches: ASTCase[] };
export type ASTCase = { _: "case"; expr: ASTExpr; value: ASTExpr };

export type ASTQName = { _: "qname"; chain: string[] };

export type ASTUnary = { _: "unary"; op: ASTUnaryOp; value: ASTExpr };
export type ASTUnaryOp = "-" | "not";

export type ASTBinary = {
  _: "binary";
  op: ASTBinaryOp;
  left: ASTExpr;
  right: ASTExpr;
};
export type ASTArithOp = "+" | "-" | "*" | "/" | "^";
export type ASTLogicOp = "and";
export type ASTCondOp = ">" | ">=" | "<" | "<=" | "==" | "!=";
export type ASTBinaryOp = ASTArithOp | ASTLogicOp | ASTCondOp;

export type ASTValue = ASTBool | ASTChar | ASTStr | ASTInt;
export type ASTChar = { _: "char"; value: string };
export type ASTStr = { _: "str"; value: string };
export type ASTInt = { _: "int"; value: number };
export type ASTBool = { _: "bool"; value: boolean };
