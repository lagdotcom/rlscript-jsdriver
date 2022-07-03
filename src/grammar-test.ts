import { getParser } from "./parser";
import { readFileSync } from "fs";

const parser = getParser();
const src = readFileSync("./rlsrc/week1.rlscript", { encoding: "utf-8" });
parser.feed(src);

if (parser.results.length === 0) console.error("No possible parsings.");
else {
  console.dir(parser.results[0], { depth: Infinity });
  if (parser.results.length > 1)
    console.warn(`Amibiguous: ${parser.results.length} possible parsings.`);
}
