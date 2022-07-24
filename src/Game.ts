import { Keys, Terminal } from "wglt";
import RL, { RLArg, RLKeyEvent, RLSystem, isAssignableTo } from "./RL";

const keyEvents = new Map([
  [Keys.VK_UP, "up"],
  [Keys.VK_RIGHT, "right"],
  [Keys.VK_DOWN, "down"],
  [Keys.VK_LEFT, "left"],
  [Keys.VK_HOME, "up-left"],
  [Keys.VK_END, "down-left"],
  [Keys.VK_PAGE_UP, "up-right"],
  [Keys.VK_PAGE_DOWN, "down-right"],
  [Keys.VK_CLEAR, "wait"],

  [Keys.VK_NUMPAD8, "up"],
  [Keys.VK_NUMPAD6, "right"],
  [Keys.VK_NUMPAD2, "down"],
  [Keys.VK_NUMPAD4, "left"],
  [Keys.VK_NUMPAD7, "up-left"],
  [Keys.VK_NUMPAD1, "down-left"],
  [Keys.VK_NUMPAD9, "up-right"],
  [Keys.VK_NUMPAD3, "down-right"],
  [Keys.VK_NUMPAD5, "wait"],

  [Keys.VK_K, "up"],
  [Keys.VK_L, "right"],
  [Keys.VK_J, "down"],
  [Keys.VK_H, "left"],
  [Keys.VK_Y, "up-left"],
  [Keys.VK_B, "down-left"],
  [Keys.VK_U, "up-right"],
  [Keys.VK_N, "down-right"],
  [Keys.VK_PERIOD, "wait"],
]);

export default class Game {
  static instance: Game;
  terminal!: Terminal;
  width: number;
  height: number;
  running: boolean;

  constructor(public rl: RL, public canvas: HTMLCanvasElement) {
    Game.instance = this;
    // TODO remove after debugging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (window as any).G = this;
    this.width = 80;
    this.height = 50;
    this.running = false;
  }

  async init() {
    this.rl.callNamedFunction("main");
    this.terminal = new Terminal(this.canvas, this.width, this.height);

    this.running = true;
    while (this.running) {
      let fired = false;
      for (const sys of this.rl.systems) {
        if (this.trySystem(sys)) fired = true;
      }

      if (!fired) {
        const key = await this.getKey();
        const sys = this.rl.keyHandlers.top;
        this.trySystem(sys, {
          type: "typed",
          typeName: "KeyEvent",
          value: key,
        });
      }
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
      return result !== false;
    }

    const matches = sys.query.get();
    if (matches.length) {
      for (const e of matches)
        this.rl.runSystem(
          sys,
          { type: "typed", typeName: "entity", value: e },
          ...args
        ) === false;

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
