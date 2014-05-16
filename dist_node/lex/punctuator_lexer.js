/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/punctuator_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["text"],
    punctuator, label = __o["label"],
    trie = __o0["trie"],
    punctuators = ["{", "}", "(", ")", ",", "[", "]", ".", ";", ",", ":", "?", "&&", "||", "<<", ">>", ">>>", "<=", "<",
        ">=", ">", "===", "!==", "==", "!=", "=", "<<=", ">>=", ">>>=", "+=", "-=", "*=", "%=", "++", "--", "!", "~",
        "&", "|", "^", "+", "-", "*", "%", "/", "/="
    ];
(punctuator = label("Punctuator Lexer", trie(punctuators)));
(exports["punctuator"] = punctuator);