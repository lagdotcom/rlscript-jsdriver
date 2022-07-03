import { ASTProgram } from "../src/ast";
import TSCompiler, {
  CannotResolveError,
  RedefinitionError,
  UnknownTypeError,
} from "../src/tscompiler";
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
  tag class tag extends tag if
  component return else: extends end
  fn case(default: class)
    default = "hello"
  end
  system break(throw: return, if)
    throw.else = if
  end`);

  const types = c.generateImplTypes();
  expect(types).toEqual(expect.not.stringContaining("export type return"));
  expect(types).toEqual(expect.not.stringContaining("else: extends"));
  expect(types).toEqual(expect.not.stringContaining("RLComponent = return"));

  const tags = c.getTagTypes();
  expect(tags).toEqual(expect.not.stringContaining("const if ="));

  const fns = c.getFunctions();
  expect(fns).toEqual(expect.not.stringContaining("function case"));
  expect(fns).toEqual(expect.not.stringContaining("default: class"));
  expect(fns).toEqual(expect.not.stringContaining(" default ="));

  const sys = c.getSystems();
  expect(sys).toEqual(expect.not.stringContaining("function break"));
  expect(sys).toEqual(expect.not.stringContaining("throw: return"));
  expect(sys).toEqual(expect.not.stringContaining(" throw."));
  expect(sys).toEqual(expect.not.stringContaining(" .else ="));
  expect(sys).toEqual(expect.not.stringContaining(" = if"));
});
