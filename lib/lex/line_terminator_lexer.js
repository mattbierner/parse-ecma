/**
 * @fileOverview Lexers for line terminators based on ECMAScrLexeript 5.1.
 */
define(['parse/parse',
        'parse/text'],
function(parse,
        parse_text){
"use strict";

var lf = '\u000A',
    cr = '\u000D',
    ls = '\u2028',
    ps = '\u2029';

/* Lexers
 ******************************************************************************/
/**
 * Line Feed
 */
var lfLexer = parse.Parser('Line Feed Lexer',
    parse_text.character(lf));

/**
 * Carriage Return
 */
var crLexer = parse.Parser('Carriage Return Lexer',
    parse_text.character(cr));

/**
 * Line Separator
 */
var lsLexer = parse.Parser('Line Separator Lexer',
    parse_text.character(ls));

/**
 * Paragraph Separator
 */
var psLexer = parse.Parser('Paragraph Separator Lexer',
    parse_text.character(ps));

/**
 * A line terminator character.
 */
var lineTerminator = parse.Parser('Line Terminator Lexer',
    parse_text.characters([lf, cr, ls, ps]));

/**
 * A sequence of characters denoting a linter terminator.
 * 
 * crlf sequences are returned as a single token.
 */
var lineTerminatorSequence = parse.Parser('Line Terminator Sequence Lexer',
    parse.choice(
        lfLexer,
        lsLexer,
        psLexer,
        parse.next(
            crLexer,
            parse.optional(cr,
                parse.next(lfLexer,
                    parse.always(cr + lf))))));

/* Export
 ******************************************************************************/
return {
    'lf': lfLexer,
    'cr': crLexer,
    'ls': lsLexer,
    'ps': psLexer,

    'lineTerminator': lineTerminator,
    'lineTerminatorSequence': lineTerminatorSequence
};

});