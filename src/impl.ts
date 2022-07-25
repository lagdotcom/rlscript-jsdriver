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
import libtype from "./libtype";

export default function implementation(__lib: libtype): RLEnv {
  enum Layer {
    Nothing,
    Corpse,
    Enemy,
    Player,
  }

  const IsBlocker = new RLTag("IsBlocker");
  const IsPlayer = new RLTag("IsPlayer");
  const RecalculateFOV = new RLTag("RecalculateFOV");
  const Redraw = new RLTag("Redraw");
  const MyTurn = new RLTag("MyTurn");
  const BaseAI = new RLTag("BaseAI");
  const HostileEnemy = new RLTag("HostileEnemy");
  const WaitAction = new RLTag("WaitAction");

  const mkAppearance = (
    name: string,
    ch: string,
    fg: string,
    bg: string,
    layer: number
  ): Appearance => ({
    type: "component",
    typeName: "Appearance",
    name,
    ch,
    fg,
    bg,
    layer,
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
    maxHp: number,
    hp: number,
    defense: number,
    power: number
  ): Fighter => ({
    type: "component",
    typeName: "Fighter",
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
      mkAppearance("player", "@", "white", "black", Layer.Player),
      mkFighter(30, 30, 2, 5),
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
      mkAppearance("orc", "o", "green", "black", Layer.Enemy),
      mkFighter(10, 10, 0, 3),
    ],
  };
  const tmTroll: RLTemplate = {
    type: "template",
    name: "Troll",
    get: () => [
      tmEnemy,
      mkAppearance("troll", "T", "lime", "black", Layer.Enemy),
      mkFighter(16, 16, 1, 4),
    ],
  };
  const tmCorpse: RLTemplate = {
    type: "template",
    name: "Corpse",
    get: () => [
      Redraw,
      mkAppearance("corpse", "%", "red", "black", Layer.Corpse),
    ],
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
        __lib.log({ type: "str", value: "You died!" });
      } else {
        __lib.log({
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: e.Appearance.name },
            { type: "str", value: "is dead!" }
          ),
        });
      }
      const corpse: RLEntity = __lib.spawn(
        tmCorpse,
        mkPosition(e.Position.x, e.Position.y)
      );
      corpse.Appearance.name = __lib.join(
        { type: "char", value: " " },
        { type: "str", value: "corpse of" },
        { type: "str", value: e.Appearance.name }
      );
      __lib.remove(e);
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
    let bg = "black";
    let layer: Layer = Layer.Nothing;
    if (visible.at(x, y)) {
      for (const _entity of new RLQuery(RL.instance, [
        "Appearance",
        "Position",
      ]).get()) {
        const { Appearance: a, Position: p } = _entity;
        if (p.x == x && p.y == y && a.layer > layer) {
          ch = a.ch;
          fg = a.fg;
          bg = a.bg;
          layer = a.layer;
        }
      }
    }
    if (layer == Layer.Nothing && explored.at(x, y)) {
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
    __lib.draw(
      { type: "int", value: x },
      { type: "int", value: y },
      { type: "char", value: ch },
      { type: "str", value: fg },
      { type: "str", value: bg }
    );
  }
  const fn_drawTileAt = new RLFn("drawTileAt", drawTileAt, [
    { type: "param", name: "x", typeName: "int" },
    { type: "param", name: "y", typeName: "int" },
  ]);

  function drawEntity(e: RLEntity) {
    if (e.Position && e.Appearance && visible.at(e.Position.x, e.Position.y)) {
      __lib.draw(
        { type: "int", value: e.Position.x },
        { type: "int", value: e.Position.y },
        { type: "char", value: e.Appearance.ch },
        { type: "str", value: e.Appearance.fg },
        { type: "str", value: e.Appearance.bg }
      );
    }
  }
  const fn_drawEntity = new RLFn("drawEntity", drawEntity, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function randomRoom() {
    const w: number = __lib.randInt(
      { type: "int", value: 6 },
      { type: "int", value: 14 }
    );
    const h: number = __lib.randInt(
      { type: "int", value: 6 },
      { type: "int", value: 14 }
    );
    const x: number = __lib.randInt(
      { type: "int", value: 1 },
      { type: "int", value: map.width - w - 1 }
    );
    const y: number = __lib.randInt(
      { type: "int", value: 1 },
      { type: "int", value: map.height - h - 1 }
    );
    return new RLRect(x, y, w, h);
  }
  const fn_randomRoom = new RLFn("randomRoom", randomRoom, []);

  function randomCorridor(x1: number, y1: number, x2: number, y2: number) {
    let cx: number = x2;
    let cy: number = y1;
    if (__lib.randInt({ type: "int", value: 0 }, { type: "int", value: 1 })) {
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
          __lib.spawn(tmPlayer, mkPosition(room.cx, room.cy));
        }
        prev = room;
      }
    }
  }
  const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);

  function addEnemies(r: RLRect, taken: RLGrid) {
    for (
      let z = 1;
      z <= __lib.randInt({ type: "int", value: 0 }, { type: "int", value: 2 });
      z++
    ) {
      const x: number = __lib.randInt(
        { type: "int", value: r.x + 1 },
        { type: "int", value: r.x2 - 1 }
      );
      const y: number = __lib.randInt(
        { type: "int", value: r.y + 1 },
        { type: "int", value: r.y2 - 1 }
      );
      if (!taken.at(x, y)) {
        taken.put(x, y, true);
        if (
          __lib.randInt(
            { type: "int", value: 1 },
            { type: "int", value: 100 }
          ) < 80
        ) {
          __lib.spawn(tmOrc, mkPosition(x, y));
        } else {
          __lib.spawn(tmTroll, mkPosition(x, y));
        }
      }
    }
  }
  const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
    { type: "param", name: "r", typeName: "rect" },
    { type: "param", name: "taken", typeName: "grid" },
  ]);

  function main() {
    __lib.setSize({ type: "int", value: 80 }, { type: "int", value: 50 });
    generateDungeon();
    __lib.pushKeyHandler(system_onKey);
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
          __lib.abs({ type: "int", value: dx }) +
          __lib.abs({ type: "int", value: dy });
        if (distance < 2) {
          e.add(mkMeleeAction(target));
          return;
        }
        const step: RLXY | undefined = __lib.getNextMove(
          map,
          getBlockingMap(),
          new RLXY(p.x, p.y),
          new RLXY(tp.x, tp.y)
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
      const b: RLEntity | undefined = __lib.find(IsBlocker, mkPosition(x, y));
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

  function doMelee(e: RLEntity, m: MeleeAction, a: Appearance, f: Fighter) {
    const target: RLEntity = m.target;
    e.remove(m);
    useTurn(e);
    const attack: string = __lib.join(
      { type: "char", value: " " },
      { type: "str", value: a.name },
      { type: "str", value: "attacks" },
      { type: "str", value: target.Appearance.name }
    );
    const damage: number = f.power - target.Fighter.defense;
    if (damage > 0) {
      __lib.log({
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: attack },
          { type: "str", value: "for" },
          { type: "int", value: damage },
          { type: "str", value: "hit points" }
        ),
      });
      hurt(target, damage);
    } else {
      __lib.log({
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: attack },
          { type: "str", value: "but does no damage" }
        ),
      });
    }
  }
  const system_doMelee = new RLSystem("doMelee", doMelee, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "m", typeName: "MeleeAction" },
    { type: "param", name: "a", typeName: "Appearance" },
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
    __lib.getFOV(
      map,
      { type: "int", value: p.x },
      { type: "int", value: p.y },
      { type: "int", value: 5 },
      visible,
      explored
    );
    e.remove(RecalculateFOV);
    for (let x = 0; x <= 79; x++) {
      for (let y = 0; y <= 49; y++) {
        drawTileAt(x, y);
      }
    }
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

  function redrawEntity(e: RLEntity, p: Position) {
    drawTileAt(p.x, p.y);
    e.remove(Redraw);
  }
  const system_redrawEntity = new RLSystem("redrawEntity", redrawEntity, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "constraint", typeName: "Redraw" },
  ]);

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

  return new Map<string, RLObject>([
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
    ["redrawEntity", system_redrawEntity],
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
}
