/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/value_parser.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    ast_value = require("ecma-ast")["value"],
    token = require("./token_parser"),
    nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral, literal, identifier, p;
(nullLiteral = parse.Parser("Null Literal", ((p = token.nullLiteral), parse.bind(p, (function(x) {
    return parse.always(new(ast_value.Literal)(x.loc, "null", x.value));
})))));
var p0;
(booleanLiteral = parse.Parser("Boolean Literal", ((p0 = token.booleanLiteral), parse.bind(p0, (function(x) {
    return parse.always(new(ast_value.Literal)(x.loc, "boolean", x.value));
})))));
var p1;
(numericLiteral = parse.Parser("Numeric Literal", ((p1 = token.numericLiteral), parse.bind(p1, (function(x) {
    return parse.always(new(ast_value.Literal)(x.loc, "number", x.value));
})))));
var p2;
(stringLiteral = parse.Parser("String Literal", ((p2 = token.stringLiteral), parse.bind(p2, (function(x) {
    return parse.always(new(ast_value.Literal)(x.loc, "string", x.value));
})))));
var p3;
(regularExpressionLiteral = parse.Parser("Regular Expression Literal", parse.next(parse.bind(parse.getParserState, (
    function(state) {
        return state.asRegExp();
    })), ((p3 = token.regularExpressionLiteral), parse.bind(p3, (function(x) {
    return parse.always(new(ast_value.Literal)(x.loc, "regexp", x.value));
}))))));
(literal = parse.Parser("Literal", parse.choice(nullLiteral, booleanLiteral, numericLiteral, stringLiteral,
    regularExpressionLiteral)));
(identifier = parse.Parser("Identifier", parse.bind(token.anyIdentifier, (function(x) {
    return parse.always(new(ast_value.Identifier)(x.loc, x.value));
}))));
(exports["nullLiteral"] = nullLiteral);
(exports["booleanLiteral"] = booleanLiteral);
(exports["numericLiteral"] = numericLiteral);
(exports["stringLiteral"] = stringLiteral);
(exports["regularExpressionLiteral"] = regularExpressionLiteral);
(exports["literal"] = literal);
(exports["identifier"] = identifier);