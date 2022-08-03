import {
  RLChar,
  RLEntity,
  RLFloat,
  RLGrid,
  RLInt,
  RLStr,
  RLSystem,
  RLTag,
  RLTemplate,
  RLTile,
  RLXY,
} from "./RL";
import MessageLog from "./MessageLog";
import { RLComponent } from "./implTypes";

type libtype = {
  abs(n: RLInt): number;
  add(...args: (RLComponent | RLTag)[]): void;
  debug(message: RLStr): void;
  draw(x: RLInt, y: RLInt, s: RLChar | RLStr, fg?: RLStr, bg?: RLStr): void;
  drawLog(
    log: MessageLog,
    x: RLInt,
    y: RLInt,
    width: RLInt,
    height: RLInt
  ): void;
  drawGrid(g: RLGrid<RLTile>): void;
  find(...args: (RLComponent | RLTag)[]): RLEntity | undefined;
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
  pushKeyHandler(handler: RLSystem): void;
  randInt(min: RLInt, max: RLInt): void;
  remove(e: RLEntity): void;
  repeat(ch: RLChar | RLStr, amount: RLInt): string;
  setSize(width: RLInt, height: RLInt): void;
  spawn(...args: (RLComponent | RLTag | RLTemplate)[]): RLEntity;
};
export default libtype;
