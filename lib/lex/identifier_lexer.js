/**
 * @fileOverview ECMAScript identifier lexers.
 */
define(['parse/parse',
        'parse/text',
        'nu/stream',
        'ecma/lex/reserved_word_lexer',
        'ecma/lex/string_lexer'],
function(parse,
        parse_text,
        stream,
        reserved_word_lexer,
        string_lexer){
"use strict";

var join = function(p, c) {
    return p + c;
};

/* Lexers
 ******************************************************************************/
// Characters
////////////////////////////////////////
/**
 * Zero Width non-joiner Lexer
 */
var zwnj = parse_text.character('\u200c');

/**
 * Zero Width joiner Lexer
 */
var zwj = parse_text.character('\u200d')

/**
 * Lexer for a unicode letter character.
 * 
 * Any character in any of the Unicode categories:
 * - Uppercase letter (Lu)
 * - Lowercase letter (Ll)
 * - Titlecase letter (Lt)
 * - Modifier letter (Lm)
 * - Other letter (Lo)
 * - Letter number (Nl)
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeLetter = parse_text.letter; 

/**
 * Lexer for a Unicode digit character.
 * 
 * Any character in the Unicode category Decimal number (Nd).
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeDigit = parse_text.digit;

/**
 * Lexer for a Unicode connector punctuation character.
 * 
 * Any character in the Unicode category Connector Punctuation (Pc).
 */
var unicodeConnectorPunctuation = parse_text.characters([
    '\u005F',
    '\u203F',
    '\u2040',
    '\u2054',
    '\uFE33',
    '\uFE34',
    '\uFE4D',
    '\uFE4E',
    '\uFE4F',
    '\uFF3F']);

/**
 * Lexer for any combining mark Unicode character.
 * 
 * Any character in any of the Unicode categories:
 * - Non-spacing mark (Mn)
 * - Combining spacing mark (Mc)
 * 
 * @TODO Implement for unicode based on spec
 */
var unicodeCombiningMark = parse.never();

// Parts
////////////////////////////////////////
/**
 * Lexer for the start of an identifier.
 */
var identifierStart = parse.choice(
    unicodeLetter,
    parse_text.character('$'),
    parse_text.character('_'),
    parse.next(string_lexer.escape,
        string_lexer.unicodeEscapeSequence));

/**
 * Lexer for the rest of an identifier after the first character.
 */
var identifierPart = parse.choice(
    parse.attempt(identifierStart),
    unicodeCombiningMark,
    unicodeDigit,
    unicodeConnectorPunctuation,
    zwnj,
    zwj);

var identifierParts = parse.many(identifierPart);

/**
 * Lexer for any identifier name.
 * 
 * May be a keyword.
 */
var identifierName = parse.cons(identifierStart, identifierParts);

// Identifier
////////////////////////////////////////
var reservedWordTest = parse.next(
    reserved_word_lexer.reservedWord,
    parse.eof);

/**
 * Lexer for an identifier.
 * 
 * Checks to make sure returned identifier is not a keyword.
 */
var identifier = parse.Parser('Identifier Lexer',
    parse.bind(identifierName, function(name) {
        var v = stream.foldl(join, '', name);
        return (reserved_word_lexer.keywordList.indexOf(v) !== -1 ?
            parse.fail("Reserved words cannot be used as identifiers") :
            parse.always(v));
    }));

/* Export
 ******************************************************************************/
return {
// Characters
    'zwnj': zwnj,
    'zwj': zwj,
    'unicodeLetter': unicodeLetter,
    'unicodeDigit': unicodeDigit,
    'unicodeConnectorPunctuation': unicodeConnectorPunctuation,
    'unicodeCombiningMark': unicodeCombiningMark,
    
// Parts
    'identifierStart': identifierStart,
    'identifierPart': identifierPart,
    'identifierParts': identifierParts,
    'identifierName': identifierName,
    
// Identifier
    'identifier': identifier
};

});