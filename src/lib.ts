import { ComputeVisibility, ShadowCastingGrid } from "./RecursiveShadowCasting";
import Game from "./Game";
import RL, {
  RLChar,
  RLEntity,
  RLEnv,
  RLFn,
  RLGrid,
  RLInt,
  RLStr,
  RLSystem,
  RLTag,
  RLTemplate,
  RLTile,
} from "./RL";
import { RLComponent } from "./implTypes";
import { TinyColor } from "tinycolor-ts";

type RLGridArg<T> = { type: "grid"; value: RLGrid<T> };

function setSize({ value: width }: RLInt, { value: height }: RLInt) {
  Game.instance.width = width;
  Game.instance.height = height;
}

function spawn(...args: (RLComponent | RLTag | RLTemplate)[]) {
  const e = new RLEntity();
  for (const a of args) {
    if (a.type === "template") {
      for (const part of a.get()) e.add(part);
    } else e.add(a);
  }

  Game.instance.rl.entities.set(e.id, e);
  return e;
}

function pushKeyHandler(handler: RLSystem) {
  Game.instance.rl.keyHandlers.push(handler);
}

function draw(
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: ch }: RLChar,
  fg?: RLStr,
  bg?: RLStr
) {
  const f = fg ? new TinyColor(fg.value).toNumber() << 8 : undefined;
  const b = bg ? new TinyColor(bg.value).toNumber() << 8 : undefined;

  Game.instance.terminal.drawChar(x, y, ch, f, b);
}

function drawGrid({ value: g }: RLGridArg<RLTile>) {
  for (let y = 0; y < g.height; y++) {
    for (let x = 0; x < g.width; x++) {
      const t = g.at(x, y);
      if (t)
        draw(
          { type: "int", value: x },
          { type: "int", value: y },
          { type: "char", value: t.ch },
          { type: "str", value: "silver" }
        );
    }
  }
}

function randInt({ value: min }: RLInt, { value: max }: RLInt) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

function getFOV(
  { value: tiles }: RLGridArg<RLTile>,
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: radius }: RLInt,
  { value: visible }: RLGridArg<boolean>,
  { value: explored }: RLGridArg<boolean>
) {
  visible.fill(visible.empty);

  const grid = new ShadowCastingGrid(
    tiles.width,
    tiles.height,
    (x, y) => !tiles.at(x, y)?.transparent
  );
  ComputeVisibility(grid, { x, y }, radius);

  for (const pos of grid.values.keys()) {
    visible.put(pos.x, pos.y, true);
    explored.put(pos.x, pos.y, true);
  }
}

function add(...args: (RLComponent | RLTag)[]) {
  for (const a of args) {
    for (const e of RL.instance.entities.values()) e.add(a);
  }
}

const lib: RLEnv = new Map([
  ["add", new RLFn("add", add, [], ["component", "tag"])],
  [
    "draw",
    new RLFn("draw", draw, [
      { type: "param", typeName: "int", name: "x" },
      { type: "param", typeName: "int", name: "y" },
      { type: "param", typeName: "char", name: "ch" },
      {
        type: "param",
        typeName: "str",
        name: "fg",
        default: { type: "str", value: "" },
      },
      {
        type: "param",
        typeName: "str",
        name: "bg",
        default: { type: "str", value: "" },
      },
    ]),
  ],
  [
    "drawGrid",
    new RLFn("drawGrid", drawGrid, [
      { type: "param", typeName: "grid", name: "g" },
    ]),
  ],
  [
    "getFOV",
    new RLFn("getFOV", getFOV, [
      { type: "param", typeName: "grid", name: "tiles" },
      { type: "param", typeName: "int", name: "x" },
      { type: "param", typeName: "int", name: "y" },
      { type: "param", typeName: "int", name: "radius" },
      { type: "param", typeName: "grid", name: "visible" },
      { type: "param", typeName: "grid", name: "explored" },
    ]),
  ],
  [
    "pushKeyHandler",
    new RLFn("pushKeyHandler", pushKeyHandler, [
      { type: "param", typeName: "system", name: "handler" },
    ]),
  ],
  [
    "randInt",
    new RLFn("randInt", randInt, [
      { type: "param", typeName: "int", name: "min" },
      { type: "param", typeName: "int", name: "max" },
    ]),
  ],
  [
    "setSize",
    new RLFn("setSize", setSize, [
      { type: "param", typeName: "int", name: "width" },
      { type: "param", typeName: "int", name: "height" },
    ]),
  ],
  ["spawn", new RLFn("spawn", spawn, [], ["component", "tag", "template"])],
]);
export default lib;
