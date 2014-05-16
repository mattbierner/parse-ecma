/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "ecma-ast/declaration",
    "ecma-ast/expression", "ecma-ast/program", "ecma-ast/statement", "./common", "./token_parser", "./value_parser",
    "./statement_parser"
], (function(require, exports, parse, parse_lang, stream, ast_declaration, ast_expression, ast_program,
    ast_statement, __o, token, value, statement) {
    "use strict";
    var functionBody, functionExpression, functionDeclaration, sourceElement, sourceElements, program, late =
            parse["late"],
        node = __o["node"],
        nodea = __o["nodea"],
        keyword = token["keyword"],
        punctuator = token["punctuator"],
        statementlabel = late((function() {
            var __o0 = require("./statement_parser"),
                statement0 = __o0["statement"];
            return statement0;
        }));
    (sourceElements = late((function() {
        return sourceElements;
    })));
    (functionBody = node(sourceElements, ast_statement.BlockStatement.create));
    var formalParameterList = parse.eager(parse_lang.sepBy(punctuator(","), value.identifier));
    (functionExpression = parse.label("Function Expression", nodea(parse.next(keyword("function"), parse.enumeration(
        parse.optional(value.identifier), parse_lang.between(punctuator("("), punctuator(")"),
            formalParameterList), parse_lang.between(punctuator("{"), punctuator("}"),
            functionBody))), ast_expression.FunctionExpression.create)));
    (functionDeclaration = parse.label("Function Declaration", nodea(parse.next(keyword("function"), parse.enumeration(
        value.identifier, parse_lang.between(punctuator("("), punctuator(")"),
            formalParameterList), parse_lang.between(punctuator("{"), punctuator("}"),
            functionBody))), ast_declaration.FunctionDeclaration.create)));
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
}));