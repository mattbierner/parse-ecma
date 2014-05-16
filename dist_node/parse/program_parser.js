/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    parse_lang = require("bennu")["lang"],
    stream = require("nu-stream")["stream"],
    ast_declaration = require("ecma-ast")["declaration"],
    ast_expression = require("ecma-ast")["expression"],
    ast_program = require("ecma-ast")["program"],
    ast_statement = require("ecma-ast")["statement"],
    __o = require("./common"),
    token = require("./token_parser"),
    value = require("./value_parser"),
    statement = require("./statement_parser"),
    functionBody, functionExpression, functionDeclaration, sourceElement, sourceElements, program, late = parse["late"],
    node = __o["node"],
    nodea = __o["nodea"],
    keyword = token["keyword"],
    punctuator = token["punctuator"],
    statementlabel = late((function() {
        var __o0 = require("ecma/parse/statement_parser"),
            statement0 = __o0["statement"];
        return statement0;
    }));
(sourceElements = late((function() {
    return sourceElements;
})));
(functionBody = node(sourceElements, ast_statement.BlockStatement.create));
var formalParameterList = parse.eager(parse_lang.sepBy(punctuator(","), value.identifier));
(functionExpression = parse.label("Function Expression", nodea(parse.next(keyword("function"), parse.enumeration(parse.optional(
            value.identifier), parse_lang.between(punctuator("("), punctuator(")"), formalParameterList),
        parse_lang.between(punctuator("{"), punctuator("}"), functionBody))), ast_expression.FunctionExpression
    .create)));
(functionDeclaration = parse.label("Function Declaration", nodea(parse.next(keyword("function"), parse.enumeration(
        value.identifier, parse_lang.between(punctuator("("), punctuator(")"), formalParameterList),
        parse_lang.between(punctuator("{"), punctuator("}"), functionBody))), ast_declaration.FunctionDeclaration
    .create)));
(sourceElement = parse.expected("statement or function", parse.either(functionDeclaration, statementlabel)));
(sourceElements = parse.eager(parse.many(sourceElement)));
(program = parse.label("Program", node(parse.eager(parse.rec((function(self) {
    return parse.either(parse.next(parse.eof, parse.always(stream.end)), parse.cons(
        sourceElement, self));
}))), ast_program.Program.create)));
(exports["functionBody"] = functionBody);
(exports["functionExpression"] = functionExpression);
(exports["functionDeclaration"] = functionDeclaration);
(exports["sourceElement"] = sourceElement);
(exports["sourceElements"] = sourceElements);
(exports["program"] = program);