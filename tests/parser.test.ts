import { ASTProgram } from "../src/ast";
import { getParser } from "../src/parser";

function valid(src: string, ...check: ASTProgram) {
  const p = getParser();
  p.feed(src);

  expect(p.results.length).toBe(1);
  expect(p.results[0]).toStrictEqual(check);
}

test("valid component", () => {
  valid("component thing a: int end", {
    _: "component",
    name: "thing",
    fields: [{ _: "field", name: "a", type: "int" }],
  });
});

test("valid tag", () => {
  valid("tag yo", { _: "tag", name: "yo" });
});

test("invalid tag (no name)", () => {
  const p = getParser();
  p.feed("tag");

  expect(p.results.length).toBe(0);
});

test("valid system", () => {
  valid("system something (e: entity, IsCool) end", {
    _: "system",
    name: "something",
    params: [
      { _: "field", name: "e", type: "entity" },
      { _: "constraint", type: "IsCool" },
    ],
    code: [],
  });
});

test("valid fn", () => {
  valid("fn something(a: int) end", {
    _: "fn",
    name: "something",
    params: [{ _: "field", name: "a", type: "int" }],
    code: [],
  });
});

test("some calls", () => {
  valid('fn test() call(3) another("one") call(-4) end', {
    _: "fn",
    name: "test",
    params: [],
    code: [
      {
        _: "call",
        name: { _: "qname", chain: ["call"] },
        args: [{ _: "int", value: 3 }],
      },
      {
        _: "call",
        name: { _: "qname", chain: ["another"] },
        args: [{ _: "str", value: "one" }],
      },
      {
        _: "call",
        name: { _: "qname", chain: ["call"] },
        args: [{ _: "unary", op: "-", value: { _: "int", value: 4 } }],
      },
    ],
  });
});
