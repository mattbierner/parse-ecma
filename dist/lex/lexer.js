/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "ecma-ast/token", "ecma-ast/position",
    "./boolean_lexer", "./comment_lexer", "./identifier_lexer", "./line_terminator_lexer", "./null_lexer",
    "./number_lexer", "./punctuator_lexer", "./reserved_word_lexer", "./string_lexer", "./whitespace_lexer",
    "./regular_expression_lexer"
], (function(require, exports, parse, __o, __o0, lexToken, __o1, __o2, comment_lexer, __o3, line_terminator_lexer,
    __o4, __o5, __o6, __o7, __o8, whitespace_lexer, __o9) {
    "use strict";
    var lexer, lexStream, lex, always = parse["always"],
        attempt = parse["attempt"],
        binds = parse["binds"],
        choice = parse["choice"],
        eof = parse["eof"],
        getPosition = parse["getPosition"],
        modifyState = parse["modifyState"],
        getState = parse["getState"],
        enumeration = parse["enumeration"],
        next = parse["next"],
        many = parse["many"],
        runState = parse["runState"],
        never = parse["never"],
        ParserState = parse["ParserState"],
        then = __o["then"],
        streamFrom = __o0["from"],
        SourceLocation = __o1["SourceLocation"],
        SourcePosition = __o1["SourcePosition"],
        booleanLiteral = __o2["booleanLiteral"],
        identifier = __o3["identifier"],
        nullLiteral = __o4["nullLiteral"],
        numericLiteral = __o5["numericLiteral"],
        punctuator = __o6["punctuator"],
        reservedWord = __o7["reservedWord"],
        stringLiteral = __o8["stringLiteral"],
        regularExpressionLiteral = __o9["regularExpressionLiteral"],
        type, type0, type1, type2, type3, p, type4, type5, type6, type7, p0, type8, p1, type9, p2, consume = (
            function(tok, self) {
                switch (tok.type) {
                    case "Comment":
                    case "Whitespace":
                    case "LineTerminator":
                        return self;
                    default:
                        return tok;
                }
            }),
        isRegExpCtx = (function(prev) {
            if ((!prev)) return true;
            switch (prev.type) {
                case "Keyword":
                case "Punctuator":
                    return true;
            }
            return false;
        }),
        enterRegExpCtx = getState.chain((function(prev) {
            return (isRegExpCtx(prev) ? always() : never());
        })),
        literal = choice(((type = lexToken.StringToken.create), stringLiteral.map((function(x) {
            return [type, x];
        }))), ((type0 = lexToken.BooleanToken.create), booleanLiteral.map((function(x) {
            return [type0, x];
        }))), ((type1 = lexToken.NullToken.create), nullLiteral.map((function(x) {
            return [type1, x];
        }))), ((type2 = lexToken.NumberToken.create), numericLiteral.map((function(x) {
            return [type2, x];
        }))), ((type3 = lexToken.RegularExpressionToken.create), (p = next(enterRegExpCtx,
            regularExpressionLiteral)), p.map((function(x) {
            return [type3, x];
        })))),
        token = choice(attempt(((type4 = lexToken.IdentifierToken), identifier.map((function(x) {
            return [type4, x];
        })))), literal, ((type5 = lexToken.KeywordToken), reservedWord.map((function(x) {
            return [type5, x];
        }))), ((type6 = lexToken.PunctuatorToken), punctuator.map((function(x) {
            return [type6, x];
        })))),
        inputElement = choice(((type7 = lexToken.CommentToken), (p0 = comment_lexer.comment), p0.map((function(
            x) {
            return [type7, x];
        }))), ((type8 = lexToken.WhitespaceToken), (p1 = whitespace_lexer.whitespace), p1.map((function(x) {
            return [type8, x];
        }))), ((type9 = lexToken.LineTerminatorToken), (p2 = line_terminator_lexer.lineTerminator), p2.map(
            (function(x) {
                return [type9, x];
            }))), token);
    (lexer = then(many(binds(enumeration(getPosition, inputElement, getPosition), (function(start, __o10, end) {
            var type10 = __o10[0],
                value = __o10[1];
            return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)),
                value));
        }))
        .chain((function(tok) {
            return next(modifyState(consume.bind(null, tok)), always(tok));
        }))), eof));
    (lexStream = (function(s, file) {
        return runState(lexer, new(ParserState)(s, new(SourcePosition)(1, 0, file), null));
    }));
    var y = lexStream;
    (lex = (function(z) {
        return y(streamFrom(z));
    }));
    (exports["lexer"] = lexer);
    (exports["lexStream"] = lexStream);
    (exports["lex"] = lex);
}));