import Serializer, { getTypeName } from "./Serializer";

import RLEntity from "./RLEntity";

type SerializedBag = {
  capacity: number;
  items: [string, object][];
};

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

  serialize(): SerializedBag {
    const { capacity } = this;
    const items: SerializedBag["items"] = [];

    for (const [key, item] of this.items)
      items.push([key, Serializer.instance.serialize(getTypeName(item), item)]);

    return { capacity, items };
  }

  static deserialize(data: SerializedBag) {
    const b = new RLBag(data.capacity);

    b.items.clear();
    for (const [key, obj] of data.items)
      b.items.set(key, Serializer.instance.deserialize(obj));

    return b;
  }
}

Serializer.instance.add(
  "bag",
  (b: RLBag) => b.serialize(),
  (data: SerializedBag) => RLBag.deserialize(data)
);
