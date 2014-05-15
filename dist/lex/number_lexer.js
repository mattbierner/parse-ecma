/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/number_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream"], (function(require, exports, parse, __o,
    __o0) {
    "use strict";
    var decimal, negativeSign, positiveSign, exponentIndicator, hexIndicator, decimalDigit, nonZeroDigit,
            hexDigit, decimalDigits, hexDigits, hexIntegerLiteralDigits, unsignedInteger, signedInteger,
            exponentPart, hexIntegerLiteral, decimalIntegerLiteral, decimalLiteral, numericLiteral, either =
            parse["either"],
        expected = parse["expected"],
        label = parse["label"],
        map = parse["map"],
        many1 = parse["many1"],
        next = parse["next"],
        optional = parse["optional"],
        character = __o["character"],
        string = __o["string"],
        oneOf = __o["oneOf"],
        foldl = __o0["foldl"],
        __minus = (function(x) {
            return (-x);
        }),
        __add = (function(x, y) {
            return (x + y);
        }),
        join = map.bind(null, foldl.bind(null, __add, ""));
    (decimal = character("."));
    (negativeSign = character("-"));
    (positiveSign = character("+"));
    (exponentIndicator = oneOf("eE"));
    (hexIndicator = either(string("0x"), string("0X")));
    (decimalDigit = oneOf("0123456789"));
    (nonZeroDigit = oneOf("123456789"));
    (hexDigit = oneOf("0123456789abcdefABCDEF"));
    (decimalDigits = join(many1(decimalDigit)));
    (hexDigits = join(many1(hexDigit)));
    (unsignedInteger = label("Unsigned Integer Lexer", map(parseInt, decimalDigits)));
    (signedInteger = label("Signed Integer Lexer", either(next(negativeSign, map(__minus, unsignedInteger)),
        next(optional(positiveSign), unsignedInteger))));
    (exponentPart = label("Exponent Part Lexer", next(exponentIndicator, expected("exponent", signedInteger))));
    (hexIntegerLiteralDigits = parse.label("Hex Integer Literal Digits Lexer", parse.bind(hexDigits, (function(
        num) {
        return parse.always(parseInt(num, 16));
    }))));
    (hexIntegerLiteral = label("Hex Integer Literal Lexer", next(hexIndicator, expected("hex digits",
        hexIntegerLiteralDigits))));
    (decimalIntegerLiteral = label("Decimal Integer Literal", map(parseInt, decimalDigits)));
    var fractional;
    (decimalLiteral = parse.label("Decimal Literal Lexer", ((fractional = parse.bind(decimalDigits, (function(
        frac) {
        return parse.always(parseFloat(("." + frac)));
    }))), parse.binds(parse.enumeration(parse.attempt(parse.either(parse.next(decimal, parse.expected(
        "decimal digits", fractional)), parse.binds(parse.enumeration(
        decimalIntegerLiteral, parse.optional(0, parse.next(decimal, parse.optional(
            0, fractional)))), (function(whole, fractional0) {
        return parse.always((whole + fractional0));
    })))), parse.optional(0, exponentPart)), (function(num, exp) {
        return parse.always((num * Math.pow(10, parseInt(exp))));
    })))));
    (numericLiteral = parse.label("Numeric Literal Lexer", either(next(hexIndicator, parse.expected(
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
}));