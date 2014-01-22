/**
 * @fileOverview ECMAScript boolean value lexers.
 */
define([
    'bennu/parse',
    'bennu/text'],
function(parse,
        parse_text){
"use strict";

/* Lexers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Lexer for true literal.
 * 
 * Returns true.
 */
var trueLiteral = parse.Parser('True Literal Lexer',
    parse.next(parse_text.string('true'),
        parse.always(true)));

/**
 * Lexer for false literal.
 * 
 * Returns false
 */
var falseLiteral = parse.Parser('False Literal Lexer',
    parse.next(parse_text.string('false'),
        parse.always(false)));

/**
 * Lexer that matches boolean literal.
 * 
 * Returns the value of the boolean literal
 */
var booleanLiteral = parse.Parser('Boolean Literal Lexer',
    parse.either(
        trueLiteral,
        falseLiteral));

/* Export
 ******************************************************************************/
return {
    'trueLiteral': trueLiteral,
    'falseLiteral': falseLiteral,
    'booleanLiteral': booleanLiteral
};

});