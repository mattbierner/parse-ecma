/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/punctuator_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var punctuator, label = __o["label"],
        trie = __o0["trie"],
        punctuators = ["{", "}", "(", ")", ",", "[", "]", ".", ";", ",", ":", "?", "&&", "||", "<<", ">>",
            ">>>", "<=", "<", ">=", ">", "===", "!==", "==", "!=", "=", "<<=", ">>=", ">>>=", "+=", "-=", "*=",
            "%=", "++", "--", "!", "~", "&", "|", "^", "+", "-", "*", "%", "/", "/="
        ];
    (punctuator = label("Punctuator Lexer", trie(punctuators)));
    (exports["punctuator"] = punctuator);
}));