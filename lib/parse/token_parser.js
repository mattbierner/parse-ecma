/**
 * @fileOverview Parsers for working with lex tokens.
 */
define(['parse/parse'],
function(parse){
"use strict";

var indexOf = Function.prototype.call.bind(Array.prototype.indexOf);
var join = Function.prototype.call.bind(Array.prototype.join);

var expectError = function(msg) {
    return function(pos, tok) {
        return new parse.ExpectError(pos, msg, (tok === null ? "end of input" : tok.value));
    };
};

var typeParser = function(type, msg) {
    return parse.token(function(tok) {
        return (tok.type === type);
    }, expectError(msg));
};

var selectAny = function(type) {
    return function(/*...*/) {
        var options = arguments;
        return parse.token(function(tok) {
            return (tok.type === type && indexOf(options, tok.value) >= 0);
        }, expectError(join(options, ', ')));
    };
}

/* Parsers
 ******************************************************************************/
// Punctuator
////////////////////////////////////////
var anyPunctuator = typeParser('Punctuator', 'any punctuator');

var punctuator = selectAny('Punctuator');

/**
 * Consume any keyword.
 */
var anyKeyword = typeParser('Keyword', 'any keyword');

/**
 * Consume a specific keyword 'v'.
 */
var keyword = selectAny('Keyword');

/**
 * Consume any identifier.
 */
var anyIdentifier = parse.Parser('Identifier',
    parse.token(function(tok) {
        return (tok.type === 'Identifier');
    }, expectError('any identifier')));
  

/**
 * Consume a specific identifier 'v'.
 */
var identifier = selectAny('Identifier');

/**
 * Consume null literal token.
 */
var nullLiteral = parse.Parser('Null Literal',
    parse.token(function(tok) {
        return (tok.type === 'Null');
    }, expectError('Null Literal')));

/**
 * Consume boolean literal token.
 */
var booleanLiteral = parse.Parser('Boolean Literal',
    parse.token(function(tok) {
        return (tok.type === 'Boolean');
    }, expectError('Boolean Literal')));

/**
 * Consume numeric literal token.
 */
var numericLiteral = parse.Parser('Numeric Literal',
    parse.token(function(tok) {
        return (tok.type === 'Number');
    }, expectError('Numeric Literal')));

/**
 * Consume string literal token.
 */
var stringLiteral = parse.Parser('String Literal',
    parse.token(function(tok) {
        return (tok.type === 'String');
    }, expectError('String Literal')));

/**
 * Consume regular expression literal token.
 */
var regularExpressionLiteral = parse.Parser('Regular Expression Literal',
    parse.token(function(tok) {
        return (tok.type === 'RegularExpression');
    }, expectError('Regular Expression Literal')));

/* Export
 ******************************************************************************/
return {
    'punctuator': punctuator,
    'anyPunctuator': anyPunctuator,
    
    'keyword': keyword,
    'anyKeyword': anyKeyword,
    
    'identifier': identifier,
    'anyIdentifier': anyIdentifier,
    
    'nullLiteral': nullLiteral,
    'booleanLiteral': booleanLiteral,
    'numericLiteral': numericLiteral,
    'stringLiteral': stringLiteral,
    'regularExpressionLiteral': regularExpressionLiteral
};

});