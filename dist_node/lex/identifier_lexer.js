/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/identifier_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    parse_text = require("bennu")["text"],
    __o = require("nu-stream")["stream"],
    reserved_word_lexer = require("./reserved_word_lexer"),
    string_lexer = require("./string_lexer"),
    zwnj, zwj, unicodeLetter, unicodeDigit, unicodeConnectorPunctuation, unicodeCombiningMark, identifierStart,
        identifierPart, identifierParts, identifierName, identifier, foldl = __o["foldl"],
    __add = (function(x, y) {
        return (x + y);
    }),
    join = __add;
(zwnj = parse_text.character("‌"));
(zwj = parse_text.character("‍"));
(unicodeLetter = parse_text.letter);
(unicodeDigit = parse_text.digit);
(unicodeConnectorPunctuation = parse_text.characters(["_", "‿", "⁀", "⁔", "︳", "︴", "﹍", "﹎", "﹏", "＿"]));
(unicodeCombiningMark = parse.never());
(identifierStart = parse.choice(unicodeLetter, parse_text.character("$"), parse_text.character("_"), parse.next(
    string_lexer.escape, string_lexer.unicodeEscapeSequence)));
(identifierPart = parse.choice(parse.attempt(identifierStart), unicodeCombiningMark, unicodeDigit,
    unicodeConnectorPunctuation, zwnj, zwj));
(identifierParts = parse.many(identifierPart));
(identifierName = parse.cons(identifierStart, identifierParts));
(identifier = parse.Parser("Identifier Lexer", parse.bind(identifierName, (function(name) {
    var v = foldl(join, "", name);
    return ((reserved_word_lexer.keywordList.indexOf(v) >= 0) ? parse.fail(
        "Reserved words cannot be used as identifiers") : parse.always(v));
}))));
(exports["zwnj"] = zwnj);
(exports["zwj"] = zwj);
(exports["unicodeLetter"] = unicodeLetter);
(exports["unicodeDigit"] = unicodeDigit);
(exports["unicodeConnectorPunctuation"] = unicodeConnectorPunctuation);
(exports["unicodeCombiningMark"] = unicodeCombiningMark);
(exports["identifierStart"] = identifierStart);
(exports["identifierPart"] = identifierPart);
(exports["identifierParts"] = identifierParts);
(exports["identifierName"] = identifierName);
(exports["identifier"] = identifier);