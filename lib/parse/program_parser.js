/**
 * @fileOverview Parsers for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'bennu/parse',
        'bennu/lang',
        'nu-stream/stream',
        'ecma/parse/common',
        'ecma/parse/statement_parser',
        'ecma/parse/token_parser',
        'ecma/parse/value_parser',
        'ecma_ast/declaration',
        'ecma_ast/expression',
        'ecma_ast/program',
        'ecma_ast/statement'],
function(require,
        parse,
        parse_lang,
        stream,
        ecma_parse,
        statement,
        token,
        value,
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
    astStatement.BlockStatement.create);

/**
 * Parser for a function's parameters.
 */
var formalParameterList = parse.eager(parse_lang.sepBy(token.punctuator(','),
    value.identifier));

// Function Expression
////////////////////////////////////////
/**
 * Parser for an function expression.
 * 
 * May be named or anon.
 */
var functionExpression = parse.Parser('Function Expression',
    ecma_parse.nodea(
        parse.next(
            token.keyword('function'),
            parse.enumeration(
                parse.optional(null, value.identifier),
                parse_lang.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse_lang.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody))),
        astExpression.FunctionExpression.create));

// Function Declaration
////////////////////////////////////////
/**
 * Parser for a function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.Parser('Function Declaration',
    ecma_parse.nodea(
        parse.next(
            token.keyword('function'),
            parse.enumeration(
                value.identifier,
                parse_lang.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse_lang.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody))),
        astDeclaration.FunctionDeclaration.create));

// Source Elements
////////////////////////////////////////
/**
 * Parser for an ECMAScript source element.
 * 
 * Source Elements are top level nodes that makes up a program.
 */
var sourceElement = parse.expected("statement or function",
    parse.either(
        functionDeclaration,
        statementParser));

/**
 * Parser for a sequence of zero or more source elements.
 */
sourceElements = parse.eager(parse.many(sourceElement));

// Program
////////////////////////////////////////
/**
 * Parser for an ECMAScript 5.1 program.
 */
var program = parse.Parser('Program',
    ecma_parse.node(
        parse.eager(parse.rec(function(self) {
            return parse.either(
                parse.next(parse.eof, parse.always(stream.end)),
                parse.cons(sourceElement, self));
        })),
        astProgram.Program.create));

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