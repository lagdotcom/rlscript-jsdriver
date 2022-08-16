import RLSystemParam from "./RLSystemParam";

export default function isConstraint(p: RLSystemParam) {
  return [
    "Appearance",
    "OldPosition",
    "Position",
    "MoveAction",
    "MeleeAction",
    "Actor",
    "Fighter",
    "Consumable",
    "Inventory",
    "InventoryActionConfig",
    "TargetingActionConfig",
    "TargetingItemConfig",
    "ConfusedEnemy",
    "IsBlocker",
    "IsPlayer",
    "RecalculateFOV",
    "RedrawMe",
    "RedrawUI",
    "MyTurn",
    "HostileEnemy",
    "WaitAction",
    "HistoryAction",
    "Item",
    "PickupAction",
    "InventoryAction",
    "DropAction",
    "LookAction",
    "QuitAction",
  ].includes(p.typeName);
}
