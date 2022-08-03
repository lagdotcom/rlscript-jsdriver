import TSCompiler, {
  CannotResolveError,
  RedefinitionError,
  UnknownTypeError,
} from "../src/tscompiler";

import { ASTProgram } from "../src/ast";
import { getParser } from "../src/parser";

function getCompiler(src: string) {
  const p = getParser();
  p.feed(src);

  const c = new TSCompiler();
  c.feed(p.results[0] as ASTProgram);

  return c;
}

test("detect undeclared types", () => {
  const c = getCompiler("component Broken thing: DoesntExist end");
  expect(() => c.generateImplTypes()).toThrow(UnknownTypeError);
});

test("detect missing members", () => {
  const c = getCompiler("fn handle(e: KeyEvent) e.something = 3 end");
  expect(() => c.getFunctions()).toThrow(CannotResolveError);
});

test("detect name reuse", () => {
  expect(() => getCompiler("tag a fn a() end")).toThrow(RedefinitionError);
});

test("escape reserved words in TS", () => {
  const c = getCompiler(`
  tag class tag extends tag do
  component super void: extends end
  fn case(default: class)
    default = "hello"
  end
  system break(throw: super, do)
    throw.void = do
  end`);

  const types = c.generateImplTypes();
  expect(types).toEqual(expect.not.stringContaining("export type super"));
  expect(types).toEqual(expect.not.stringContaining("void: extends"));
  expect(types).toEqual(expect.not.stringContaining("RLComponent = super"));

  const tags = c.getTagTypes();
  expect(tags).toEqual(expect.not.stringContaining("const do ="));

  const fns = c.getFunctions();
  expect(fns).toEqual(expect.not.stringContaining("function case"));
  expect(fns).toEqual(expect.not.stringContaining("default: class"));
  expect(fns).toEqual(expect.not.stringContaining(" default ="));

  const sys = c.getSystems();
  expect(sys).toEqual(expect.not.stringContaining("function break"));
  expect(sys).toEqual(expect.not.stringContaining("throw: super"));
  expect(sys).toEqual(expect.not.stringContaining(" throw."));
  expect(sys).toEqual(expect.not.stringContaining(" .void ="));
  expect(sys).toEqual(expect.not.stringContaining(" = finally"));
});
