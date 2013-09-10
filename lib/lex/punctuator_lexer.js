/**
 * @fileOverview Lexers for ECMAScript 5.1 punctuators.
 */
define(['parse/parse', 'parse/text'],
function(parse, parse_text){
"use strict";

/* Objects
 ******************************************************************************/
var punctuators = [
    '{', '}', '(', ')', ',', '[', ']', '.', ';', ',', ':', '?', '&&', '||', '<<', '>>',
    '>>>', '<=', '<', '>=', '>', '===', '!==', '==', '!=', '=', '<<=', '>>=',
    '>>>=', '+=', '-=', '*=', '%=', '++', '--', '!', '~', '&', '|', '^', '+',
    '-', '*', '%'];

/* Lexers
 ******************************************************************************/
// Brackets and Braces
////////////////////////////////////////
var openBrace = parse_text.character('{');
var closeBrace = parse_text.character('}');

var openParenthesis = parse_text.character('(');
var closeParenthesis = parse_text.character(')');

var openBracket= parse_text.character('[');
var closeBracket= parse_text.character(']');

// Punctuation
////////////////////////////////////////
var period = parse_text.character('.');

var semicolon = parse_text.character(';');

var comma = parse_text.character(',');

// Conditional
////////////////////////////////////////
var colon = parse_text.character(':');

var questionMark = parse_text.character('?');

// Logical
////////////////////////////////////////
var logicalAnd = parse_text.string('&&');

var logicalOr = parse_text.string('||');

// Shifts
////////////////////////////////////////
var leftShift = parse_text.string('<<');

var signedRightShift = parse_text.string('>>');

var unsignedRightShift = parse_text.string('>>>');

// Relational
////////////////////////////////////////
var lessThanOrEqualTo = parse_text.string('<=');
var lessThan = parse_text.character('<');

var greaterThanOrEqualTo = parse_text.string('>=');
var greaterThan = parse_text.character('>');

// Equality
////////////////////////////////////////
var strictEquals = parse_text.string('===');
var strictDoesNotEqual = parse_text.string('!==');

var equals = parse_text.string('==');
var doesNotEqual = parse_text.string('!=');

// Assignment
////////////////////////////////////////
var assign = parse_text.character('=');

var leftShiftAssignment = parse_text.string('<<=');

var signedRightShiftAssignment = parse_text.string('>>=');

var unsignedRightShiftAssignment = parse_text.string('>>>=');

var additionAssignment = parse_text.string('+=');

var subtrationAssignment = parse_text.string('-=');

var multiplicationAssignment = parse_text.string('*=');

var divisionAssignment = parse_text.string('/=');

var modAssignment = parse_text.string('%=');

// Unary
////////////////////////////////////////
var increment = parse_text.string('++');

var decrement = parse_text.string('--');

var logicalNot = parse_text.character('!');

var bitwiseNot = parse_text.character('~');

// Bitwise
////////////////////////////////////////
var and = parse_text.character('&');

var or = parse_text.character('|');

var xor = parse_text.character('^');

// Additive Operators
////////////////////////////////////////
var addition = parse_text.character('+');

var subtration = parse_text.character('-');

// Multiplicative Operators
////////////////////////////////////////
var multiplication = parse_text.character('*');

var division = parse_text.character('/');

var mod = parse_text.character('%');

// Punctuators
////////////////////////////////////////
/**
 * Lexer for punctuators excluding division punctuators.
 */
var punctuator = parse.Parser('Punctuator Lexer',
    parse_text.trie(punctuators));

/**
 * Lexer for division punctuators.
 */
var divPunctuator = parse.either(
    divisionAssignment,
    division);


/* Export
 ******************************************************************************/
return {
// Brackets and Braces
    'openBrace': openBrace,
    'closeBrace': closeBrace,
    'openParenthesis': openParenthesis,
    'closeParenthesis': closeParenthesis,
    'openBracket': openBracket,
    'closeBracket': closeBracket,
    'period': period,
    'semicolon': semicolon,
    'comma': comma,
    'colon': colon,
    'questionMark': questionMark,
    
// Logical
    'logicalAnd': logicalAnd,
    'logicalOr': logicalOr,

// Shifts
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,

// Relational
    'lessThanOrEqualTo': lessThanOrEqualTo,
    'lessThan': lessThan,
    'greaterThanOrEqualTo': greaterThanOrEqualTo,
    'greaterThan': greaterThan,

// Equality
    'strictEquals': strictEquals,
    'strictDoesNotEqual': strictDoesNotEqual,
    'equals': equals,
    'doesNotEqual': doesNotEqual,
    
// bitwise
    'and': and,
    'or': or,
    'xor': xor,
    
// Assignment Operators
    'assign': assign,
    'leftShiftAssignment': leftShiftAssignment,
    'signedRightShiftAssignment': signedRightShiftAssignment,
    'unsignedRightShiftAssignment': unsignedRightShiftAssignment,
    'additionAssignment': additionAssignment,
    'subtrationAssignment': subtrationAssignment,
    'multiplicationAssignment': multiplicationAssignment,
    'modAssignment': modAssignment,

// Additive Operators
    'increment': increment,
    'decrement': decrement,
    'logicalNot': logicalNot,
    'bitwiseNot': bitwiseNot,

// Additive Operators
    'addition': addition,
    'subtration': subtration,
    
// Multiplicative Operators
    'multiplication': multiplication,
    'mod': mod,

// Punctuators
    'punctuator': punctuator,
    'divPunctuator': divPunctuator
};
});