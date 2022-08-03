import RLObjectType from "./RLObjectType";

export default class RLXY {
  static type: RLObjectType = "xy";
  type: "xy";

  constructor(public x: number, public y: number) {
    this.type = "xy";
  }

  equals(o: RLXY) {
    return this.x === o.x && this.y === o.y;
  }

  plus(o: RLXY) {
    return new RLXY(this.x + o.x, this.y + o.y);
  }
}
