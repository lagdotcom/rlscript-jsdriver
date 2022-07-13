import { Appearance, MoveAction, OldPosition, Position } from "./implTypes";
import RL, {
  RLEntity,
  RLEnv,
  RLFn,
  RLGrid,
  RLKeyEvent,
  RLObject,
  RLRect,
  RLSystem,
  RLTag,
  RLTemplate,
  RLTile,
} from "./RL";

const IsPlayer = new RLTag("IsPlayer");
const RecalculateFOV = new RLTag("RecalculateFOV");

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

const tmPlayer: RLTemplate = {
  type: "template",
  name: "Player",
  get: () => [IsPlayer, mkAppearance("@", "white", "black"), RecalculateFOV],
};
const tmNPC: RLTemplate = {
  type: "template",
  name: "NPC",
  get: () => [mkAppearance("@", "yellow", "black")],
};

const Floor = new RLTile(".", true, true);
const Wall = new RLTile("#", false, false);

let map: RLGrid;
let explored: RLGrid;
let visible: RLGrid;

function drawTileAt(x: number, y: number) {
  let ch = " ";
  let fg = "white";
  if (explored.at(x, y)) {
    const t: RLTile | undefined = map.at(x, y);
    if (t) {
      ch = t.ch;
      if (visible.at(x, y)) {
        fg = "silver";
      } else {
        fg = "#444";
      }
    }
  }
  RL.instance.callNamedFunction(
    "draw",
    { type: "positional", value: { type: "int", value: x } },
    { type: "positional", value: { type: "int", value: y } },
    { type: "positional", value: { type: "char", value: ch } },
    { type: "positional", value: { type: "str", value: fg } }
  );
}
const fn_drawTileAt = new RLFn("drawTileAt", drawTileAt, [
  { type: "param", name: "x", typeName: "int" },
  { type: "param", name: "y", typeName: "int" },
]);

function drawEntity(e: RLEntity) {
  if (e.Position && e.Appearance) {
    RL.instance.callNamedFunction(
      "draw",
      { type: "positional", value: { type: "int", value: e.Position.x } },
      { type: "positional", value: { type: "int", value: e.Position.y } },
      { type: "positional", value: { type: "char", value: e.Appearance.ch } },
      { type: "positional", value: { type: "str", value: e.Appearance.fg } },
      { type: "positional", value: { type: "str", value: e.Appearance.bg } }
    );
  }
}
const fn_drawEntity = new RLFn("drawEntity", drawEntity, [
  { type: "param", name: "e", typeName: "entity" },
]);

function randomRoom() {
  const w: number = RL.instance.callNamedFunction(
    "randInt",
    { type: "positional", value: { type: "int", value: 6 } },
    { type: "positional", value: { type: "int", value: 14 } }
  );
  const h: number = RL.instance.callNamedFunction(
    "randInt",
    { type: "positional", value: { type: "int", value: 6 } },
    { type: "positional", value: { type: "int", value: 14 } }
  );
  const x: number = RL.instance.callNamedFunction(
    "randInt",
    { type: "positional", value: { type: "int", value: 1 } },
    { type: "positional", value: { type: "int", value: map.width - w - 1 } }
  );
  const y: number = RL.instance.callNamedFunction(
    "randInt",
    { type: "positional", value: { type: "int", value: 1 } },
    { type: "positional", value: { type: "int", value: map.height - h - 1 } }
  );
  return new RLRect(x, y, w, h);
}
const fn_randomRoom = new RLFn("randomRoom", randomRoom, []);

function randomCorridor(x1: number, y1: number, x2: number, y2: number) {
  let cx: number = x2;
  let cy: number = y1;
  if (
    RL.instance.callNamedFunction(
      "randInt",
      { type: "positional", value: { type: "int", value: 0 } },
      { type: "positional", value: { type: "int", value: 1 } }
    )
  ) {
    cx = x1;
    cy = y2;
  }
  map.line(x1, y1, cx, cy, Floor);
  map.line(cx, cy, x2, y2, Floor);
}
const fn_randomCorridor = new RLFn("randomCorridor", randomCorridor, [
  { type: "param", name: "x1", typeName: "int" },
  { type: "param", name: "y1", typeName: "int" },
  { type: "param", name: "x2", typeName: "int" },
  { type: "param", name: "y2", typeName: "int" },
]);

function generateDungeon() {
  map = new RLGrid(80, 50, Wall);
  explored = new RLGrid(80, 50, false);
  visible = new RLGrid(80, 50, false);
  let prev: RLRect | undefined;
  let room: RLRect;
  for (let r = 1; r <= 30; r++) {
    room = randomRoom();
    if (!map.findInRegion(room, Floor)) {
      map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
      if (prev) {
        randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
      } else {
        RL.instance.callNamedFunction(
          "spawn",
          { type: "positional", value: tmPlayer },
          { type: "positional", value: mkPosition(room.cx, room.cy) },
          { type: "positional", value: mkOldPosition(0, 0) }
        );
      }
      prev = room;
    }
  }
  RL.instance.callNamedFunction(
    "spawn",
    { type: "positional", value: tmNPC },
    { type: "positional", value: mkPosition(prev.cx, prev.cy) },
    { type: "positional", value: mkOldPosition(0, 0) }
  );
}
const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);

function main() {
  RL.instance.callNamedFunction(
    "setSize",
    { type: "positional", value: { type: "int", value: 80 } },
    { type: "positional", value: { type: "int", value: 50 } }
  );
  generateDungeon();
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
  const x: number = p.x + m.x;
  const y: number = p.y + m.y;
  const t: RLTile | undefined = map.at(x, y);
  if (t && t.walkable) {
    e.add(mkOldPosition(p.x, p.y));
    p.x = x;
    p.y = y;
    if (e.IsPlayer) {
      e.add(RecalculateFOV);
    }
  }
  e.remove(m);
}
const system_movement = new RLSystem("movement", movement, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "param", name: "m", typeName: "MoveAction" },
]);

function fov(e: RLEntity, p: Position) {
  RL.instance.callNamedFunction(
    "getFOV",
    { type: "positional", value: { type: "grid", value: map } },
    { type: "positional", value: { type: "int", value: p.x } },
    { type: "positional", value: { type: "int", value: p.y } },
    { type: "positional", value: { type: "int", value: 5 } },
    { type: "positional", value: { type: "grid", value: visible } },
    { type: "positional", value: { type: "grid", value: explored } }
  );
  e.remove(RecalculateFOV);
  for (let x = 0; x <= 80; x++) {
    for (let y = 0; y <= 50; y++) {
      drawTileAt(x, y);
    }
  }
}
const system_fov = new RLSystem("fov", fov, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "constraint", typeName: "RecalculateFOV" },
]);

function drawAfterMove(e: RLEntity, o: OldPosition) {
  drawTileAt(o.x, o.y);
  e.remove(o);
  drawEntity(e);
}
const system_drawAfterMove = new RLSystem("drawAfterMove", drawAfterMove, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "o", typeName: "OldPosition" },
]);

const impl: RLEnv = new Map<string, RLObject>([
  ["drawTileAt", fn_drawTileAt],
  ["drawEntity", fn_drawEntity],
  ["randomRoom", fn_randomRoom],
  ["randomCorridor", fn_randomCorridor],
  ["generateDungeon", fn_generateDungeon],
  ["main", fn_main],
  ["onKey", system_onKey],
  ["movement", system_movement],
  ["fov", system_fov],
  ["drawAfterMove", system_drawAfterMove],
  ["IsPlayer", IsPlayer],
  ["RecalculateFOV", RecalculateFOV],
  ["Player", tmPlayer],
  ["NPC", tmNPC],
]);
export default impl;
