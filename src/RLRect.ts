import RLObjectType from "./RLObjectType";
import RLXY from "./RLXY";

export default class RLRect {
  static type: RLObjectType = "rect";
  type: "rect";

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.type = "rect";
  }

  get x2() {
    return this.x + this.width;
  }

  get y2() {
    return this.y + this.height;
  }

  get cx() {
    return Math.floor(this.x + this.width / 2);
  }

  get cy() {
    return Math.floor(this.y + this.height / 2);
  }

  get centre() {
    return new RLXY(this.cx, this.cy);
  }

  intersects(o: RLRect) {
    return this.x <= o.x2 && this.x2 >= o.x && this.y <= o.y2 && this.y2 >= o.y;
  }
}
