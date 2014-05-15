/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/null_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["text"],
    nullLiteral, label = __o["label"],
    next = __o["next"],
    always = __o["always"],
    string = __o0["string"];
(nullLiteral = label("Null label", next(string("null"), always(null))));
(exports["nullLiteral"] = nullLiteral);