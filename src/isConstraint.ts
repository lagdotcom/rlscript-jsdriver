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
  ].includes(p.typeName);
}
