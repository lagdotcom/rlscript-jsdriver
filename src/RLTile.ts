import RLObjectType from "./RLObjectType";
import Serializer from "./Serializer";

export default class RLTile {
  static registry: Record<string, RLTile> = {};
  static type: RLObjectType = "tile";
  type: "tile";

  constructor(
    public ch: string,
    public walkable: boolean,
    public transparent: boolean
  ) {
    RLTile.registry[ch] = this;
    this.type = "tile";
  }
}

Serializer.instance.add(
  "tile",
  (t: RLTile) => t.ch,
  (ch: string) => RLTile.registry[ch]
);
