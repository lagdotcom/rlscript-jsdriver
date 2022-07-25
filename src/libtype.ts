import {
  RLChar,
  RLEntity,
  RLGrid,
  RLInt,
  RLStr,
  RLSystem,
  RLTag,
  RLTemplate,
  RLTile,
  RLXY,
} from "./RL";
import { RLComponent } from "./implTypes";

type libtype = {
  abs(n: RLInt): number;
  add(...args: (RLComponent | RLTag)[]): void;
  draw(x: RLInt, y: RLInt, ch: RLChar, fg?: RLStr, bg?: RLStr): void;
  drawGrid(g: RLGrid<RLTile>): void;
  find(...args: (RLComponent | RLTag)[]): RLEntity | undefined;
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
  log(message: RLStr): void;
  pushKeyHandler(handler: RLSystem): void;
  randInt(min: RLInt, max: RLInt): void;
  remove(e: RLEntity): void;
  setSize(width: RLInt, height: RLInt): void;
  spawn(...args: (RLComponent | RLTag | RLTemplate)[]): RLEntity;
};
export default libtype;
