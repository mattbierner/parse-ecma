/**
 * @fileOverview Parsers for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'nu/stream',
        'ecma/parse/common',
        'ecma/parse/statement_parser', 'ecma/parse/token_parser', 'ecma/parse/value_parser',
        'ecma/ast/declaration', 'ecma/ast/expression', 'ecma/ast/program', 'ecma/ast/statement'],
function(require,
        parse, parse_eager,
        stream,
        ecma_parse,
        statement, token, value,
        astDeclaration, astExpression, astProgram, astStatement){
"use strict";

/* Circular
 ******************************************************************************/
var statementParser = function() {
    return require('ecma/parse/statement_parser').statement.apply(undefined, arguments);
};

/* Forward declarations
 ******************************************************************************/
var sourceElements = function() { return sourceElements.apply(undefined, arguments); };

/* Parsers
 ******************************************************************************/
/**
 * Parser for the body of a function.
 */
var functionBody = ecma_parse.node(
    sourceElements,
    function(loc, body) {
        return new astStatement.BlockStatement(loc, body);
    });

/**
 * Parser for a function's parameters.
 */
var formalParameterList = parse_eager.sepBy(token.punctuator(','),
    value.identifier);

// Function Expression
////////////////////////////////////////
/**
 * Parser for an function expression.
 * 
 * May be named or anon.
 */
var functionExpression = parse.Parser('Function Expression',
    ecma_parse.node(
        parse.next(
            token.keyword('function'),
            parse.sequence(
                parse.optional(value.identifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody))),
        function(loc, id, parameters, body) {
            return new astExpression.FunctionExpression(
                loc,
                id,
                parameters,
                body);
        }));

// Function Declaration
////////////////////////////////////////
/**
 * Parser for a function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.Parser('Function Declaration',
    ecma_parse.node(
        parse.next(
            token.keyword('function'),
            parse.sequence(
                value.identifier,
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody))),
        function(loc, id, params, body) {
            return new astDeclaration.FunctionDeclaration(
                loc,
                id,
                params,
                body);
        }));

// Function
////////////////////////////////////////
var fn = parse.Parser('Function',
    ecma_parse.node(
        parse.next(
            token.keyword('function'),
            parse.sequence(
                parse.optional(value.identifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody))),
        function(loc, id, params, body) {
            return (id ? 
                new astDeclaration.FunctionDeclaration(loc, id, params, body) :
                new astStatement.ExpressionStatement(new astExpression.FunctionExpression(loc, id, params, body)));
        }));

// Source Elements
////////////////////////////////////////
/**
 * Parser for an ECMAScript source element.
 * 
 * Source Elements are top level nodes that makes up a program.
 */
var sourceElement = parse.expected("statement or function",
    parse.either(
        fn,
        statementParser));

/**
 * Parser for a sequence of zero or more source elements.
 */
sourceElements = parse_eager.many(sourceElement);

// Program
////////////////////////////////////////
/**
 * Parser for an ECMAScript 5.1 program.
 */
var program = parse.Parser('Program',
    ecma_parse.node(
        parse.rec(function(self) {
            return parse.either(
                parse.next(parse.eof(), parse.always(stream.end)),
                parse.cons(sourceElement, self));
        }),
        function(loc, elements) {
            return new astProgram.Program(loc, stream.toArray(elements));
        }));

/* Export
 ******************************************************************************/
return {
    'functionBody': functionBody,
    'functionExpression': functionExpression,
    'functionDeclaration': functionDeclaration,
    
    'sourceElement': sourceElement,
    'sourceElements': sourceElements,
    
    'program': program
};

});