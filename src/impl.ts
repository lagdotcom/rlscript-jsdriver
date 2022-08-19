import type {
  Actor,
  Appearance,
  ConfusedEnemy,
  Consumable,
  Fighter,
  Inventory,
  InventoryActionConfig,
  MeleeAction,
  MoveAction,
  OldPosition,
  Position,
  Progress,
  TargetingActionConfig,
  TargetingItemConfig,
} from "./implTypes";

// TODO make these dynamic

import RL from "./RL";
import RLBag from "./RLBag";
import RLEntity from "./RLEntity";
import RLEnv from "./RLEnv";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLKeyEvent from "./RLKeyEvent";
import RLLibrary from "./RLLibrary";
import RLMessages from "./RLMessages";
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
    Item,
    Enemy,
    Player,
  }

  const IsBlocker = new RLTag("IsBlocker");
  const IsPlayer = new RLTag("IsPlayer");
  const RecalculateFOV = new RLTag("RecalculateFOV");
  const RedrawMe = new RLTag("RedrawMe");
  const RedrawUI = new RLTag("RedrawUI");
  const MyTurn = new RLTag("MyTurn");
  const HostileEnemy = new RLTag("HostileEnemy");
  const WaitAction = new RLTag("WaitAction");
  const HistoryAction = new RLTag("HistoryAction");
  const Item = new RLTag("Item");
  const PickupAction = new RLTag("PickupAction");
  const InventoryAction = new RLTag("InventoryAction");
  const DropAction = new RLTag("DropAction");
  const LookAction = new RLTag("LookAction");
  const QuitAction = new RLTag("QuitAction");
  const TakeStairsAction = new RLTag("TakeStairsAction");

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
  const mkConsumable = (
    activate: CallableFunction,
    power: number,
    range: number,
    targeted: boolean,
    radius: number
  ): Consumable => ({
    type: "component",
    typeName: "Consumable",
    activate,
    power,
    range,
    targeted,
    radius,
  });
  const mkInventory = (items: RLBag): Inventory => ({
    type: "component",
    typeName: "Inventory",
    items,
  });
  const mkInventoryActionConfig = (
    callback: CallableFunction
  ): InventoryActionConfig => ({
    type: "component",
    typeName: "InventoryActionConfig",
    callback,
  });
  const mkTargetingActionConfig = (
    callback: CallableFunction,
    radius: number
  ): TargetingActionConfig => ({
    type: "component",
    typeName: "TargetingActionConfig",
    callback,
    radius,
  });
  const mkTargetingItemConfig = (
    key: string,
    item: RLEntity
  ): TargetingItemConfig => ({
    type: "component",
    typeName: "TargetingItemConfig",
    key,
    item,
  });
  const mkConfusedEnemy = (duration: number, old: RLTag): ConfusedEnemy => ({
    type: "component",
    typeName: "ConfusedEnemy",
    duration,
    old,
  });
  const mkProgress = (floor: number): Progress => ({
    type: "component",
    typeName: "Progress",
    floor,
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
      mkInventory(new RLBag(20)),
      MyTurn,
      RecalculateFOV,
      RedrawUI,
      mkProgress(1),
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
  const tmHealingPotion: RLTemplate = {
    type: "template",
    name: "HealingPotion",
    get: () => [
      Item,
      mkAppearance("healing potion", "!", "purple", "black", Layer.Item),
      mkConsumable(healingItem, 4, 0, false, 0),
    ],
  };
  const tmLightningScroll: RLTemplate = {
    type: "template",
    name: "LightningScroll",
    get: () => [
      Item,
      mkAppearance("lightning scroll", "~", "cyan", "black", Layer.Item),
      mkConsumable(zapItem, 20, 5, false, 0),
    ],
  };
  const tmConfusionScroll: RLTemplate = {
    type: "template",
    name: "ConfusionScroll",
    get: () => [
      Item,
      mkAppearance("confusion scroll", "~", "#cf3fff", "black", Layer.Item),
      mkConsumable(confuseItem, 10, 100, true, 0),
    ],
  };
  const tmFireballScroll: RLTemplate = {
    type: "template",
    name: "FireballScroll",
    get: () => [
      Item,
      mkAppearance("fireball scroll", "~", "#ff0000", "black", Layer.Item),
      mkConsumable(fireballItem, 12, 100, true, 3),
    ],
  };

  const Floor = new RLTile(".", true, true);
  const Wall = new RLTile("#", false, false);
  const DownStairs = new RLTile(">", true, true);

  const impossible = "#808080";
  const healed = "#00ff00";
  const playerDied = "#ff3030";
  const enemyDied = "#ffa030";
  const playerAttack = "#e0e0e0";
  const enemyAttack = "#ffc0c0";
  const welcomeText = "#20a0ff";
  const needsTarget = "#3fffff";
  const statusApplied = "#3fff3f";
  const menuTitle = "#ffff3f";
  const descended = "#9f3fff";
  const gameWidth = 80;
  const gameHeight = 50;
  const mapWidth: number = gameWidth;
  const mapHeight: number = gameHeight - 5;
  const hoverX = 0;
  const hoverY: number = mapHeight;
  const hpX = 0;
  const hpY: number = hoverY + 1;
  const hpWidth = 20;
  const floorX: number = hpX;
  const floorY: number = hpY + 2;
  const logX: number = hpWidth + 2;
  const logY: number = hpY;
  const maxEnemiesPerRoom = 2;
  const maxItemsPerRoom = 2;
  const map: RLGrid = new RLGrid(mapWidth, mapHeight, Wall);
  __lib.persist({ type: "str", value: "map" }, map);
  const explored: RLGrid = new RLGrid(mapWidth, mapHeight, false);
  __lib.persist({ type: "str", value: "explored" }, explored);
  const visible: RLGrid = new RLGrid(mapWidth, mapHeight, false);
  __lib.persist({ type: "str", value: "visible" }, visible);
  const log: RLMessages = new RLMessages();
  __lib.persist({ type: "str", value: "log" }, log);
  let targetAt: RLXY = new RLXY(-1, -1);
  let targetSize = 1;
  let historyOffset = 0;

  function distance(a: RLXY, b: RLXY) {
    const dx: number = a.x - b.x;
    const dy: number = a.y - b.y;
    return __lib.sqrt({ type: "int", value: dx * dx + dy * dy });
  }
  const fn_distance = new RLFn("distance", distance, [
    { type: "param", name: "a", typeName: "xy" },
    { type: "param", name: "b", typeName: "xy" },
  ]);

  function healingItem(pc: RLEntity, item: RLEntity) {
    if (!pc.Fighter) {
      log.add("You can't use that.", impossible);
      return false;
    }
    if (pc.Fighter.hp >= pc.Fighter.maxHp) {
      log.add("You're already healthy.", impossible);
      return false;
    }
    const oldHp: number = pc.Fighter.hp;
    pc.Fighter.hp = __lib.clamp(
      { type: "int", value: oldHp + item.Consumable.power },
      { type: "int", value: 0 },
      { type: "int", value: pc.Fighter.maxHp }
    );
    const gained: number = pc.Fighter.hp - oldHp;
    log.add(
      __lib.join(
        { type: "char", value: " " },
        { type: "str", value: "You healed for" },
        { type: "int", value: gained },
        { type: "str", value: "hp" }
      ),
      healed
    );
    pc.add(RedrawUI);
    return true;
  }
  const fn_healingItem = new RLFn("healingItem", healingItem, [
    { type: "param", name: "pc", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function zapItem(pc: RLEntity, item: RLEntity) {
    let target: RLEntity | undefined;
    let closest: number = item.Consumable.range + 1;
    for (const t of new RLQuery(RL.instance, ["Position", "Fighter"]).get()) {
      const { Position: p } = t;
      if (t != pc && visible.at(p.x, p.y)) {
        const d: number = distance(
          new RLXY(pc.Position.x, pc.Position.y),
          new RLXY(p.x, p.y)
        );
        if (d < closest) {
          closest = d;
          target = t;
        }
      }
    }
    if (target) {
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "A lightning bolt strikes" },
          { type: "str", value: target.Appearance.name },
          { type: "str", value: "for" },
          { type: "int", value: item.Consumable.power },
          { type: "str", value: "damage!" }
        )
      );
      hurt(target, item.Consumable.power);
      return true;
    }
    log.add("No enemy is close enough.", impossible);
    return false;
  }
  const fn_zapItem = new RLFn("zapItem", zapItem, [
    { type: "param", name: "pc", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function confuseItem(pc: RLEntity, item: RLEntity, target: RLXY) {
    if (!visible.at(target.x, target.y)) {
      log.add("Cannot target there.", impossible);
      return false;
    }
    const victim: RLEntity | undefined = __lib.find(
      "Actor",
      mkPosition(target.x, target.y)
    );
    if (!victim) {
      log.add("No target.", impossible);
      return false;
    }
    if (victim == pc) {
      log.add("Cannot confuse yourself!", impossible);
      return false;
    }
    const ai: RLTag | undefined = ((__match) => {
      if (__match.has(HostileEnemy.typeName)) return HostileEnemy;
    })(victim);
    if (!ai) {
      log.add("Cannot be confused.", impossible);
      return false;
    }
    log.add(
      __lib.join(
        { type: "char", value: " " },
        { type: "str", value: "The eyes of the" },
        { type: "str", value: getName(victim) },
        { type: "str", value: "look vacant." }
      ),
      statusApplied
    );
    victim.add(mkConfusedEnemy(item.Consumable.power, ai));
    victim.remove(ai);
    return true;
  }
  const fn_confuseItem = new RLFn("confuseItem", confuseItem, [
    { type: "param", name: "pc", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
    { type: "param", name: "target", typeName: "xy" },
  ]);

  function fireballItem(pc: RLEntity, item: RLEntity, target: RLXY) {
    if (!visible.at(target.x, target.y)) {
      log.add("Cannot target there.", impossible);
      return false;
    }
    const damage: number = item.Consumable.power;
    let hit = false;
    for (const t of new RLQuery(RL.instance, ["Position", "Fighter"]).get()) {
      const { Position: p } = t;
      if (distance(target, new RLXY(p.x, p.y)) <= item.Consumable.radius) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "The" },
            { type: "str", value: getName(t) },
            { type: "str", value: "is engulfed in fire, taking" },
            { type: "int", value: damage },
            { type: "str", value: "damage" }
          )
        );
        hurt(t, damage);
        hit = true;
      }
    }
    if (!hit) {
      log.add("No targets in range.", impossible);
    }
    return hit;
  }
  const fn_fireballItem = new RLFn("fireballItem", fireballItem, [
    { type: "param", name: "pc", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
    { type: "param", name: "target", typeName: "xy" },
  ]);

  function redrawEverything(e: RLEntity) {
    __lib.clear();
    e.add(RecalculateFOV);
    e.add(RedrawUI);
    log.dirty = true;
  }
  const fn_redrawEverything = new RLFn("redrawEverything", redrawEverything, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

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
      else if (__match === "KeyD") return "drop";
      else if (__match === "KeyG") return "pickup";
      else if (__match === "KeyI") return "inventory";
      else if (__match === "KeyV") return "history";
      else if (__match === "Slash") return "look";
      else if (__match === "Enter") return "confirm";
      else if (__match === "NumpadEnter") return "confirm";
      else if (__match === "Escape") return "quit";
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

  function showNamesAt(x: number, y: number) {
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
    if (visible.at(x, y)) {
      const names: string = getNamesAtLocation(x, y);
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
  const fn_showNamesAt = new RLFn("showNamesAt", showNamesAt, [
    { type: "param", name: "x", typeName: "int" },
    { type: "param", name: "y", typeName: "int" },
  ]);

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

  function getRandomMove() {
    return ((__match) => {
      if (__match === 1) return mkMoveAction(0, -1);
      else if (__match === 2) return mkMoveAction(1, 0);
      else if (__match === 3) return mkMoveAction(0, 1);
      else if (__match === 4) return mkMoveAction(-1, 0);
    })(__lib.randInt({ type: "int", value: 1 }, { type: "int", value: 4 }));
  }
  const fn_getRandomMove = new RLFn("getRandomMove", getRandomMove, []);

  function hurt(e: RLEntity, damage: number) {
    e.Fighter.hp -= damage;
    if (e.Fighter.hp < 1) {
      const colour: string = ((__match) => {
        if (__match.has(IsPlayer.typeName)) return playerDied;
        else return enemyDied;
      })(e);
      if (e.IsPlayer) {
        log.add("You died! Press Escape to leave.", colour);
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
        __lib.pushKeyHandler(dead_onKey);
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

  function getName(e: RLEntity) {
    if (e.Appearance) {
      return e.Appearance.name;
    }
    return "???";
  }
  const fn_getName = new RLFn("getName", getName, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function openInventory(
    e: RLEntity,
    v: Inventory,
    callback: CallableFunction,
    title: string
  ) {
    if (!v.items.count) {
      log.add("You're not carrying anything.", impossible);
      return;
    }
    e.add(mkInventoryActionConfig(callback));
    __lib.pushKeyHandler(inventory_onKey);
    __lib.drawBag(
      v.items,
      { type: "str", value: title },
      fn_getName,
      { type: "str", value: "white" },
      { type: "str", value: "silver" },
      { type: "str", value: "grey" },
      { type: "str", value: "black" }
    );
  }
  const fn_openInventory = new RLFn("openInventory", openInventory, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "v", typeName: "Inventory" },
    { type: "param", name: "callback", typeName: "fn" },
    { type: "param", name: "title", typeName: "str" },
  ]);

  function tcUseItem(e: RLEntity, target: RLXY) {
    const config: TargetingItemConfig = e.TargetingItemConfig;
    if (config) {
      e.remove(config);
      const item: RLEntity = config.item;
      if (item.Consumable.activate(e, item, target)) {
        if (e.Inventory) {
          e.Inventory.items.remove(config.key);
        }
        useTurn(e);
      }
    }
  }
  const fn_tcUseItem = new RLFn("tcUseItem", tcUseItem, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "target", typeName: "xy" },
  ]);

  function icUse(e: RLEntity, key: string, item: RLEntity) {
    if (!item.Consumable) {
      log.add("You cannot use that.", impossible);
      return;
    }
    if (item.Consumable.targeted) {
      log.add("Select a target.", needsTarget);
      e.add(mkTargetingItemConfig(key, item));
      startTargeting(e, tcUseItem, item.Consumable.radius);
      return;
    }
    if (item.Consumable.activate(e, item)) {
      if (e.Inventory) {
        e.Inventory.items.remove(key);
      }
      useTurn(e);
    }
  }
  const fn_icUse = new RLFn("icUse", icUse, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "key", typeName: "char" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function icDrop(e: RLEntity, key: string, item: RLEntity) {
    if (e.Inventory && e.Position) {
      e.Inventory.items.remove(key);
      item.add(mkPosition(e.Position.x, e.Position.y));
      useTurn(e);
      if (item.Appearance) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "You drop the" },
            { type: "str", value: item.Appearance.name }
          )
        );
      }
    }
  }
  const fn_icDrop = new RLFn("icDrop", icDrop, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "key", typeName: "char" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function drawTilesAt(sx: number, sy: number, width: number, height: number) {
    for (let x = sx; x <= sx + width; x++) {
      for (let y = sy; y <= sy + height; y++) {
        drawTileAt(x, y);
      }
    }
  }
  const fn_drawTilesAt = new RLFn("drawTilesAt", drawTilesAt, [
    { type: "param", name: "sx", typeName: "int" },
    { type: "param", name: "sy", typeName: "int" },
    { type: "param", name: "width", typeName: "int" },
    { type: "param", name: "height", typeName: "int" },
  ]);

  function setTargetTo(x: number, y: number, radius: number) {
    const oldX: number = targetAt.x;
    const oldY: number = targetAt.y;
    targetAt = new RLXY(x, y);
    targetSize = radius;
    if (radius > 0) {
      const size: number = radius * 2 + 1;
      drawTilesAt(oldX - radius, oldY - radius, size, size);
      drawTilesAt(x - radius, y - radius, size, size);
    } else {
      drawTileAt(oldX, oldY);
      drawTileAt(x, y);
    }
    showNamesAt(x, y);
  }
  const fn_setTargetTo = new RLFn("setTargetTo", setTargetTo, [
    { type: "param", name: "x", typeName: "int" },
    { type: "param", name: "y", typeName: "int" },
    { type: "param", name: "radius", typeName: "int" },
  ]);

  function startTargeting(
    e: RLEntity,
    callback: CallableFunction,
    radius: number
  ) {
    e.add(mkTargetingActionConfig(callback, radius));
    if (e.Position) {
      setTargetTo(e.Position.x, e.Position.y, radius);
    }
    __lib.pushKeyHandler(targeting_onKey);
    __lib.pushMouseHandler(targeting_onMouse);
  }
  const fn_startTargeting = new RLFn("startTargeting", startTargeting, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "callback", typeName: "fn" },
    { type: "param", name: "radius", typeName: "int" },
  ]);

  function stopTargeting(e: RLEntity) {
    setTargetTo(-1, -1, 0);
    __lib.popKeyHandler();
    __lib.popMouseHandler();
    redrawEverything(e);
  }
  const fn_stopTargeting = new RLFn("stopTargeting", stopTargeting, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function useTurn(e: RLEntity) {
    e.Actor.energy -= 100;
    e.remove(MyTurn);
  }
  const fn_useTurn = new RLFn("useTurn", useTurn, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function drawTileAt(x: number, y: number) {
    const highlight: boolean = distance(targetAt, new RLXY(x, y)) <= targetSize;
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
    if (highlight) {
      bg = "#808000";
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

  function clearHPBar() {
    __lib.draw(
      { type: "int", value: hpX },
      { type: "int", value: hpY },
      {
        type: "str",
        value: __lib.repeat(
          { type: "char", value: " " },
          { type: "int", value: hpWidth }
        ),
      },
      { type: "str", value: "white" },
      { type: "str", value: "black" }
    );
  }
  const fn_clearHPBar = new RLFn("clearHPBar", clearHPBar, []);

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
    let start: RLXY;
    let stairs: RLXY;
    for (let r = 1; r <= 30; r++) {
      room = randomRoom();
      if (!map.findInRegion(room, Floor)) {
        map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
        if (prev) {
          randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
          addEnemies(room, taken);
          addItems(room, taken);
        } else {
          start = room.centre;
        }
        stairs = room.centre;
        prev = room;
      }
    }
    map.put(stairs.x, stairs.y, DownStairs);
    hostileAI.enable();
    return start;
  }
  const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);

  function addEnemies(r: RLRect, taken: RLGrid) {
    for (
      let z = 1;
      z <=
      __lib.randInt(
        { type: "int", value: 0 },
        { type: "int", value: maxEnemiesPerRoom }
      );
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
        __lib.spawn(
          ((__match) => {
            if (__match <= 80) return tmOrc;
            else return tmTroll;
          })(
            __lib.randInt(
              { type: "int", value: 1 },
              { type: "int", value: 100 }
            )
          ),
          mkPosition(x, y)
        );
      }
    }
  }
  const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
    { type: "param", name: "r", typeName: "rect" },
    { type: "param", name: "taken", typeName: "grid" },
  ]);

  function addItems(r: RLRect, taken: RLGrid) {
    for (
      let z = 1;
      z <=
      __lib.randInt(
        { type: "int", value: 0 },
        { type: "int", value: maxItemsPerRoom }
      );
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
        __lib.spawn(
          ((__match) => {
            if (__match <= 70) return tmHealingPotion;
            else if (__match <= 80) return tmFireballScroll;
            else if (__match <= 90) return tmConfusionScroll;
            else return tmLightningScroll;
          })(
            __lib.randInt(
              { type: "int", value: 1 },
              { type: "int", value: 100 }
            )
          ),
          mkPosition(x, y)
        );
      }
    }
  }
  const fn_addItems = new RLFn("addItems", addItems, [
    { type: "param", name: "r", typeName: "rect" },
    { type: "param", name: "taken", typeName: "grid" },
  ]);

  function nextFloor(player: RLEntity) {
    player.Progress.floor += 1;
    const start: RLXY = generateDungeon();
    player.Position.x = start.x;
    player.Position.y = start.y;
    player.add(RecalculateFOV);
    player.add(RedrawUI);
  }
  const fn_nextFloor = new RLFn("nextFloor", nextFloor, [
    { type: "param", name: "player", typeName: "entity" },
  ]);

  function newGame() {
    const player: RLEntity = __lib.spawn(tmPlayer);
    const start: RLXY = generateDungeon();
    player.add(mkPosition(start.x, start.y));
    log.add("Welcome to the RLscript dungeon!", welcomeText);
    __lib.pushKeyHandler(main_onKey);
    __lib.pushMouseHandler(main_onMouse);
    nextTurn.enable();
  }
  const fn_newGame = new RLFn("newGame", newGame, []);

  function mainMenu() {
    for (const e of new RLQuery(RL.instance, []).get()) {
      __lib.remove(e);
    }
    log.clear();
    __lib.clearHandlers();
    __lib.pushKeyHandler(menu_onKey);
    nextTurn.disable();
    __lib.clear();
    clearHPBar();
    __lib.drawCentred(
      { type: "int", value: gameWidth / 2 },
      { type: "int", value: gameHeight / 2 - 4 },
      { type: "str", value: "An Improbable Roguelike" },
      { type: "str", value: menuTitle }
    );
    __lib.drawCentred(
      { type: "int", value: gameWidth / 2 },
      { type: "int", value: gameHeight - 2 },
      { type: "str", value: "by Lag.Com" },
      { type: "str", value: menuTitle }
    );
    __lib.drawCentred(
      { type: "int", value: gameWidth / 2 },
      { type: "int", value: gameHeight / 2 - 2 },
      { type: "str", value: "[N] Play a new game" },
      { type: "str", value: "white" }
    );
    if (__lib.canLoadGame()) {
      __lib.drawCentred(
        { type: "int", value: gameWidth / 2 },
        { type: "int", value: gameHeight / 2 - 1 },
        { type: "str", value: "[C] Continue last game" },
        { type: "str", value: "white" }
      );
    }
  }
  const fn_mainMenu = new RLFn("mainMenu", mainMenu, []);

  function main() {
    __lib.setSize(
      { type: "int", value: gameWidth },
      { type: "int", value: gameHeight }
    );
    mainMenu();
  }
  const fn_main = new RLFn("main", main, []);

  function code_main_onMouse(m: RLMouseEvent) {
    showNamesAt(m.x, m.y);
  }
  const main_onMouse = new RLSystem("main_onMouse", code_main_onMouse, [
    { type: "param", name: "m", typeName: "MouseEvent" },
  ]);

  function code_main_onKey(e: RLEntity, k: RLKeyEvent) {
    e.add(
      ((__match) => {
        if (__match === "up") return mkMoveAction(0, -1);
        else if (__match === "right") return mkMoveAction(1, 0);
        else if (__match === "down") return mkMoveAction(0, 1);
        else if (__match === "left") return mkMoveAction(-1, 0);
        else if (__match === "wait") return WaitAction;
        else if (__match === "history") return HistoryAction;
        else if (__match === "pickup") return PickupAction;
        else if (__match === "inventory") return InventoryAction;
        else if (__match === "drop") return DropAction;
        else if (__match === "look") return LookAction;
        else if (__match === "confirm") return TakeStairsAction;
        else if (__match === "quit") return QuitAction;
      })(getKey(k.key))
    );
  }
  const main_onKey = new RLSystem("main_onKey", code_main_onKey, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_dead_onKey(e: RLEntity, k: RLKeyEvent) {
    if (k.key == "Escape") {
      mainMenu();
    }
  }
  const dead_onKey = new RLSystem("dead_onKey", code_dead_onKey, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_confusedAI(e: RLEntity, a: Appearance, c: ConfusedEnemy) {
    if (c.duration <= 0) {
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "The" },
          { type: "str", value: a.name },
          { type: "str", value: "is no longer confused." }
        )
      );
      e.remove(c);
      e.add(c.old);
      return;
    }
    c.duration -= 1;
    e.add(getRandomMove());
  }
  const confusedAI = new RLSystem("confusedAI", code_confusedAI, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "a", typeName: "Appearance" },
    { type: "param", name: "c", typeName: "ConfusedEnemy" },
    { type: "constraint", typeName: "MyTurn" },
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
          log.add("That way is blocked.", impossible);
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
      if (e.ConfusedEnemy) {
        if (visible.at(p.x, p.y)) {
          log.add(
            __lib.join(
              { type: "char", value: " " },
              { type: "str", value: getName(e) },
              { type: "str", value: "thumps into a wall." }
            )
          );
        }
        useTurn(e);
        return;
      }
      log.add("That way is blocked.", impossible);
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
      if (__match.has(IsPlayer.typeName)) return playerAttack;
      else return enemyAttack;
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

  function code_history_onMouse(m: RLMouseEvent) {}
  const history_onMouse = new RLSystem(
    "history_onMouse",
    code_history_onMouse,
    [{ type: "param", name: "m", typeName: "MouseEvent" }]
  );

  function code_history_onKey(e: RLEntity, k: RLKeyEvent) {
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
      redrawEverything(e);
      __lib.popKeyHandler();
      __lib.popMouseHandler();
      return;
    }
    historyOffset = __lib.clamp(
      { type: "int", value: historyOffset + change },
      { type: "int", value: 0 },
      { type: "int", value: log.length - 1 }
    );
    showHistoryView();
  }
  const history_onKey = new RLSystem("history_onKey", code_history_onKey, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_doHistory(e: RLEntity) {
    e.remove(HistoryAction);
    __lib.pushKeyHandler(history_onKey);
    __lib.pushMouseHandler(history_onMouse);
    historyOffset = 0;
    __lib.clear();
    clearHPBar();
    showHistoryView();
  }
  const doHistory = new RLSystem("doHistory", code_doHistory, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "HistoryAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doPickup(e: RLEntity, p: Position, v: Inventory) {
    e.remove(PickupAction);
    let matches = 0;
    let got = 0;
    let failed = false;
    for (const item of new RLQuery(RL.instance, [
      "Appearance",
      "Position",
      "Item",
    ]).get()) {
      const { Appearance: ia, Position: ip } = item;
      if (ip.x == p.x && ip.y == p.y) {
        matches += 1;
        const key: string | undefined = v.items.add(item);
        if (key) {
          got += 1;
          log.add(
            __lib.join(
              { type: "str", value: "" },
              { type: "str", value: "You got (" },
              { type: "char", value: key },
              { type: "str", value: ") " },
              { type: "str", value: ia.name }
            )
          );
          item.remove(ip);
        } else {
          failed = true;
        }
      }
    }
    if (got) {
      useTurn(e);
    }
    if (failed) {
      log.add("Can't carry any more.", impossible);
    } else {
      if (!matches) {
        log.add("Nothing here.", impossible);
      }
    }
  }
  const doPickup = new RLSystem("doPickup", code_doPickup, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "param", name: "v", typeName: "Inventory" },
    { type: "constraint", typeName: "PickupAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doInventory(e: RLEntity, v: Inventory) {
    e.remove(InventoryAction);
    openInventory(e, v, icUse, "Use what?");
  }
  const doInventory = new RLSystem("doInventory", code_doInventory, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "v", typeName: "Inventory" },
    { type: "constraint", typeName: "InventoryAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doDrop(e: RLEntity, v: Inventory) {
    e.remove(DropAction);
    openInventory(e, v, icDrop, "Drop what?");
  }
  const doDrop = new RLSystem("doDrop", code_doDrop, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "v", typeName: "Inventory" },
    { type: "constraint", typeName: "DropAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_inventory_onKey(
    e: RLEntity,
    v: Inventory,
    config: InventoryActionConfig,
    k: RLKeyEvent
  ) {
    let closing = false;
    let firing = false;
    if (k.key == "Escape") {
      closing = true;
    }
    if (v.items.has(k.char)) {
      firing = true;
      closing = true;
    }
    if (closing) {
      e.remove(config);
      __lib.popKeyHandler();
      redrawEverything(e);
    }
    if (firing) {
      config.callback(e, k.char, v.items.get(k.char));
    }
  }
  const inventory_onKey = new RLSystem(
    "inventory_onKey",
    code_inventory_onKey,
    [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "v", typeName: "Inventory" },
      { type: "param", name: "config", typeName: "InventoryActionConfig" },
      { type: "param", name: "k", typeName: "KeyEvent" },
    ]
  );

  function code_targeting_onKey(
    e: RLEntity,
    config: TargetingActionConfig,
    k: RLKeyEvent
  ) {
    let mul = 1;
    const key: string = getKey(k.key);
    const move: RLXY | undefined = ((__match) => {
      if (__match === "up") return new RLXY(0, -1);
      else if (__match === "right") return new RLXY(1, 0);
      else if (__match === "down") return new RLXY(0, 1);
      else if (__match === "left") return new RLXY(-1, 0);
    })(key);
    if (move) {
      if (k.shift) {
        mul *= 5;
      }
      if (k.ctrl) {
        mul *= 10;
      }
      if (k.alt) {
        mul *= 20;
      }
      const x: number = targetAt.x + move.x * mul;
      const y: number = targetAt.y + move.y * mul;
      setTargetTo(
        __lib.clamp(
          { type: "int", value: x },
          { type: "int", value: 0 },
          { type: "int", value: mapWidth - 1 }
        ),
        __lib.clamp(
          { type: "int", value: y },
          { type: "int", value: 0 },
          { type: "int", value: mapHeight - 1 }
        ),
        config.radius
      );
      return;
    }
    if (key == "confirm") {
      config.callback(e, targetAt);
      stopTargeting(e);
    }
    if (key == "quit") {
      stopTargeting(e);
    }
  }
  const targeting_onKey = new RLSystem(
    "targeting_onKey",
    code_targeting_onKey,
    [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "config", typeName: "TargetingActionConfig" },
      { type: "param", name: "k", typeName: "KeyEvent" },
    ]
  );

  function code_targeting_onMouse(
    e: RLEntity,
    config: TargetingActionConfig,
    m: RLMouseEvent
  ) {
    setTargetTo(m.x, m.y, config.radius);
    if (m.button == 1) {
      config.callback(e, targetAt);
      stopTargeting(e);
    }
  }
  const targeting_onMouse = new RLSystem(
    "targeting_onMouse",
    code_targeting_onMouse,
    [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "config", typeName: "TargetingActionConfig" },
      { type: "param", name: "m", typeName: "MouseEvent" },
    ]
  );

  function code_doLook(e: RLEntity) {
    e.remove(LookAction);
    startTargeting(e, stopTargeting, 0);
  }
  const doLook = new RLSystem("doLook", code_doLook, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "LookAction" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doQuit(e: RLEntity) {
    e.remove(QuitAction);
    redrawEverything(e);
    __lib.saveGame();
    mainMenu();
  }
  const doQuit = new RLSystem("doQuit", code_doQuit, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "constraint", typeName: "QuitAction" },
    { type: "constraint", typeName: "IsPlayer" },
    { type: "constraint", typeName: "MyTurn" },
  ]);

  function code_doStairs(e: RLEntity, p: Position) {
    e.remove(TakeStairsAction);
    const t: RLTile = map.at(p.x, p.y);
    if (t.ch == ">") {
      log.add("You descend the staircase.", descended);
      nextFloor(e);
    } else {
      log.add("There are no stairs here.", impossible);
    }
  }
  const doStairs = new RLSystem("doStairs", code_doStairs, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "constraint", typeName: "TakeStairsAction" },
    { type: "constraint", typeName: "IsPlayer" },
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
    drawBar(hpX, hpY, f.hp, f.maxHp, hpWidth, "#401010", "#006000");
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
    __lib.draw(
      { type: "int", value: floorX },
      { type: "int", value: floorY },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "Floor:" },
          { type: "int", value: e.Progress.floor }
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

  function code_menu_onKey(k: RLKeyEvent) {
    if (k.key == "KeyN") {
      newGame();
      return;
    }
    if (k.key == "KeyC") {
      if (__lib.canLoadGame()) {
        __lib.clear();
        __lib.loadGame();
      }
    }
  }
  const menu_onKey = new RLSystem("menu_onKey", code_menu_onKey, [
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  return new Map<string, RLObject>([
    ["distance", fn_distance],
    ["healingItem", fn_healingItem],
    ["zapItem", fn_zapItem],
    ["confuseItem", fn_confuseItem],
    ["fireballItem", fn_fireballItem],
    ["redrawEverything", fn_redrawEverything],
    ["getKey", fn_getKey],
    ["getNamesAtLocation", fn_getNamesAtLocation],
    ["showNamesAt", fn_showNamesAt],
    ["getBlockingMap", fn_getBlockingMap],
    ["getRandomMove", fn_getRandomMove],
    ["hurt", fn_hurt],
    ["showHistoryView", fn_showHistoryView],
    ["getName", fn_getName],
    ["openInventory", fn_openInventory],
    ["tcUseItem", fn_tcUseItem],
    ["icUse", fn_icUse],
    ["icDrop", fn_icDrop],
    ["drawTilesAt", fn_drawTilesAt],
    ["setTargetTo", fn_setTargetTo],
    ["startTargeting", fn_startTargeting],
    ["stopTargeting", fn_stopTargeting],
    ["useTurn", fn_useTurn],
    ["drawTileAt", fn_drawTileAt],
    ["drawEntity", fn_drawEntity],
    ["drawBar", fn_drawBar],
    ["clearHPBar", fn_clearHPBar],
    ["randomRoom", fn_randomRoom],
    ["randomCorridor", fn_randomCorridor],
    ["generateDungeon", fn_generateDungeon],
    ["addEnemies", fn_addEnemies],
    ["addItems", fn_addItems],
    ["nextFloor", fn_nextFloor],
    ["newGame", fn_newGame],
    ["mainMenu", fn_mainMenu],
    ["main", fn_main],
    ["main_onMouse", main_onMouse],
    ["main_onKey", main_onKey],
    ["dead_onKey", dead_onKey],
    ["confusedAI", confusedAI],
    ["hostileAI", hostileAI],
    ["doMove", doMove],
    ["doMelee", doMelee],
    ["doWait", doWait],
    ["history_onMouse", history_onMouse],
    ["history_onKey", history_onKey],
    ["doHistory", doHistory],
    ["doPickup", doPickup],
    ["doInventory", doInventory],
    ["doDrop", doDrop],
    ["inventory_onKey", inventory_onKey],
    ["targeting_onKey", targeting_onKey],
    ["targeting_onMouse", targeting_onMouse],
    ["doLook", doLook],
    ["doQuit", doQuit],
    ["doStairs", doStairs],
    ["fov", fov],
    ["drawUnderTile", drawUnderTile],
    ["RedrawMeEntity", RedrawMeEntity],
    ["drawUI", drawUI],
    ["nextTurn", nextTurn],
    ["showLog", showLog],
    ["menu_onKey", menu_onKey],
    ["IsBlocker", IsBlocker],
    ["IsPlayer", IsPlayer],
    ["RecalculateFOV", RecalculateFOV],
    ["RedrawMe", RedrawMe],
    ["RedrawUI", RedrawUI],
    ["MyTurn", MyTurn],
    ["HostileEnemy", HostileEnemy],
    ["WaitAction", WaitAction],
    ["HistoryAction", HistoryAction],
    ["Item", Item],
    ["PickupAction", PickupAction],
    ["InventoryAction", InventoryAction],
    ["DropAction", DropAction],
    ["LookAction", LookAction],
    ["QuitAction", QuitAction],
    ["TakeStairsAction", TakeStairsAction],
    ["Player", tmPlayer],
    ["Enemy", tmEnemy],
    ["Orc", tmOrc],
    ["Troll", tmTroll],
    ["Corpse", tmCorpse],
    ["HealingPotion", tmHealingPotion],
    ["LightningScroll", tmLightningScroll],
    ["ConfusionScroll", tmConfusionScroll],
    ["FireballScroll", tmFireballScroll],
  ]);
}
