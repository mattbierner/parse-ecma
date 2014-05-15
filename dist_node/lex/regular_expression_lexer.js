/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/regular_expression_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    parse_lang = require("bennu")["lang"],
    parse_text = require("bennu")["text"],
    stream = require("nu-stream")["stream"],
    identifier_lexer = require("./identifier_lexer"),
    line_terminator_lexer = require("./line_terminator_lexer"),
    regularExpressionNonTerminator, regularExpressionBackslashSequence, regularExpressionClassChar,
        regularExpressionClassChars, regularExpressionClass, regularExpressionChar, regularExpressionChars,
        regularExpressionFirstChar, regularExpressionFlags, regularExpressionBody, regularExpressionLiteral, __add = (
            function(x, y) {
                return (x + y);
            }),
    join = __add;
(regularExpressionNonTerminator = parse.token((function(tok) {
    return (!parse.test(line_terminator_lexer.lineTerminator, tok));
})));
(regularExpressionBackslashSequence = parse.next(parse_text.character("\\"), parse.bind(regularExpressionNonTerminator, (
    function(char) {
        return parse.always(("\\" + char));
    }))));
(regularExpressionClassChar = parse.either(parse.attempt(parse.token((function(tok) {
    return (((!parse.test(line_terminator_lexer.lineTerminator, tok)) && (tok !== "]")) && (tok !==
        "\\"));
}))), regularExpressionBackslashSequence));
(regularExpressionClassChars = parse.many(regularExpressionClassChar));
(regularExpressionClass = parse_lang.between(parse_text.character("["), parse_text.character("]"), parse.bind(
    regularExpressionClassChars, (function(body) {
        return parse.always((("[" + stream.foldl(join, "", body)) + "]"));
    }))));
(regularExpressionFirstChar = parse.choice(parse.token((function(tok) {
    return (((((!parse.test(line_terminator_lexer.lineTerminator, tok)) && (tok !== "*")) && (tok !==
        "\\")) && (tok !== "/")) && (tok !== "["));
})), regularExpressionBackslashSequence, regularExpressionClass));
(regularExpressionChar = parse.choice(parse.token((function(tok) {
    return ((((!parse.test(line_terminator_lexer.lineTerminator, tok)) && (tok !== "\\")) && (tok !==
        "/")) && (tok !== "["));
})), regularExpressionBackslashSequence, regularExpressionClass));
(regularExpressionChars = parse.many(regularExpressionChar));
(regularExpressionFlags = parse.many(identifier_lexer.identifierPart));
(regularExpressionBody = parse.bind(parse.cons(regularExpressionFirstChar, regularExpressionChars), (function(s) {
    return parse.always(stream.foldl(join, "", s));
})));
(regularExpressionLiteral = parse.Parser("Regular Expression Lexer", parse.binds(parse.enumeration(parse_lang.between(
        parse_text.character("/"), parse_text.character("/"), regularExpressionBody),
    regularExpressionFlags), (function(body, flags) {
    return parse.always(({
        "body": body,
        "flags": stream.foldl(join, "", flags)
    }));
}))));
(exports["regularExpressionNonTerminator"] = regularExpressionNonTerminator);
(exports["regularExpressionBackslashSequence"] = regularExpressionBackslashSequence);
(exports["regularExpressionClassChar"] = regularExpressionClassChar);
(exports["regularExpressionClassChars"] = regularExpressionClassChars);
(exports["regularExpressionClass"] = regularExpressionClass);
(exports["regularExpressionChar"] = regularExpressionChar);
(exports["regularExpressionChars"] = regularExpressionChars);
(exports["regularExpressionFirstChar"] = regularExpressionFirstChar);
(exports["regularExpressionFlags"] = regularExpressionFlags);
(exports["regularExpressionBody"] = regularExpressionBody);
(exports["regularExpressionLiteral"] = regularExpressionLiteral);