import { RLComponent } from "./implTypes";
import RLTag from "./RLTag";

type RLTemplate = {
  type: "template";
  name: string;
  get: () => (RLTag | RLComponent | RLTemplate)[];
};
export default RLTemplate;
