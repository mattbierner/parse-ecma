/**
 * @fileOverview ECMAScript number lexers.
 */
define(['bennu/parse',
        'bennu/lang',
        'bennu/text',
        'nu-stream/stream'],
function(parse,
        parse_lang,
        parse_text,
        stream){
"use strict";

/* Helpers
 ******************************************************************************/
var joinLexer = function(p, joiner) {
    var join = function(p, c) {
        return p + joiner + c;
    };
    return parse.bind(p, function(s) {
        return parse.always(stream.foldl(join, '', s));
    });
};

/* Lexers
 ******************************************************************************/
// Constants
////////////////////////////////////////
/**
 * Lexer that matches decimal character.
 */
var decimal = parse.Parser('Decimal Lexer',
    parse_text.character('.'));

/**
 * Lexer that matches negative sign.
 */
var negativeSign = parse.Parser('Negative Sign Lexer',
    parse_text.character('-'));

/**
 * Lexer that matches positive sign.
 */
var positiveSign = parse.Parser('Positive Sign Lexer',
    parse_text.character('+'));

/**
 * Lexer that matches character that indicates the beginning of the exponent
 * part of a number.
 * Either: 'e' or 'E'.
 */
var exponentIndicator =  parse.Parser('Exponent Indicator Lexer',
    parse_text.match(/^e$/i));

/**
 * Lexer that matches characters that indicate the beginning of a hex number,
 * Either: '0x' or '0X'.
 */
var hexIndicator = parse.Parser('Hex Indicator Lexer',
    parse.either(
        parse_text.string('0x'),
        parse_text.string('0X')));

// Digits
////////////////////////////////////////
/**
 * Lexer that matches any decimal number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var decimalDigit = parse.Parser('Decimal Digit Lexer',
    parse_text.match(/^[0-9]$/));

/**
 * Lexer that matches any non zero decimal number digit.
 * One of: '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var nonZeroDigit = parse.Parser('Non Zero Digit Lexer',
    parse_text.match(/^[1-9]$/));

/**
 * Lexer that matches any hex number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
 * 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'
 */
 var hexDigit = parse.Parser('Hex Digit Lexer',
     parse_text.match(/^[0-9a-f]$/i));

/**
 * Lexer that matches a string of one or more decimal digits.
 */
var decimalDigits = parse.Parser('Decimal Digits Lexer',
    joinLexer(parse.many1(decimalDigit), ''));

/**
 * Lexer that matches a string of one or more hex digits.
 */
var hexDigits = parse.Parser('Hex Digits Lexer',
    joinLexer(parse.many1(hexDigit), ''));

// Integer
////////////////////////////////////////
/**
 * Lexer that matches an unsigned integer.
 * 
 * Returns the numeric value of the integer.
 */
var unsignedInteger = parse.Parser('Unsigned Integer Lexer',
    parse.bind(decimalDigits, function(t) {
        return parse.always(parseInt(t));
    }));

/**
 * Lexer that matches a signed integer.
 * 
 * Returns the numeric value of the integer.
 */
var signedInteger = parse.Parser('Signed Integer Lexer',
    parse.either(
        parse.next(
            negativeSign,
            parse.bind(unsignedInteger, function(num) {
                return parse.always(-num);
            })),
        parse.next(
            parse.optional(null, positiveSign),
            unsignedInteger)));

// Part
////////////////////////////////////////
/**
 * Lexer that matches the exponent part of a number.
 * 
 * Returns the numeric value of the exponent part.
 */
var exponentPart = parse.Parser('Exponent Part Lexer',
    parse.next(
        exponentIndicator,
        parse.expected('exponent', signedInteger)));

/**
 * Digits of a hex number literal.
 */
var hexIntegerLiteralDigits = parse.Parser('Hex Integer Literal Digits Lexer',
    parse.bind(hexDigits, function(num) {
        return parse.always(parseInt(num, 16));
    }));

// Literals
////////////////////////////////////////
/**
 * A hex number literal.
 */
var hexIntegerLiteral = parse.Parser('Hex Integer Literal Lexer',
    parse.next(
        hexIndicator,
        parse.expected('hex digits', hexIntegerLiteralDigits)));

/**
 * A integer number literal.
 * 
 * Returns the number value of the input.
 */
var decimalIntegerLiteral = parse.Parser('Decimal Integer Literal',
    parse.bind(decimalDigits, function(num) {
        return parse.always(parseInt(num));
    }));

/**
 * A decimal number literal.
 * 
 * Either a integer or a decimal number. Before or after the decimal must contain
 * at least one number. May contain an exponent value at the end.
 * 
 * @return Number value of the input.
 */
var decimalLiteral = parse.Parser('Decimal Literal Lexer',
(function(){
    var fractional = parse.bind(decimalDigits, function(frac) {
        return parse.always(parseFloat('.' + frac));
    });
    
    return parse.binds(
        parse.enumeration(
            parse.attempt(parse.either(
                parse.next(
                    decimal,
                    parse.expected('decimal digits', fractional)),
                parse.binds(
                    parse.enumeration(
                        decimalIntegerLiteral,
                        parse.optional(0,
                            parse.next(
                                decimal,
                                parse.optional(0, fractional)))),
                    function(whole, fractional) {
                        return parse.always(whole + fractional);
                    }))),
            parse.optional(0, exponentPart)),
        function(num, exp) {
            return parse.always(num * Math.pow(10, parseInt(exp)));
    });
}()));


/**
 * Literal for any numeric value
 * 
 * @return Number value of the input.
 */
var numericLiteral = parse.Parser('Numeric Literal Lexer',
    parse.either(
        parse.next(
            parse.attempt(hexIndicator),
            parse.expected('hex digits', hexIntegerLiteralDigits)),
        decimalLiteral));

/* Export
 ******************************************************************************/
return {
// Constants
    'decimal': decimal,
    'negativeSign': negativeSign,
    'positiveSign': positiveSign,
    'exponentIndicator': exponentIndicator,
    'hexIndicator': hexIndicator,

// Digits
    'decimalDigit': decimalDigit,
    'nonZeroDigit': nonZeroDigit,
    'hexDigit': hexDigit,
    'decimalDigits': decimalDigits,
    'hexDigits': hexDigits,

// Integer
    'unsignedInteger': unsignedInteger,
    'signedInteger': signedInteger,

// Part
    'exponentPart': exponentPart,

// Literals
    'hexIntegerLiteral': hexIntegerLiteral,
    'decimalIntegerLiteral': decimalIntegerLiteral,
    'decimalLiteral': decimalLiteral,

    'numericLiteral': numericLiteral
};

});