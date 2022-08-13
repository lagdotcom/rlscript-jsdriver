import RLBag from "./RLBag";
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
export type ItemAction = {
  type: "component";
  typeName: "ItemAction";
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
export type Consumable = {
  type: "component";
  typeName: "Consumable";
  activate: CallableFunction;
  power: number;
  range: number;
};
export type Inventory = {
  type: "component";
  typeName: "Inventory";
  items: RLBag;
};
export type InventoryActionConfig = {
  type: "component";
  typeName: "InventoryActionConfig";
  callback: CallableFunction;
};
export type TargetingActionConfig = {
  type: "component";
  typeName: "TargetingActionConfig";
  callback: CallableFunction;
};
export type RLComponent =
  | Appearance
  | OldPosition
  | Position
  | MoveAction
  | MeleeAction
  | ItemAction
  | Actor
  | Fighter
  | Consumable
  | Inventory
  | InventoryActionConfig
  | TargetingActionConfig;
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
  | "WaitAction"
  | "HistoryAction"
  | "Item"
  | "PickupAction"
  | "InventoryAction"
  | "DropAction"
  | "LookAction";
