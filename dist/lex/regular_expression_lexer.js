/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/regular_expression_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "bennu/text", "nu-stream/stream", "./identifier_lexer",
    "./line_terminator_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3, __o4) {
    "use strict";
    var regularExpressionNonTerminator, regularExpressionBackslashSequence, regularExpressionClassChar,
            regularExpressionClassChars, regularExpressionClass, regularExpressionChar, regularExpressionChars,
            regularExpressionFirstChar, regularExpressionFlags, regularExpressionBody, regularExpressionLiteral,
            always = __o["always"],
        anyToken = __o["anyToken"],
        attempt = __o["attempt"],
        binds = __o["binds"],
        choice = __o["choice"],
        cons = __o["cons"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        label = __o["label"],
        many = __o["many"],
        map = __o["map"],
        not = __o["not"],
        next = __o["next"],
        between = __o0["between"],
        character = __o1["character"],
        noneOf = __o1["noneOf"],
        foldl = __o2["foldl"],
        identifierPart = __o3["identifierPart"],
        lineTerminator = __o4["lineTerminator"],
        __add = (function(x, y) {
            return (x + y);
        }),
        join = map.bind(null, foldl.bind(null, __add, ""));
    (regularExpressionNonTerminator = next(not(lineTerminator), anyToken));
    (regularExpressionBackslashSequence = next(character("\\"), regularExpressionNonTerminator.map((function(y) {
        return ("\\" + y);
    }))));
    (regularExpressionClassChar = either(attempt(next(not(lineTerminator), noneOf("]\\"))),
        regularExpressionBackslashSequence));
    (regularExpressionClassChars = many(regularExpressionClassChar));
    (regularExpressionClass = between(character("["), character("]"), join(regularExpressionClassChars))
        .map((function(body) {
            return (("[" + body) + "]");
        })));
    (regularExpressionFirstChar = choice(next(not(lineTerminator), noneOf("*\\/[")),
        regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChar = choice(next(not(lineTerminator), noneOf("\\/[")),
        regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChars = many(regularExpressionChar));
    (regularExpressionFlags = many(identifierPart));
    (regularExpressionBody = join(cons(regularExpressionFirstChar, regularExpressionChars)));
    (regularExpressionLiteral = label("Regular Expression Lexer", binds(enumeration(between(character("/"),
        character("/"), regularExpressionBody), join(regularExpressionFlags)), (function(body,
        flags) {
        return always(({
            body: body,
            flags: flags
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
}));