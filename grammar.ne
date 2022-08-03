@{%
const val = ([tok]: NearleyToken[]) => tok.value;

import moo from 'moo';

const lexer = moo.compile({
    ws:         { match: /[ \t\n\r]+/, lineBreaks: true },
    comment:    { match: /;[^\n]*\n/, lineBreaks: true },
    number:     /[0-9]+/,
    sqstring:   /'.'/,
    dqstring:   /".*?"/,
    keywords:   ["else", "end", "enum", "false", "if", "not", "query", "return", "true"],

    word: {
        match: /[a-zA-Z][a-zA-Z0-9_]*/,
    },

    colon: ":",
    comma: ",",
    lp: "(",
    rp: ")",
    dot: ".",
    le: "<=",
    lt: "<",
    ge: ">=",
    gt: ">",
    eq: "==",
    ne: "!=",
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
    qm: "?",
});
%}
@preprocessor typescript

@lexer lexer

document -> _ program {% ([,prog]) => prog %}
program -> declp:* {% id %}
declp -> decl _ {% id %}
decl -> componentdecl {% id %}
      | tagdecl {% id %}
      | systemdecl {% id %}
      | fndecl {% id %}
      | templatedecl {% id %}
      | tiletypedecl {% id %}
      | globaldecl {% id %}
      | enumdecl {% id %}

componentdecl -> "component" __ name _ fieldlist "end" {% ([,,name,,fields]) => ({ _: 'component', name: name.value, fields }) %}
tagdecl -> "tag" __ name {% ([,,name]) => ({ _: 'tag', name: name.value }) %}
systemdecl -> "system" __ name _ paramlist _ code "end" {% ([,,name,,params,,code]) => ({ _: 'system', name: name.value, params, code }) %}
fndecl -> "fn" __ name _ paramlist maybentype _ code "end" {% ([,,name,,params,type,,code]) => ({ _: 'fn', name: name.value, params, type, code }) %}
templatedecl -> "template" __ name _ templatelist "end" {% ([,,name,,fields]) => ({ _: 'template', name: name.value, fields }) %}
tiletypedecl -> "tiletype" __ name _ %sqstring _ tiletypefieldlist "end" {% ([,,name,,char,,fields]) => ({ _: 'tiletype', name: name.value, char: char.value.slice(1, -1), fields }) %}
globaldecl -> "global" __ field {% ([,,field]) => ({ _: 'global', name: field.name, type: field.type }) %}
            | "global" __ field _ "=" _ expr {% ([,,field,,,,expr]) => ({ _: 'global', name: field.name, type: field.type, expr }) %}
enumdecl -> "enum" __ name _ enumvals _ "end" {% ([,,name,,values]) => ({ _: 'enum', name: name.value, values }) %}

fieldlist -> fieldp:* {% id %}
fieldp -> field __ {% id %}
field -> name _ ":" _ ntype {% ([name,,,,type]) => ({ _: 'field', name: name.value, type }) %}

paramlist -> "(" _ params _ ")" {% ([,,params]) => params %}
params -> null {% () => [] %}
        | param
        | params _ "," _ param {% ([params,,,,param]) => params.concat(param) %}
param -> field {% id %}
       | type {% ([type]) => ({ _: 'constraint', type: type.value }) %}

enumvals -> enumval
          | enumvals __ enumval {% ([values,,value]) => values.concat(value) %}
enumval -> name {% ([name]) => ({ name }) %}
         | name _ "=" _ expr {% ([name,,,expr]) => ({ name, expr }) %}

maybentype -> null {% () => undefined %}
            | ":" _ ntype {% ([,,type]) => type %}

templatelist -> templatefieldp:* {% id %}
templatefieldp -> templatefield _ {% id %}
templatefield -> name {% ([name]) => ({ _: 'tag', name }) %}
               | call {% id %}

tiletypefieldlist -> tiletypefieldp:* {% id %}
tiletypefieldp -> tiletypefield __ {% id %}
tiletypefield -> name {% ([name]) => ({ _: 'flag', name: name.value }) %}
               | name _ "=" _ expr {% ([name,,,,expr]) => ({ _: 'field', name: name.value, expr }) %}

code -> stmtp:* {% id %}
stmtp -> stmt _ {% id %}
stmt -> call {% id %}
      | assignment {% id %}
      | local {% id %}
      | if {% id %}
      | return {% id %}
      | for {% id %}
      | query {% id %}

call -> qname arglist {% ([name,args]) => ({ _: 'call', name, args }) %}

assignment -> qname _ assignop _ expr {% ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr }) %}
assignop -> "=" {% val %}
          | "+=" {% val %}
          | "-=" {% val %}
          | "*=" {% val %}
          | "/=" {% val %}
          | "^=" {% val %}

local -> "local" __ field {% ([,,field]) => ({ _: 'local', name: field.name, type: field.type }) %}
       | "local" __ field _ "=" _ expr {% ([,,field,,,,expr]) => ({ _: 'local', name: field.name, type: field.type, expr }) %}

if -> "if" __ expr _ code "end" {% ([,,expr,,code]) => ({ _: 'if', expr, code }) %}
    | "if" __ expr _ code _ "else" _ code "end" {% ([,,expr,,code,,,,code2]) => ({ _: 'if', expr, code, code2 }) %}

return -> "exit" {% () => ({ _: 'return' }) %}
        | "return" __ expr {% ([,,expr]) => ({ _: 'return', expr }) %}

for -> "for" __ name _ "=" _ expr __ "to" __ expr _ code "end" {% ([,,name,,,,start,,,,end,,code]) => ({ _: 'for', name, start, end, code }) %}

query -> "query" _ paramlist _ code "end" {% ([,,params,,code]) => ({ _: 'query', params, code }) %}

arglist -> "(" _ args _ ")" {% ([,,args,,]) => args %}
args -> null {% () => [] %}
      | arg
      | args _ "," _ arg {% ([args,,,,arg]) => args.concat(arg) %}
arg -> expr {% id %}

expr -> maths {% id %}

maths   -> logic {% id %}
logic   -> logic _ logicop _ boolean {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | boolean {% id %}
boolean -> boolean _ boolop _ sum {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | sum {% id %}
sum     -> sum _ sumop _ product {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | product {% id %}
product -> product _ mulop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | exp {% id %}
exp     -> unary _ expop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | unary {% id %}
unary   -> "-" number {% ([op,value]) => ({ _: 'unary', op: op.value, value }) %}
         | "not" _ value {% ([op,,value]) => ({ _: 'unary', op: op.value, value }) %}
         | value {% id %}

logicop -> "and" {% val %}
boolop  -> ">" {% id %}
         | ">=" {% id %}
         | "<" {% id %}
         | "<=" {% id %}
         | "==" {% id %}
         | "!=" {% id %}
sumop   -> "+" {% val %}
         | "-" {% val %}
mulop   -> "*" {% val %}
         | "/" {% val %}
expop   -> "^" {% val %}

value -> number {% id %}
       | nonnumber {% id %}
       | qname {% id %}
       | call {% id %}
       | matchexpr {% id %}

nonnumber -> %sqstring {% ([tok]) => ({ _: 'char', value: tok.value[1] }) %}
           | %dqstring {% ([tok]) => ({ _: 'str', value: tok.value.slice(1, -1) }) %}
           | "true" {% () => ({ _: 'bool', value: true }) %}
           | "false" {% () => ({ _: 'bool', value: false }) %}

number -> %number {% ([tok]) => ({ _: 'int', value: Number(tok.value) }) %}
        | %number "." %number {% ([whole,,frac]) => ({ _: 'float', value: Number(whole.value + '.' + frac.value)}) %}

matchexpr -> "match" __ expr _ matchlist _ "end" {% ([,,expr,,matches]) => ({ _: 'match', expr, matches }) %}
matchlist -> match
           | matchlist _ match {% ([matches,,match]) => matches.concat(match) %}
match -> expr _ "=" _ expr {% ([expr,,,,value]) => ({ _: 'case', expr, value }) %}
       | "else" _ "=" _ expr {% ([,,,,value]) => ({ _: 'case', expr: "else", value }) %}

qname -> name {% ([name]) => ({ _: 'qname', chain: [name.value] }) %}
       | qname "." name {% ([qname,,name]) => ({ ...qname, chain: qname.chain.concat(name.value) }) %}

ntype -> type {% ([name]) => ({ _: 'type', value: name.value }) %}
       | type "?" {% ([name]) => ({ _: 'type', value: name.value, optional: true }) %}

type -> name {% id %}
name -> %word {% ([tok]) => ({ _: 'id', value: tok.value }) %}

_  -> ws {% () => null %}
    | comment {% () => null %}
    | null {% () => null %}
__ -> ws {% () => null %}

ws -> %ws {% () => null %}
comment -> _ %comment _ {% () => null %}
