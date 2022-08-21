export default class RLWeighted<T> {
  type: "weighted";
  entries: Map<T, number>;

  constructor() {
    this.type = "weighted";
    this.entries = new Map();
  }

  get chanceTotal() {
    let total = 0;
    for (const [, chance] of this.entries) total += chance;

    return total;
  }

  set(item: T, chance: number) {
    this.entries.set(item, chance);
  }

  roll(): T {
    let roll = Math.floor(Math.random() * this.chanceTotal);
    for (const [item, chance] of this.entries) {
      if (roll <= chance) return item;
      roll -= chance;
    }

    throw new Error("I can't add up?");
  }
}
