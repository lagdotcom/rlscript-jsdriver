import { RLComponent, RLComponentName } from "./implTypes";

import RLBag from "./RLBag";
import RLChar from "./RLChar";
import RLEntity from "./RLEntity";
import RLFloat from "./RLFloat";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLInt from "./RLInt";
import RLMessages from "./RLMessages";
import RLObject from "./RLObject";
import RLStr from "./RLStr";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";

type RLLibrary = {
  abs(n: RLInt | RLFloat): number;
  add(...args: (RLComponent | RLTag)[]): void;
  canLoadGame(): boolean;
  clamp(
    value: RLInt | RLFloat,
    min: RLInt | RLFloat,
    max: RLInt | RLFloat
  ): number;
  clear(): void;
  clearHandlers(): void;
  clearRect(
    x: RLInt,
    y: RLInt,
    width: RLInt,
    height: RLInt,
    fg?: RLStr,
    bg?: RLStr
  ): void;
  debug(...args: RLObject[]): void;
  draw(x: RLInt, y: RLInt, s: RLChar | RLStr, fg?: RLStr, bg?: RLStr): void;
  drawBag(
    bag: RLBag,
    title: RLStr,
    getName: RLFn,
    titleColour?: RLStr,
    itemColour?: RLStr,
    borderColour?: RLStr,
    bg?: RLStr
  ): void;
  drawBox(
    x: RLInt,
    y: RLInt,
    width: RLInt,
    height: RLInt,
    fg?: RLStr,
    bg?: RLStr
  ): void;
  drawCentred(
    x: RLInt,
    y: RLInt,
    s: RLChar | RLStr,
    fg?: RLStr,
    bg?: RLStr
  ): void;
  drawLog(
    log: RLMessages,
    x: RLInt,
    y: RLInt,
    width: RLInt,
    height: RLInt,
    offset?: RLInt
  ): void;
  drawGrid(g: RLGrid<RLTile>): void;
  find(
    ...args: (RLComponent | RLComponentName | RLTag)[]
  ): RLEntity | undefined;
  floor(x: RLInt | RLFloat): number;
  getFOV(
    tiles: RLGrid<RLTile>,
    x: RLInt,
    y: RLInt,
    radius: RLInt,
    visible: RLGrid<boolean>,
    explored: RLGrid<boolean>
  ): void;
  getNextMove(
    map: RLGrid<RLTile>,
    blockedMap: RLGrid<unknown>,
    src: RLXY,
    dst: RLXY
  ): RLXY | undefined;
  join(glue: RLChar | RLStr, ...parts: (RLChar | RLStr | RLInt)[]): string;
  loadGame(): void;
  lookup(eid: RLStr): RLEntity | undefined;
  persist(name: RLStr, obj: RLObject): void;
  popKeyHandler(): void;
  popMouseHandler(): void;
  pushKeyHandler(handler: RLSystem): void;
  pushMouseHandler(handler: RLSystem): void;
  randInt(min: RLInt, max: RLInt): number;
  remove(e: RLEntity): void;
  repeat(ch: RLChar | RLStr, amount: RLInt): string;
  saveGame(): void;
  setSize(width: RLInt, height: RLInt): void;
  spawn(...args: (RLComponent | RLTag | RLTemplate)[]): RLEntity;
  sqrt(n: RLInt | RLFloat): number;
};
export default RLLibrary;
