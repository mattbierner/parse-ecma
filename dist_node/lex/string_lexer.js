/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/string_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["lang"],
    __o1 = require("bennu")["text"],
    __o2 = require("nu-stream")["stream"],
    __o3 = require("./line_terminator_lexer"),
    __o4 = require("./number_lexer"),
    doubleQuote, escape, singleQuote, lineContinuation, singleEscapeCharacter, escapeCharacter, nonEscapeCharacter,
        characterEscapeSequence, unicodeEscapeSequence, hexEscapeSequence, escapeSequence, singleStringCharacter,
        singleStringCharacters, singleStringLiteral, doubleStringCharacter, doubleStringCharacters, doubleStringLiteral,
        stringLiteral, always = __o["always"],
    anyToken = __o["anyToken"],
    attempt = __o["attempt"],
    choice = __o["choice"],
    either = __o["either"],
    label = __o["label"],
    map = __o["map"],
    many = __o["many"],
    next = __o["next"],
    not = __o["not"],
    eof = __o["eof"],
    sequence = __o["sequence"],
    between = __o0["between"],
    times = __o0["times"],
    character = __o1["character"],
    oneOf = __o1["oneOf"],
    noneOf = __o1["noneOf"],
    foldl = __o2["foldl"],
    lineTerminator = __o3["lineTerminator"],
    lineTerminatorSequence = __o3["lineTerminatorSequence"],
    decimalDigit = __o4["decimalDigit"],
    hexDigit = __o4["hexDigit"],
    y, __add = (function(x, y) {
        return (x + y);
    }),
    join = map.bind(null, foldl.bind(null, __add, "")),
    fromCharCodeParser = ((y = map.bind(null, (function(x) {
        return String.fromCharCode(parseInt(x, 16));
    }))), (function(z) {
        return y(join(z));
    }));
(doubleQuote = character("\""));
(escape = character("\\"));
(singleQuote = character("'"));
(lineContinuation = sequence(escape, lineTerminatorSequence, always("")));
(singleEscapeCharacter = choice(character("'"), character("\""), character("\\"), next(character("b"), always("\b")),
    next(character("f"), always("\f")), next(character("n"), always("\n")), next(character("r"), always("\r")),
    next(character("t"), always("\t")), next(character("v"), always("\u000b"))));
(escapeCharacter = choice(singleEscapeCharacter, decimalDigit, oneOf("ux")));
(nonEscapeCharacter = sequence(not(escapeCharacter), not(lineTerminator), anyToken));
(hexEscapeSequence = next(character("x"), fromCharCodeParser(times(2, hexDigit))));
(unicodeEscapeSequence = next(character("u"), fromCharCodeParser(times(4, hexDigit))));
(characterEscapeSequence = either(singleEscapeCharacter, nonEscapeCharacter));
(escapeSequence = choice(characterEscapeSequence, sequence(character("0"), either(eof, next(not(decimalDigit), anyToken)),
    always("\u0000")), hexEscapeSequence, unicodeEscapeSequence));
(singleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), next(not(lineTerminator),
    noneOf("\\'"))));
(singleStringCharacters = many(singleStringCharacter));
(singleStringLiteral = label("Single String Literal", between(singleQuote, singleQuote, join(singleStringCharacters))));
(doubleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), next(not(lineTerminator),
    noneOf("\"\\"))));
(doubleStringCharacters = many(doubleStringCharacter));
(doubleStringLiteral = label("Double String Literal", between(doubleQuote, doubleQuote, join(doubleStringCharacters))));
(stringLiteral = label("Sting Literal Lexer", either(singleStringLiteral, doubleStringLiteral)));
(exports["doubleQuote"] = doubleQuote);
(exports["escape"] = escape);
(exports["singleQuote"] = singleQuote);
(exports["lineContinuation"] = lineContinuation);
(exports["singleEscapeCharacter"] = singleEscapeCharacter);
(exports["escapeCharacter"] = escapeCharacter);
(exports["nonEscapeCharacter"] = nonEscapeCharacter);
(exports["characterEscapeSequence"] = characterEscapeSequence);
(exports["unicodeEscapeSequence"] = unicodeEscapeSequence);
(exports["hexEscapeSequence"] = hexEscapeSequence);
(exports["escapeSequence"] = escapeSequence);
(exports["singleStringCharacter"] = singleStringCharacter);
(exports["singleStringCharacters"] = singleStringCharacters);
(exports["singleStringLiteral"] = singleStringLiteral);
(exports["doubleStringCharacter"] = doubleStringCharacter);
(exports["doubleStringCharacters"] = doubleStringCharacters);
(exports["doubleStringLiteral"] = doubleStringLiteral);
(exports["stringLiteral"] = stringLiteral);