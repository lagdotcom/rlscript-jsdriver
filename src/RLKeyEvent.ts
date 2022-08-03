import RLObjectType from "./RLObjectType";

export default class RLKeyEvent {
  static type: RLObjectType = "KeyEvent";
  type: "KeyEvent";

  constructor(public key: string) {
    this.type = "KeyEvent";
  }
}
