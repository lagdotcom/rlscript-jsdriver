import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import { readFileSync } from "fs";

const parser = new Parser(grammar as unknown as Grammar);
const src = readFileSync("./week1.rl", { encoding: "utf-8" });
parser.feed(src);

if (parser.results.length === 0) console.error("No possible parsings.");
else {
  console.dir(parser.results[0], { depth: Infinity });
  if (parser.results.length > 1)
    console.warn(`Amibiguous: ${parser.results.length} possible parsings.`);
}
