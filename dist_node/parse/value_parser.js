/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/value_parser.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    ast_value = require("ecma-ast")["value"],
    token = require("./token_parser"),
    nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral, literal, identifier, choice =
        parse["choice"],
    label = parse["label"],
    map = parse["map"],
    p;
(nullLiteral = label("Null Literal", ((p = token.nullLiteral), map((function(x) {
    return new(ast_value.Literal)(x.loc, "null", x.value);
}), p))));
var p0;
(booleanLiteral = label("Boolean Literal", ((p0 = token.booleanLiteral), map((function(x) {
    return new(ast_value.Literal)(x.loc, "boolean", x.value);
}), p0))));
var p1;
(numericLiteral = label("Numeric Literal", ((p1 = token.numericLiteral), map((function(x) {
    return new(ast_value.Literal)(x.loc, "number", x.value);
}), p1))));
var p2;
(stringLiteral = label("String Literal", ((p2 = token.stringLiteral), map((function(x) {
    return new(ast_value.Literal)(x.loc, "string", x.value);
}), p2))));
var p3;
(regularExpressionLiteral = label("Regular Expression Literal", ((p3 = token.regularExpressionLiteral), map((function(x) {
    return new(ast_value.Literal)(x.loc, "regexp", x.value);
}), p3))));
(literal = label("Literal", choice(nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral)));
(identifier = label("Identifier", map((function(x) {
    return new(ast_value.Identifier)(x.loc, x.value);
}), token.anyIdentifier)));
(exports["nullLiteral"] = nullLiteral);
(exports["booleanLiteral"] = booleanLiteral);
(exports["numericLiteral"] = numericLiteral);
(exports["stringLiteral"] = stringLiteral);
(exports["regularExpressionLiteral"] = regularExpressionLiteral);
(exports["literal"] = literal);
(exports["identifier"] = identifier);