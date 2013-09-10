/**
 * @fileOverview ECMAScript null value lexers.
 */
define(['parse/parse',
        'parse/text'],
function(parse,
        parse_text){
"use strict";

/* Lexers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Lexer that matches null literal.
 */
var nullLiteral = parse.Parser('Null Parser',
    parse.next(parse_text.string('null'),
        parse.always(null)));

/* Export
 ******************************************************************************/
return {
    'nullLiteral': nullLiteral
};

});