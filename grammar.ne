@{%
const val = ([tok]) => tok.value;

const moo = require('moo');

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
%}
@lexer lexer

document -> _ program {% ([,prog]) => prog %}
program -> declp:* {% id %}
declp -> decl _ {% id %}
decl -> componentdecl {% id %}
      | tagdecl {% id %}
      | systemdecl {% id %}
      | fndecl {% id %}

componentdecl -> "component" __ name _ fieldlist "end" {% ([,,name,,fields]) => ({ _: 'component', name: name.value, fields }) %}
tagdecl -> "tag" __ name {% ([,,name]) => ({ _: 'tag', name: name.value }) %}
systemdecl -> "system" __ name _ paramlist _ code "end" {% ([,,name,,params,,code]) => ({ _: 'system', name, params, code }) %}
fndecl -> "fn" __ name _ paramlist _ code "end" {% ([,,name,,params,,code]) => ({ _: 'fn', name, params, code }) %}

fieldlist -> fieldp:* {% id %}
fieldp -> field _ {% id %}
field -> name _ ":" _ type {% ([name,,,,type]) => ({ _: 'field', name: name.value, type: type.value }) %}

paramlist -> "(" _ params _ ")" {% ([,,params]) => params %}
params -> null {% () => [] %}
        | param
        | params _ "," _ param {% ([params,,,,param]) => params.concat(param) %}
param -> field {% id %}
       | type {% ([type]) => ({ _: 'constraint', type: type.value }) %}

code -> stmtp:* {% id %}
stmtp -> stmt _ {% id %}
stmt -> call {% id %}
      | assignment {% id %}

call -> qname arglist {% ([name,args]) => ({ _: 'call', name, args }) %}

assignment -> qname _ assignop _ expr {% ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr }) %}
assignop -> "=" {% val %}
          | "+=" {% val %}

arglist -> "(" _ args _ ")" {% ([,,args,,]) => args %}
args -> null {% () => [] %}
      | arg
      | args _ "," _ arg {% ([args,,,,arg]) => args.concat(arg) %}
arg -> expr {% id %}

expr -> qname {% id %}
      | matchexpr {% id %}
      | ecall {% id %}
      | value {% id %}
      | unary {% id %}

ecall -> name arglist {% ([name,args]) => ({ _: 'call', name, args }) %}

unary -> unaryop value {% ([op,value]) => ({ _: 'unary', op, value }) %}
unaryop -> "-" {% val %}

value -> %sqstring {% ([tok]) => ({ _: 'char', value: tok.value[1] }) %}
       | %dqstring {% ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) }) %}
       | %number {% ([tok]) => ({ _: 'number', value: Number(tok.value) }) %}

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
