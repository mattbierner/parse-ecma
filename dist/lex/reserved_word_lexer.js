/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/reserved_word_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var reservedWord, keywordList, label = __o["label"],
        trie = __o0["trie"];
    (keywordList = ["break", "case", "catch", "continue", "debugger", "default", "delete", "do", "else",
        "finally", "for", "function", "if", "in", "instanceof", "typeof", "new", "var", "return", "void",
        "switch", "while", "this", "with", "throw", "try", "class", "enum", "extends", "super", "const",
        "export", "import", "implements", "let", "private", "public", "interface", "package", "protected",
        "static", "yield", "true", "false", "null"
    ]);
    (reservedWord = label("Reserved Word Lexer", trie(keywordList)));
    (exports["reservedWord"] = reservedWord);
    (exports["keywordList"] = keywordList);
}));