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
    comment, whitespace, lineTerminator, tokenDiv, tokenRegExp, lexDivState, lexDivStream, lexDiv, lexRegExpState,
        lexRegExpStream, lexRegExp, always = parse["always"],
    attempt = parse["attempt"],
    binds = parse["binds"],
    bind = parse["bind"],
    choice = parse["choice"],
    eof = parse["eof"],
    getPosition = parse["getPosition"],
    enumeration = parse["enumeration"],
    many = parse["many"],
    runState = parse["runState"],
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
    divPunctuator = __o6["divPunctuator"],
    reservedWord = __o7["reservedWord"],
    stringLiteral = __o8["stringLiteral"],
    regularExpressionLiteral = __o9["regularExpressionLiteral"],
    type, type0, type1, type2, type3, type4, type5, type6, p, type7, type8, type9, type10, p2, type11, p3, type12, p4,
        p5, p6, literalDiv = choice(((type = lexToken.StringToken.create), bind(stringLiteral, (function(x) {
            return always([type, x]);
        }))), ((type0 = lexToken.BooleanToken.create), bind(booleanLiteral, (function(x) {
            return always([type0, x]);
        }))), ((type1 = lexToken.NullToken.create), bind(nullLiteral, (function(x) {
            return always([type1, x]);
        }))), ((type2 = lexToken.NumberToken.create), bind(numericLiteral, (function(x) {
            return always([type2, x]);
        })))),
    literalRegExp = choice(literalDiv, ((type3 = lexToken.RegularExpressionToken.create), bind(regularExpressionLiteral, (
        function(x) {
            return always([type3, x]);
        })))),
    tokenDivToken = choice(attempt(((type4 = lexToken.IdentifierToken), bind(identifier, (function(x) {
        return always([type4, x]);
    })))), literalDiv, ((type5 = lexToken.KeywordToken), bind(reservedWord, (function(x) {
        return always([type5, x]);
    }))), ((type6 = lexToken.PunctuatorToken), (p = choice(punctuator, divPunctuator)), bind(p, (function(x) {
        return always([type6, x]);
    })))),
    p0 = tokenDivToken;
(tokenDiv = binds(enumeration(getPosition, p0, getPosition), (function(start, __o10, end) {
    var type7 = __o10[0],
        value = __o10[1];
    return always(new(type7)(new(SourceLocation)(start, end, (start.file || end.file)), value));
})));
var tokenRegExpToken = choice(attempt(((type7 = lexToken.IdentifierToken), bind(identifier, (function(x) {
    return always([type7, x]);
})))), literalRegExp, ((type8 = lexToken.KeywordToken), bind(reservedWord, (function(x) {
    return always([type8, x]);
}))), ((type9 = lexToken.PunctuatorToken), bind(punctuator, (function(x) {
    return always([type9, x]);
})))),
    p1 = tokenRegExpToken;
(tokenRegExp = binds(enumeration(getPosition, p1, getPosition), (function(start, __o10, end) {
    var type10 = __o10[0],
        value = __o10[1];
    return always(new(type10)(new(SourceLocation)(start, end, (start.file || end.file)), value));
})));
var commentToken = ((type10 = lexToken.CommentToken), (p2 = comment_lexer.comment), bind(p2, (function(x) {
    return always([type10, x]);
}))),
    whitespaceToken = ((type11 = lexToken.WhitespaceToken), (p3 = whitespace_lexer.whitespace), bind(p3, (function(x) {
        return always([type11, x]);
    }))),
    lineTerminatorToken = ((type12 = lexToken.LineTerminatorToken), (p4 = line_terminator_lexer.lineTerminator), bind(
        p4, (function(x) {
            return always([type12, x]);
        })));
(comment = binds(enumeration(getPosition, commentToken, getPosition), (function(start, __o10, end) {
    var type13 = __o10[0],
        value = __o10[1];
    return always(new(type13)(new(SourceLocation)(start, end, (start.file || end.file)), value));
})));
(whitespace = binds(enumeration(getPosition, whitespaceToken, getPosition), (function(start, __o10, end) {
    var type13 = __o10[0],
        value = __o10[1];
    return always(new(type13)(new(SourceLocation)(start, end, (start.file || end.file)), value));
})));
(lineTerminator = binds(enumeration(getPosition, lineTerminatorToken, getPosition), (function(start, __o10, end) {
    var type13 = __o10[0],
        value = __o10[1];
    return always(new(type13)(new(SourceLocation)(start, end, (start.file || end.file)), value));
})));
var element = choice(commentToken, whitespaceToken, lineTerminatorToken),
    inputElementDiv = choice(element, tokenDivToken),
    inputElementRegExp = choice(element, tokenRegExpToken),
    lexerDiv = many(((p5 = inputElementDiv), binds(enumeration(getPosition, p5, getPosition), (function(start, __o10,
        end) {
        var type13 = __o10[0],
            value = __o10[1];
        return always(new(type13)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    })))),
    lexerRegExp = many(((p6 = inputElementRegExp), binds(enumeration(getPosition, p6, getPosition), (function(start,
        __o10, end) {
        var type13 = __o10[0],
            value = __o10[1];
        return always(new(type13)(new(SourceLocation)(start, end, (start.file || end.file)), value));
    }))));
(lexDivState = (function(state) {
    return runState(then(lexerDiv, eof), state);
}));
(lexDivStream = (function(s, file) {
    return lexDivState(new(ParserState)(s, new(SourcePosition)(1, 0, file)));
}));
var y = lexDivStream;
(lexDiv = (function(z) {
    return y(streamFrom(z));
}));
(lexRegExpState = (function(state) {
    return runState(then(lexerRegExp, parse.eof), state);
}));
(lexRegExpStream = (function(s, file) {
    return lexRegExpState(new(ParserState)(s, new(SourcePosition)(1, 0, file)));
}));
var y0 = lexRegExpStream;
(lexRegExp = (function(z) {
    return y0(streamFrom(z));
}));
(exports["comment"] = comment);
(exports["whitespace"] = whitespace);
(exports["lineTerminator"] = lineTerminator);
(exports["tokenDiv"] = tokenDiv);
(exports["tokenRegExp"] = tokenRegExp);
(exports["lexDivState"] = lexDivState);
(exports["lexDivStream"] = lexDivStream);
(exports["lexDiv"] = lexDiv);
(exports["lexRegExpState"] = lexRegExpState);
(exports["lexRegExpStream"] = lexRegExpStream);
(exports["lexRegExp"] = lexRegExp);