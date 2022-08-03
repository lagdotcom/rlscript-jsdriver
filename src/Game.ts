import { Key, Terminal } from "wglt";

import RL from "./RL";
import RLArg from "./RLArg";
import RLKeyEvent from "./RLKeyEvent";
import RLMouseEvent from "./RLMouseEvent";
import RLSystem from "./RLSystem";
import isAssignableTo from "./isAssignableTo";

const keyEvents = new Map([
  [Key.VK_UP, "up"],
  [Key.VK_RIGHT, "right"],
  [Key.VK_DOWN, "down"],
  [Key.VK_LEFT, "left"],
  [Key.VK_HOME, "up-left"],
  [Key.VK_END, "down-left"],
  [Key.VK_PAGE_UP, "up-right"],
  [Key.VK_PAGE_DOWN, "down-right"],
  // [Key.VK_CLEAR, "wait"],

  [Key.VK_NUMPAD8, "up"],
  [Key.VK_NUMPAD6, "right"],
  [Key.VK_NUMPAD2, "down"],
  [Key.VK_NUMPAD4, "left"],
  [Key.VK_NUMPAD7, "up-left"],
  [Key.VK_NUMPAD1, "down-left"],
  [Key.VK_NUMPAD9, "up-right"],
  [Key.VK_NUMPAD3, "down-right"],
  [Key.VK_NUMPAD5, "wait"],

  [Key.VK_K, "up"],
  [Key.VK_L, "right"],
  [Key.VK_J, "down"],
  [Key.VK_H, "left"],
  [Key.VK_Y, "up-left"],
  [Key.VK_B, "down-left"],
  [Key.VK_U, "up-right"],
  [Key.VK_N, "down-right"],
  [Key.VK_PERIOD, "wait"],
]);

export default class Game {
  static instance: Game;
  terminal!: Terminal;
  width: number;
  height: number;
  running: boolean;
  mouseX: number;
  mouseY: number;

  constructor(public rl: RL, public canvas: HTMLCanvasElement) {
    Game.instance = this;
    // TODO remove after debugging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (window as any).G = this;
    this.width = 80;
    this.height = 50;
    this.running = false;
    this.mouseX = NaN;
    this.mouseY = NaN;
  }

  async init() {
    this.rl.callNamedFunction("main");
    this.terminal = new Terminal(this.canvas, this.width, this.height);
    this.terminal.update = this.terminalUpdate.bind(this);

    let count = 0;
    this.running = true;
    while (this.running) {
      let fired = false;
      for (const sys of this.rl.systems.filter((s) => s.enabled)) {
        if (this.trySystem(sys)) fired = true;
      }

      if (!fired) {
        count = 0;

        const key = await this.getKey();
        const sys = this.rl.keyHandlers.top;
        this.trySystem(sys, {
          type: "typed",
          typeName: "KeyEvent",
          value: key,
        });
      } else {
        count++;

        if (count > 5000) {
          this.running = false;
          console.warn("Suspected infinite loop.");
        }
      }
    }
  }

  terminalUpdate() {
    if (this.rl.mouseHandlers.empty) return;

    if (
      this.mouseX !== this.terminal.mouse.x ||
      this.mouseY !== this.terminal.mouse.y
    ) {
      this.mouseX = this.terminal.mouse.x;
      this.mouseY = this.terminal.mouse.y;

      const sys = this.rl.mouseHandlers.top;
      this.trySystem(sys, {
        type: "typed",
        typeName: "MouseEvent",
        value: new RLMouseEvent("move", this.mouseX, this.mouseY),
      });
    }
  }

  trySystem(sys: RLSystem, ...args: RLArg[]) {
    for (const e of sys.externals) {
      if (typeof e.default !== "undefined") continue;
      const a = args.find(
        (a) =>
          (a.type === "named" && a.name === e.name) ||
          (a.type === "typed" && isAssignableTo(a.value, a.typeName))
      );
      if (!a) return;
    }

    if (sys.params.length === 0) {
      // a system that can fail to execute
      const result = this.rl.runSystem(sys, ...args);

      // console.log(`${sys.name}: ${result !== false ? "ok" : "failed"}`);
      return result !== false;
    }

    const hasEntityParam = sys.params.find((p) => p.typeName === "entity");

    if (hasEntityParam) {
      const matches = sys.query.get();
      if (matches.length) {
        // console.log(`${sys.name}: ${matches.length} found`);

        for (const e of matches)
          this.rl.runSystem(
            sys,
            { type: "typed", typeName: "entity", value: e },
            ...args
          );

        return true;
      }
    } else {
      // probably an event handler then

      this.rl.runSystem(sys, ...args);
      return true;
    }

    return false;
  }

  async getKey(): Promise<RLKeyEvent> {
    return new Promise<RLKeyEvent>((resolve) => {
      const handler = () => {
        for (const [key, name] of keyEvents) {
          if (this.terminal.isKeyPressed(key))
            return resolve(new RLKeyEvent(name));
        }

        requestAnimationFrame(handler);
      };
      requestAnimationFrame(handler);
    });
  }
}
