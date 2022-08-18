import Serializer, { getTypeName } from "./Serializer";

import RL from "./RL";
import RLObjectType from "./RLObjectType";
import RLRect from "./RLRect";
import bresenham from "bresenham";

type SerializedGrid = {
  width: number;
  height: number;
  contents: Record<string, any>;
};

export default class RLGrid<T> {
  static type: RLObjectType = "grid";
  type: "grid";
  contents: Map<string, T>;
  itemType: string;

  constructor(public width: number, public height: number, public empty: T) {
    this.type = "grid";
    this.contents = new Map<string, T>();

    this.itemType = getTypeName(empty);
  }

  tag(x: number, y: number) {
    return `${x},${y}`;
  }

  at(x: number, y: number) {
    return this.atOr(x, y, this.empty);
  }

  atOr<E>(x: number, y: number, empty: E) {
    const tag = this.tag(x, y);
    const item = this.contents.get(tag);
    return typeof item === "undefined" ? empty : item;
  }

  put(x: number, y: number, item: T) {
    const tag = this.tag(x, y);
    if (item === this.empty) this.contents.delete(tag);
    else this.contents.set(this.tag(x, y), item);
  }

  clear() {
    this.contents.clear();
  }

  fill(item: T) {
    this.rect(0, 0, this.width - 1, this.height - 1, item);
  }

  rect(sx: number, sy: number, ex: number, ey: number, item: T) {
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        this.put(x, y, item);
      }
    }
  }

  findInRegion(region: RLRect, item: T) {
    for (let y = region.y; y <= region.y2; y++) {
      for (let x = region.x; x <= region.x2; x++) {
        if (this.at(x, y) === item) return true;
      }
    }

    return false;
  }

  line(x1: number, y1: number, x2: number, y2: number, item: T) {
    bresenham(x1, y1, x2, y2, (x, y) => this.put(x, y, item));
  }

  draw() {
    RL.instance.lib.drawGrid(this);
  }

  serialize(): SerializedGrid {
    const { width, height, itemType } = this;
    const contents: SerializedGrid["contents"] = {};
    for (const [tag, item] of this.contents)
      contents[tag] = Serializer.instance.serialize(itemType, item);

    return { width, height, contents };
  }

  deserialize(data: SerializedGrid) {
    this.width = data.width;
    this.height = data.height;

    this.contents.clear();
    for (const tag in data.contents) {
      this.contents.set(
        tag,
        Serializer.instance.deserialize(this.itemType, data.contents[tag])
      );
    }

    return this;
  }
}

Serializer.instance.add(
  "grid",
  (g: RLGrid<unknown>) => g.serialize(),
  (data: SerializedGrid, g: RLGrid<unknown>) => g.deserialize(data)
);
