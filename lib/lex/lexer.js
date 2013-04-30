/**
 * @fileOverview Lexer for ECMAScript 5.1 tokenization.
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'ecma/lex/token',
        'ecma/lex/boolean_lexer', 'ecma/lex/comment_lexer', 'ecma/lex/identifier_lexer',
        'ecma/lex/line_terminator_lexer', 'ecma/lex/null_lexer', 'ecma/lex/number_lexer', 'ecma/lex/punctuator_lexer',
        'ecma/lex/reserved_word_lexer', 'ecma/lex/string_lexer', 'ecma/lex/whitespace_lexer', 'ecma/lex/regular_expression_lexer'],
function(parse,
        stream,
        position,
        lexToken,
        boolean_lexer, comment_lexer, identifier_lexer,
        line_terminator_lexer, null_lexer, number_lexer, punctuator_lexer,
        reserved_word_lexer, string_lexer, whitespace_lexer, regular_expression_lexer){
"use strict";

/* Helpers
 ******************************************************************************/
var positionParser = parse.extract(function(state) {
    return state.position;
});

var makeToken = function(type, p) {
    return parse.binda(
        parse.sequence(
            positionParser,
            p,
            positionParser),
        function(start, value, end) {
            var loc = new position.SourceLocation(start, end);
            return parse.always(new type(loc, value));
        });
};

/* Lexers
 ******************************************************************************/
var literal = parse.choice(
    parse.expected("string literal",
        makeToken(lexToken.StringToken, string_lexer.stringLiteral)),
    parse.expected("regular expression literal",
        makeToken(lexToken.RegularExpressionToken, regular_expression_lexer.regularExpressionLiteral)),
    parse.expected("boolean literal",
        makeToken(lexToken.BooleanToken, boolean_lexer.booleanLiteral)),
    parse.expected("null literal",
        makeToken(lexToken.NullToken, null_lexer.nullLiteral)),
    parse.expected("number literal",
        makeToken(lexToken.NumberToken, number_lexer.numericLiteral)));

var token = parse.choice(
    parse.attempt(parse.expected("identifier",
        makeToken(lexToken.IdentifierToken, identifier_lexer.identifier))),
    parse.attempt(literal),
    parse.attempt(parse.expected("reserved word",
        makeToken(lexToken.KeywordToken, reserved_word_lexer.reservedWord))),
    parse.expected("puctuator",
        makeToken(lexToken.PunctuatorToken, punctuator_lexer.punctuator)));

var inputElementRegExp = parse.choice(
    parse.expected("comment",
        makeToken(lexToken.CommentToken, comment_lexer.comment)),
    parse.expected("whitespace",
        makeToken(lexToken.WhitespaceToken, whitespace_lexer.whitespace)),
    parse.expected("line terminator",
        makeToken(lexToken.LineTerminatorToken, line_terminator_lexer.lineTerminator)),
    token);

/**
 * Parser for lexing ECMAScript 5.1 input.
 */
var lexer = parse.many(inputElementRegExp);

/* Running
 ******************************************************************************/
var lexManyState = function(p, state) {
    var manyP = parse.either(
        parse.bind(p, function(x, state, m) {
            return parse.always(stream.memoStream(x, parse.runState.bind(undefined, manyP, state, m)));
        }),
        parse.next(parse.eof(), parse.always(stream.end)));
    return parse.runState(manyP, state);
};

/**
 * Lexes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = function(input) {
    var state = new parse.ParserState(stream.from(input), new position.SourcePosition(0, 0));
    return lexManyState(inputElementRegExp, state);
};

/* Export
 ******************************************************************************/
return {
    'literal': literal,
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'lexer': lexer,
    
    'lex': lex,
};

});