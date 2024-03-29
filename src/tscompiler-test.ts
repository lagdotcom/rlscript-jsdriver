import { ASTProgram } from "./ast";
import TSCompiler from "./tscompiler";
import { getParser } from "./parser";
import { readFileSync } from "fs";

const parser = getParser();
const src = readFileSync("./rlsrc/part13.rlscript", { encoding: "utf-8" });
parser.feed(src);

if (parser.results.length === 0) console.error("No possible parsings.");
else {
  if (parser.results.length > 1)
    console.warn(`Amibiguous: ${parser.results.length} possible parsings.`);

  const compiler = new TSCompiler();
  compiler.feed(parser.results[0] as ASTProgram);
  compiler.writeAll("src");
}
