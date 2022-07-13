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
    sqstring:   /'.'/,
    dqstring:   /".*?"/,
    keywords:   ["else", "end", "false", "if", "not", "return", "true"],

    word: {
        match: /[a-zA-Z][a-zA-Z0-9_]*/,
    },

    colon: ":",
    comma: ",",
    lp: "(",
    rp: ")",
    dot: ".",
    plusequals: "+=",
    minusequals: "-=",
    timesequals: "*=",
    divideequals: "/=",
    expequals: "^=",
    equals: "=",
    plus: "+",
    minus: "-",
    times: "*",
    divide: "/",
    exp: "^",
    le: "<=",
    lt: "<",
    ge: ">=",
    gt: ">",
    qm: "?",
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
    {"name": "decl", "symbols": ["templatedecl"], "postprocess": id},
    {"name": "decl", "symbols": ["tiletypedecl"], "postprocess": id},
    {"name": "decl", "symbols": ["globaldecl"], "postprocess": id},
    {"name": "componentdecl", "symbols": [{"literal":"component"}, "__", "name", "_", "fieldlist", {"literal":"end"}], "postprocess": ([,,name,,fields]) => ({ _: 'component', name: name.value, fields })},
    {"name": "tagdecl", "symbols": [{"literal":"tag"}, "__", "name"], "postprocess": ([,,name]) => ({ _: 'tag', name: name.value })},
    {"name": "systemdecl", "symbols": [{"literal":"system"}, "__", "name", "_", "paramlist", "_", "code", {"literal":"end"}], "postprocess": ([,,name,,params,,code]) => ({ _: 'system', name: name.value, params, code })},
    {"name": "fndecl", "symbols": [{"literal":"fn"}, "__", "name", "_", "paramlist", "_", "code", {"literal":"end"}], "postprocess": ([,,name,,params,,code]) => ({ _: 'fn', name: name.value, params, code })},
    {"name": "templatedecl", "symbols": [{"literal":"template"}, "__", "name", "_", "templatelist", {"literal":"end"}], "postprocess": ([,,name,,fields]) => ({ _: 'template', name: name.value, fields })},
    {"name": "tiletypedecl", "symbols": [{"literal":"tiletype"}, "__", "name", "_", (lexer.has("sqstring") ? {type: "sqstring"} : sqstring), "_", "tiletypefieldlist", {"literal":"end"}], "postprocess": ([,,name,,char,,fields]) => ({ _: 'tiletype', name: name.value, char: char.value.slice(1, -1), fields })},
    {"name": "globaldecl", "symbols": [{"literal":"global"}, "__", "field"], "postprocess": ([,,field]) => ({ _: 'global', name: field.name, type: field.type })},
    {"name": "fieldlist$ebnf$1", "symbols": []},
    {"name": "fieldlist$ebnf$1", "symbols": ["fieldlist$ebnf$1", "fieldp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fieldlist", "symbols": ["fieldlist$ebnf$1"], "postprocess": id},
    {"name": "fieldp", "symbols": ["field", "__"], "postprocess": id},
    {"name": "field", "symbols": ["name", "_", {"literal":":"}, "_", "ntype"], "postprocess": ([name,,,,type]) => ({ _: 'field', name: name.value, type })},
    {"name": "paramlist", "symbols": [{"literal":"("}, "_", "params", "_", {"literal":")"}], "postprocess": ([,,params]) => params},
    {"name": "params", "symbols": [], "postprocess": () => []},
    {"name": "params", "symbols": ["param"]},
    {"name": "params", "symbols": ["params", "_", {"literal":","}, "_", "param"], "postprocess": ([params,,,,param]) => params.concat(param)},
    {"name": "param", "symbols": ["field"], "postprocess": id},
    {"name": "param", "symbols": ["type"], "postprocess": ([type]) => ({ _: 'constraint', type: type.value })},
    {"name": "templatelist$ebnf$1", "symbols": []},
    {"name": "templatelist$ebnf$1", "symbols": ["templatelist$ebnf$1", "templatefieldp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "templatelist", "symbols": ["templatelist$ebnf$1"], "postprocess": id},
    {"name": "templatefieldp", "symbols": ["templatefield", "_"], "postprocess": id},
    {"name": "templatefield", "symbols": ["name"], "postprocess": ([name]) => ({ _: 'tag', name })},
    {"name": "templatefield", "symbols": ["call"], "postprocess": id},
    {"name": "tiletypefieldlist$ebnf$1", "symbols": []},
    {"name": "tiletypefieldlist$ebnf$1", "symbols": ["tiletypefieldlist$ebnf$1", "tiletypefieldp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "tiletypefieldlist", "symbols": ["tiletypefieldlist$ebnf$1"], "postprocess": id},
    {"name": "tiletypefieldp", "symbols": ["tiletypefield", "__"], "postprocess": id},
    {"name": "tiletypefield", "symbols": ["name"], "postprocess": ([name]) => ({ _: 'flag', name: name.value })},
    {"name": "tiletypefield", "symbols": ["name", "_", {"literal":"="}, "_", "expr"], "postprocess": ([name,,,,expr]) => ({ _: 'field', name: name.value, expr })},
    {"name": "code$ebnf$1", "symbols": []},
    {"name": "code$ebnf$1", "symbols": ["code$ebnf$1", "stmtp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "code", "symbols": ["code$ebnf$1"], "postprocess": id},
    {"name": "stmtp", "symbols": ["stmt", "_"], "postprocess": id},
    {"name": "stmt", "symbols": ["call"], "postprocess": id},
    {"name": "stmt", "symbols": ["assignment"], "postprocess": id},
    {"name": "stmt", "symbols": ["local"], "postprocess": id},
    {"name": "stmt", "symbols": ["if"], "postprocess": id},
    {"name": "stmt", "symbols": ["return"], "postprocess": id},
    {"name": "stmt", "symbols": ["for"], "postprocess": id},
    {"name": "call", "symbols": ["qname", "arglist"], "postprocess": ([name,args]) => ({ _: 'call', name, args })},
    {"name": "assignment", "symbols": ["qname", "_", "assignop", "_", "expr"], "postprocess": ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr })},
    {"name": "assignop", "symbols": [{"literal":"="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"+="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"-="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"*="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"/="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"^="}], "postprocess": val},
    {"name": "local", "symbols": [{"literal":"local"}, "__", "field"], "postprocess": ([,,field]) => ({ _: 'local', name: field.name, type: field.type })},
    {"name": "local", "symbols": [{"literal":"local"}, "__", "field", "_", {"literal":"="}, "_", "expr"], "postprocess": ([,,field,,,,expr]) => ({ _: 'local', name: field.name, type: field.type, expr })},
    {"name": "if", "symbols": [{"literal":"if"}, "__", "expr", "_", "code", {"literal":"end"}], "postprocess": ([,,expr,,code]) => ({ _: 'if', expr, code })},
    {"name": "if", "symbols": [{"literal":"if"}, "__", "expr", "_", "code", "_", {"literal":"else"}, "_", "code", {"literal":"end"}], "postprocess": ([,,expr,,code,,,,code2]) => ({ _: 'if', expr, code, code2 })},
    {"name": "return", "symbols": [{"literal":"exit"}], "postprocess": () => ({ _: 'return' })},
    {"name": "return", "symbols": [{"literal":"return"}, "__", "expr"], "postprocess": ([,,expr]) => ({ _: 'return', expr })},
    {"name": "for", "symbols": [{"literal":"for"}, "__", "name", "_", {"literal":"="}, "_", "expr", "__", {"literal":"to"}, "__", "expr", "_", "code", {"literal":"end"}], "postprocess": ([,,name,,,,start,,,,end,,code]) => ({ _: 'for', name, start, end, code })},
    {"name": "arglist", "symbols": [{"literal":"("}, "_", "args", "_", {"literal":")"}], "postprocess": ([,,args,,]) => args},
    {"name": "args", "symbols": [], "postprocess": () => []},
    {"name": "args", "symbols": ["arg"]},
    {"name": "args", "symbols": ["args", "_", {"literal":","}, "_", "arg"], "postprocess": ([args,,,,arg]) => args.concat(arg)},
    {"name": "arg", "symbols": ["expr"], "postprocess": id},
    {"name": "expr", "symbols": ["maths"], "postprocess": id},
    {"name": "maths", "symbols": ["logic"], "postprocess": id},
    {"name": "logic", "symbols": ["logic", "_", "logicop", "_", "sum"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "logic", "symbols": ["sum"], "postprocess": id},
    {"name": "sum", "symbols": ["sum", "_", "sumop", "_", "product"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "sum", "symbols": ["product"], "postprocess": id},
    {"name": "product", "symbols": ["product", "_", "mulop", "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "product", "symbols": ["exp"], "postprocess": id},
    {"name": "exp", "symbols": ["unary", "_", "expop", "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "exp", "symbols": ["unary"], "postprocess": id},
    {"name": "unary", "symbols": [{"literal":"-"}, "number"], "postprocess": ([op,value]) => ({ _: 'unary', op: op.value, value })},
    {"name": "unary", "symbols": [{"literal":"not"}, "_", "value"], "postprocess": ([op,,value]) => ({ _: 'unary', op: op.value, value })},
    {"name": "unary", "symbols": ["value"], "postprocess": id},
    {"name": "logicop", "symbols": [{"literal":"and"}], "postprocess": val},
    {"name": "sumop", "symbols": [{"literal":"+"}], "postprocess": val},
    {"name": "sumop", "symbols": [{"literal":"-"}], "postprocess": val},
    {"name": "mulop", "symbols": [{"literal":"*"}], "postprocess": val},
    {"name": "mulop", "symbols": [{"literal":"/"}], "postprocess": val},
    {"name": "expop", "symbols": [{"literal":"^"}], "postprocess": val},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["nonnumber"], "postprocess": id},
    {"name": "value", "symbols": ["qname"], "postprocess": id},
    {"name": "value", "symbols": ["call"], "postprocess": id},
    {"name": "value", "symbols": ["matchexpr"], "postprocess": id},
    {"name": "nonnumber", "symbols": [(lexer.has("sqstring") ? {type: "sqstring"} : sqstring)], "postprocess": ([tok]) => ({ _: 'char', value: tok.value[1] })},
    {"name": "nonnumber", "symbols": [(lexer.has("dqstring") ? {type: "dqstring"} : dqstring)], "postprocess": ([tok]) => ({ _: 'str', value: tok.value.slice(1, -1) })},
    {"name": "nonnumber", "symbols": [{"literal":"true"}], "postprocess": () => ({ _: 'bool', value: true })},
    {"name": "nonnumber", "symbols": [{"literal":"false"}], "postprocess": () => ({ _: 'bool', value: false })},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([tok]) => ({ _: 'int', value: Number(tok.value) })},
    {"name": "matchexpr", "symbols": [{"literal":"match"}, "__", "expr", "_", "matchlist", "_", {"literal":"end"}], "postprocess": ([,,expr,,matches]) => ({ _: 'match', expr, matches })},
    {"name": "matchlist", "symbols": ["match"]},
    {"name": "matchlist", "symbols": ["matchlist", "_", "match"], "postprocess": ([matches,,match]) => matches.concat(match)},
    {"name": "match", "symbols": ["expr", "_", {"literal":"="}, "_", "expr"], "postprocess": ([expr,,,,value]) => ({ _: 'case', expr, value })},
    {"name": "qname", "symbols": ["name"], "postprocess": ([name]) => ({ _: 'qname', chain: [name.value] })},
    {"name": "qname", "symbols": ["qname", {"literal":"."}, "name"], "postprocess": ([qname,,name]) => ({ ...qname, chain: qname.chain.concat(name.value) })},
    {"name": "ntype", "symbols": ["type"], "postprocess": ([name]) => ({ _: 'type', value: name.value })},
    {"name": "ntype", "symbols": ["type", {"literal":"?"}], "postprocess": ([name]) => ({ _: 'type', value: name.value, optional: true })},
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
