import RLBag from "./RLBag";
import RLEntity from "./RLEntity";
import RLTag from "./RLTag";

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
  xp: number;
};
export type Consumable = {
  type: "component";
  typeName: "Consumable";
  activate: CallableFunction;
  power: number;
  range: number;
  targeted: boolean;
  radius: number;
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
  radius: number;
};
export type TargetingItemConfig = {
  type: "component";
  typeName: "TargetingItemConfig";
  key: string;
  item: RLEntity;
};
export type ConfusedEnemy = {
  type: "component";
  typeName: "ConfusedEnemy";
  duration: number;
  old: RLTag;
};
export type Progress = {
  type: "component";
  typeName: "Progress";
  floor: number;
  level: number;
  formulaBase: number;
  formulaFactor: number;
};
export type Equippable = {
  type: "component";
  typeName: "Equippable";
  slot: Slot;
  power: number;
  defence: number;
};
export type Equipment = {
  type: "component";
  typeName: "Equipment";
  weapon: string;
  armour: string;
};
export type RLComponent =
  | Appearance
  | OldPosition
  | Position
  | MoveAction
  | MeleeAction
  | Actor
  | Fighter
  | Consumable
  | Inventory
  | InventoryActionConfig
  | TargetingActionConfig
  | TargetingItemConfig
  | ConfusedEnemy
  | Progress
  | Equippable
  | Equipment;
export type RLComponentName = RLComponent["typeName"];
export type RLTagName =
  | "IsBlocker"
  | "IsPlayer"
  | "RecalculateFOV"
  | "RedrawMe"
  | "RedrawUI"
  | "MyTurn"
  | "HostileEnemy"
  | "WaitAction"
  | "HistoryAction"
  | "Item"
  | "PickupAction"
  | "InventoryAction"
  | "DropAction"
  | "LookAction"
  | "QuitAction"
  | "TakeStairsAction"
  | "GainingLevel"
  | "CharacterInfoAction";
