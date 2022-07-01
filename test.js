const { readFileSync } = require("fs");
const nearley = require("nearley");
const grammar = require("./src/grammar.js");

const parser = new nearley.Parser(grammar);
const src = readFileSync("./week1.rl", { encoding: "utf-8" });
parser.feed(src);

if (parser.results === 0) console.error("No possible parsings.");
else {
  console.dir(parser.results[0], { depth: Infinity });
  if (parser.results > 1)
    console.warn(`Amibiguous: ${parser.results.length} possible parsings.`);
}
