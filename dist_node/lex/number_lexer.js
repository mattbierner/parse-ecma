/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/number_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    parse_lang = require("bennu")["lang"],
    parse_text = require("bennu")["text"],
    __o = require("nu-stream")["stream"],
    decimal, negativeSign, positiveSign, exponentIndicator, hexIndicator, decimalDigit, nonZeroDigit, hexDigit,
        decimalDigits, hexDigits, hexIntegerLiteralDigits, unsignedInteger, signedInteger, exponentPart,
        hexIntegerLiteral, decimalIntegerLiteral, decimalLiteral, numericLiteral, foldl = __o["foldl"],
    __add = (function(x, y) {
        return (x + y);
    });
(decimal = parse_text.character("."));
(negativeSign = parse_text.character("-"));
(positiveSign = parse_text.character("+"));
(exponentIndicator = parse_text.match(/^e$/i));
(hexIndicator = parse.either(parse_text.string("0x"), parse_text.string("0X")));
(decimalDigit = parse.label("Decimal Digit Lexer", parse_text.match(/^[0-9]$/)));
(nonZeroDigit = parse.label("Non Zero Digit Lexer", parse_text.match(/^[1-9]$/)));
(hexDigit = parse.label("Hex Digit Lexer", parse_text.match(/^[0-9a-f]$/i)));
var p;
(decimalDigits = parse.label("Decimal Digits Lexer", ((p = parse.many1(decimalDigit)), parse.bind(p, (function(s) {
    return parse.always(foldl(__add, "", s));
})))));
var p0;
(hexDigits = parse.label("Hex Digits Lexer", ((p0 = parse.many1(hexDigit)), parse.bind(p0, (function(s) {
    return parse.always(foldl(__add, "", s));
})))));
(unsignedInteger = parse.label("Unsigned Integer Lexer", parse.bind(decimalDigits, (function(t) {
    return parse.always(parseInt(t));
}))));
(signedInteger = parse.label("Signed Integer Lexer", parse.either(parse.next(negativeSign, parse.bind(unsignedInteger, (
    function(num) {
        return parse.always((-num));
    }))), parse.next(parse.optional(null, positiveSign), unsignedInteger))));
(exponentPart = parse.label("Exponent Part Lexer", parse.next(exponentIndicator, parse.expected("exponent",
    signedInteger))));
(hexIntegerLiteralDigits = parse.label("Hex Integer Literal Digits Lexer", parse.bind(hexDigits, (function(num) {
    return parse.always(parseInt(num, 16));
}))));
(hexIntegerLiteral = parse.label("Hex Integer Literal Lexer", parse.next(hexIndicator, parse.expected("hex digits",
    hexIntegerLiteralDigits))));
(decimalIntegerLiteral = parse.label("Decimal Integer Literal", parse.bind(decimalDigits, (function(num) {
    return parse.always(parseInt(num));
}))));
var fractional;
(decimalLiteral = parse.label("Decimal Literal Lexer", ((fractional = parse.bind(decimalDigits, (function(frac) {
    return parse.always(parseFloat(("." + frac)));
}))), parse.binds(parse.enumeration(parse.attempt(parse.either(parse.next(decimal, parse.expected(
    "decimal digits", fractional)), parse.binds(parse.enumeration(decimalIntegerLiteral,
    parse.optional(0, parse.next(decimal, parse.optional(0, fractional)))), (function(
    whole, fractional0) {
    return parse.always((whole + fractional0));
})))), parse.optional(0, exponentPart)), (function(num, exp) {
    return parse.always((num * Math.pow(10, parseInt(exp))));
})))));
(numericLiteral = parse.label("Numeric Literal Lexer", parse.either(parse.next(parse.attempt(hexIndicator), parse.expected(
    "hex digits", hexIntegerLiteralDigits)), decimalLiteral)));
(exports["decimal"] = decimal);
(exports["negativeSign"] = negativeSign);
(exports["positiveSign"] = positiveSign);
(exports["exponentIndicator"] = exponentIndicator);
(exports["hexIndicator"] = hexIndicator);
(exports["decimalDigit"] = decimalDigit);
(exports["nonZeroDigit"] = nonZeroDigit);
(exports["hexDigit"] = hexDigit);
(exports["decimalDigits"] = decimalDigits);
(exports["hexDigits"] = hexDigits);
(exports["hexIntegerLiteralDigits"] = hexIntegerLiteralDigits);
(exports["unsignedInteger"] = unsignedInteger);
(exports["signedInteger"] = signedInteger);
(exports["exponentPart"] = exponentPart);
(exports["hexIntegerLiteral"] = hexIntegerLiteral);
(exports["decimalIntegerLiteral"] = decimalIntegerLiteral);
(exports["decimalLiteral"] = decimalLiteral);
(exports["numericLiteral"] = numericLiteral);