import { Grammar, Parser } from "nearley";
import grammar from "./grammar";

export function getParser() {
  return new Parser(grammar as unknown as Grammar);
}
