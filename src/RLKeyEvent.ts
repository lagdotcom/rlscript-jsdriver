import RLObjectType from "./RLObjectType";

const keyChars: Record<string, string> = {
  KeyA: "A",
  KeyB: "B",
  KeyC: "C",
  KeyD: "D",
  KeyE: "E",
  KeyF: "F",
  KeyG: "G",
  KeyH: "H",
  KeyI: "I",
  KeyJ: "J",
  KeyK: "K",
  KeyL: "L",
  KeyM: "M",
  KeyN: "N",
  KeyO: "O",
  KeyP: "P",
  KeyQ: "Q",
  KeyR: "R",
  KeyS: "S",
  KeyT: "T",
  KeyU: "U",
  KeyV: "V",
  KeyW: "W",
  KeyX: "X",
  KeyY: "Y",
  KeyZ: "Z",
};

export default class RLKeyEvent {
  static type: RLObjectType = "KeyEvent";
  type: "KeyEvent";
  char?: string;

  constructor(public key: string) {
    this.type = "KeyEvent";

    if (keyChars[key]) this.char = keyChars[key];
  }
}
