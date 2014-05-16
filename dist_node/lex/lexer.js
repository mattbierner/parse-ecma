/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    __o = require("bennu")["lang"],
    __o0 = require("nu-stream")["stream"],
    lexToken = require("ecma-ast")["token"],
    __o1 = require("ecma-ast")["position"],
    ParserState = require("./state"),
    __o2 = require("./boolean_lexer"),
    comment_lexer = require("./comment_lexer"),
    __o3 = require("./identifier_lexer"),
    line_terminator_lexer = require("./line_terminator_lexer"),
    __o4 = require("./null_lexer"),
    __o5 = require("./number_lexer"),
    __o6 = require("./punctuator_lexer"),
    __o7 = require("./reserved_word_lexer"),
    __o8 = require("./string_lexer"),
    whitespace_lexer = require("./whitespace_lexer"),
    __o9 = require("./regular_expression_lexer"),
    comment, whitespace, lineTerminator, token, lexState, lexStream, lex, always = parse["always"],
    attempt = parse["attempt"],
    binds = parse["binds"],
    bind = parse["bind"],
    choice = parse["choice"],
    eof = parse["eof"],
    getPosition = parse["getPosition"],
    modifyParserState = parse["modifyParserState"],
    enumeration = parse["enumeration"],
    extract = parse["extract"],
    next = parse["next"],
    many = parse["many"],
    runState = parse["runState"],
    never = parse["never"],
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
    type, type0, type1, type2, type3, p, type4, type5, type6, type7, p1, type8, p2, type9, p3, p4, isRegExpCtx =
        extract((function(x) {
            return x.prevTok;
        }))
        .chain((function(prev) {
            if ((!prev)) return always();
            switch (prev.type) {
                case "Keyword":
                case "Punctuator":
                    return always();
            }
            return never();
        })),
    literal = choice(((type = lexToken.StringToken.create), bind(stringLiteral, (function(x) {
        return always([type, x]);
    }))), ((type0 = lexToken.BooleanToken.create), bind(booleanLiteral, (function(x) {
        return always([type0, x]);
    }))), ((type1 = lexToken.NullToken.create), bind(nullLiteral, (function(x) {
        return always([type1, x]);
    }))), ((type2 = lexToken.NumberToken.create), bind(numericLiteral, (function(x) {
        return always([type2, x]);
    }))), ((type3 = lexToken.RegularExpressionToken.create), (p = next(isRegExpCtx, regularExpressionLiteral)),
        bind(p, (function(x) {
            return always([type3, x]);
        })))),
    tokenToken = choice(attempt(((type4 = lexToken.IdentifierToken), bind(identifier, (function(x) {
        return always([type4, x]);
    })))), literal, ((type5 = lexToken.KeywordToken), bind(reservedWord, (function(x) {
        return always([type5, x]);
    }))), ((type6 = lexToken.PunctuatorToken), bind(punctuator, (function(x) {
        return always([type6, x]);
    })))),
    p0 = tokenToken;
(token = binds(enumeration(getPosition, p0, getPosition), (function(start, __o10, end) {
        var type7 = __o10[0],
            value = __o10[1];
        return always(new(type7)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    }))
    .chain((function(tok) {
        return next(modifyParserState((function(s) {
            return s.consume(tok);
        })), always(tok));
    })));
var commentToken = ((type7 = lexToken.CommentToken), (p1 = comment_lexer.comment), bind(p1, (function(x) {
    return always([type7, x]);
}))),
    whitespaceToken = ((type8 = lexToken.WhitespaceToken), (p2 = whitespace_lexer.whitespace), bind(p2, (function(x) {
        return always([type8, x]);
    }))),
    lineTerminatorToken = ((type9 = lexToken.LineTerminatorToken), (p3 = line_terminator_lexer.lineTerminator), bind(p3, (
        function(x) {
            return always([type9, x]);
        })));
(comment = binds(enumeration(getPosition, commentToken, getPosition), (function(start, __o10, end) {
        var type10 = __o10[0],
            value = __o10[1];
        return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    }))
    .chain((function(tok) {
        return next(modifyParserState((function(s) {
            return s.consume(tok);
        })), always(tok));
    })));
(whitespace = binds(enumeration(getPosition, whitespaceToken, getPosition), (function(start, __o10, end) {
        var type10 = __o10[0],
            value = __o10[1];
        return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    }))
    .chain((function(tok) {
        return next(modifyParserState((function(s) {
            return s.consume(tok);
        })), always(tok));
    })));
(lineTerminator = binds(enumeration(getPosition, lineTerminatorToken, getPosition), (function(start, __o10, end) {
        var type10 = __o10[0],
            value = __o10[1];
        return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    }))
    .chain((function(tok) {
        return next(modifyParserState((function(s) {
            return s.consume(tok);
        })), always(tok));
    })));
var inputElement = choice(commentToken, whitespaceToken, lineTerminatorToken, tokenToken),
    lexer = many(((p4 = inputElement), binds(enumeration(getPosition, p4, getPosition), (function(start, __o10, end) {
            var type10 = __o10[0],
                value = __o10[1];
            return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)), value));
        }))
        .chain((function(tok) {
            return next(modifyParserState((function(s) {
                return s.consume(tok);
            })), always(tok));
        }))));
(lexState = (function(state) {
    return runState(then(lexer, eof), state);
}));
(lexStream = (function(s, file) {
    return lexState(new(ParserState)(s, new(SourcePosition)(1, 0, file)));
}));
var y = lexStream;
(lex = (function(z) {
    return y(streamFrom(z));
}));
(exports["comment"] = comment);
(exports["whitespace"] = whitespace);
(exports["lineTerminator"] = lineTerminator);
(exports["token"] = token);
(exports["lexState"] = lexState);
(exports["lexStream"] = lexStream);
(exports["lex"] = lex);