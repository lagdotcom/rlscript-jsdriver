import { RLComponentName, RLTagName } from "./implTypes";

import RLObject from "./RLObject";

type RLObjectType = RLObject["type"] | RLComponentName | RLTagName;
export default RLObjectType;
