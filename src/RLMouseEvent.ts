import RLObjectType from "./RLObjectType";

export default class RLMouseEvent {
  static type: RLObjectType = "MouseEvent";
  type: "MouseEvent";

  constructor(
    public event: "move" | "click",
    public x: number,
    public y: number,
    public button: number = NaN
  ) {
    this.type = "MouseEvent";
  }
}
