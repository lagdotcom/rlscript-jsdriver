import { ComputeVisibility, ShadowCastingGrid } from "./RecursiveShadowCasting";

import Game from "./Game";
import MessageLog from "./MessageLog";
import RL from "./RL";
import RLChar from "./RLChar";
import { RLComponent } from "./implTypes";
import RLEntity from "./RLEntity";
import RLFloat from "./RLFloat";
import RLGrid from "./RLGrid";
import RLInt from "./RLInt";
import RLStr from "./RLStr";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";
import { TinyColor } from "tinycolor-ts";
import libtype from "./libtype";

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

function draw(
  { value: x }: RLInt,
  { value: y }: RLInt,
  display: RLChar | RLStr,
  fg?: RLStr,
  bg?: RLStr
) {
  const f = fg ? new TinyColor(fg.value).toNumber() << 8 : undefined;
  const b = bg ? new TinyColor(bg.value).toNumber() << 8 : undefined;

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

// TODO support "having a component" as a query part
function find(...args: (RLComponent | RLTag)[]) {
  for (const e of RL.instance.entities.values()) {
    let success = true;

    for (const a of args) {
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

function abs(n: RLInt) {
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

function debug({ value: message }: RLStr) {
  console.log(message);
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
  log: MessageLog,
  { value: x }: RLInt,
  { value: y }: RLInt,
  { value: width }: RLInt,
  { value: height }: RLInt
) {
  log.render(Game.instance.terminal, x, y, width, height);
}

const lib: libtype = {
  abs,
  add,
  debug,
  draw,
  drawLog,
  drawGrid,
  find,
  floor,
  getFOV,
  getNextMove,
  join,
  pushKeyHandler,
  randInt,
  remove,
  repeat,
  setSize,
  spawn,
};
export default lib;
