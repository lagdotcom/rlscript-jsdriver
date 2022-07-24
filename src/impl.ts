import {
  Actor,
  Appearance,
  Fighter,
  MeleeAction,
  MoveAction,
  OldPosition,
  Position,
} from "./implTypes";
import RL, {
  RLEntity,
  RLEnv,
  RLFn,
  RLGrid,
  RLKeyEvent,
  RLObject,
  RLQuery,
  RLRect,
  RLSystem,
  RLTag,
  RLTemplate,
  RLTile,
  RLXY,
} from "./RL";

const IsBlocker = new RLTag("IsBlocker");
const IsPlayer = new RLTag("IsPlayer");
const RecalculateFOV = new RLTag("RecalculateFOV");
const Redraw = new RLTag("Redraw");
const MyTurn = new RLTag("MyTurn");
const BaseAI = new RLTag("BaseAI");
const HostileEnemy = new RLTag("HostileEnemy");
const WaitAction = new RLTag("WaitAction");

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
const mkMeleeAction = (target: RLEntity): MeleeAction => ({
  type: "component",
  typeName: "MeleeAction",
  target,
});
const mkActor = (energy: number): Actor => ({
  type: "component",
  typeName: "Actor",
  energy,
});
const mkFighter = (
  name: string,
  maxHp: number,
  hp: number,
  defense: number,
  power: number
): Fighter => ({
  type: "component",
  typeName: "Fighter",
  name,
  maxHp,
  hp,
  defense,
  power,
});

const tmPlayer: RLTemplate = {
  type: "template",
  name: "Player",
  get: () => [
    IsBlocker,
    IsPlayer,
    mkAppearance("@", "white", "black"),
    mkFighter("player", 30, 30, 2, 5),
    mkActor(100),
    MyTurn,
    RecalculateFOV,
  ],
};
const tmEnemy: RLTemplate = {
  type: "template",
  name: "Enemy",
  get: () => [IsBlocker, HostileEnemy, mkActor(1)],
};
const tmOrc: RLTemplate = {
  type: "template",
  name: "Orc",
  get: () => [
    tmEnemy,
    mkAppearance("o", "green", "black"),
    mkFighter("orc", 10, 10, 0, 3),
  ],
};
const tmTroll: RLTemplate = {
  type: "template",
  name: "Troll",
  get: () => [
    tmEnemy,
    mkAppearance("T", "lime", "black"),
    mkFighter("troll", 16, 16, 1, 4),
  ],
};
const tmCorpse: RLTemplate = {
  type: "template",
  name: "Corpse",
  get: () => [Redraw, mkAppearance("%", "red", "black")],
};

const Floor = new RLTile(".", true, true);
const Wall = new RLTile("#", false, false);

let map: RLGrid;
let explored: RLGrid;
let visible: RLGrid;

function getBlockingMap() {
  const blocked: RLGrid = new RLGrid(map.width, map.height, false);
  for (const _entity of new RLQuery(RL.instance, [
    "Position",
    "IsBlocker",
  ]).get()) {
    const { Position: p } = _entity;
    blocked.put(p.x, p.y, true);
  }
  return blocked;
}
const fn_getBlockingMap = new RLFn("getBlockingMap", getBlockingMap, []);

function hurt(e: RLEntity, damage: number) {
  e.Fighter.hp -= damage;
  if (e.Fighter.hp < 0) {
    if (e.IsPlayer) {
      RL.instance.callNamedFunction("log", {
        type: "positional",
        value: { type: "str", value: "You died!" },
      });
    } else {
      RL.instance.callNamedFunction("log", {
        type: "positional",
        value: {
          type: "str",
          value: RL.instance.callNamedFunction(
            "join",
            { type: "positional", value: { type: "char", value: " " } },
            {
              type: "positional",
              value: { type: "str", value: e.Fighter.name },
            },
            { type: "positional", value: { type: "str", value: "is dead!" } }
          ),
        },
      });
    }
    RL.instance.callNamedFunction("remove", { type: "positional", value: e });
    const corpse: RLEntity = RL.instance.callNamedFunction(
      "spawn",
      { type: "positional", value: tmCorpse },
      { type: "positional", value: mkPosition(e.Position.x, e.Position.y) }
    );
  }
}
const fn_hurt = new RLFn("hurt", hurt, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "damage", typeName: "int" },
]);

function useTurn(e: RLEntity) {
  e.Actor.energy -= 100;
  e.remove(MyTurn);
}
const fn_useTurn = new RLFn("useTurn", useTurn, [
  { type: "param", name: "e", typeName: "entity" },
]);

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
  if (e.Position && e.Appearance && visible.at(e.Position.x, e.Position.y)) {
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
  const taken: RLGrid = new RLGrid(80, 50, false);
  for (let r = 1; r <= 30; r++) {
    room = randomRoom();
    if (!map.findInRegion(room, Floor)) {
      map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
      if (prev) {
        randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
        addEnemies(room, taken);
      } else {
        RL.instance.callNamedFunction(
          "spawn",
          { type: "positional", value: tmPlayer },
          { type: "positional", value: mkPosition(room.cx, room.cy) }
        );
      }
      prev = room;
    }
  }
}
const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);

function addEnemies(r: RLRect, taken: RLGrid) {
  for (
    let z = 1;
    z <=
    RL.instance.callNamedFunction(
      "randInt",
      { type: "positional", value: { type: "int", value: 0 } },
      { type: "positional", value: { type: "int", value: 2 } }
    );
    z++
  ) {
    const x: number = RL.instance.callNamedFunction(
      "randInt",
      { type: "positional", value: { type: "int", value: r.x + 1 } },
      { type: "positional", value: { type: "int", value: r.x2 - 1 } }
    );
    const y: number = RL.instance.callNamedFunction(
      "randInt",
      { type: "positional", value: { type: "int", value: r.y + 1 } },
      { type: "positional", value: { type: "int", value: r.y2 - 1 } }
    );
    if (!taken.at(x, y)) {
      taken.put(x, y, true);
      if (
        RL.instance.callNamedFunction(
          "randInt",
          { type: "positional", value: { type: "int", value: 1 } },
          { type: "positional", value: { type: "int", value: 100 } }
        ) < 80
      ) {
        RL.instance.callNamedFunction(
          "spawn",
          { type: "positional", value: tmOrc },
          { type: "positional", value: mkPosition(x, y) }
        );
      } else {
        RL.instance.callNamedFunction(
          "spawn",
          { type: "positional", value: tmTroll },
          { type: "positional", value: mkPosition(x, y) }
        );
      }
    }
  }
}
const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
  { type: "param", name: "r", typeName: "rect" },
  { type: "param", name: "taken", typeName: "grid" },
]);

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
      else if (matchvar === "wait") return WaitAction;
    })(k.key)
  );
}
const system_onKey = new RLSystem("onKey", onKey, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "constraint", typeName: "IsPlayer" },
  { type: "param", name: "k", typeName: "KeyEvent" },
]);

function hostileAI(e: RLEntity, p: Position) {
  if (visible.at(p.x, p.y)) {
    for (const target of new RLQuery(RL.instance, [
      "Position",
      "IsPlayer",
    ]).get()) {
      const { Position: tp } = target;
      const dx: number = tp.x - p.x;
      const dy: number = tp.y - p.y;
      const distance: number =
        RL.instance.callNamedFunction("abs", {
          type: "positional",
          value: { type: "int", value: dx },
        }) +
        RL.instance.callNamedFunction("abs", {
          type: "positional",
          value: { type: "int", value: dy },
        });
      if (distance < 2) {
        e.add(mkMeleeAction(target));
        return;
      }
      const step: RLXY | undefined = RL.instance.callNamedFunction(
        "getNextMove",
        { type: "positional", value: map },
        { type: "positional", value: getBlockingMap() },
        { type: "positional", value: new RLXY(p.x, p.y) },
        { type: "positional", value: new RLXY(tp.x, tp.y) }
      );
      if (step) {
        e.add(mkMoveAction(step.x - p.x, step.y - p.y));
        return;
      }
    }
  }
  e.add(WaitAction);
}
const system_hostileAI = new RLSystem("hostileAI", hostileAI, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "constraint", typeName: "HostileEnemy" },
  { type: "constraint", typeName: "MyTurn" },
]);

function doMove(e: RLEntity, p: Position, m: MoveAction) {
  const x: number = p.x + m.x;
  const y: number = p.y + m.y;
  e.remove(m);
  const t: RLTile | undefined = map.at(x, y);
  if (t && t.walkable) {
    const b: RLEntity | undefined = RL.instance.callNamedFunction(
      "find",
      { type: "positional", value: IsBlocker },
      { type: "positional", value: mkPosition(x, y) }
    );
    if (b && b.has("Fighter")) {
      e.add(mkMeleeAction(b));
      return;
    }
    useTurn(e);
    e.add(mkOldPosition(p.x, p.y));
    p.x = x;
    p.y = y;
    if (e.IsPlayer) {
      e.add(RecalculateFOV);
    }
  }
}
const system_doMove = new RLSystem("doMove", doMove, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "param", name: "m", typeName: "MoveAction" },
  { type: "constraint", typeName: "MyTurn" },
]);

function doMelee(e: RLEntity, m: MeleeAction, f: Fighter) {
  const target: RLEntity = m.target;
  e.remove(m);
  useTurn(e);
  const attack: string = RL.instance.callNamedFunction(
    "join",
    { type: "positional", value: { type: "char", value: " " } },
    { type: "positional", value: { type: "str", value: f.name } },
    { type: "positional", value: { type: "str", value: "attacks" } },
    { type: "positional", value: { type: "str", value: target.Fighter.name } }
  );
  const damage: number = f.power - target.Fighter.defense;
  if (damage > 0) {
    RL.instance.callNamedFunction("log", {
      type: "positional",
      value: {
        type: "str",
        value: RL.instance.callNamedFunction(
          "join",
          { type: "positional", value: { type: "char", value: " " } },
          { type: "positional", value: { type: "str", value: attack } },
          { type: "positional", value: { type: "str", value: "for" } },
          { type: "positional", value: { type: "int", value: damage } },
          { type: "positional", value: { type: "str", value: "hit points" } }
        ),
      },
    });
    hurt(target, damage);
  } else {
    RL.instance.callNamedFunction("log", {
      type: "positional",
      value: {
        type: "str",
        value: RL.instance.callNamedFunction(
          "join",
          { type: "positional", value: { type: "char", value: " " } },
          { type: "positional", value: { type: "str", value: attack } },
          {
            type: "positional",
            value: { type: "str", value: "but does no damage" },
          }
        ),
      },
    });
  }
}
const system_doMelee = new RLSystem("doMelee", doMelee, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "m", typeName: "MeleeAction" },
  { type: "param", name: "f", typeName: "Fighter" },
  { type: "constraint", typeName: "MyTurn" },
]);

function doWait(e: RLEntity) {
  e.remove(WaitAction);
  useTurn(e);
}
const system_doWait = new RLSystem("doWait", doWait, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "constraint", typeName: "WaitAction" },
  { type: "constraint", typeName: "MyTurn" },
]);

function fov(e: RLEntity, p: Position) {
  RL.instance.callNamedFunction(
    "getFOV",
    { type: "positional", value: map },
    { type: "positional", value: { type: "int", value: p.x } },
    { type: "positional", value: { type: "int", value: p.y } },
    { type: "positional", value: { type: "int", value: 5 } },
    { type: "positional", value: visible },
    { type: "positional", value: explored }
  );
  e.remove(RecalculateFOV);
  for (let x = 0; x <= 79; x++) {
    for (let y = 0; y <= 49; y++) {
      drawTileAt(x, y);
    }
  }
  RL.instance.callNamedFunction("add", { type: "positional", value: Redraw });
}
const system_fov = new RLSystem("fov", fov, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "p", typeName: "Position" },
  { type: "constraint", typeName: "RecalculateFOV" },
]);

function drawUnderTile(e: RLEntity, o: OldPosition) {
  drawTileAt(o.x, o.y);
  e.remove(o);
  e.add(Redraw);
}
const system_drawUnderTile = new RLSystem("drawUnderTile", drawUnderTile, [
  { type: "param", name: "e", typeName: "entity" },
  { type: "param", name: "o", typeName: "OldPosition" },
]);

function drawKnownEntities(e: RLEntity) {
  e.remove(Redraw);
  drawEntity(e);
}
const system_drawKnownEntities = new RLSystem(
  "drawKnownEntities",
  drawKnownEntities,
  [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "Redraw" },
  ]
);

function nextTurn() {
  let highest = -99999;
  for (const _entity of new RLQuery(RL.instance, ["Actor"]).get()) {
    const { Actor: a } = _entity;
    if (a.energy > highest) {
      highest = a.energy;
    }
  }
  if (highest >= 100) {
    return false;
  }
  const elapse: number = 100 - highest;
  for (const e of new RLQuery(RL.instance, ["Actor"]).get()) {
    const { Actor: a } = e;
    a.energy += elapse;
    if (a.energy >= 100) {
      e.add(MyTurn);
    }
  }
}
const system_nextTurn = new RLSystem("nextTurn", nextTurn, []);

const impl: RLEnv = new Map<string, RLObject>([
  ["getBlockingMap", fn_getBlockingMap],
  ["hurt", fn_hurt],
  ["useTurn", fn_useTurn],
  ["drawTileAt", fn_drawTileAt],
  ["drawEntity", fn_drawEntity],
  ["randomRoom", fn_randomRoom],
  ["randomCorridor", fn_randomCorridor],
  ["generateDungeon", fn_generateDungeon],
  ["addEnemies", fn_addEnemies],
  ["main", fn_main],
  ["onKey", system_onKey],
  ["hostileAI", system_hostileAI],
  ["doMove", system_doMove],
  ["doMelee", system_doMelee],
  ["doWait", system_doWait],
  ["fov", system_fov],
  ["drawUnderTile", system_drawUnderTile],
  ["drawKnownEntities", system_drawKnownEntities],
  ["nextTurn", system_nextTurn],
  ["IsBlocker", IsBlocker],
  ["IsPlayer", IsPlayer],
  ["RecalculateFOV", RecalculateFOV],
  ["Redraw", Redraw],
  ["MyTurn", MyTurn],
  ["BaseAI", BaseAI],
  ["HostileEnemy", HostileEnemy],
  ["WaitAction", WaitAction],
  ["Player", tmPlayer],
  ["Enemy", tmEnemy],
  ["Orc", tmOrc],
  ["Troll", tmTroll],
  ["Corpse", tmCorpse],
]);
export default impl;
