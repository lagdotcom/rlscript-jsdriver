import RLObjectType from "./RLObjectType";

export default class RLTile {
  static type: RLObjectType = "tile";
  type: "tile";

  constructor(
    public ch: string,
    public walkable: boolean,
    public transparent: boolean
  ) {
    this.type = "tile";
  }
}
