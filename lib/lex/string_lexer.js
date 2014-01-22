/**
 * @fileOverview Lexers for ECMAScript 5.1 string values.
 */
define(['bennu/parse', 'bennu/text', 'bennu/lang',
        'nu-stream/stream',
        'ecma/lex/line_terminator_lexer', 'ecma/lex/number_lexer'],
function(parse, parse_text, parse_lang,
        stream,
        line_terminator_lexer, number_lexer){
"use strict";

var join = function(p, c) {
    return p + "" + c;
};

/* Helpers
 ******************************************************************************/
var fromCharCodeParser = function(digits) {
    return parse.always(String.fromCharCode(parseInt(stream.foldl(join, '', digits), 16)));
};

/* Lexers
 ******************************************************************************/
// Constants
////////////////////////////////////////
var doubleQuote = parse_text.character('"');
var escape = parse_text.character('\\');
var singleQuote = parse_text.character("'");

/**
 * Lexer for string line continuation.
 * 
 * Returns an empty string.
 */
var lineContinuation = parse.next(
    parse.next(escape, line_terminator_lexer.lineTerminatorSequence),
    parse.always(''));

// Escape Character
////////////////////////////////////////
/**
 * Lexer for a single escape character.
 * 
 * Returns the value represented by the escape character.
 */
var singleEscapeCharacter = parse.choice(
    parse_text.character("'"),
    parse_text.character('"'),
    parse_text.character('\\'),
    parse.next(parse_text.character('b'), parse.always('\u0008')),
    parse.next(parse_text.character('f'), parse.always('\u000C')),
    parse.next(parse_text.character('n'), parse.always('\u000A')),
    parse.next(parse_text.character('r'), parse.always('\u000D')),
    parse.next(parse_text.character('t'), parse.always('\u0009')),
    parse.next(parse_text.character('v'), parse.always('\u000B')));

/**
 * 
 */
var escapeCharacter = parse.choice(
    singleEscapeCharacter,
    number_lexer.decimalDigit,
    parse_text.character('u'),
    parse_text.character('x'));

/**
 * Lexer for a string character which is not an escape character.
 */
var nonEscapeCharacter = parse.token(function(tok) {
    return !(parse.test(escapeCharacter, tok) ||
        parse.test(line_terminator_lexer.lineTerminator, tok));
});

// Escape Sequence
////////////////////////////////////////
/**
 * Lexer for a hex escape sequence.
 * 
 * Returns the character defined by the escape sequence.
 */
var hexEscapeSequence = parse.next(
    parse_text.character('x'),
    parse.bind(parse_lang.times(2, number_lexer.hexDigit),
        fromCharCodeParser));

/**
 * Lexer for a unicode escape sequence.
 * 
 * Returns the unicode character defined by the escape sequence.
 */
var unicodeEscapeSequence = parse.next(
    parse_text.character('u'),
    parse.bind(parse_lang.times(4, number_lexer.hexDigit),
        fromCharCodeParser));

/**
 * Lexer for a character escape sequence.
 */
var characterEscapeSequence = parse.either(
    singleEscapeCharacter,
    nonEscapeCharacter);

/**
 * Lexer for an escape sequence.
 * 
 * Returns the character defined by the escape sequence.
 */
var escapeSequence = parse.choice(
    characterEscapeSequence,
    parse.next(
        parse_text.character('0'),
        parse.next(
            parse.either(
                parse.eof,
                parse.token(function(tok) {
                    return !parse.test(number_lexer.decimalDigit, tok);
                })
            ),
        parse.always('\u0000'))),
    hexEscapeSequence,
    unicodeEscapeSequence);

// Single String Literal
////////////////////////////////////////
/**
 * Lexer for a valid single string character.
 */
var singleStringCharacter = parse.choice(
    parse.attempt(lineContinuation),
    parse.next(escape, escapeSequence),
    parse.token(function(tok) {
        return !(parse.test(singleQuote, tok) ||
            parse.test(escape, tok) || 
            parse.test(line_terminator_lexer.lineTerminator, tok));
    }));

/**
 * Lexer for a sequence of single string characters.
 */
var singleStringCharacters = parse.many(singleStringCharacter);

/**
 * Lexer for a single quoted string literal.
 * 
 * Returns the value of the string enclosed in the single quoted string literal.
 */
var singleStringLiteral = parse.Parser('Single String Literal',
    parse_lang.between(singleQuote, singleQuote,
        parse.bind(singleStringCharacters, function(str) {
            return parse.always(stream.foldl(join, '', str));
        })));

// Double String Literal
////////////////////////////////////////
/**
 * Lexer for a valid double string character
 */
var doubleStringCharacter = parse.choice(
    parse.attempt(lineContinuation),
    parse.next(escape, escapeSequence),
    parse.token(function(tok) {
        return !(parse.test(doubleQuote, tok) ||
            parse.test(escape, tok) ||
            parse.test(line_terminator_lexer.lineTerminator, tok));
    }));

/**
 * Lexer for a sequence of double string characters.
 */
var doubleStringCharacters = parse.many(doubleStringCharacter);

/**
 * Lexer for a double quoted string literal.
 * 
 * Returns the value of the string enclosed in the double quoted string literal.
 */
var doubleStringLiteral = parse.Parser('Double String Literal',
    parse_lang.between(doubleQuote, doubleQuote,
        parse.bind(doubleStringCharacters, function(str) {
            return parse.always(stream.foldl(join, '', str));
        })));

// String Literal
////////////////////////////////////////
/**
 * Lexer for a string literal.
 * 
 * Returns the value of the string enclosed in the string literal.
 */
var stringLiteral = parse.Parser('Sting Literal Lexer',
    parse.either(
        singleStringLiteral,
        doubleStringLiteral));


/* Export
 ******************************************************************************/

return {
// Constants
    'doubleQuote': doubleQuote,
    'escape': escape,
    'singleQuote': singleQuote,
    
// Escape Sequences
    'unicodeEscapeSequence': unicodeEscapeSequence,
    'hexEscapeSequence': hexEscapeSequence,
    'escapeSequence': escapeSequence,
    
// Single String Literal
    'singleStringCharacter': singleStringCharacter,
    'singleStringCharacters': singleStringCharacters,
    'singleStringLiteral': singleStringLiteral,
    
// Double String Literal
    'doubleStringCharacter': doubleStringCharacter,
    'doubleStringCharacters': doubleStringCharacters,
    'doubleStringLiteral': doubleStringLiteral,

// Literal
    'stringLiteral': stringLiteral
};

});