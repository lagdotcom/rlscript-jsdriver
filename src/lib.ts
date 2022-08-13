import { ComputeVisibility, ShadowCastingGrid } from "./RecursiveShadowCasting";
import { RLComponent, RLComponentName } from "./implTypes";

import Game from "./Game";
import RL from "./RL";
import RLBag from "./RLBag";
import RLChar from "./RLChar";
import RLEntity from "./RLEntity";
import RLFloat from "./RLFloat";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLInt from "./RLInt";
import RLLibrary from "./RLLibrary";
import RLMessages from "./RLMessages";
import RLObject from "./RLObject";
import RLStr from "./RLStr";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";
import { TinyColor } from "tinycolor-ts";

function setSize({ value: width }: RLInt, { value: height }: RLInt) {
  Game.instance.width = width;
  Game.instance.height = height;
}

function spawn(...args: (RLComponent | RLTag | RLTemplate)[]) {
  const e = new RLEntity();
  for (const a of args) e.add(a);

  Game.instance.rl.entities.set(e.id, e);
  return e;
}

function pushKeyHandler(handler: RLSystem) {
  Game.instance.rl.keyHandlers.push(handler);
}

function getColour(s?: RLStr) {
  return s ? new TinyColor(s.value).toNumber() << 8 : undefined;
}

function draw(
  { value: x }: RLInt,
  { value: y }: RLInt,
  display: RLChar | RLStr,
  fg?: RLStr,
  bg?: RLStr
) {
  const f = getColour(fg);
  const b = getColour(bg);

  if (display.type === "char")
    Game.instance.terminal.drawChar(x, y, display.value, f, b);
  else Game.instance.terminal.drawString(x, y, display.value, f, b);
}

function drawGrid(g: RLGrid<RLTile>) {
  for (let y = 0; y < g.height; y++) {
    for (let x = 0; x < g.width; x++) {
      const t = g.at(x, y);
      if (t)
        draw(
          { type: "int", value: x },
          { type: "int", value: y },
          { type: "char", value: t.ch },
          { type: "str", value: "silver" }
        );
    }
  }
}

function randInt({ value: min }: RLInt, { value: max }: RLInt) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

function getFOV(
  tiles: RLGrid<RLTile>,
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: radius }: RLInt,
  visible: RLGrid<boolean>,
  explored: RLGrid<boolean>
) {
  visible.fill(visible.empty);

  const grid = new ShadowCastingGrid(
    tiles.width,
    tiles.height,
    (x, y) => !tiles.at(x, y)?.transparent
  );
  ComputeVisibility(grid, { x, y }, radius);

  for (const pos of grid.values.keys()) {
    visible.put(pos.x, pos.y, true);
    explored.put(pos.x, pos.y, true);
  }
}

function add(...args: (RLComponent | RLTag)[]) {
  for (const a of args) {
    for (const e of RL.instance.entities.values()) e.add(a);
  }
}

function find(...args: (RLComponent | RLComponentName | RLTag)[]) {
  for (const e of RL.instance.entities.values()) {
    let success = true;

    for (const a of args) {
      if (typeof a === "string") {
        if (!e.has(a)) {
          success = false;
          break;
        }

        continue;
      }

      if (!e.has(a.typeName)) {
        success = false;
        break;
      }

      if (a.type === "component") {
        const check = e.get(a.typeName) as RLComponent;

        for (const [key, val] of Object.entries(a)) {
          // TODO figure this out
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (val !== check[key]) {
            success = false;
            break;
          }
        }
      }
    }

    if (success) return e;
  }
}

function abs(n: RLInt | RLFloat) {
  return Math.abs(n.value);
}

const offsets: RLXY[] = [
  new RLXY(1, 0),
  new RLXY(0, 1),
  new RLXY(-1, 0),
  new RLXY(0, -1),
];
function getNextMove(
  map: RLGrid<RLTile>,
  blockedMap: RLGrid<unknown>,
  src: RLXY,
  dst: RLXY
): RLXY | undefined {
  const cost = new RLGrid(map.width, map.height, Infinity);
  const from = new RLGrid<RLXY | undefined>(map.width, map.height, undefined);
  cost.put(src.x, src.y, 0);
  const queue: RLXY[] = [src];
  let best = Infinity;

  while (queue.length) {
    const centre = queue.shift() as RLXY;
    const newCost = cost.at(centre.x, centre.y) + 1;
    if (best < newCost) continue;

    for (const o of offsets) {
      const pos = centre.plus(o);
      if (pos.equals(dst)) {
        best = newCost;
        cost.put(pos.x, pos.y, newCost);
        from.put(pos.x, pos.y, centre);
        break;
      }

      const tile = map.at(pos.x, pos.y);
      const canWalk = tile?.walkable;
      const blocked = blockedMap.at(pos.x, pos.y);
      const oldCost = cost.at(pos.x, pos.y);

      if (canWalk && !blocked && oldCost > newCost) {
        cost.put(pos.x, pos.y, newCost);
        from.put(pos.x, pos.y, centre);
        queue.push(pos);
      }
    }
  }

  if (cost.at(dst.x, dst.y) === Infinity) return;
  const path: RLXY[] = [];
  let at = dst;
  while (!at.equals(src)) {
    path.unshift(at);
    const next = from.at(at.x, at.y);
    if (!next) break;

    at = next;
  }

  return path[0];
}

function join(
  { value: glue }: RLChar | RLStr,
  ...parts: (RLChar | RLStr | RLInt)[]
): string {
  return parts
    .map((p) => {
      switch (p.type) {
        case "char":
        case "str":
          return p.value;

        case "int":
          return p.value.toString();
      }
    })
    .join(glue);
}

function debug(...args: RLObject[]) {
  console.log(
    ...args.map((arg) => {
      if (
        arg.type === "char" ||
        arg.type === "float" ||
        arg.type === "int" ||
        arg.type === "str"
      )
        return arg.value;

      return arg;
    })
  );
}

function remove(e: RLEntity) {
  RL.instance.entities.delete(e.id);
}

function floor({ value }: RLInt | RLFloat) {
  return Math.floor(value);
}

function repeat({ value: ch }: RLChar | RLStr, { value: count }: RLInt) {
  let s = "";
  for (let i = 0; i < count; i++) s += ch;

  return s;
}

function drawLog(
  log: RLMessages,
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: width }: RLInt,
  { value: height }: RLInt,
  offset?: RLInt
) {
  log.render(
    Game.instance.terminal,
    x,
    y,
    width,
    height,
    offset ? offset.value : 0
  );
}

function pushMouseHandler(handler: RLSystem) {
  Game.instance.rl.mouseHandlers.push(handler);
}

function popKeyHandler() {
  Game.instance.rl.keyHandlers.pop();
}

function popMouseHandler() {
  Game.instance.rl.mouseHandlers.pop();
}

function clamp(
  { value }: RLInt | RLFloat,
  { value: min }: RLInt | RLFloat,
  { value: max }: RLInt | RLFloat
) {
  return value < min ? min : value > max ? max : value;
}

function clear() {
  Game.instance.terminal.clear();
}

function drawBox(
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: width }: RLInt,
  { value: height }: RLInt,
  fg?: RLStr,
  bg?: RLStr
) {
  Game.instance.terminal.drawSingleBox(
    x,
    y,
    width,
    height,
    getColour(fg),
    getColour(bg)
  );
}

function drawBag(
  bag: RLBag,
  { value: title }: RLStr,
  getName: RLFn,
  titleColour?: RLStr,
  itemColour?: RLStr,
  borderColour?: RLStr,
  bgColour?: RLStr
) {
  const items = Array.from(bag.items.entries())
    .map(
      ([key, e]) =>
        `(${key}) ${getName.apply([{ type: "positional", value: e }])}`
    )
    .sort();
  const width = Math.max(title.length, ...items.map((n) => n.length)) + 4;
  const height = items.length + 4;

  const x = Math.floor((Game.instance.width - width) / 2);
  const y = Math.floor((Game.instance.height - height) / 2);

  const tc = getColour(titleColour);
  const ic = getColour(itemColour);
  const bc = getColour(borderColour);
  const bg = getColour(bgColour);

  const term = Game.instance.terminal;
  term.fillRect(x, y, width, height, " ", ic, bg);
  term.drawSingleBox(x, y, width, height, bc);
  term.drawString(x + 2, y + 1, title, tc);

  for (let i = 0; i < items.length; i++)
    term.drawString(x + 2, y + i + 3, items[i], ic);
}

function sqrt({ value }: RLInt | RLFloat) {
  return Math.sqrt(value);
}

const lib: RLLibrary = {
  abs,
  add,
  clamp,
  clear,
  debug,
  draw,
  drawBag,
  drawBox,
  drawLog,
  drawGrid,
  find,
  floor,
  getFOV,
  getNextMove,
  join,
  popKeyHandler,
  popMouseHandler,
  pushKeyHandler,
  pushMouseHandler,
  randInt,
  remove,
  repeat,
  setSize,
  spawn,
  sqrt,
};
export default lib;
