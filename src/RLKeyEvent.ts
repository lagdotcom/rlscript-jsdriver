import { Key } from "wglt";
import RLObjectType from "./RLObjectType";

const keyChars: Partial<Record<Key, string>> = {
  [Key.VK_A]: "A",
  [Key.VK_B]: "B",
  [Key.VK_C]: "C",
  [Key.VK_D]: "D",
  [Key.VK_E]: "E",
  [Key.VK_F]: "F",
  [Key.VK_G]: "G",
  [Key.VK_H]: "H",
  [Key.VK_I]: "I",
  [Key.VK_J]: "J",
  [Key.VK_K]: "K",
  [Key.VK_L]: "L",
  [Key.VK_M]: "M",
  [Key.VK_N]: "N",
  [Key.VK_O]: "O",
  [Key.VK_P]: "P",
  [Key.VK_Q]: "Q",
  [Key.VK_R]: "R",
  [Key.VK_S]: "S",
  [Key.VK_T]: "T",
  [Key.VK_U]: "U",
  [Key.VK_V]: "V",
  [Key.VK_W]: "W",
  [Key.VK_X]: "X",
  [Key.VK_Y]: "Y",
  [Key.VK_Z]: "Z",
};

export default class RLKeyEvent {
  static type: RLObjectType = "KeyEvent";
  type: "KeyEvent";
  char?: string;

  constructor(
    public key: Key,
    public shift = false,
    public ctrl = false,
    public alt = false
  ) {
    this.type = "KeyEvent";

    if (keyChars[key]) this.char = keyChars[key];
  }
}
