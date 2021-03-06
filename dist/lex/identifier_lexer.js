/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/identifier_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream", "./reserved_word_lexer",
    "./string_lexer"
], (function(require, exports, parse, parse_text, __o, reserved_word_lexer, string_lexer) {
    "use strict";
    var zwnj, zwj, unicodeLetter, unicodeDigit, unicodeConnectorPunctuation, unicodeCombiningMark,
            identifierStart, identifierPart, identifierParts, identifierName, identifier, oneOf = parse_text[
                "oneOf"],
        foldl = __o["foldl"],
        __add = (function(x, y) {
            return (x + y);
        }),
        join = __add;
    (zwnj = parse_text.character("‌"));
    (zwj = parse_text.character("‍"));
    (unicodeLetter = parse_text.letter);
    (unicodeDigit = parse_text.digit);
    (unicodeConnectorPunctuation = oneOf(["_", "‿", "⁀", "⁔", "︳", "︴", "﹍", "﹎", "﹏", "＿"]));
    (unicodeCombiningMark = parse.never());
    (identifierStart = parse.choice(unicodeLetter, parse_text.character("$"), parse_text.character("_"), parse.next(
        string_lexer.escape, string_lexer.unicodeEscapeSequence)));
    (identifierPart = parse.choice(parse.attempt(identifierStart), unicodeCombiningMark, unicodeDigit,
        unicodeConnectorPunctuation, zwnj, zwj));
    (identifierParts = parse.many(identifierPart));
    (identifierName = parse.cons(identifierStart, identifierParts));
    (identifier = parse.label("Identifier Lexer", parse.bind(identifierName, (function(name) {
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
}));