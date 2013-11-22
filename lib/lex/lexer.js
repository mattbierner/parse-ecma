/**
 * @fileOverview Lexers for ECMAScript 5.1.
 * 
 * As per the ECMAScript 5.1 spec, two top level symbols are defined, one
 * that supports leading division operators and division assignment operators, 
 * and one that does not.
 */
define(['parse/parse',
        'parse/lang',
        'nu/stream',
        'ecma_ast/token',
        'ecma_ast/position',
        'ecma/lex/boolean_lexer',
        'ecma/lex/comment_lexer',
        'ecma/lex/identifier_lexer',
        'ecma/lex/line_terminator_lexer',
        'ecma/lex/null_lexer', 
        'ecma/lex/number_lexer',
        'ecma/lex/punctuator_lexer',
        'ecma/lex/reserved_word_lexer',
        'ecma/lex/string_lexer',
        'ecma/lex/whitespace_lexer',
        'ecma/lex/regular_expression_lexer'],
function(parse,
        parse_lang,
        stream,
        token,
        position,
        boolean_lexer,
        comment_lexer,
        identifier_lexer,
        line_terminator_lexer,
        null_lexer,
        number_lexer,
        punctuator_lexer,
        reserved_word_lexer,
        string_lexer,
        whitespace_lexer,
        regular_expression_lexer){
"use strict";

var positionParser = parse.extract(function(state) {
    return state.position;
});

var makeToken = function(type, p) {
    return parse.bind(p, function(x) {
        return parse.always([type, x]);
    });
};

var buildToken = function(p) {
    return parse.binds(
        parse.enumeration(
            parse.getState,
            positionParser,
            p,
            positionParser),
        function(file, start, entry, end) {
            return parse.always(new (entry[0])(
                new position.SourceLocation(file, start, end),
                entry[1]));
        });
};

/* Lexers
 ******************************************************************************/
// Literal
////////////////////////////////////////
var stringLiteral = makeToken(token.StringToken, string_lexer.stringLiteral);
var booleanLiteral = makeToken(token.BooleanToken, boolean_lexer.booleanLiteral);
var nullLiteral = makeToken(token.NullToken, null_lexer.nullLiteral);
var numericLiteral = makeToken(token.NumberToken, number_lexer.numericLiteral);
var regularExpressionLiteral = makeToken(token.RegularExpressionToken, regular_expression_lexer.regularExpressionLiteral);

/**
 * Literal in division contexts.
 */
var literalDiv = parse.choice(
    parse.expected("string literal", stringLiteral),
    parse.expected("boolean literal", booleanLiteral),
    parse.expected("null literal", nullLiteral),
    parse.expected("numeric literal", numericLiteral));

/**
 * Literal in non-division contexts.
 */
var literalRegExp = parse.choice(
    parse.expected("string literal", stringLiteral),
    parse.expected("boolean literal", booleanLiteral),
    parse.expected("null literal", nullLiteral),
    parse.expected("numeric literal", numericLiteral),
    parse.expected("regular expression literal", regularExpressionLiteral));

// Token
////////////////////////////////////////
var identifier = makeToken(token.IdentifierToken, identifier_lexer.identifier);
var reservedWord = makeToken(token.KeywordToken, reserved_word_lexer.reservedWord);
var punctuator = makeToken(token.PunctuatorToken, punctuator_lexer.punctuator);
var divPunctuator = makeToken(token.PunctuatorToken, punctuator_lexer.divPunctuator);

/**
 * Lexer for a token in division contexts.
 */
var tokenDiv = parse.choice(
    parse.attempt(parse.expected("identifier", identifier)),
    literalDiv,
    parse.expected("reserved word", reservedWord),
    parse.expected("punctuator", parse.either(
        punctuator,
        divPunctuator)));

/**
 * Lexer for a token in non-division contexts.
 */
var tokenRegExp = parse.choice(
    parse.attempt(parse.expected("identifier", identifier)),
    literalRegExp,
    parse.expected("reserved word", reservedWord),
    parse.expected("punctuator", punctuator));

// Input Element
////////////////////////////////////////
var comment = makeToken(token.CommentToken, comment_lexer.comment);
var whitespace = makeToken(token.WhitespaceToken, whitespace_lexer.whitespace);
var lineTerminator = makeToken(token.LineTerminatorToken, line_terminator_lexer.lineTerminator);

/**
 * Lexer for a top level element in division contexts.
 */
var inputElementDiv = parse.choice(
    parse.expected("comment", comment),
    parse.expected("whitespace", whitespace),
    parse.expected("line terminator", lineTerminator),
    tokenDiv);

/**
 * Lexer for a top level element in non-division contexts.
 */
var inputElementRegExp = parse.choice(
    parse.expected("comment", comment),
    parse.expected("whitespace", whitespace),
    parse.expected("line terminator", lineTerminator),
    tokenRegExp);

// Lexers
////////////////////////////////////////
/**
 * Lexer for a stream of tokens in leading division grammars.
 * 
 * Lexes as much input as possible, does not check for eof.
 */
var lexerDiv = parse.many(buildToken(inputElementDiv));

/**
 * Lexer for a stream of tokens in non leading division grammars.
 * 
 * Lexes as much input as possible, does not check for eof.
 */
var lexerRegExp = parse.many(buildToken(inputElementRegExp));

/* Running
 ******************************************************************************/
// Lex Div 
////////////////////////////////////////
/**
 * Lexes state in division context.
 */
var lexDivState = function(state) {
    return parse.runState(
        parse_lang.then(
            lexerDiv,
            parse.eof),
        state);
};

/**
 * Lexes stream in division context.
 */
var lexDivStream = function(s, file) {
    return lexDivState(
        new parse.ParserState(
            s,
            position.SourcePosition.initial,
            file));
};

/**
 * Lexes array-like input in division context.
 */
var lexDiv = function(input) {
    return lexDivStream(stream.from(input));
};

// Lex RegExp 
////////////////////////////////////////
/**
 * Lexes state in non-division context.
 */
var lexRegExpState = function(state) {
    return parse.runState(
        parse_lang.then(
            lexerRegExp,
            parse.eof),
        state);
};

/**
 * Lexes stream in non-division context.
 */
var lexRegExpStream = function(s, file) {
    return lexRegExpState(
        new parse.ParserState(
            s,
            position.SourcePosition.initial,
            file));
};

/**
 * Lexes array-like in non-division context.
 */
var lexRegExp = function(input) {
    return lexRegExpStream(stream.from(input));
};

/* Export
 ******************************************************************************/
return {
// Tokens
    'stringLiteral': buildToken(stringLiteral),
    'booleanLiteral': buildToken(booleanLiteral),
    'nullLiteral': buildToken(nullLiteral),
    'numericLiteral': buildToken(numericLiteral),
    'regularExpressionLiteral': buildToken(regularExpressionLiteral),
    'literalDiv': buildToken(literalDiv),
    'literalRegExp': buildToken(literalRegExp),
    
    'identifier': buildToken(identifier),
    'reservedWord': buildToken(reservedWord),
    'punctuator': buildToken(punctuator),
    'divPunctuator': buildToken(divPunctuator),
    'tokenDiv': buildToken(tokenDiv),
    'tokenRegExp': buildToken(tokenRegExp),
    
    'comment': buildToken(comment),
    'whitespace': buildToken(whitespace),
    'lineTerminator': buildToken(lineTerminator),

// input elements
    'inputElementDiv': buildToken(inputElementDiv),
    'inputElementRegExp': buildToken(inputElementRegExp),

// lexers
    'lexerDiv': lexerDiv,
    'lexerRegExp': lexerRegExp,
    
// lex div
    'lexDivState': lexDivState,
    'lexDivStream': lexDivStream,
    'lexDiv': lexDiv,
    
// lex regexp
    'lexRegExpState': lexRegExpState,
    'lexRegExpStream': lexRegExpStream,
    'lexRegExp': lexRegExp
};

});