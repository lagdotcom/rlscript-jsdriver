//#IMPLTYPES

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
  //#ENTITYFIELDS
  constructor() {
    this.type = "entity";
    this.id = nanoid();
    this.components = new Set();
    this.templates = new Set();
    //#ENTITYCONSTRUCTOR
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
