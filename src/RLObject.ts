import RLBag from "./RLBag";
import RLChar from "./RLChar";
import { RLComponent } from "./implTypes";
import RLEntity from "./RLEntity";
import RLFloat from "./RLFloat";
import RLFn from "./RLFn";
import RLGrid from "./RLGrid";
import RLInt from "./RLInt";
import RLKeyEvent from "./RLKeyEvent";
import RLMessages from "./RLMessages";
import RLMouseEvent from "./RLMouseEvent";
import RLRect from "./RLRect";
import RLStr from "./RLStr";
import RLSystem from "./RLSystem";
import RLTag from "./RLTag";
import RLTemplate from "./RLTemplate";
import RLTile from "./RLTile";
import RLXY from "./RLXY";

type RLObject =
  | RLBag
  | RLChar
  | RLComponent
  | RLEntity
  | RLFn
  | RLGrid<unknown>
  | RLInt
  | RLFloat
  | RLKeyEvent
  | RLMessages
  | RLMouseEvent
  | RLRect
  | RLStr
  | RLSystem
  | RLTag
  | RLTemplate
  | RLTile
  | RLXY;
export default RLObject;
