import type {
  Actor,
  Appearance,
  ConfusedEnemy,
  Consumable,
  Equipment,
  Equippable,
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
import RLWeighted from "./RLWeighted";
import RLXY from "./RLXY";

export default function implementation(__lib: RLLibrary): RLEnv {
  enum Layer {
    Nothing,
    Corpse,
    Item,
    Enemy,
    Player,
  }
  enum Slot {
    Weapon,
    Armour,
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
  const GainingLevel = new RLTag("GainingLevel");
  const CharacterInfoAction = new RLTag("CharacterInfoAction");

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
    power: number,
    xp: number
  ): Fighter => ({
    type: "component",
    typeName: "Fighter",
    maxHp,
    hp,
    defence,
    power,
    xp,
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
  const mkProgress = (
    floor: number,
    level: number,
    formulaBase: number,
    formulaFactor: number
  ): Progress => ({
    type: "component",
    typeName: "Progress",
    floor,
    level,
    formulaBase,
    formulaFactor,
  });
  const mkEquippable = (
    slot: Slot,
    power: number,
    defence: number
  ): Equippable => ({
    type: "component",
    typeName: "Equippable",
    slot,
    power,
    defence,
  });
  const mkEquipment = (weapon: string, armour: string): Equipment => ({
    type: "component",
    typeName: "Equipment",
    weapon,
    armour,
  });

  const Player: RLTemplate = {
    type: "template",
    name: "Player",
    get: () => [
      IsBlocker,
      IsPlayer,
      mkAppearance("player", "@", "white", "black", Layer.Player),
      mkFighter(30, 30, 1, 2, 0),
      mkActor(100),
      mkInventory(new RLBag(20)),
      mkEquipment(),
      MyTurn,
      RecalculateFOV,
      RedrawUI,
      mkProgress(1, 1, 0, 200),
    ],
  };
  const Enemy: RLTemplate = {
    type: "template",
    name: "Enemy",
    get: () => [IsBlocker, HostileEnemy, mkActor(1)],
  };
  const Orc: RLTemplate = {
    type: "template",
    name: "Orc",
    get: () => [
      Enemy,
      mkAppearance("orc", "o", "green", "black", Layer.Enemy),
      mkFighter(10, 10, 0, 3, 35),
    ],
  };
  const Troll: RLTemplate = {
    type: "template",
    name: "Troll",
    get: () => [
      Enemy,
      mkAppearance("troll", "T", "lime", "black", Layer.Enemy),
      mkFighter(16, 16, 1, 4, 100),
    ],
  };
  const Corpse: RLTemplate = {
    type: "template",
    name: "Corpse",
    get: () => [
      RedrawMe,
      mkAppearance("corpse", "%", "red", "black", Layer.Corpse),
    ],
  };
  const HealingPotion: RLTemplate = {
    type: "template",
    name: "HealingPotion",
    get: () => [
      Item,
      mkAppearance("healing potion", "!", "purple", "black", Layer.Item),
      mkConsumable(healingItem, 4, 0, false, 0),
    ],
  };
  const LightningScroll: RLTemplate = {
    type: "template",
    name: "LightningScroll",
    get: () => [
      Item,
      mkAppearance("lightning scroll", "~", "cyan", "black", Layer.Item),
      mkConsumable(zapItem, 20, 5, false, 0),
    ],
  };
  const ConfusionScroll: RLTemplate = {
    type: "template",
    name: "ConfusionScroll",
    get: () => [
      Item,
      mkAppearance("confusion scroll", "~", "#cf3fff", "black", Layer.Item),
      mkConsumable(confuseItem, 10, 100, true, 0),
    ],
  };
  const FireballScroll: RLTemplate = {
    type: "template",
    name: "FireballScroll",
    get: () => [
      Item,
      mkAppearance("fireball scroll", "~", "#ff0000", "black", Layer.Item),
      mkConsumable(fireballItem, 12, 100, true, 3),
    ],
  };
  const Dagger: RLTemplate = {
    type: "template",
    name: "Dagger",
    get: () => [
      Item,
      mkAppearance("dagger", "/", "silver", "black", Layer.Item),
      mkEquippable(Slot.Weapon, 2, 0),
    ],
  };
  const Sword: RLTemplate = {
    type: "template",
    name: "Sword",
    get: () => [
      Item,
      mkAppearance("sword", "/", "white", "black", Layer.Item),
      mkEquippable(Slot.Weapon, 4, 0),
    ],
  };
  const LeatherArmour: RLTemplate = {
    type: "template",
    name: "LeatherArmour",
    get: () => [
      Item,
      mkAppearance("leather armour", "[", "brown", "black", Layer.Item),
      mkEquippable(Slot.Armour, 0, 1),
    ],
  };
  const ChainMail: RLTemplate = {
    type: "template",
    name: "ChainMail",
    get: () => [
      Item,
      mkAppearance("chain mail", "[", "silver", "black", Layer.Item),
      mkEquippable(Slot.Armour, 0, 3),
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
  const xpX: number = hpX;
  const xpY: number = hpY + 1;
  const xpWidth: number = hpWidth;
  const floorX: number = hpX;
  const floorY: number = hpY + 2;
  const logX: number = hpWidth + 2;
  const logY: number = hpY;
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
  let gPlayer: RLEntity;

  function getRandomEnemy(floor: number) {
    const gen: RLWeighted = new RLWeighted();
    gen.set(Orc, 80);
    gen.set(
      Troll,
      ((__match) => {
        if (__match >= 3) return 15;
        else if (__match >= 5) return 30;
        else if (__match >= 7) return 60;
        else return 0;
      })(floor)
    );
    return gen.roll();
  }
  const fn_getRandomEnemy = new RLFn("getRandomEnemy", getRandomEnemy, [
    { type: "param", name: "floor", typeName: "int" },
  ]);

  function getRandomItem(floor: number) {
    const gen: RLWeighted = new RLWeighted();
    gen.set(HealingPotion, 35);
    if (floor >= 2) {
      gen.set(ConfusionScroll, 10);
    }
    if (floor >= 4) {
      gen.set(LightningScroll, 25);
      gen.set(Sword, 5);
    }
    if (floor >= 6) {
      gen.set(FireballScroll, 25);
      gen.set(ChainMail, 5);
    }
    return gen.roll();
  }
  const fn_getRandomItem = new RLFn("getRandomItem", getRandomItem, [
    { type: "param", name: "floor", typeName: "int" },
  ]);

  function getPower(e: RLEntity) {
    let power = 0;
    if (!e) {
      return 0;
    }
    if (e.Fighter) {
      power += e.Fighter.power;
    }
    if (e.Equipment) {
      if (e.Equipment.weapon) {
        power += getPower(
          __lib.lookup({ type: "eid", value: e.Equipment.weapon })
        );
      }
      if (e.Equipment.armour) {
        power += getPower(
          __lib.lookup({ type: "eid", value: e.Equipment.armour })
        );
      }
    }
    if (e.Equippable) {
      power += e.Equippable.power;
    }
    return power;
  }
  const fn_getPower = new RLFn("getPower", getPower, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function getDefence(e: RLEntity) {
    let defence = 0;
    if (e.Fighter) {
      defence += e.Fighter.defence;
    }
    if (e.Equipment) {
      if (e.Equipment.weapon) {
        defence += getDefence(
          __lib.lookup({ type: "eid", value: e.Equipment.weapon })
        );
      }
      if (e.Equipment.armour) {
        defence += getDefence(
          __lib.lookup({ type: "eid", value: e.Equipment.armour })
        );
      }
    }
    if (e.Equippable) {
      defence += e.Equippable.defence;
    }
    return defence;
  }
  const fn_getDefence = new RLFn("getDefence", getDefence, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

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
      hurt(target, item.Consumable.power, pc);
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
        hurt(t, damage, pc);
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

  function getMaxItemsPerRoom(floor: number) {
    return ((__match) => {
      if (__match <= 4) return 1;
      else return 2;
    })(floor);
  }
  const fn_getMaxItemsPerRoom = new RLFn(
    "getMaxItemsPerRoom",
    getMaxItemsPerRoom,
    [{ type: "param", name: "floor", typeName: "int" }]
  );

  function getMaxEnemiesPerRoom(floor: number) {
    return ((__match) => {
      if (__match <= 4) return 2;
      else if (__match <= 6) return 3;
      else return 5;
    })(floor);
  }
  const fn_getMaxEnemiesPerRoom = new RLFn(
    "getMaxEnemiesPerRoom",
    getMaxEnemiesPerRoom,
    [{ type: "param", name: "floor", typeName: "int" }]
  );

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
      else if (__match === "KeyC") return "character";
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

  function toNextLevel(e: RLEntity) {
    return e.Progress.formulaBase + e.Progress.level * e.Progress.formulaFactor;
  }
  const fn_toNextLevel = new RLFn("toNextLevel", toNextLevel, [
    { type: "param", name: "e", typeName: "entity" },
  ]);

  function giveXp(e: RLEntity, xp: number) {
    e.Fighter.xp += xp;
    if (e.IsPlayer) {
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "You gain" },
          { type: "int", value: xp },
          { type: "str", value: "experience." }
        )
      );
      e.add(RedrawUI);
      if (e.Fighter.xp >= toNextLevel(e)) {
        log.add("You are ready to gain a level.");
        e.add(GainingLevel);
      }
    }
  }
  const fn_giveXp = new RLFn("giveXp", giveXp, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "xp", typeName: "int" },
  ]);

  function hurt(e: RLEntity, damage: number, attacker: RLEntity) {
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
        Corpse,
        mkPosition(e.Position.x, e.Position.y)
      );
      corpse.Appearance.name = __lib.join(
        { type: "char", value: " " },
        { type: "str", value: "corpse of" },
        { type: "str", value: e.Appearance.name }
      );
      if (attacker.Progress) {
        giveXp(attacker, e.Fighter.xp);
      }
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
    { type: "param", name: "attacker", typeName: "entity" },
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

  function getEquippedName(e: RLEntity) {
    let name: string = getName(e);
    if (
      e.Equippable &&
      getEquipmentInSlot(gPlayer.Equipment, e.Equippable.slot) == e.id
    ) {
      name = __lib.join(
        { type: "char", value: " " },
        { type: "str", value: name },
        { type: "str", value: "(E)" }
      );
    }
    return name;
  }
  const fn_getEquippedName = new RLFn("getEquippedName", getEquippedName, [
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
      fn_getEquippedName,
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

  function getEquipmentInSlot(eq: Equipment, slot: Slot) {
    return ((__match) => {
      if (__match === Slot.Weapon) return eq.weapon;
      else if (__match === Slot.Armour) return eq.armour;
    })(slot);
  }
  const fn_getEquipmentInSlot = new RLFn(
    "getEquipmentInSlot",
    getEquipmentInSlot,
    [
      { type: "param", name: "eq", typeName: "Equipment" },
      { type: "param", name: "slot", typeName: "Slot" },
    ]
  );

  function setEquipmentInSlot(eq: Equipment, slot: Slot, id: string) {
    if (slot == Slot.Weapon) {
      eq.weapon = id;
    }
    if (slot == Slot.Armour) {
      eq.armour = id;
    }
  }
  const fn_setEquipmentInSlot = new RLFn(
    "setEquipmentInSlot",
    setEquipmentInSlot,
    [
      { type: "param", name: "eq", typeName: "Equipment" },
      { type: "param", name: "slot", typeName: "Slot" },
      { type: "param", name: "id", typeName: "eid" },
    ]
  );

  function removeItem(e: RLEntity, item: RLEntity) {
    if (getEquipmentInSlot(e.Equipment, item.Equippable.slot) == item.id) {
      setEquipmentInSlot(e.Equipment, item.Equippable.slot, "");
      log.add(
        __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "You remove the " },
          { type: "str", value: getName(item) },
          { type: "char", value: "." }
        )
      );
      return true;
    }
  }
  const fn_removeItem = new RLFn("removeItem", removeItem, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function equipItem(e: RLEntity, item: RLEntity) {
    const slot: Slot = item.Equippable.slot;
    const old: string | undefined = getEquipmentInSlot(e.Equipment, slot);
    if (old) {
      removeItem(e, __lib.lookup({ type: "eid", value: old }));
    }
    setEquipmentInSlot(e.Equipment, slot, item.id);
    log.add(
      __lib.join(
        { type: "str", value: "" },
        { type: "str", value: "You equip the " },
        { type: "str", value: getName(item) },
        { type: "char", value: "." }
      )
    );
    useTurn(e);
  }
  const fn_equipItem = new RLFn("equipItem", equipItem, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function toggleEquipped(e: RLEntity, item: RLEntity) {
    if (!e.Equipment) {
      log.add("You can't equip anything.", impossible);
      return;
    }
    if (!item.Equippable) {
      log.add("You can't equip that.", impossible);
      return;
    }
    if (getEquipmentInSlot(e.Equipment, item.Equippable.slot) == item.id) {
      removeItem(e, item);
    } else {
      equipItem(e, item);
    }
  }
  const fn_toggleEquipped = new RLFn("toggleEquipped", toggleEquipped, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function icUse(e: RLEntity, key: string, item: RLEntity) {
    if (item.Equippable) {
      toggleEquipped(e, item);
      useTurn(e);
      return;
    }
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
      if (e.Equipment && item.Equippable) {
        removeItem(e, item);
      }
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
      value:
        (__lib.clamp(
          { type: "int", value: value },
          { type: "int", value: 0 },
          { type: "int", value: maxValue }
        ) /
          maxValue) *
        maxWidth,
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

  function clearUI() {
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
    __lib.draw(
      { type: "int", value: xpX },
      { type: "int", value: xpY },
      {
        type: "str",
        value: __lib.repeat(
          { type: "char", value: " " },
          { type: "int", value: xpWidth }
        ),
      },
      { type: "str", value: "white" },
      { type: "str", value: "black" }
    );
  }
  const fn_clearUI = new RLFn("clearUI", clearUI, []);

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

  function generateDungeon(floor: number) {
    for (const e of new RLQuery(RL.instance, ["Position"]).get()) {
      if (!e.IsPlayer) {
        __lib.remove(e);
      }
    }
    map.clear();
    explored.clear();
    visible.clear();
    let prev: RLRect | undefined;
    let room: RLRect;
    const taken: RLGrid = new RLGrid(mapWidth, mapHeight, false);
    let start: RLXY;
    let stairs: RLXY;
    const maxEnemies: number = getMaxEnemiesPerRoom(floor);
    const maxItems: number = getMaxItemsPerRoom(floor);
    for (let r = 1; r <= 30; r++) {
      room = randomRoom();
      if (!map.findInRegion(room, Floor)) {
        map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
        if (prev) {
          randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
          addEnemies(room, taken, maxEnemies, floor);
          addItems(room, taken, maxItems, floor);
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
  const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, [
    { type: "param", name: "floor", typeName: "int" },
  ]);

  function addEnemies(r: RLRect, taken: RLGrid, max: number, floor: number) {
    for (
      let z = 1;
      z <=
      __lib.randInt({ type: "int", value: 0 }, { type: "int", value: max });
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
        __lib.spawn(getRandomEnemy(floor), mkPosition(x, y));
      }
    }
  }
  const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
    { type: "param", name: "r", typeName: "rect" },
    { type: "param", name: "taken", typeName: "grid" },
    { type: "param", name: "max", typeName: "int" },
    { type: "param", name: "floor", typeName: "int" },
  ]);

  function addItems(r: RLRect, taken: RLGrid, max: number, floor: number) {
    for (
      let z = 1;
      z <=
      __lib.randInt({ type: "int", value: 0 }, { type: "int", value: max });
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
        __lib.spawn(getRandomItem(floor), mkPosition(x, y));
      }
    }
  }
  const fn_addItems = new RLFn("addItems", addItems, [
    { type: "param", name: "r", typeName: "rect" },
    { type: "param", name: "taken", typeName: "grid" },
    { type: "param", name: "max", typeName: "int" },
    { type: "param", name: "floor", typeName: "int" },
  ]);

  function nextFloor(player: RLEntity) {
    player.Progress.floor += 1;
    const start: RLXY = generateDungeon(player.Progress.floor);
    player.Position.x = start.x;
    player.Position.y = start.y;
    player.add(RecalculateFOV);
    player.add(RedrawUI);
  }
  const fn_nextFloor = new RLFn("nextFloor", nextFloor, [
    { type: "param", name: "player", typeName: "entity" },
  ]);

  function giveAndEquip(e: RLEntity, item: RLEntity) {
    e.Inventory.items.add(item);
    equipItem(e, item);
  }
  const fn_giveAndEquip = new RLFn("giveAndEquip", giveAndEquip, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "item", typeName: "entity" },
  ]);

  function newGame() {
    gPlayer = __lib.spawn(Player);
    const start: RLXY = generateDungeon(1);
    gPlayer.add(mkPosition(start.x, start.y));
    giveAndEquip(gPlayer, __lib.spawn(Dagger));
    giveAndEquip(gPlayer, __lib.spawn(LeatherArmour));
    log.clear();
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
    clearUI();
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
        else if (__match === "character") return CharacterInfoAction;
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

  function code_doMelee(e: RLEntity, m: MeleeAction, a: Appearance) {
    const target: RLEntity = m.target;
    e.remove(m);
    useTurn(e);
    const attack: string = __lib.join(
      { type: "char", value: " " },
      { type: "str", value: a.name },
      { type: "str", value: "attacks" },
      { type: "str", value: target.Appearance.name }
    );
    const damage: number = getPower(e) - getDefence(target);
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
      hurt(target, damage, e);
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
    { type: "constraint", typeName: "Fighter" },
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
    clearUI();
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

  function code_info_onMouse(m: RLMouseEvent) {}
  const info_onMouse = new RLSystem("info_onMouse", code_info_onMouse, [
    { type: "param", name: "m", typeName: "MouseEvent" },
  ]);

  function code_info_onKey(
    e: RLEntity,
    f: Fighter,
    pr: Progress,
    k: RLKeyEvent
  ) {
    if (
      ((__match) => {
        if (__match === "confirm") return true;
        else if (__match === "quit") return true;
      })(getKey(k.key))
    ) {
      __lib.popKeyHandler();
      __lib.popMouseHandler();
      redrawEverything(e);
    }
  }
  const info_onKey = new RLSystem("info_onKey", code_info_onKey, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "param", name: "pr", typeName: "Progress" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_doCharacterScreen(
    e: RLEntity,
    p: Position,
    f: Fighter,
    pr: Progress
  ) {
    e.remove(CharacterInfoAction);
    let x = 0;
    if (p.x <= gameWidth / 2) {
      x = 40;
    }
    __lib.clearRect(
      { type: "int", value: x },
      { type: "int", value: 5 },
      { type: "int", value: 30 },
      { type: "int", value: 10 },
      { type: "str", value: "white" },
      { type: "str", value: "black" }
    );
    __lib.drawBox(
      { type: "int", value: x },
      { type: "int", value: 5 },
      { type: "int", value: 30 },
      { type: "int", value: 10 }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 7 },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "Level:" },
          { type: "int", value: pr.level }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 8 },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "XP:" },
          { type: "int", value: f.xp }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 9 },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "...next level:" },
          { type: "int", value: toNextLevel(e) }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 11 },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "Power:" },
          { type: "int", value: getPower(e) }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 12 },
      {
        type: "str",
        value: __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "Defence:" },
          { type: "int", value: getDefence(e) }
        ),
      }
    );
    __lib.pushKeyHandler(info_onKey);
    __lib.pushMouseHandler(info_onMouse);
  }
  const doCharacterScreen = new RLSystem(
    "doCharacterScreen",
    code_doCharacterScreen,
    [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "param", name: "pr", typeName: "Progress" },
      { type: "constraint", typeName: "CharacterInfoAction" },
      { type: "constraint", typeName: "MyTurn" },
    ]
  );

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

  function code_drawUI(e: RLEntity, f: Fighter, pr: Progress) {
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
    const tnl: number = toNextLevel(e);
    drawBar(xpX, xpY, f.xp, tnl, xpWidth, "#600060", "#A000A0");
    __lib.draw(
      { type: "int", value: xpX + 1 },
      { type: "int", value: xpY },
      {
        type: "str",
        value: __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "XP: " },
          { type: "int", value: f.xp },
          { type: "str", value: "/" },
          { type: "int", value: tnl }
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
          { type: "int", value: pr.floor }
        ),
      },
      { type: "str", value: "white" }
    );
  }
  const drawUI = new RLSystem("drawUI", code_drawUI, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "param", name: "pr", typeName: "Progress" },
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

  function code_level_onMouse(m: RLMouseEvent) {}
  const level_onMouse = new RLSystem("level_onMouse", code_level_onMouse, [
    { type: "param", name: "m", typeName: "MouseEvent" },
  ]);

  function code_level_onKey(
    e: RLEntity,
    f: Fighter,
    pr: Progress,
    k: RLKeyEvent
  ) {
    let done = false;
    if (k.key == "KeyC") {
      done = true;
      f.hp += 20;
      f.maxHp += 20;
      log.add("Your health improves.");
    }
    if (k.key == "KeyS") {
      done = true;
      f.power += 1;
      log.add("You feel stronger.");
    }
    if (k.key == "KeyA") {
      done = true;
      f.defence += 1;
      log.add("Your feel swifter.");
    }
    if (done) {
      f.xp -= toNextLevel(e);
      pr.level += 1;
      __lib.popKeyHandler();
      __lib.popMouseHandler();
      redrawEverything(e);
    }
  }
  const level_onKey = new RLSystem("level_onKey", code_level_onKey, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "param", name: "pr", typeName: "Progress" },
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  function code_gainLevel(e: RLEntity, p: Position, f: Fighter) {
    e.remove(GainingLevel);
    e.remove(RecalculateFOV);
    let x = 0;
    if (p.x <= gameWidth / 2) {
      x = 40;
    }
    __lib.clearRect(
      { type: "int", value: x },
      { type: "int", value: 5 },
      { type: "int", value: 40 },
      { type: "int", value: 10 },
      { type: "str", value: "white" },
      { type: "str", value: "black" }
    );
    __lib.drawBox(
      { type: "int", value: x },
      { type: "int", value: 5 },
      { type: "int", value: 40 },
      { type: "int", value: 10 }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 7 },
      { type: "str", value: "You gain a level." },
      { type: "str", value: "yellow" }
    );
    __lib.draw(
      { type: "int", value: x + 2 },
      { type: "int", value: 9 },
      { type: "str", value: "Choose your boon:" }
    );
    __lib.draw(
      { type: "int", value: x + 4 },
      { type: "int", value: 10 },
      {
        type: "str",
        value: __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "C)onstitution (+20 hp, was " },
          { type: "int", value: f.maxHp },
          { type: "char", value: ")" }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 4 },
      { type: "int", value: 11 },
      {
        type: "str",
        value: __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "S)trength (+1 power, was " },
          { type: "int", value: f.power },
          { type: "char", value: ")" }
        ),
      }
    );
    __lib.draw(
      { type: "int", value: x + 4 },
      { type: "int", value: 12 },
      {
        type: "str",
        value: __lib.join(
          { type: "str", value: "" },
          { type: "str", value: "A)gility (+1 defence, was " },
          { type: "int", value: f.defence },
          { type: "char", value: ")" }
        ),
      }
    );
    __lib.pushKeyHandler(level_onKey);
    __lib.pushMouseHandler(level_onMouse);
  }
  const gainLevel = new RLSystem("gainLevel", code_gainLevel, [
    { type: "param", name: "e", typeName: "entity" },
    { type: "param", name: "p", typeName: "Position" },
    { type: "param", name: "f", typeName: "Fighter" },
    { type: "constraint", typeName: "GainingLevel" },
  ]);

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
        for (const e of new RLQuery(RL.instance, ["IsPlayer"]).get()) {
          gPlayer = e;
        }
      }
    }
  }
  const menu_onKey = new RLSystem("menu_onKey", code_menu_onKey, [
    { type: "param", name: "k", typeName: "KeyEvent" },
  ]);

  return new Map<string, RLObject>([
    ["getRandomEnemy", fn_getRandomEnemy],
    ["getRandomItem", fn_getRandomItem],
    ["getPower", fn_getPower],
    ["getDefence", fn_getDefence],
    ["distance", fn_distance],
    ["healingItem", fn_healingItem],
    ["zapItem", fn_zapItem],
    ["confuseItem", fn_confuseItem],
    ["fireballItem", fn_fireballItem],
    ["redrawEverything", fn_redrawEverything],
    ["getMaxItemsPerRoom", fn_getMaxItemsPerRoom],
    ["getMaxEnemiesPerRoom", fn_getMaxEnemiesPerRoom],
    ["getKey", fn_getKey],
    ["getNamesAtLocation", fn_getNamesAtLocation],
    ["showNamesAt", fn_showNamesAt],
    ["getBlockingMap", fn_getBlockingMap],
    ["getRandomMove", fn_getRandomMove],
    ["toNextLevel", fn_toNextLevel],
    ["giveXp", fn_giveXp],
    ["hurt", fn_hurt],
    ["showHistoryView", fn_showHistoryView],
    ["getName", fn_getName],
    ["getEquippedName", fn_getEquippedName],
    ["openInventory", fn_openInventory],
    ["tcUseItem", fn_tcUseItem],
    ["getEquipmentInSlot", fn_getEquipmentInSlot],
    ["setEquipmentInSlot", fn_setEquipmentInSlot],
    ["removeItem", fn_removeItem],
    ["equipItem", fn_equipItem],
    ["toggleEquipped", fn_toggleEquipped],
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
    ["clearUI", fn_clearUI],
    ["randomRoom", fn_randomRoom],
    ["randomCorridor", fn_randomCorridor],
    ["generateDungeon", fn_generateDungeon],
    ["addEnemies", fn_addEnemies],
    ["addItems", fn_addItems],
    ["nextFloor", fn_nextFloor],
    ["giveAndEquip", fn_giveAndEquip],
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
    ["info_onMouse", info_onMouse],
    ["info_onKey", info_onKey],
    ["doCharacterScreen", doCharacterScreen],
    ["fov", fov],
    ["drawUnderTile", drawUnderTile],
    ["RedrawMeEntity", RedrawMeEntity],
    ["drawUI", drawUI],
    ["nextTurn", nextTurn],
    ["level_onMouse", level_onMouse],
    ["level_onKey", level_onKey],
    ["gainLevel", gainLevel],
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
    ["GainingLevel", GainingLevel],
    ["CharacterInfoAction", CharacterInfoAction],
    ["Player", Player],
    ["Enemy", Enemy],
    ["Orc", Orc],
    ["Troll", Troll],
    ["Corpse", Corpse],
    ["HealingPotion", HealingPotion],
    ["LightningScroll", LightningScroll],
    ["ConfusionScroll", ConfusionScroll],
    ["FireballScroll", FireballScroll],
    ["Dagger", Dagger],
    ["Sword", Sword],
    ["LeatherArmour", LeatherArmour],
    ["ChainMail", ChainMail],
  ]);
}
