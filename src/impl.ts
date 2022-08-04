import {
  Actor,
  Appearance,
  Fighter,
  MeleeAction,
  MoveAction,
  OldPosition,
  Position,
} from "./implTypes";

import MessageLog from "./MessageLog";
import RL from "./RL";
import RLEntity from "./RLEntity";
import RLEnv from "./RLEnv";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLKeyEvent from "./RLKeyEvent";
import RLLibrary from "./RLLibrary";
import RLMouseEvent from "./RLMouseEvent";
import RLObject from "./RLObject";
import RLQuery from "./RLQuery";
import RLRect from "./RLRect";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";

export default function implementation(__lib: RLLibrary): RLEnv {
  enum Layer {
    Nothing,
    Corpse,
    Enemy,
    Player,
  }

  const IsBlocker = new RLTag("IsBlocker");
  const IsPlayer = new RLTag("IsPlayer");
  const RecalculateFOV = new RLTag("RecalculateFOV");
  const RedrawMe = new RLTag("RedrawMe");
  const RedrawUI = new RLTag("RedrawUI");
  const MyTurn = new RLTag("MyTurn");
  const BaseAI = new RLTag("BaseAI");
  const HostileEnemy = new RLTag("HostileEnemy");
  const WaitAction = new RLTag("WaitAction");
  const HistoryAction = new RLTag("HistoryAction");

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
    defence: number,
    power: number
  ): Fighter => ({
    type: "component",
    typeName: "Fighter",
    maxHp,
    hp,
    defence,
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
      RedrawUI,
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
      RedrawMe,
      mkAppearance("corpse", "%", "red", "black", Layer.Corpse),
    ],
  };

  const Floor = new RLTile(".", true, true);
  const Wall = new RLTile("#", false, false);

  const gameWidth = 80;
  const gameHeight = 50;
  const mapWidth: number = gameWidth;
  const mapHeight: number = gameHeight - 5;
  const hoverX = 0;
  const hoverY: number = mapHeight;
  const hpX = 0;
  const hpY: number = hoverY + 1;
  const hpWidth = 20;
  const logX: number = hpWidth + 2;
  const logY: number = hpY;
  const map: RLGrid = new RLGrid(mapWidth, mapHeight, Wall);
  const explored: RLGrid = new RLGrid(mapWidth, mapHeight, false);
  const visible: RLGrid = new RLGrid(mapWidth, mapHeight, false);
  const log: MessageLog = new MessageLog();
  let historyOffset = 0;

  function getKey(k: string) {
    return ((__match) => {
      if (__match === "ArrowUp") return "up";
      else if (__match === "ArrowRight") return "right";
      else if (__match === "ArrowDown") return "down";
      else if (__match === "ArrowLeft") return "left";
      else if (__match === "Numpad8") return "up";
      else if (__match === "Numpad6") return "right";
      else if (__match === "Numpad2") return "down";
      else if (__match === "Numpad4") return "left";
      else if (__match === "Numpad5") return "wait";
      else if (__match === "KeyK") return "up";
      else if (__match === "KeyL") return "right";
      else if (__match === "KeyJ") return "down";
      else if (__match === "KeyH") return "left";
      else if (__match === "Period") return "wait";
      else if (__match === "KeyV") return "history";
      else return k;
    })(k);
  }
  const fn_getKey = new RLFn("getKey", getKey, [
    { type: "param", name: "k", typeName: "str" },
  ]);

  function getNamesAtLocation(x: number, y: number) {
    let total: string;
    for (const _entity of new RLQuery(RL.instance, [
      "Appearance",
      "Position",
    ]).get()) {
      const { Appearance: a, Position: p } = _entity;
      if (p.x == x && p.y == y) {
        if (total) {
          total = __lib.join(
            { type: "str", value: ", " },
            { type: "str", value: total },
            { type: "str", value: a.name }
          );
        } else {
          total = a.name;
        }
      }
    }
    return total;
  }
  const fn_getNamesAtLocation = new RLFn(
    "getNamesAtLocation",
    getNamesAtLocation,
    [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" },
    ]
  );

  function getBlockingMap() {
    const blocked: RLGrid = new RLGrid(mapWidth, mapHeight, false);
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
    if (e.Fighter.hp < 1) {
      const colour: string = ((__match) => {
        if (__match.has(IsPlayer.typeName)) return "red";
        else return "orange";
      })(e);
      if (e.IsPlayer) {
        log.add("You died!", colour);
      } else {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: e.Appearance.name },
            { type: "str", value: "is dead!" }
          ),
          colour
        );
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
      if (e.IsPlayer) {
        e.add(RedrawUI);
        e.remove("Actor");
        hostileAI.disable();
        __lib.pushKeyHandler(onKeyWhenDead);
      } else {
        __lib.remove(e);
      }
    } else {
      if (e.IsPlayer) {
        e.add(RedrawUI);
      }
    }
  }
  const fn_hurt = new RLFn("hurt", hurt, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "damage", typeName: "int" },
  ]);

  function showHistoryView() {
    __lib.drawLog(
      log,
      { type: "int", value: 0 },
      { type: "int", value: 0 },
      { type: "int", value: gameWidth },
      { type: "int", value: gameHeight },
      { type: "int", value: historyOffset }
    );
  }
  const fn_showHistoryView = new RLFn("showHistoryView", showHistoryView, []);

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

  function drawBar(
    x: number,
    y: number,
    value: number,
    maxValue: number,
    maxWidth: number,
    emptyColour: string,
    filledColour: string
  ) {
    const barWidth: number = __lib.floor({
      type: "int",
      value: (value / maxValue) * maxWidth,
    });
    __lib.draw(
      { type: "int", value: x },
      { type: "int", value: y },
      {
        type: "str",
        value: __lib.repeat(
          { type: "char", value: " " },
          { type: "int", value: maxWidth }
        ),
      },
      { type: "str", value: "white" },
      { type: "str", value: emptyColour }
    );
    if (barWidth > 0) {
      __lib.draw(
        { type: "int", value: x },
        { type: "int", value: y },
        {
          type: "str",
          value: __lib.repeat(
            { type: "char", value: " " },
            { type: "int", value: barWidth }
          ),
        },
        { type: "str", value: "white" },
        { type: "str", value: filledColour }
      );
    }
  }
  const fn_drawBar = new RLFn("drawBar", drawBar, [
    { type: "param", name: "x", typeName: "int" },
    { type: "param", name: "y", typeName: "int" },
    { type: "param", name: "value", typeName: "int" },
    { type: "param", name: "maxValue", typeName: "int" },
    { type: "param", name: "maxWidth", typeName: "int" },
    { type: "param", name: "emptyColour", typeName: "str" },
    { type: "param", name: "filledColour", typeName: "str" },
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
      { type: "int", value: mapWidth - w - 1 }
    );
    const y: number = __lib.randInt(
      { type: "int", value: 1 },
      { type: "int", value: mapHeight - h - 1 }
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
    map.clear();
    explored.clear();
    visible.clear();
    let prev: RLRect | undefined;
    let room: RLRect;
    const taken: RLGrid = new RLGrid(mapWidth, mapHeight, false);
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
    hostileAI.enable();
    log.add("Welcome to the RLscript dungeon!", "skyblue");
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
    __lib.setSize(
      { type: "int", value: gameWidth },
      { type: "int", value: gameHeight }
    );
    generateDungeon();
    __lib.pushKeyHandler(onKeyInDungeon);
    __lib.pushMouseHandler(onMouseInDungeon);
  }
  const fn_main = new RLFn("main", main, []);

  function code_onMouseInDungeon(m: RLMouseEvent) {
    __lib.draw(
      { type: "int", value: hoverX },
      { type: "int", value: hoverY },
      {
        type: "str",
        value: __lib.repeat(
          { type: "char", value: " " },
          { type: "int", value: gameWidth }
        ),
      },
      { type: "str", value: "white" },
      { type: "str", value: "black" }
    );
    if (visible.at(m.x, m.y)) {
      const names: string = getNamesAtLocation(m.x, m.y);
      if (names) {
        __lib.draw(
          { type: "int", value: hoverX },
          { type: "int", value: hoverY },
          { type: "str", value: names },
          { type: "str", value: "white" }
        );
      }
    }
  }
  const onMouseInDungeon = new RLSystem(
    "onMouseInDungeon",
    code_onMouseInDungeon,
    [{ type: "param", name: "m", typeName: "MouseEvent" }]
  );

  function code_onKeyInDungeon(e: RLEntity, k: RLKeyEvent) {
    e.add(
      ((__match) => {
        if (__match === "up") return mkMoveAction(0, -1);
        else if (__match === "right") return mkMoveAction(1, 0);
        else if (__match === "down") return mkMoveAction(0, 1);
        else if (__match === "left") return mkMoveAction(-1, 0);
        else if (__match === "wait") return WaitAction;
        else if (__match === "history") return HistoryAction;
      })(getKey(k.key))
    );
  }
  const onKeyInDungeon = new RLSystem("onKeyInDungeon", code_onKeyInDungeon, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_onKeyWhenDead(e: RLEntity, k: RLKeyEvent) {}
  const onKeyWhenDead = new RLSystem("onKeyWhenDead", code_onKeyWhenDead, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_hostileAI(e: RLEntity, p: Position) {
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
  const hostileAI = new RLSystem("hostileAI", code_hostileAI, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "constraint", typeName: "HostileEnemy" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doMove(e: RLEntity, p: Position, m: MoveAction) {
    const x: number = p.x + m.x;
    const y: number = p.y + m.y;
    e.remove(m);
    const t: RLTile | undefined = map.at(x, y);
    if (t && t.walkable) {
      const b: RLEntity | undefined = __lib.find(IsBlocker, mkPosition(x, y));
      if (b) {
        if (b.Fighter) {
          e.add(mkMeleeAction(b));
        } else {
          log.add("That way is blocked.", "grey");
        }
        return;
      }
      useTurn(e);
      e.add(mkOldPosition(p.x, p.y));
      p.x = x;
      p.y = y;
      if (e.IsPlayer) {
        e.add(RecalculateFOV);
      }
    } else {
      log.add("That way is blocked.", "grey");
    }
  }
  const doMove = new RLSystem("doMove", code_doMove, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "param", name: "m", typeName: "MoveAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doMelee(
    e: RLEntity,
    m: MeleeAction,
    a: Appearance,
    f: Fighter
  ) {
    const target: RLEntity = m.target;
    e.remove(m);
    useTurn(e);
    const attack: string = __lib.join(
      { type: "char", value: " " },
      { type: "str", value: a.name },
      { type: "str", value: "attacks" },
      { type: "str", value: target.Appearance.name }
    );
    const damage: number = f.power - target.Fighter.defence;
    const colour: string = ((__match) => {
      if (__match.has(IsPlayer.typeName)) return "white";
      else return "red";
    })(e);
    if (damage > 0) {
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: attack },
          { type: "str", value: "for" },
          { type: "int", value: damage },
          { type: "str", value: "hit points" }
        ),
        colour
      );
      hurt(target, damage);
    } else {
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: attack },
          { type: "str", value: "but does no damage" }
        ),
        colour
      );
    }
  }
  const doMelee = new RLSystem("doMelee", code_doMelee, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "m", typeName: "MeleeAction" },
    { type: "param", name: "a", typeName: "Appearance" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doWait(e: RLEntity) {
    e.remove(WaitAction);
    useTurn(e);
  }
  const doWait = new RLSystem("doWait", code_doWait, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "WaitAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_onKeyInHistory(e: RLEntity, k: RLKeyEvent) {
    if (k.key == "KeyV") {
      return;
    }
    const change: number = ((__match) => {
      if (__match === "up") return -1;
      else if (__match === "down") return 1;
      else if (__match === "PageUp") return -10;
      else if (__match === "PageDown") return 10;
      else if (__match === "Home") return -historyOffset - 1;
      else if (__match === "End") return log.length - historyOffset;
      else return 0;
    })(getKey(k.key));
    if (!change) {
      __lib.clear();
      e.add(RecalculateFOV);
      e.add(RedrawUI);
      log.dirty = true;
      __lib.popKeyHandler();
      return;
    }
    historyOffset = __lib.clamp(
      { type: "int", value: historyOffset + change },
      { type: "int", value: 0 },
      { type: "int", value: log.length - 1 }
    );
    showHistoryView();
  }
  const onKeyInHistory = new RLSystem("onKeyInHistory", code_onKeyInHistory, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_doHistory(e: RLEntity) {
    e.remove(HistoryAction);
    __lib.pushKeyHandler(onKeyInHistory);
    historyOffset = 0;
    __lib.clear();
    showHistoryView();
  }
  const doHistory = new RLSystem("doHistory", code_doHistory, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "HistoryAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_fov(e: RLEntity, p: Position) {
    __lib.getFOV(
      map,
      { type: "int", value: p.x },
      { type: "int", value: p.y },
      { type: "int", value: 5 },
      visible,
      explored
    );
    e.remove(RecalculateFOV);
    for (let x = 0; x <= mapWidth - 1; x++) {
      for (let y = 0; y <= mapHeight - 1; y++) {
        drawTileAt(x, y);
      }
    }
  }
  const fov = new RLSystem("fov", code_fov, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "constraint", typeName: "RecalculateFOV" },
  ]);

  function code_drawUnderTile(e: RLEntity, o: OldPosition) {
    drawTileAt(o.x, o.y);
    e.remove(o);
    e.add(RedrawMe);
  }
  const drawUnderTile = new RLSystem("drawUnderTile", code_drawUnderTile, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "o", typeName: "OldPosition" },
  ]);

  function code_RedrawMeEntity(e: RLEntity, p: Position) {
    drawTileAt(p.x, p.y);
    e.remove(RedrawMe);
  }
  const RedrawMeEntity = new RLSystem("RedrawMeEntity", code_RedrawMeEntity, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "constraint", typeName: "RedrawMe" },
  ]);

  function code_drawUI(e: RLEntity, f: Fighter) {
    e.remove(RedrawUI);
    drawBar(hpX, hpY, f.hp, f.maxHp, hpWidth, "red", "green");
    __lib.draw(
      { type: "int", value: hpX + 1 },
      { type: "int", value: hpY },
      {
        type: "str",
        value: __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "HP: " },
          { type: "int", value: f.hp },
          { type: "str", value: "/" },
          { type: "int", value: f.maxHp }
        ),
      }
    );
  }
  const drawUI = new RLSystem("drawUI", code_drawUI, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "constraint", typeName: "RedrawUI" },
  ]);

  function code_nextTurn() {
    let highest = -99999;
    for (const _entity of new RLQuery(RL.instance, ["Actor"]).get()) {
      const { Actor: ac } = _entity;
      if (ac.energy > highest) {
        highest = ac.energy;
      }
    }
    if (highest >= 100) {
      return false;
    }
    const elapse: number = 100 - highest;
    for (const e of new RLQuery(RL.instance, ["Actor"]).get()) {
      const { Actor: ac } = e;
      ac.energy += elapse;
      if (ac.energy >= 100) {
        e.add(MyTurn);
      }
    }
  }
  const nextTurn = new RLSystem("nextTurn", code_nextTurn, []);

  function code_showLog() {
    if (log.dirty) {
      __lib.drawLog(
        log,
        { type: "int", value: logX },
        { type: "int", value: logY },
        { type: "int", value: gameWidth - logX },
        { type: "int", value: gameHeight - logY }
      );
    } else {
      return false;
    }
  }
  const showLog = new RLSystem("showLog", code_showLog, []);

  return new Map<string, RLObject>([
    ["getKey", fn_getKey],
    ["getNamesAtLocation", fn_getNamesAtLocation],
    ["getBlockingMap", fn_getBlockingMap],
    ["hurt", fn_hurt],
    ["showHistoryView", fn_showHistoryView],
    ["useTurn", fn_useTurn],
    ["drawTileAt", fn_drawTileAt],
    ["drawEntity", fn_drawEntity],
    ["drawBar", fn_drawBar],
    ["randomRoom", fn_randomRoom],
    ["randomCorridor", fn_randomCorridor],
    ["generateDungeon", fn_generateDungeon],
    ["addEnemies", fn_addEnemies],
    ["main", fn_main],
    ["onMouseInDungeon", onMouseInDungeon],
    ["onKeyInDungeon", onKeyInDungeon],
    ["onKeyWhenDead", onKeyWhenDead],
    ["hostileAI", hostileAI],
    ["doMove", doMove],
    ["doMelee", doMelee],
    ["doWait", doWait],
    ["onKeyInHistory", onKeyInHistory],
    ["doHistory", doHistory],
    ["fov", fov],
    ["drawUnderTile", drawUnderTile],
    ["RedrawMeEntity", RedrawMeEntity],
    ["drawUI", drawUI],
    ["nextTurn", nextTurn],
    ["showLog", showLog],
    ["IsBlocker", IsBlocker],
    ["IsPlayer", IsPlayer],
    ["RecalculateFOV", RecalculateFOV],
    ["RedrawMe", RedrawMe],
    ["RedrawUI", RedrawUI],
    ["MyTurn", MyTurn],
    ["BaseAI", BaseAI],
    ["HostileEnemy", HostileEnemy],
    ["WaitAction", WaitAction],
    ["HistoryAction", HistoryAction],
    ["Player", tmPlayer],
    ["Enemy", tmEnemy],
    ["Orc", tmOrc],
    ["Troll", tmTroll],
    ["Corpse", tmCorpse],
  ]);
}
