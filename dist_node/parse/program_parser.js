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
    ecma_parse = require("./common"),
    token = require("./token_parser"),
    value = require("./value_parser"),
    statement = require("./statement_parser"),
    functionBody, functionExpression, functionDeclaration, sourceElement, sourceElements, program, statementParser = (
        function() {
            var args = arguments,
                __o = require("ecma/parse/statement_parser"),
                statement0 = __o["statement"];
            return statement0.apply(undefined, args);
        });
(sourceElements = (function() {
    var args = arguments;
    return sourceElements.apply(undefined, args);
}));
(functionBody = ecma_parse.node(sourceElements, ast_statement.BlockStatement.create));
var formalParameterList = parse.eager(parse_lang.sepBy(token.punctuator(","), value.identifier));
(functionExpression = parse.Parser("Function Expression", ecma_parse.nodea(parse.next(token.keyword("function"), parse.enumeration(
    parse.optional(null, value.identifier), parse_lang.between(token.punctuator("("), token.punctuator(
        ")"), formalParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"),
        functionBody))), ast_expression.FunctionExpression.create)));
(functionDeclaration = parse.Parser("Function Declaration", ecma_parse.nodea(parse.next(token.keyword("function"),
    parse.enumeration(value.identifier, parse_lang.between(token.punctuator("("), token.punctuator(")"),
        formalParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"),
        functionBody))), ast_declaration.FunctionDeclaration.create)));
(sourceElement = parse.expected("statement or function", parse.either(functionDeclaration, statementParser)));
(sourceElements = parse.eager(parse.many(sourceElement)));
(program = parse.Parser("Program", ecma_parse.node(parse.eager(parse.rec((function(self) {
    return parse.either(parse.next(parse.eof, parse.always(stream.end)), parse.cons(
        sourceElement, self));
}))), ast_program.Program.create)));
(exports["functionBody"] = functionBody);
(exports["functionExpression"] = functionExpression);
(exports["functionDeclaration"] = functionDeclaration);
(exports["sourceElement"] = sourceElement);
(exports["sourceElements"] = sourceElements);
(exports["program"] = program);