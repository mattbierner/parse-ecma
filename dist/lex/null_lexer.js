/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/null_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var nullLiteral, Parser = __o["Parser"],
        next = __o["next"],
        always = __o["always"],
        string = __o0["string"];
    (nullLiteral = Parser("Null Parser", next(string("null"), always(null))));
    (exports["nullLiteral"] = nullLiteral);
}));