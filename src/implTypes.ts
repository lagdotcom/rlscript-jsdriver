export type Appearance = {
  type: "component";
  typeName: "Appearance";
  ch: string;
  fg: string;
  bg: string;
};
export type OldPosition = {
  type: "component";
  typeName: "OldPosition";
  x: number;
  y: number;
};
export type Position = {
  type: "component";
  typeName: "Position";
  x: number;
  y: number;
};
export type MoveAction = {
  type: "component";
  typeName: "MoveAction";
  x: number;
  y: number;
};
export type RLComponent = Appearance | OldPosition | Position | MoveAction;
export type RLComponentName = RLComponent["typeName"];
export type RLTagName = "IsPlayer";
