import {
  Actor,
  Appearance,
  Fighter,
  MeleeAction,
  MoveAction,
  OldPosition,
  Position,
  RLComponent,
  RLComponentName,
} from "./implTypes";

import RLObjectType from "./RLObjectType";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import { nanoid } from "nanoid";

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
  IsBlocker: boolean;
  IsPlayer: boolean;
  RecalculateFOV: boolean;
  RedrawMe: boolean;
  RedrawUI: boolean;
  MyTurn: boolean;
  BaseAI: boolean;
  HostileEnemy: boolean;
  WaitAction: boolean;
  HistoryAction: boolean;
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
    this.BaseAI = false;
    this.HostileEnemy = false;
    this.WaitAction = false;
    this.HistoryAction = false;
  }

  toString() {
    return `#${this.id} (${Array.from(this.templates.values()).join(" ")})`;
  }

  get [Symbol.toStringTag]() {
    return `Entity#${this.toString()})`;
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
}
