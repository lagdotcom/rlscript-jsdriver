import RLEntity from "./RLEntity";

export type Appearance = {
  type: "component";
  typeName: "Appearance";
  name: string;
  ch: string;
  fg: string;
  bg: string;
  layer: number;
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
export type MeleeAction = {
  type: "component";
  typeName: "MeleeAction";
  target: RLEntity;
};
export type Actor = {
  type: "component";
  typeName: "Actor";
  energy: number;
};
export type Fighter = {
  type: "component";
  typeName: "Fighter";
  maxHp: number;
  hp: number;
  defence: number;
  power: number;
};
export type RLComponent =
  | Appearance
  | OldPosition
  | Position
  | MoveAction
  | MeleeAction
  | Actor
  | Fighter;
export type RLComponentName = RLComponent["typeName"];
export type RLTagName =
  | "IsBlocker"
  | "IsPlayer"
  | "RecalculateFOV"
  | "RedrawMe"
  | "RedrawUI"
  | "MyTurn"
  | "BaseAI"
  | "HostileEnemy"
  | "WaitAction";
