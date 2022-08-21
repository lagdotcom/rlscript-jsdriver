import { getParser } from "./parser";
import { readFileSync } from "fs";

const parser = getParser();
const src = readFileSync("./rlsrc/part12.rlscript", { encoding: "utf-8" });
parser.feed(src);

if (parser.results.length === 0) console.error("No possible parsings.");
else {
  for (const result of parser.results) console.dir(result, { depth: Infinity });
  if (parser.results.length > 1)
    console.warn(`Amibiguous: ${parser.results.length} possible parsings.`);
}
