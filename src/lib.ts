import {
  RLEntity,
  RLEnv,
  RLFn,
  RLInt,
  RLStr,
  RLSystem,
  RLTag,
  RLTemplate,
} from "./RL";
import Game from "./Game";
import { RLComponent } from "./implTypes";
import { TinyColor } from "tinycolor-ts";

function setSize(w: RLInt, h: RLInt) {
  Game.instance.width = w.value;
  Game.instance.height = h.value;
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

function draw(x: RLInt, y: RLInt, ch: RLStr, fg?: RLStr, bg?: RLStr) {
  const f = fg ? new TinyColor(fg.value).toNumber() << 8 : undefined;
  const b = bg ? new TinyColor(bg.value).toNumber() << 8 : undefined;

  Game.instance.terminal.drawChar(x.value, y.value, ch.value, f, b);
}

const lib: RLEnv = new Map([
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
    "pushKeyHandler",
    new RLFn("pushKeyHandler", pushKeyHandler, [
      { type: "param", typeName: "system", name: "handler" },
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
