/**
 * @fileOverview Defines parsers for whitespace values based on ECMAScript 5.1.
 */
define([
    'bennu/parse',
    'bennu/text'],
function(parse,
        parse_text){
"use strict";

var tab = '\u0009',
    vt = '\u000B',
    ff = '\u000C',
    sp = '\u0020',
    nbsp = '\u00A0',
    bom = '\uFEFF';

/* Lexers
 ******************************************************************************/
/**
 * Tab
 */
var tabParser = parse_text.character(tab);

/**
 * Vertical Tab
 */
var vtParser = parse_text.character(vt);

/**
 * Form Feed
 */
var ffParser = parse_text.character(ff);

/**
 * Space
 */
var spParser = parse_text.character(sp);

/**
 * No-break space
 */
var nbspParser = parse_text.character(nbsp);

/**
 * Byte Order Mark
 */
var bomParser = parse_text.character(bom);

/**
 * Any Unicode space separator.
 */
var uspParser = parse.token(RegExp.prototype.test.bind(/^\s$/));

/**
 * A whitespace character.
 */
var whitespace = parse.Parser('Whitespace Lexer',
    parse_text.characters([tab, vt, ff, sp, nbsp, bom]));

/* Export
 ******************************************************************************/
return {
    'tab': tabParser,
    'vt': vtParser,
    'ff': ffParser,
    'sp': spParser,
    'nbsp': nbspParser,
    'bom': bomParser,
    'usp': uspParser,
    
    'whitespace': whitespace
};

});