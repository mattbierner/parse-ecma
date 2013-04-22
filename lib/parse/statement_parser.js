/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager',
        'ecma/parse/token_parser', 'ecma/parse/_common',
        'ecma/parse/expression_parser', 'ecma/parse/value_parser',
        'ecma/ast/clause', 'ecma/ast/declaration','ecma/ast/statement'],
function(parse, parse_eager,
        token, ecma_parse,
        expression, value,
        astClause, astDeclaration, astStatement){
"use strict";

/* Forward declarations
 ******************************************************************************/
var statement = function(){ return statement.apply(undefined, arguments); };

/* Helpers
 ******************************************************************************/
// logicalSemiColon
////////////////////////////////////////
/**
 * Checks if a line terminator existed in the original stream.
 */
var lineTerminator = parse.lookahead(parse.token(function(tok) {
    return tok.lineTerminator;
}));

/**
 * Consumes 'p' as long as a line terminator did not exist before 'p'.
 */
var noLineTerminator = parse.next.bind(undefined,
    parse.lookahead(parse.token(function(tok) {
        return !tok.lineTerminator;
    })));

/**
 * Matches a logical semicolon in the grammar.
 * 
 * Based on:
 *    'OMeta: an Object-Oriented Language for Pattern Matching',
 *    Alessandro, Warth, Ian Piumarta 2007
 */
var logicalSemiColon = parse.expected('logical semicolon',
    parse.choice(
        token.punctuator(';'),
        parse.lookahead(token.punctuator('}')),
        lineTerminator,
        parse.eof()));


/* Statement Parsers
 ******************************************************************************/
var statementList = parse_eager.many(statement);

// Block
////////////////////////////////////////
/**
 * Parser for a block statement
 */
var blockStatement = parse.Parser('Block Statement',
    ecma_parse.astNode(parse.bind(
        parse.between(token.punctuator('{'), token.punctuator('}'), 
            statementList),
        function(body) {
            return parse.always(new astStatement.BlockStatement(body));
        })));

// Variable Statement
////////////////////////////////////////
var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var initialiserNoIn = parse.next(token.punctuator('='),
    expression.assignmentExpressionNoIn);

/**
 * Parser for a single variable declaration.
 */
var variableDeclaration = ecma_parse.astNode(parse.binda(
    parse.sequence(
        value.identifier,
        parse.optional(initialiser)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    }));

/**
 * Parser for a single variable declaration without the in operator.
 */
var variableDeclarationNoIn = ecma_parse.astNode(parse.binda(
    parse.sequence(
        value.identifier,
        parse.optional(initialiserNoIn)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    }));

var variableDeclarationList = parse_eager.sepBy1(token.punctuator(','),
    variableDeclaration);

var variableDeclarationListNoIn = parse_eager.sepBy1(token.punctuator(','),
    variableDeclarationNoIn);

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.Parser('Variable Statement', 
    ecma_parse.astNode(parse.bind(
        parse.between(token.keyword('var'), logicalSemiColon,
            variableDeclarationList),
        function(declarations) {
            return parse.always(new astDeclaration.VariableDeclaration(declarations));
        })));

// Empty Statement
////////////////////////////////////////
/**
 * Parser for an empty statement.
 */
var emptyStatement = parse.Parser('Empty Statement',
    ecma_parse.astNode(parse.bind(
        token.punctuator(';'),
        function() {
            return parse.always(new astStatement.EmptyStatement());
        })));

// Expression
////////////////////////////////////////
/**
 * Parser for an expression statement.
 *
 * @TODO: Add lookahead not 'function' check?
 */
var expressionStatement = parse.Parser('Expression Statement',
    ecma_parse.astNode(parse.bind(
        parse.then(
            expression.expression,
            logicalSemiColon),
        function(expression) {
            return parse.always(new astStatement.ExpressionStatement(expression));
        })));

// If
////////////////////////////////////////
/**
 * Parser for an if statement with optional alternate.
 */
var ifStatement = parse.Parser('If Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('if'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement,
                parse.optional(parse.next(token.keyword('else'),
                    statement))),
            function(test, consequent, alternate) {
                return parse.always(new astStatement.IfStatement(test, consequent, alternate));
            }))));

// Iteration
////////////////////////////////////////
/**
 * Parser for while statement.
 */
var whileStatement = parse.Parser('While Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('while'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement),
            function(test, body) {
                return parse.always(new astStatement.WhileStatement(test, body));
            }))));

/**
 * Parser for a do while statement.
 */
var doWhileStatement = parse.Parser('Do While Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('do'),
        parse.binda(
            parse.sequence(
                statement,
                token.keyword('while'),
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                token.punctuator(';')),
            function(body, _0, test) {
                return parse.always(new astStatement.DoWhileStatement(body, test));
            }))));

var forInit = parse.either(
    parse.bind(
        parse.next(
            token.keyword('var'),
            parse.memo(variableDeclarationListNoIn)),
        function(declarations) {
            return parse.always(new astDeclaration.VariableDeclaration(declarations));
        }),
    expression.expressionNoIn);

/**
 * Parser for a for statement with optional init, test, and update expressions.
 */
var forStatement = parse.Parser('For Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('for'),
        parse.next(
            token.punctuator('('),
            parse.binda(
                parse.sequence(
                    parse.then(
                        parse.optional(forInit),
                        token.punctuator(';')),
                    parse.then(
                        parse.optional(expression.expressionNoIn),
                        token.punctuator(';')),
                    parse.then(
                        parse.optional(expression.expressionNoIn),
                        token.punctuator(')')),
                    statement),
                function(init, test, update, body) {
                    return parse.always(new astStatement.ForStatement(init, test, update, body));
                })))));

var forInLeft = parse.either(
    parse.next(
        token.keyword('var'),
        parse.bind(
            parse.memo(variableDeclarationNoIn),
            function(x) {
                return parse.always(new astDeclaration.VariableDeclaration([x]));
            })),
    expression.leftHandSideExpression);

/**
 * Parser for a for in statement.
 */
var forInStatement = parse.Parser('For In Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('for'),
        parse.next(
            token.punctuator('('),
            parse.binda(
                parse.sequence(
                    parse.then(
                        forInLeft,
                        token.keyword('in')),
                    parse.then(
                        expression.expressionNoIn,
                        token.punctuator(')')),
                    statement),
            function(left, right, body) {
                return parse.always(new astStatement.ForInStatement(left, right, body));
            })))));

/**
 * Parser for any iteration statement.
 */
var iterationStatement = parse.Parser('Iteration Statement',
    parse.backtrack(parse.choice(
        doWhileStatement,
        whileStatement,
        parse.attempt(forInStatement),
        forStatement)));

// Continue
////////////////////////////////////////
/**
 * Parser for a continue statement with optional label.
 */
var continueStatement = parse.Parser('Continue Statement',
    ecma_parse.astNode(parse.bind(
        parse.between(token.keyword('continue'), logicalSemiColon,
            parse.optional(noLineTerminator(value.identifier))),
        function(label) {
            return parse.always(new astStatement.ContinueStatement(label));
        })));

// Break
////////////////////////////////////////
/**
 * Parser for a break statement with optional label.
 */
var breakStatement = parse.Parser('Break Statement',
    ecma_parse.astNode(parse.bind(
        parse.between(token.keyword('break'), logicalSemiColon,
            parse.optional(noLineTerminator(value.identifier))),
        function(label) {
            return parse.always(new astStatement.BreakStatement(label));
        })));

// Return
////////////////////////////////////////
/**
 * Parser for a return statement.
 */
var returnStatement = parse.Parser('Return Statement',
    ecma_parse.astNode(parse.bind(
        parse.between(token.keyword('return'), logicalSemiColon,
            parse.optional(noLineTerminator(expression.expression))),
        function(argument) {
            return parse.always(new astStatement.ReturnStatement(argument));
        })));

// With
////////////////////////////////////////
/**
 * Parser for a with statement.
 */
var withStatement = parse.Parser('With Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('with'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement),
            function(object, body) {
                return parse.always(new astStatement.WithStatement(object, body));
            }))));

// Labeled
////////////////////////////////////////
/**
 * Parser for a labeled statement.
 */
var labeledStatement = parse.Parser('Labeled Statement',
    ecma_parse.astNode(parse.binda(
        parse.sequence(
            parse.then(
                value.identifier,
                token.punctuator(':')),
            statement),
        function(label, body) {
            return parse.always(new astStatement.LabeledStatement(label, body));
        })));

// Switch
////////////////////////////////////////
/**
 * Parser for a case clause from a switch statement.
 */
var caseClause = parse.next(
    token.keyword('case'),
    parse.binda(
        parse.sequence(
            parse.then(
                expression.expression,
                token.punctuator(':')),
            statementList),
        function(test, consequent) {
            return parse.always(new astClause.SwitchCase(test, consequent));
        }));

/**
 * Parser for the default case of a switch statement.
 */
var defaultClause = parse.next(
    token.keyword('default'),
    parse.next(
        token.punctuator(':'),
        parse.bind(
            statementList,
            function(consequent) {
                return parse.always(new astClause.SwitchCase(null, consequent));
            })));

var caseClauses = parse_eager.many(caseClause);

var caseBlock = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.binda(
        parse.sequence(
            parse.optional(caseClauses),
            parse.optional(defaultClause),
            parse.optional(caseClauses)),
        function(first, defaultClause, rest) {
            return parse.always(defaultClause ?
                first.concat([defaultClause], rest) :
                first.concat(rest));
        }));

/**
 * Parser for a switch statement with zero or more case clauses and zero or one
 * default case clauses in any order.
 */
var switchStatement = parse.Parser('Switch Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('switch'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                caseBlock),
            function(discriminant, cases) {
                return parse.always(new astStatement.SwitchStatement(discriminant, cases));
            }))));

// Throw
////////////////////////////////////////
/**
 * Parser for a throw statement.
 */
var throwStatement = parse.Parser('Throw Statement',
    ecma_parse.astNode(parse.between(token.keyword('throw'), logicalSemiColon,
        parse.bind(
            noLineTerminator(expression.expression),
            function(argument) {
                return parse.always(new astStatement.ThrowStatement(argument));
            }))));

// Try
////////////////////////////////////////
/**
 * Parser for a catch block in a try statement.
 */
var catchBlock = parse.next(
    token.keyword('catch'),
    parse.binda(
        parse.sequence(
            parse.between(token.punctuator('('), token.punctuator(')'),
                value.identifier),
            blockStatement),
        function(param, body) {
            return parse.always(new astClause.CatchClause(param, null, body));
        }));

/**
 * Parser for a finally block in try statement.
 */
var finallyBlock = parse.next(
    token.keyword('finally'),
    blockStatement);

/**
 * Parser for a try statement with optional catch and finally blocks.
 */
var tryStatement = parse.Parser('Try Statement',
    ecma_parse.astNode(parse.next(
        token.keyword('try'),
        parse.binda(
            parse.sequence(
                blockStatement,
                parse.optional(catchBlock),
                parse.optional(finallyBlock)),
            function(block, handler, finalizer) {
                return parse.always(new astStatement.TryStatement(block, handler, finalizer));
            }))));

// Debugger
////////////////////////////////////////
/**
 * Parser for a debugger statement.
 */
var debuggerStatement = parse.Parser('Debugger Statement',
    ecma_parse.astNode(parse.bind(
        parse.next(
            token.keyword('debugger'),
            token.punctuator(';')),
        function() {
            return parse.always(new astStatement.DebuggerStatement());
        })));

// statement
////////////////////////////////////////
/**
 * 
 */
statement = parse.Parser('Statement',
    parse.expected("statement", parse.choice(
        parse.attempt(labeledStatement),
        blockStatement,
        variableStatement,
        emptyStatement,
        ifStatement,
        iterationStatement,
        continueStatement,
        breakStatement,
        returnStatement,
        withStatement,
        switchStatement,
        throwStatement,
        tryStatement,
        debuggerStatement,
        expressionStatement)));

/* Export
 ******************************************************************************/
return {
    'blockStatement': blockStatement,
    'variableStatement': variableStatement,
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'ifStatement': ifStatement,
    'iterationStatement': iterationStatement,
    'continueStatement': continueStatement,
    'breakStatement': breakStatement,
    'returnStatement': returnStatement,
    'withStatement': withStatement,
    'labeledStatement': labeledStatement,
    'switchStatement': switchStatement,
    'throwStatement': throwStatement,
    'tryStatement': tryStatement,
    'debuggerStatement': debuggerStatement,
    
    'statement': statement,
};

});