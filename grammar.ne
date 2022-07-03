@{%
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

componentdecl -> "component" __ name _ fieldlist "end" {% ([,,name,,fields]) => ({ _: 'component', name: name.value, fields }) %}
tagdecl -> "tag" __ name {% ([,,name]) => ({ _: 'tag', name: name.value }) %}
systemdecl -> "system" __ name _ paramlist _ code "end" {% ([,,name,,params,,code]) => ({ _: 'system', name: name.value, params, code }) %}
fndecl -> "fn" __ name _ paramlist _ code "end" {% ([,,name,,params,,code]) => ({ _: 'fn', name: name.value, params, code }) %}
templatedecl -> "template" __ name _ templatelist "end" {% ([,,name,,fields]) => ({ _: 'template', name: name.value, fields }) %}

fieldlist -> fieldp:* {% id %}
fieldp -> field _ {% id %}
field -> name _ ":" _ type {% ([name,,,,type]) => ({ _: 'field', name: name.value, type: type.value }) %}

paramlist -> "(" _ params _ ")" {% ([,,params]) => params %}
params -> null {% () => [] %}
        | param
        | params _ "," _ param {% ([params,,,,param]) => params.concat(param) %}
param -> field {% id %}
       | type {% ([type]) => ({ _: 'constraint', type: type.value }) %}

templatelist -> templatefieldp:* {% id %}
templatefieldp -> templatefield _ {% id %}
templatefield -> name {% ([name]) => ({ _: 'tag', name }) %}
               | ecall {% id %}

code -> stmtp:* {% id %}
stmtp -> stmt _ {% id %}
stmt -> call {% id %}
      | assignment {% id %}

call -> qname arglist {% ([name,args]) => ({ _: 'call', name, args }) %}

assignment -> qname _ assignop _ expr {% ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr }) %}
assignop -> "=" {% val %}
          | "+=" {% val %}
          | "-=" {% val %}
          | "*=" {% val %}
          | "/=" {% val %}
          | "^=" {% val %}

arglist -> "(" _ args _ ")" {% ([,,args,,]) => args %}
args -> null {% () => [] %}
      | arg
      | args _ "," _ arg {% ([args,,,,arg]) => args.concat(arg) %}
arg -> expr {% id %}

expr -> qname {% id %}
      | matchexpr {% id %}
      | ecall {% id %}
      | maths {% id %}
      | nonnumber {% id %}

ecall -> name arglist {% ([name,args]) => ({ _: 'call', name, args }) %}

maths   -> sum {% id %}
sum     -> sum _ sumop _ product {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | product {% id %}
product -> product _ mulop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | exp {% id %}
exp     -> unary _ expop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | unary {% id %}
unary   -> unaryop number {% ([op,value]) => ({ _: 'unary', op, value }) %}
         | number {% id %}

sumop   -> "+" {% val %}
         | "-" {% val %}
mulop   -> "*" {% val %}
         | "/" {% val %}
expop   -> "^" {% val %}
unaryop -> "-" {% val %}

number -> %number {% ([tok]) => ({ _: 'int', value: Number(tok.value) }) %}

nonnumber -> %sqstring {% ([tok]) => ({ _: 'char', value: tok.value[1] }) %}
           | %dqstring {% ([tok]) => ({ _: 'str', value: tok.value.slice(1, -1) }) %}

matchexpr -> "match" __ expr _ matchlist _ "end" {% ([,,expr,,matches]) => ({ _: 'match', expr, matches }) %}
matchlist -> match
           | matchlist _ match {% ([matches,,match]) => matches.concat(match) %}
match -> expr _ "=" _ expr {% ([expr,,,,value]) => ({ _: 'case', expr, value }) %}

qname -> name {% ([name]) => ({ _: 'qname', chain: [name.value] }) %}
       | qname "." name {% ([qname,,name]) => ({ ...qname, chain: qname.chain.concat(name.value) }) %}

type -> name {% id %}
name -> %word {% ([tok]) => ({ _: 'id', value: tok.value }) %}

_  -> ws {% () => null %}
    | comment {% () => null %}
    | null {% () => null %}
__ -> ws {% () => null %}

ws -> %ws {% () => null %}
comment -> _ %comment _ {% () => null %}
