import { Appearance, MoveAction, OldPosition, Position } from "./implTypes";
import RL, {
  RLEntity,
  RLEnv,
  RLFn,
  RLKeyEvent,
  RLObject,
  RLSystem,
  RLTag,
} from "./RL";

const IsPlayer = new RLTag("IsPlayer");

const mkAppearance = (ch: string, fg = "white", bg = "black"): Appearance => ({
  type: "component",
  typeName: "Appearance",
  ch,
  fg,
  bg,
});
const mkMoveAction = (x: number, y: number): MoveAction => ({
  type: "component",
  typeName: "MoveAction",
  x,
  y,
});
const mkOldPosition = (x: number, y: number): OldPosition => ({
  type: "component",
  typeName: "OldPosition",
  x,
  y,
});
const mkPosition = (x: number, y: number): Position => ({
  type: "component",
  typeName: "Position",
  x,
  y,
});

function onKey(e: RLEntity, k: RLKeyEvent) {
  e.add(
    (() => {
      if (k.key === "up") return mkMoveAction(0, -1);
      else if (k.key === "right") return mkMoveAction(1, 0);
      else if (k.key === "down") return mkMoveAction(0, 1);
      else if (k.key === "left") return mkMoveAction(-1, 0);
    })()
  );
}
const system_onKey = new RLSystem("onKey", onKey, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "k", typeName: "KeyEvent" },
  { type: "constraint", typeName: "IsPlayer" },
]);

function movement(e: RLEntity, p: Position, m: MoveAction) {
  e.add(mkOldPosition(p.x, p.y));
  p.x += m.x;
  p.y += m.y;
  e.remove(m);
}
const system_movement = new RLSystem("movement", movement, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "param", name: "m", typeName: "MoveAction" },
]);

function drawAfterMove(
  e: RLEntity,
  a: Appearance,
  o: OldPosition,
  p: Position
) {
  RL.instance.callNamedFunction(
    "draw",
    { type: "positional", value: { type: "int", value: o.x } },
    { type: "positional", value: { type: "int", value: o.y } },
    { type: "positional", value: { type: "char", value: " " } }
  );

  e.remove(o);
  RL.instance.callNamedFunction(
    "draw",
    { type: "positional", value: { type: "int", value: p.x } },
    { type: "positional", value: { type: "int", value: p.y } },
    { type: "positional", value: { type: "char", value: a.ch } },
    { type: "positional", value: { type: "str", value: a.fg } },
    { type: "positional", value: { type: "str", value: a.bg } }
  );
}
const system_drawAfterMove = new RLSystem("drawAfterMove", drawAfterMove, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "a", typeName: "Appearance" },
  { type: "param", name: "o", typeName: "OldPosition" },
  { type: "param", name: "p", typeName: "Position" },
]);

function main() {
  RL.instance.callNamedFunction(
    "setSize",
    { type: "positional", value: { type: "int", value: 80 } },
    { type: "positional", value: { type: "int", value: 50 } }
  );
  RL.instance.callNamedFunction(
    "spawn",
    { type: "positional", value: IsPlayer },
    { type: "positional", value: mkAppearance("@", "white", "black") },
    { type: "positional", value: mkPosition(40, 25) },
    { type: "positional", value: mkOldPosition(40, 25) }
  );
  RL.instance.callNamedFunction("pushKeyHandler", {
    type: "positional",
    value: system_onKey,
  });
}
const fn_main = new RLFn("main", main, []);

const impl: RLEnv = new Map<string, RLObject>([
  ["IsPlayer", IsPlayer],
  ["onKey", system_onKey],
  ["movement", system_movement],
  ["drawAfterMove", system_drawAfterMove],
  ["main", fn_main],
]);
export default impl;
