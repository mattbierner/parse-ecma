/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "ecma-ast/declaration",
    "ecma-ast/expression", "ecma-ast/program", "ecma-ast/statement", "./common", "./token_parser", "./value_parser",
    "./statement_parser"
], (function(require, exports, parse, parse_lang, stream, ast_declaration, ast_expression, ast_program,
    ast_statement, ecma_parse, token, value, statement) {
    "use strict";
    var functionBody, functionExpression, functionDeclaration, sourceElement, sourceElements, program, late =
            parse["late"],
        statementlabel = late((function() {
            var __o = require("ecma/parse/statement_parser"),
                statement0 = __o["statement"];
            return statement0;
        }));
    (sourceElements = late((function() {
        return sourceElements;
    })));
    (functionBody = ecma_parse.node(sourceElements, ast_statement.BlockStatement.create));
    var formalParameterList = parse.eager(parse_lang.sepBy(token.punctuator(","), value.identifier));
    (functionExpression = parse.label("Function Expression", ecma_parse.nodea(parse.next(token.keyword(
            "function"), parse.enumeration(parse.optional(value.identifier), parse_lang.between(
            token.punctuator("("), token.punctuator(")"), formalParameterList), parse_lang.between(
            token.punctuator("{"), token.punctuator("}"), functionBody))), ast_expression.FunctionExpression
        .create)));
    (functionDeclaration = parse.label("Function Declaration", ecma_parse.nodea(parse.next(token.keyword(
        "function"), parse.enumeration(value.identifier, parse_lang.between(token.punctuator(
        "("), token.punctuator(")"), formalParameterList), parse_lang.between(token.punctuator(
        "{"), token.punctuator("}"), functionBody))), ast_declaration.FunctionDeclaration.create)));
    (sourceElement = parse.expected("statement or function", parse.either(functionDeclaration, statementlabel)));
    (sourceElements = parse.eager(parse.many(sourceElement)));
    (program = parse.label("Program", ecma_parse.node(parse.eager(parse.rec((function(self) {
        return parse.either(parse.next(parse.eof, parse.always(stream.end)), parse.cons(
            sourceElement, self));
    }))), ast_program.Program.create)));
    (exports["functionBody"] = functionBody);
    (exports["functionExpression"] = functionExpression);
    (exports["functionDeclaration"] = functionDeclaration);
    (exports["sourceElement"] = sourceElement);
    (exports["sourceElements"] = sourceElements);
    (exports["program"] = program);
}));