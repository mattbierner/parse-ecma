/**
 * @fileOverview Parsers for working with lex tokens.
 */
define(['parse/parse',
        'ecma/ast/value'],
function(parse,
        astValue){
"use strict";

var expectError = function(msg) {
    return function(pos, tok) {
        return new parse.ExpectError(pos, msg + " Found:" + tok.value);
    };
};

var typeParser = function(type, msg) {
    return parse.token(function(tok) {
        return (tok.type === type);
    }, expectError(msg));
};

/* Parsers
 ******************************************************************************/
// Punctuator
////////////////////////////////////////
var anyPunctuator = typeParser('Punctuator', 'any punctuator');

var punctuator = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Punctuator' && tok.value === v);
    }, expectError(v));
};

/**
 * Consume any keyword.
 */
var anyKeyword = typeParser('Keyword', 'any keyword');

/**
 * Consume a specific keyword 'v'.
 */
var keyword = parse.Parser('Keyword',
    function(v) {
        return parse.token(function(tok) {
            return (tok.type === 'Keyword' && tok.value === v);
        }, expectError(v));
    });

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
var identifier = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Identifier' && tok.value === v);
    }, expectError(v));
};

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