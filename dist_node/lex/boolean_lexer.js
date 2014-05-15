/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/boolean_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["text"],
    trueLiteral, falseLiteral, booleanLiteral, always = __o["always"],
    either = __o["either"],
    next = __o["next"],
    label = __o["label"],
    string = __o0["string"];
(trueLiteral = label("True Literal Lexer", next(string("true"), always(true))));
(falseLiteral = label("False Literal Lexer", next(string("false"), always(false))));
(booleanLiteral = label("Boolean Literal Lexer", either(trueLiteral, falseLiteral)));
(exports["trueLiteral"] = trueLiteral);
(exports["falseLiteral"] = falseLiteral);
(exports["booleanLiteral"] = booleanLiteral);