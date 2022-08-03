export type LibFunctionType =
  | "bool"
  | "char"
  | "component"
  | "entity"
  | "float"
  | "fn"
  | "grid"
  | "int"
  | "messages"
  | "KeyEvent"
  | "rect"
  | "str"
  | "system"
  | "tag"
  | "template"
  | "tile"
  | "xy";

export type LibFunctionParam = {
  name: string;
  types: LibFunctionType[];
  optional?: boolean;
};

export type LibFunction = {
  name: string;
  params: LibFunctionParam[];
  variadic?: LibFunctionParam;
  returns?: LibFunctionParam;
};

const p = (name: string, ...types: LibFunctionType[]): LibFunctionParam => ({
  name,
  types,
});
const o = (name: string, ...types: LibFunctionType[]): LibFunctionParam => ({
  name,
  types,
  optional: true,
});

const f = (
  name: string,
  params: LibFunctionParam[],
  returns?: LibFunctionParam
): LibFunction => ({ name, params, returns });
const v = (
  name: string,
  params: LibFunctionParam[],
  variadic: LibFunctionParam,
  returns?: LibFunctionParam
): LibFunction => ({ name, params, variadic, returns });

const library = [
  // constructors
  f(
    "grid",
    [p("width", "int"), p("height", "int"), p("empty", "bool", "int", "tile")],
    p("g", "grid")
  ),
  f("messages", [], p("log", "messages")),
  f(
    "rect",
    [p("x", "int"), p("y", "int"), p("width", "int"), p("height", "int")],
    p("r", "rect")
  ),
  f("xy", [p("x", "int"), p("y", "int")], p("coord", "xy")),

  // library
  f("abs", [p("value", "int")], p("value", "int")),
  v("add", [], p("components", "component", "tag")),
  f("debug", [p("message", "str")]),
  f("draw", [
    p("x", "int"),
    p("y", "int"),
    p("s", "char", "str"),
    o("fg", "str"),
    o("bg", "str"),
  ]),
  f("drawLog", [
    p("log", "messages"),
    p("x", "int"),
    p("y", "int"),
    p("width", "int"),
    p("height", "int"),
  ]),
  f("drawGrid", [p("g", "grid")]),
  v("find", [], p("criteria", "component", "tag"), o("match", "entity")),
  f("floor", [p("value", "float", "int")], p("value", "int")),
  f("getFOV", [
    p("tiles", "grid"),
    p("x", "int"),
    p("y", "int"),
    p("radius", "int"),
    p("visible", "grid"),
    p("explored", "grid"),
  ]),
  f(
    "getNextMove",
    [p("map", "grid"), p("blockers", "grid"), p("from", "xy"), p("to", "xy")],
    o("next", "xy")
  ),
  v(
    "join",
    [p("glue", "char", "str")],
    p("parts", "char", "str", "int"),
    p("string", "str")
  ),
  f("pushKeyHandler", [p("handler", "system")]),
  f("randInt", [p("min", "int"), p("max", "int")], p("value", "int")),
  f("remove", [p("e", "entity")]),
  f("repeat", [p("ch", "char", "str"), p("count", "int")], p("string", "str")),
  f("setSize", [p("width", "int"), p("height", "int")]),
  v(
    "spawn",
    [],
    p("components", "component", "tag", "template"),
    p("e", "entity")
  ),
];
export default library;
