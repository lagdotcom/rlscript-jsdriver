import RLChar from "./RLChar";
import { RLComponent } from "./implTypes";
import RLEntity from "./RLEntity";
import RLFloat from "./RLFloat";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLInt from "./RLInt";
import RLKeyEvent from "./RLKeyEvent";
import RLMouseEvent from "./RLMouseEvent";
import RLRect from "./RLRect";
import RLStr from "./RLStr";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";

type RLObject =
  | RLChar
  | RLComponent
  | RLEntity
  | RLFn
  | RLGrid<unknown>
  | RLInt
  | RLFloat
  | RLKeyEvent
  | RLMouseEvent
  | RLRect
  | RLStr
  | RLSystem
  | RLTag
  | RLTemplate
  | RLTile
  | RLXY;
export default RLObject;
