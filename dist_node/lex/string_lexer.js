/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/string_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    parse_lang = require("bennu")["lang"],
    parse_text = require("bennu")["text"],
    stream = require("nu-stream")["stream"],
    line_terminator_lexer = require("./line_terminator_lexer"),
    number_lexer = require("./number_lexer"),
    doubleQuote, escape, singleQuote, lineContinuation, singleEscapeCharacter, escapeCharacter, nonEscapeCharacter,
        characterEscapeSequence, unicodeEscapeSequence, hexEscapeSequence, escapeSequence, singleStringCharacter,
        singleStringCharacters, singleStringLiteral, doubleStringCharacter, doubleStringCharacters, doubleStringLiteral,
        stringLiteral, __add = (function(x, y) {
            return (x + y);
        }),
    join = __add;
(doubleQuote = parse_text.character("\""));
(escape = parse_text.character("\\"));
(singleQuote = parse_text.character("'"));
(lineContinuation = parse.next(parse.next(escape, line_terminator_lexer.lineTerminatorSequence), parse.always("")));
(singleEscapeCharacter = parse.choice(parse_text.character("'"), parse_text.character("\""), parse_text.character("\\"),
    parse.next(parse_text.character("b"), parse.always("\b")), parse.next(parse_text.character("f"), parse.always(
        "\f")), parse.next(parse_text.character("n"), parse.always("\n")), parse.next(parse_text.character("r"),
        parse.always("\r")), parse.next(parse_text.character("t"), parse.always("\t")), parse.next(parse_text.character(
        "v"), parse.always("\u000b"))));
(escapeCharacter = parse.choice(singleEscapeCharacter, number_lexer.decimalDigit, parse_text.character("u"), parse_text
    .character("x")));
(nonEscapeCharacter = parse.token((function(tok) {
    return (!(parse.test(escapeCharacter, tok) || parse.test(line_terminator_lexer.lineTerminator, tok)));
})));
(hexEscapeSequence = parse.next(parse_text.character("x"), parse.bind(parse_lang.times(2, number_lexer.hexDigit), (
    function(digits) {
        return parse.always(String.fromCharCode(parseInt(stream.foldl(join, "", digits), 16)));
    }))));
(unicodeEscapeSequence = parse.next(parse_text.character("u"), parse.bind(parse_lang.times(4, number_lexer.hexDigit), (
    function(digits) {
        return parse.always(String.fromCharCode(parseInt(stream.foldl(join, "", digits), 16)));
    }))));
(characterEscapeSequence = parse.either(singleEscapeCharacter, nonEscapeCharacter));
(escapeSequence = parse.choice(characterEscapeSequence, parse.next(parse_text.character("0"), parse.next(parse.either(
    parse.eof, parse.token((function(tok) {
        return (!parse.test(number_lexer.decimalDigit, tok));
    }))), parse.always("\u0000"))), hexEscapeSequence, unicodeEscapeSequence));
(singleStringCharacter = parse.choice(parse.attempt(lineContinuation), parse.next(escape, escapeSequence), parse.token(
    (function(tok) {
        return (!((parse.test(singleQuote, tok) || parse.test(escape, tok)) || parse.test(
            line_terminator_lexer.lineTerminator, tok)));
    }))));
(singleStringCharacters = parse.many(singleStringCharacter));
(singleStringLiteral = parse.Parser("Single String Literal", parse_lang.between(singleQuote, singleQuote, parse.bind(
    singleStringCharacters, (function(str) {
        return parse.always(stream.foldl(join, "", str));
    })))));
(doubleStringCharacter = parse.choice(parse.attempt(lineContinuation), parse.next(escape, escapeSequence), parse.token(
    (function(tok) {
        return (!((parse.test(doubleQuote, tok) || parse.test(escape, tok)) || parse.test(
            line_terminator_lexer.lineTerminator, tok)));
    }))));
(doubleStringCharacters = parse.many(doubleStringCharacter));
(doubleStringLiteral = parse.Parser("Double String Literal", parse_lang.between(doubleQuote, doubleQuote, parse.bind(
    doubleStringCharacters, (function(str) {
        return parse.always(stream.foldl(join, "", str));
    })))));
(stringLiteral = parse.Parser("Sting Literal Lexer", parse.either(singleStringLiteral, doubleStringLiteral)));
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