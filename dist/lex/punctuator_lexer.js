/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/punctuator_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var punctuator, divPunctuator, Parser = __o["Parser"],
        either = __o["either"],
        string = __o0["string"],
        trie = __o0["trie"],
        punctuators = ["{", "}", "(", ")", ",", "[", "]", ".", ";", ",", ":", "?", "&&", "||", "<<", ">>",
            ">>>", "<=", "<", ">=", ">", "===", "!==", "==", "!=", "=", "<<=", ">>=", ">>>=", "+=", "-=", "*=",
            "%=", "++", "--", "!", "~", "&", "|", "^", "+", "-", "*", "%"
        ];
    (punctuator = Parser("Punctuator Lexer", trie(punctuators)));
    (divPunctuator = either(string("/="), string("/")));
    (exports["punctuator"] = punctuator);
    (exports["divPunctuator"] = divPunctuator);
}));