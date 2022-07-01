// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var sqstring: any;
declare var dqstring: any;
declare var number: any;
declare var word: any;
declare var ws: any;
declare var comment: any;

const val = ([tok]: NearleyToken[]) => tok.value;

import moo from 'moo';

const lexer = moo.compile({
    ws:         { match: /[ \t\n\r]+/, lineBreaks: true },
    comment:    { match: /;[^\n]*\n/, lineBreaks: true },
    number:     /[0-9]+/,
    sqstring:   /'.*?'/,
    dqstring:   /".*?"/,
    word: {
        match: /[a-zA-Z][a-zA-Z0-9_]*/,
    },

    colon: ":",
    comma: ",",
    lp: "(",
    rp: ")",
    dot: ".",
    plusequals: "+=",
    equals: "=",
    minus: "-",
});

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "document", "symbols": ["_", "program"], "postprocess": ([,prog]) => prog},
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "declp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": id},
    {"name": "declp", "symbols": ["decl", "_"], "postprocess": id},
    {"name": "decl", "symbols": ["componentdecl"], "postprocess": id},
    {"name": "decl", "symbols": ["tagdecl"], "postprocess": id},
    {"name": "decl", "symbols": ["systemdecl"], "postprocess": id},
    {"name": "decl", "symbols": ["fndecl"], "postprocess": id},
    {"name": "componentdecl", "symbols": [{"literal":"component"}, "__", "name", "_", "fieldlist", {"literal":"end"}], "postprocess": ([,,name,,fields]) => ({ _: 'component', name: name.value, fields })},
    {"name": "tagdecl", "symbols": [{"literal":"tag"}, "__", "name"], "postprocess": ([,,name]) => ({ _: 'tag', name: name.value })},
    {"name": "systemdecl", "symbols": [{"literal":"system"}, "__", "name", "_", "paramlist", "_", "code", {"literal":"end"}], "postprocess": ([,,name,,params,,code]) => ({ _: 'system', name, params, code })},
    {"name": "fndecl", "symbols": [{"literal":"fn"}, "__", "name", "_", "paramlist", "_", "code", {"literal":"end"}], "postprocess": ([,,name,,params,,code]) => ({ _: 'fn', name, params, code })},
    {"name": "fieldlist$ebnf$1", "symbols": []},
    {"name": "fieldlist$ebnf$1", "symbols": ["fieldlist$ebnf$1", "fieldp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fieldlist", "symbols": ["fieldlist$ebnf$1"], "postprocess": id},
    {"name": "fieldp", "symbols": ["field", "_"], "postprocess": id},
    {"name": "field", "symbols": ["name", "_", {"literal":":"}, "_", "type"], "postprocess": ([name,,,,type]) => ({ _: 'field', name: name.value, type: type.value })},
    {"name": "paramlist", "symbols": [{"literal":"("}, "_", "params", "_", {"literal":")"}], "postprocess": ([,,params]) => params},
    {"name": "params", "symbols": [], "postprocess": () => []},
    {"name": "params", "symbols": ["param"]},
    {"name": "params", "symbols": ["params", "_", {"literal":","}, "_", "param"], "postprocess": ([params,,,,param]) => params.concat(param)},
    {"name": "param", "symbols": ["field"], "postprocess": id},
    {"name": "param", "symbols": ["type"], "postprocess": ([type]) => ({ _: 'constraint', type: type.value })},
    {"name": "code$ebnf$1", "symbols": []},
    {"name": "code$ebnf$1", "symbols": ["code$ebnf$1", "stmtp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "code", "symbols": ["code$ebnf$1"], "postprocess": id},
    {"name": "stmtp", "symbols": ["stmt", "_"], "postprocess": id},
    {"name": "stmt", "symbols": ["call"], "postprocess": id},
    {"name": "stmt", "symbols": ["assignment"], "postprocess": id},
    {"name": "call", "symbols": ["qname", "arglist"], "postprocess": ([name,args]) => ({ _: 'call', name, args })},
    {"name": "assignment", "symbols": ["qname", "_", "assignop", "_", "expr"], "postprocess": ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr })},
    {"name": "assignop", "symbols": [{"literal":"="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"+="}], "postprocess": val},
    {"name": "arglist", "symbols": [{"literal":"("}, "_", "args", "_", {"literal":")"}], "postprocess": ([,,args,,]) => args},
    {"name": "args", "symbols": [], "postprocess": () => []},
    {"name": "args", "symbols": ["arg"]},
    {"name": "args", "symbols": ["args", "_", {"literal":","}, "_", "arg"], "postprocess": ([args,,,,arg]) => args.concat(arg)},
    {"name": "arg", "symbols": ["expr"], "postprocess": id},
    {"name": "expr", "symbols": ["qname"], "postprocess": id},
    {"name": "expr", "symbols": ["matchexpr"], "postprocess": id},
    {"name": "expr", "symbols": ["ecall"], "postprocess": id},
    {"name": "expr", "symbols": ["value"], "postprocess": id},
    {"name": "expr", "symbols": ["unary"], "postprocess": id},
    {"name": "ecall", "symbols": ["name", "arglist"], "postprocess": ([name,args]) => ({ _: 'call', name, args })},
    {"name": "unary", "symbols": ["unaryop", "value"], "postprocess": ([op,value]) => ({ _: 'unary', op, value })},
    {"name": "unaryop", "symbols": [{"literal":"-"}], "postprocess": val},
    {"name": "value", "symbols": [(lexer.has("sqstring") ? {type: "sqstring"} : sqstring)], "postprocess": ([tok]) => ({ _: 'char', value: tok.value[1] })},
    {"name": "value", "symbols": [(lexer.has("dqstring") ? {type: "dqstring"} : dqstring)], "postprocess": ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) })},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([tok]) => ({ _: 'number', value: Number(tok.value) })},
    {"name": "matchexpr", "symbols": [{"literal":"match"}, "__", "expr", "_", "matchlist", "_", {"literal":"end"}], "postprocess": ([,,expr,,matches]) => ({ _: 'match', expr, matches })},
    {"name": "matchlist", "symbols": ["match"]},
    {"name": "matchlist", "symbols": ["matchlist", "_", "match"], "postprocess": ([matches,,match]) => matches.concat(match)},
    {"name": "match", "symbols": ["expr", "_", {"literal":"="}, "_", "expr"], "postprocess": ([expr,,,,value]) => ({ _: 'case', expr, value })},
    {"name": "qname", "symbols": ["name"], "postprocess": ([name]) => ({ _: 'qname', chain: [name.value] })},
    {"name": "qname", "symbols": ["qname", {"literal":"."}, "name"], "postprocess": ([qname,,name]) => ({ ...qname, chain: qname.chain.concat(name.value) })},
    {"name": "type", "symbols": ["name"], "postprocess": id},
    {"name": "name", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([tok]) => ({ _: 'id', value: tok.value })},
    {"name": "_", "symbols": ["ws"], "postprocess": () => null},
    {"name": "_", "symbols": ["comment"], "postprocess": () => null},
    {"name": "_", "symbols": [], "postprocess": () => null},
    {"name": "__", "symbols": ["ws"], "postprocess": () => null},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "comment", "symbols": ["_", (lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": () => null}
  ],
  ParserStart: "document",
};

export default grammar;
