import RLSystemParam from "./RLSystemParam";

export default function isConstraint(p: RLSystemParam) {
  return [
    "Appearance",
    "OldPosition",
    "Position",
    "MoveAction",
    "MeleeAction",
    "ItemAction",
    "Actor",
    "Fighter",
    "Consumable",
    "Inventory",
    "InventoryActionConfig",
    "TargetingActionConfig",
    "IsBlocker",
    "IsPlayer",
    "RecalculateFOV",
    "RedrawMe",
    "RedrawUI",
    "MyTurn",
    "BaseAI",
    "HostileEnemy",
    "WaitAction",
    "HistoryAction",
    "Item",
    "PickupAction",
    "InventoryAction",
    "DropAction",
    "LookAction",
  ].includes(p.typeName);
}
