import { Key, Terminal } from "wglt";

import RL from "./RL";
import RLArg from "./RLArg";
import RLKeyEvent from "./RLKeyEvent";
import RLMouseEvent from "./RLMouseEvent";
import RLSystem from "./RLSystem";
import isAssignableTo from "./isAssignableTo";

const metaKeys = [
  Key.VK_CONTROL_LEFT,
  Key.VK_CONTROL_RIGHT,
  Key.VK_SHIFT_LEFT,
  Key.VK_SHIFT_RIGHT,
  Key.VK_ALT_LEFT,
  Key.VK_ALT_RIGHT,
];

export type AfterInitFn = (term: Terminal) => void;

export default class Game {
  static instance: Game;
  terminal!: Terminal;
  width: number;
  height: number;
  running: boolean;
  mouseX: number;
  mouseY: number;
  afterInit: AfterInitFn[];

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
    this.afterInit = [];
  }

  init() {
    this.afterInit = [];
    this.rl.callNamedFunction("main");

    this.terminal = new Terminal(this.canvas, this.width, this.height);
    this.terminal.update = this.terminalUpdate.bind(this);

    for (const pending of this.afterInit.splice(0)) pending(this.terminal);
  }

  async start() {
    let count = 0;
    this.running = true;
    const activated = new Set<string>();

    while (this.running) {
      activated.clear();
      let fired = false;

      for (const sys of this.rl.systems) {
        if (this.trySystem(sys)) {
          activated.add(sys.name);
          fired = true;
        }
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
          console.warn("Suspected infinite loop.", activated);
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
    if (!sys.enabled) return;

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
        const shift = this.terminal.isKeyDown(Key.VK_SHIFT_LEFT);
        const ctrl = this.terminal.isKeyDown(Key.VK_CONTROL_LEFT);
        const alt = this.terminal.isKeyDown(Key.VK_ALT_LEFT);

        for (const [key, input] of this.terminal.keys.keys.inputs) {
          if (metaKeys.includes(key)) continue;

          if (input.isPressed())
            return resolve(new RLKeyEvent(key, shift, ctrl, alt));
        }

        requestAnimationFrame(handler);
      };
      requestAnimationFrame(handler);
    });
  }
}
