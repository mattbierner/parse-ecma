/**
 * @fileOverview ECMAScript 5.1 statement parsers.
 */
define(['parse/parse',
        'parse/lang',
        'ecma_ast/clause',
        'ecma_ast/declaration',
        'ecma_ast/statement',
        'ecma/parse/token_parser',
        'ecma/parse/common',
        'ecma/parse/expression_parser',
        'ecma/parse/value_parser'],
function(parse,
        parse_lang,
        ast_clause,
        ast_declaration,
        ast_statement,
        token,
        ecma_parse,
        expression,
        value){
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
        parse.eof));


/* Statement Parsers
 ******************************************************************************/
var statementList = parse.eager(parse.many(statement));

// Block
////////////////////////////////////////
/**
 * Parser for a block statement
 */
var blockStatement = parse.Parser('Block Statement',
    ecma_parse.node(
        parse_lang.between(token.punctuator('{'), token.punctuator('}'), 
            statementList),
        ast_statement.BlockStatement.create));

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
    parse.enumeration(
        value.identifier,
        parse.optional(null, initialiser)),
    ast_declaration.VariableDeclarator.create);

/**
 * Parser for a single variable declaration without the in operator.
 */
var variableDeclarationNoIn = ecma_parse.nodea(
    parse.enumeration(
        value.identifier,
        parse.optional(null, initialiserNoIn)),
    ast_declaration.VariableDeclarator.create);

var variableDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(','),
    variableDeclaration));

var variableDeclarationListNoIn = parse.eager(parse_lang.sepBy1(token.punctuator(','),
    variableDeclarationNoIn));

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.Parser('Variable Statement', 
    ecma_parse.node(
        parse_lang.between(token.keyword('var'), logicalSemiColon,
            variableDeclarationList),
        ast_declaration.VariableDeclaration.create));

// Empty Statement
////////////////////////////////////////
/**
 * Parser for an empty statement.
 */
var emptyStatement = parse.Parser('Empty Statement',
    ecma_parse.node(
        token.punctuator(';'),
        ast_statement.EmptyStatement.create));

// Expression
////////////////////////////////////////
/**
 * Parser for an expression statement.
 *
 * @TODO: Add lookahead not 'function' check?
 */
var expressionStatement = parse.Parser('Expression Statement',
    ecma_parse.node(
        parse_lang.then(
            expression.expression,
            logicalSemiColon),
        ast_statement.ExpressionStatement.create));

// If
////////////////////////////////////////
/**
 * Parser for an if statement with optional alternate.
 */
var ifStatement = parse.Parser('If Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('if'),
            parse.enumeration(
                parse_lang.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement,
                parse.optional(null, parse.next(token.keyword('else'),
                    statement)))),
        ast_statement.IfStatement.create));

// Iteration
////////////////////////////////////////
/**
 * Parser for while statement.
 */
var whileStatement = parse.Parser('While Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('while'),
            parse.enumeration(
                parse_lang.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement)),
        ast_statement.WhileStatement.create));

/**
 * Parser for a do while statement.
 */
var doWhileStatement = parse.Parser('Do While Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('do'),
            parse.enumeration(
                statement,
                parse.next(
                    token.keyword('while'),
                    parse_lang.between(token.punctuator('('), token.punctuator(')'),
                        expression.expression)),
                token.punctuator(';'))),
        ast_statement.DoWhileStatement.create));

var forInit = parse.either(
    ecma_parse.node(
        parse.next(
            token.keyword('var'),
            parse.memo(variableDeclarationListNoIn)),
        ast_declaration.VariableDeclaration.create),
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
                parse.enumeration(
                    parse_lang.then(
                        parse.optional(null, forInit),
                        token.punctuator(';')),
                    parse_lang.then(
                        parse.optional(null, expression.expressionNoIn),
                        token.punctuator(';')),
                    parse_lang.then(
                        parse.optional(null, expression.expressionNoIn),
                        token.punctuator(')')),
                    statement))),
        ast_statement.ForStatement.create));

var forInLeft = parse.either(
    ecma_parse.node(
        parse.next(
            token.keyword('var'),
            parse.memo(variableDeclarationNoIn)),
        function(loc, x) {
            return ast_declaration.VariableDeclaration.create(loc, [x]);
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
                parse.enumeration(
                    parse_lang.then(
                        forInLeft,
                        token.keyword('in')),
                    parse_lang.then(
                        expression.expressionNoIn,
                        token.punctuator(')')),
                    statement))),
        ast_statement.ForInStatement.create));

/**
 * Parser for any iteration statement.
 */
var iterationStatement = parse.Parser('Iteration Statement',
    parse.choice(
        doWhileStatement,
        whileStatement,
        parse.attempt(forInStatement),
        forStatement));

// Continue
////////////////////////////////////////
/**
 * Parser for a continue statement with optional label.
 */
var continueStatement = parse.Parser('Continue Statement',
    ecma_parse.node(
        parse_lang.between(token.keyword('continue'), logicalSemiColon,
            parse.optional(null, noLineTerminator(value.identifier))),
        ast_statement.ContinueStatement.create));

// Break
////////////////////////////////////////
/**
 * Parser for a break statement with optional label.
 */
var breakStatement = parse.Parser('Break Statement',
    ecma_parse.node(
        parse_lang.between(token.keyword('break'), logicalSemiColon,
            parse.optional(null, noLineTerminator(value.identifier))),
        ast_statement.BreakStatement.create));

// Return
////////////////////////////////////////
/**
 * Parser for a return statement.
 */
var returnStatement = parse.Parser('Return Statement',
    ecma_parse.node(
        parse_lang.between(token.keyword('return'), logicalSemiColon,
            parse.optional(null, noLineTerminator(expression.expression))),
        ast_statement.ReturnStatement.create));

// With
////////////////////////////////////////
/**
 * Parser for a with statement.
 */
var withStatement = parse.Parser('With Statement',
    ecma_parse.nodea(
        parse.next(
            token.keyword('with'),
            parse.enumeration(
                parse_lang.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement)),
        ast_statement.WithStatement.create));

// Labeled
////////////////////////////////////////
/**
 * Parser for a labeled statement.
 */
var labeledStatement = parse.Parser('Labeled Statement',
    ecma_parse.nodea(
        parse.enumeration(
            parse_lang.then(
                value.identifier,
                token.punctuator(':')),
            statement),
        ast_statement.LabeledStatement.create));

// Switch
////////////////////////////////////////
/**
 * Parser for a case clause from a switch statement.
 */
var caseClause = ecma_parse.nodea(
    parse.next(
        token.keyword('case'),
        parse.enumeration(
            parse_lang.then(
                expression.expression,
                token.punctuator(':')),
            statementList)),
    ast_clause.SwitchCase.create);

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
        return ast_clause.SwitchCase.create(loc, null, consequent);
    });

var caseClauses = parse.eager(parse.many(caseClause));

var caseBlock = parse_lang.between(token.punctuator('{'), token.punctuator('}'),
    parse.binds(
        parse.enumeration(
            parse.optional([], caseClauses),
            parse.optional(null, defaultClause),
            parse.optional([], caseClauses)),
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
            parse.enumeration(
                parse_lang.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                caseBlock)),
        ast_statement.SwitchStatement.create));

// Throw
////////////////////////////////////////
/**
 * Parser for a throw statement.
 */
var throwStatement = parse.Parser('Throw Statement',
    ecma_parse.node(
        parse_lang.between(token.keyword('throw'), logicalSemiColon,
            noLineTerminator(expression.expression)),
        ast_statement.ThrowStatement.create));

// Try
////////////////////////////////////////
/**
 * Parser for a catch block in a try statement.
 */
var catchBlock = ecma_parse.nodea(
    parse.next(
        token.keyword('catch'),
        parse.enumeration(
            parse_lang.between(token.punctuator('('), token.punctuator(')'),
                value.identifier),
            blockStatement)),
    ast_clause.CatchClause.create);

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
            parse.enumeration(
                blockStatement,
                parse.optional(null, catchBlock),
                parse.optional(null, finallyBlock))),
        ast_statement.TryStatement.create));

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
        ast_statement.DebuggerStatement.create));

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