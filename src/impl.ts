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

const mkAppearance = (ch: string, fg: string, bg: string): Appearance => ({
  type: "component",
  typeName: "Appearance",
  ch,
  fg,
  bg,
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
const mkMoveAction = (x: number, y: number): MoveAction => ({
  type: "component",
  typeName: "MoveAction",
  x,
  y,
});

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

function onKey(e: RLEntity, k: RLKeyEvent) {
  e.add(
    ((matchvar) => {
      if (matchvar === "up") return mkMoveAction(0, -1);
      else if (matchvar === "right") return mkMoveAction(1, 0);
      else if (matchvar === "down") return mkMoveAction(0, 1);
      else if (matchvar === "left") return mkMoveAction(-1, 0);
    })(k.key)
  );
}
const system_onKey = new RLSystem("onKey", onKey, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "constraint", typeName: "IsPlayer" },
  { type: "param", name: "k", typeName: "KeyEvent" },
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

const impl: RLEnv = new Map<string, RLObject>([
  ["main", fn_main],
  ["onKey", system_onKey],
  ["movement", system_movement],
  ["drawAfterMove", system_drawAfterMove],
  ["IsPlayer", IsPlayer],
]);
export default impl;
