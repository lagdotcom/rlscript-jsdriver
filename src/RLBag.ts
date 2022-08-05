import RLEntity from "./RLEntity";

export default class RLBag<T = RLEntity> {
  public type: "bag";
  public items: Map<string, T>;

  constructor(public capacity: number) {
    this.type = "bag";
    this.items = new Map();
  }

  get count() {
    return this.items.size;
  }

  getKeyByIndex(i: number) {
    return String.fromCharCode(i + 65);
  }

  getFreeKey(): string | undefined {
    for (let i = 0; i < this.capacity; i++) {
      const key = this.getKeyByIndex(i);
      if (!this.items.has(key)) return key;
    }
  }

  add(item: T): string | undefined {
    const key = this.getFreeKey();
    if (key) this.items.set(key, item);

    return key;
  }

  get(key: string) {
    return this.items.get(key);
  }

  has(key: string) {
    return this.items.has(key);
  }

  contains(item: T) {
    return Array.from(this.items.values()).includes(item);
  }

  remove(key: string) {
    this.items.delete(key);
  }
}
