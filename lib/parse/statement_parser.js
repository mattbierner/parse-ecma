/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager',
        'ecma/parse/token_parser', 'ecma/parse/common',
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
    ecma_parse.node(
        parse.between(token.punctuator('{'), token.punctuator('}'), 
            statementList),
        function(loc, body) {
            return new astStatement.BlockStatement(loc, body);
        }));

// Variable Statement
////////////////////////////////////////
var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var initialiserNoIn = parse.next(token.punctuator('='),
    expression.assignmentExpressionNoIn);

/**
 * Parser for a single variable declaration.
 */
var variableDeclaration = ecma_parse.nodea(
    parse.sequence(
        value.identifier,
        parse.optional(initialiser)),
    function(loc, identifier, initialiser) {
        return new astDeclaration.VariableDeclarator(loc, identifier, initialiser);
    });

/**
 * Parser for a single variable declaration without the in operator.
 */
var variableDeclarationNoIn = ecma_parse.nodea(
    parse.sequence(
        value.identifier,
        parse.optional(initialiserNoIn)),
    function(loc, identifier, initialiser) {
        return new astDeclaration.VariableDeclarator(loc, identifier, initialiser);
    });

var variableDeclarationList = parse_eager.sepBy1(token.punctuator(','),
    variableDeclaration);

var variableDeclarationListNoIn = parse_eager.sepBy1(token.punctuator(','),
    variableDeclarationNoIn);

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.Parser('Variable Statement', 
    ecma_parse.node(
        parse.between(token.keyword('var'), logicalSemiColon,
            variableDeclarationList),
        function(loc, declarations) {
            return new astDeclaration.VariableDeclaration(loc, declarations);
        }));

// Empty Statement
////////////////////////////////////////
/**
 * Parser for an empty statement.
 */
var emptyStatement = parse.Parser('Empty Statement',
    ecma_parse.node(
        token.punctuator(';'),
        function(loc) {
            return new astStatement.EmptyStatement(loc);
        }));

// Expression
////////////////////////////////////////
/**
 * Parser for an expression statement.
 *
 * @TODO: Add lookahead not 'function' check?
 */
var expressionStatement = parse.Parser('Expression Statement',
    ecma_parse.node(
        parse.then(
            expression.expression,
            logicalSemiColon),
        function(loc, expression) {
            return new astStatement.ExpressionStatement(loc, expression);
        }));

// If
////////////////////////////////////////
/**
 * Parser for an if statement with optional alternate.
 */
var ifStatement = parse.Parser('If Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('if'),
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement,
                parse.optional(parse.next(token.keyword('else'),
                    statement)))),
        function(loc, test, consequent, alternate) {
            return new astStatement.IfStatement(loc, test, consequent, alternate);
        }));

// Iteration
////////////////////////////////////////
/**
 * Parser for while statement.
 */
var whileStatement = parse.Parser('While Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('while'),
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement)),
        function(loc, test, body) {
            return new astStatement.WhileStatement(loc, test, body);
        }));

/**
 * Parser for a do while statement.
 */
var doWhileStatement = parse.Parser('Do While Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('do'),
            parse.sequence(
                statement,
                token.keyword('while'),
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                token.punctuator(';'))),
        function(loc, body, _0, test) {
            return new astStatement.DoWhileStatement(loc, body, test);
        }));

var forInit = parse.either(
    ecma_parse.node(
        parse.next(
            token.keyword('var'),
            parse.memo(variableDeclarationListNoIn)),
        function(loc, declarations) {
            return new astDeclaration.VariableDeclaration(loc, declarations);
        }),
    expression.expressionNoIn);

/**
 * Parser for a for statement with optional init, test, and update expressions.
 */
var forStatement = parse.Parser('For Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('for'),
            parse.next(
                token.punctuator('('),
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
                    statement))),
        function(loc, init, test, update, body) {
            return new astStatement.ForStatement(loc, init, test, update, body);
        }));

var forInLeft = parse.either(
    ecma_parse.node(
        parse.next(
            token.keyword('var'),
            parse.memo(variableDeclarationNoIn)),
        function(loc, x) {
            return new astDeclaration.VariableDeclaration(loc, [x]);
        }),
    expression.leftHandSideExpression);

/**
 * Parser for a for in statement.
 */
var forInStatement = parse.Parser('For In Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('for'),
            parse.next(
                token.punctuator('('),
                parse.sequence(
                    parse.then(
                        forInLeft,
                        token.keyword('in')),
                    parse.then(
                        expression.expressionNoIn,
                        token.punctuator(')')),
                    statement))),
        function(loc, left, right, body) {
            return new astStatement.ForInStatement(loc, left, right, body);
        }));

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
    ecma_parse.node(
        parse.between(token.keyword('continue'), logicalSemiColon,
            parse.optional(noLineTerminator(value.identifier))),
        function(loc, label) {
            return new astStatement.ContinueStatement(loc, label);
        }));

// Break
////////////////////////////////////////
/**
 * Parser for a break statement with optional label.
 */
var breakStatement = parse.Parser('Break Statement',
    ecma_parse.node(
        parse.between(token.keyword('break'), logicalSemiColon,
            parse.optional(noLineTerminator(value.identifier))),
        function(loc, label) {
            return new astStatement.BreakStatement(loc, label);
        }));

// Return
////////////////////////////////////////
/**
 * Parser for a return statement.
 */
var returnStatement = parse.Parser('Return Statement',
    ecma_parse.node(
        parse.between(token.keyword('return'), logicalSemiColon,
            parse.optional(noLineTerminator(expression.expression))),
        function(loc, argument) {
            return new astStatement.ReturnStatement(loc, argument);
        }));

// With
////////////////////////////////////////
/**
 * Parser for a with statement.
 */
var withStatement = parse.Parser('With Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('with'),
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement)),
        function(loc, object, body) {
            return new astStatement.WithStatement(loc, object, body);
        }));

// Labeled
////////////////////////////////////////
/**
 * Parser for a labeled statement.
 */
var labeledStatement = parse.Parser('Labeled Statement',
    ecma_parse.nodea(
        parse.sequence(
            parse.then(
                value.identifier,
                token.punctuator(':')),
            statement),
        function(loc, label, body) {
            return new astStatement.LabeledStatement(loc, label, body);
        }));

// Switch
////////////////////////////////////////
/**
 * Parser for a case clause from a switch statement.
 */
var caseClause = ecma_parse.nodea(
    parse.next(
        token.keyword('case'),
        parse.sequence(
            parse.then(
                expression.expression,
                token.punctuator(':')),
            statementList)),
    function(loc, test, consequent) {
        return new astClause.SwitchCase(loc, test, consequent);
    });

/**
 * Parser for the default case of a switch statement.
 */
var defaultClause = ecma_parse.node(
    parse.next(
        token.keyword('default'),
        parse.next(
            token.punctuator(':'),
            statementList)),
    function(loc, consequent) {
        return new astClause.SwitchCase(loc, null, consequent);
    });

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
    ecma_parse.nodea(
        parse.next(
            token.keyword('switch'),
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                caseBlock)),
        function(loc, discriminant, cases) {
            return new astStatement.SwitchStatement(loc, discriminant, cases);
        }));

// Throw
////////////////////////////////////////
/**
 * Parser for a throw statement.
 */
var throwStatement = parse.Parser('Throw Statement',
    ecma_parse.node(
        parse.between(token.keyword('throw'), logicalSemiColon,
            noLineTerminator(expression.expression)),
        function(loc, argument) {
            return new astStatement.ThrowStatement(loc, argument);
        }));

// Try
////////////////////////////////////////
/**
 * Parser for a catch block in a try statement.
 */
var catchBlock = ecma_parse.nodea(
    parse.next(
        token.keyword('catch'),
        parse.sequence(
            parse.between(token.punctuator('('), token.punctuator(')'),
                value.identifier),
            blockStatement)),
    function(loc, param, body) {
        return new astClause.CatchClause(loc, param, null, body);
    });

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
    ecma_parse.nodea(
        parse.next(
            token.keyword('try'),
            parse.sequence(
                blockStatement,
                parse.optional(catchBlock),
                parse.optional(finallyBlock))),
        function(loc, block, handler, finalizer) {
            return new astStatement.TryStatement(loc, block, handler, finalizer);
        }));

// Debugger
////////////////////////////////////////
/**
 * Parser for a debugger statement.
 */
var debuggerStatement = parse.Parser('Debugger Statement',
    ecma_parse.node(
        parse.next(
            token.keyword('debugger'),
            token.punctuator(';')),
        function(loc) {
            return new astStatement.DebuggerStatement(loc);
        }));

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

// Statement
    'statement': statement,
};

});