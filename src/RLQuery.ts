import RL from "./RL";
import RLEntity from "./RLEntity";
import RLObjectType from "./RLObjectType";

export default class RLQuery {
  constructor(public parent: RL, public types: RLObjectType[]) {}

  get() {
    return Array.from(this.parent.entities.values()).filter((e) =>
      this.match(e)
    );
  }

  match(e: RLEntity) {
    for (const type of this.types) {
      if (!e.has(type)) return false;
    }

    return true;
  }
}
