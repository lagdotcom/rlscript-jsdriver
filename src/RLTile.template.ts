import RLObjectType from "./RLObjectType";

export default class RLTile {
  static type: RLObjectType = "tile";
  type: "tile";

  constructor(public ch: string, //#TILECONSTRUCTOR) {
    this.type = "tile";
  }
}
