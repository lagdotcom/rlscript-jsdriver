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
  RLComponent,
  RLComponentName,
  RLTagName,
  TargetingActionConfig,
  TargetingItemConfig,
} from "./implTypes";

import RLObjectType from "./RLObjectType";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import Serializer from "./Serializer";
import { nanoid } from "nanoid";

type RLEntityField =
  | "id"
  | "components"
  | "templates"
  | RLComponentName
  | RLTagName;

export default class RLEntity {
  static type: RLObjectType = "entity";
  type: "entity";
  id: string;

  components: Set<string>;
  templates: Set<string>;
  Appearance?: Appearance;
  OldPosition?: OldPosition;
  Position?: Position;
  MoveAction?: MoveAction;
  MeleeAction?: MeleeAction;
  Actor?: Actor;
  Fighter?: Fighter;
  Consumable?: Consumable;
  Inventory?: Inventory;
  InventoryActionConfig?: InventoryActionConfig;
  TargetingActionConfig?: TargetingActionConfig;
  TargetingItemConfig?: TargetingItemConfig;
  ConfusedEnemy?: ConfusedEnemy;
  Progress?: Progress;
  Equippable?: Equippable;
  Equipment?: Equipment;
  IsBlocker: boolean;
  IsPlayer: boolean;
  RecalculateFOV: boolean;
  RedrawMe: boolean;
  RedrawUI: boolean;
  MyTurn: boolean;
  HostileEnemy: boolean;
  WaitAction: boolean;
  HistoryAction: boolean;
  Item: boolean;
  PickupAction: boolean;
  InventoryAction: boolean;
  DropAction: boolean;
  LookAction: boolean;
  QuitAction: boolean;
  TakeStairsAction: boolean;
  GainingLevel: boolean;
  CharacterInfoAction: boolean;
  constructor() {
    this.type = "entity";
    this.id = nanoid();
    this.components = new Set();
    this.templates = new Set();
    this.IsBlocker = false;
    this.IsPlayer = false;
    this.RecalculateFOV = false;
    this.RedrawMe = false;
    this.RedrawUI = false;
    this.MyTurn = false;
    this.HostileEnemy = false;
    this.WaitAction = false;
    this.HistoryAction = false;
    this.Item = false;
    this.PickupAction = false;
    this.InventoryAction = false;
    this.DropAction = false;
    this.LookAction = false;
    this.QuitAction = false;
    this.TakeStairsAction = false;
    this.GainingLevel = false;
    this.CharacterInfoAction = false;
  }

  toString() {
    return `#${this.id} (${Array.from(this.templates.values()).join(" ")})`;
  }

  get [Symbol.toStringTag]() {
    return `Entity#${this.toString()}`;
  }

  has(name: RLObjectType) {
    return this.components.has(name);
  }

  add(thing?: RLTag | RLComponent | RLTemplate) {
    if (!thing) return;

    if (thing.type === "template") {
      this.templates.add(thing.name);
      for (const part of thing.get()) this.add(part);
      return;
    }

    if (thing.type === "component") {
      // TODO what is going on here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[thing.typeName] = thing;
    } else this[thing.typeName] = true;

    this.components.add(thing.typeName);
  }

  remove(thing?: RLTag | RLComponent) {
    if (!thing) return;

    if (thing.type === "component") delete this[thing.typeName];
    else this[thing.typeName] = false;

    this.components.delete(thing.typeName);
  }

  get(name: RLComponentName) {
    if (this.components.has(name)) return this[name];

    throw new Error(`Tried to access empty entity.${name}`);
  }

  serialize() {
    const keys = Object.keys(this).filter(
      (k) => Object.prototype.hasOwnProperty.call(this, k) && k !== "type"
    ) as RLEntityField[];

    const data = Object.fromEntries(keys.map((k) => [k, this[k]]));
    return Serializer.instance.serialize("n:object", data)[1];
  }

  static deserialize(data: object) {
    const e = new RLEntity();

    for (const key in data) {
      const value = data[key];
      e[key] = Serializer.instance.deserialize(value);
    }

    return e;
  }
}

Serializer.instance.add(
  "entity",
  (e: RLEntity) => e.serialize(),
  (data: object) => RLEntity.deserialize(data)
);
Serializer.instance.alias("component", "n:object");
