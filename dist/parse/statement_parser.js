/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "ecma-ast/clause", "ecma-ast/declaration",
    "ecma-ast/statement", "./token_parser", "./common", "./expression_parser", "./value_parser"
], (function(require, exports, parse, parse_lang, ast_clause, ast_declaration, ast_statement, token, ecma_parse,
    expression, value) {
    "use strict";
    var blockStatement, variableStatement, emptyStatement, expressionStatement, ifStatement, forStatement,
            forInStatement, whileStatement, doWhileStatement, iterationStatement, continueStatement,
            breakStatement, returnStatement, withStatement, labeledStatement, switchStatement, throwStatement,
            tryStatement, debuggerStatement, statement;
    (statement = (function() {
        var args = arguments;
        return statement.apply(undefined, args);
    }));
    var lineTerminator = parse.look(parse.token((function(x) {
        return x.lineTerminator;
    }))),
        noLineTerminator = parse.next.bind(undefined, parse.look(parse.token((function(z) {
            var x = z.lineTerminator;
            return (!x);
        })))),
        logicalSemiColon = parse.expected("logical semicolon", parse.choice(token.punctuator(";"), parse.look(
            token.punctuator("}")), lineTerminator, parse.eof)),
        statementList = parse.eager(parse.many(statement));
    (blockStatement = parse.Parser("Block Statement", ecma_parse.node(parse_lang.between(token.punctuator("{"),
        token.punctuator("}"), statementList), ast_statement.BlockStatement.create)));
    var initialiser = parse.next(token.punctuator("="), parse.expected("initialiser expression", expression.assignmentExpression)),
        initialiserNoIn = parse.next(token.punctuator("="), parse.expected("initialiser expression", expression
            .assignmentExpressionNoIn)),
        variableDeclaration = ecma_parse.nodea(parse.enumeration(value.identifier, parse.optional(null,
            initialiser)), ast_declaration.VariableDeclarator.create),
        variableDeclarationNoIn = ecma_parse.nodea(parse.enumeration(value.identifier, parse.optional(null,
            initialiserNoIn)), ast_declaration.VariableDeclarator.create),
        variableDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(","), parse.expected(
            "variable declaration", variableDeclaration))),
        variableDeclarationListNoIn = parse.eager(parse_lang.sepBy1(token.punctuator(","), parse.expected(
            "variable declaration", variableDeclarationNoIn)));
    (variableStatement = parse.Parser("Variable Statement", ecma_parse.node(parse_lang.between(token.keyword(
        "var"), logicalSemiColon, parse.expected("variable declaration list",
        variableDeclarationList)), ast_declaration.VariableDeclaration.create)));
    (emptyStatement = parse.Parser("Empty Statement", ecma_parse.node(token.punctuator(";"), ast_statement.EmptyStatement
        .create)));
    (expressionStatement = parse.Parser("Expression Statement", ecma_parse.node(parse_lang.then(expression.expression,
        logicalSemiColon), ast_statement.ExpressionStatement.create)));
    (ifStatement = parse.Parser("If Statement", ecma_parse.nodea(parse.next(token.keyword("if"), parse.enumeration(
        parse_lang.between(token.punctuator("("), token.punctuator(")"), parse.expected(
            "if test", expression.expression)), parse.expected("if consequent", statement),
        parse.optional(null, parse.next(token.keyword("else"), parse.expected("if alternate",
            statement))))), ast_statement.IfStatement.create)));
    (whileStatement = parse.Parser("While Statement", ecma_parse.nodea(parse.next(token.keyword("while"), parse
            .enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"), parse.expected(
                "while test", expression.expression)), parse.expected("while body", statement))),
        ast_statement.WhileStatement.create)));
    (doWhileStatement = parse.Parser("Do While Statement", ecma_parse.nodea(parse.next(token.keyword("do"),
            parse.enumeration(parse.expected("do-while body", statement), parse.next(token.keyword(
                "while"), parse_lang.between(token.punctuator("("), token.punctuator(")"),
                parse.expected("do-while test", expression.expression))), token.punctuator(";"))),
        ast_statement.DoWhileStatement.create)));
    var forInit = parse.either(ecma_parse.node(parse.next(token.keyword("var"), parse.expected(
            "variable declaration list", parse.memo(variableDeclarationListNoIn))), ast_declaration.VariableDeclaration
        .create), expression.expressionNoIn);
    (forStatement = parse.Parser("For Statement", ecma_parse.nodea(parse.next(token.keyword("for"), parse.next(
        token.punctuator("("), parse.enumeration(parse_lang.then(parse.optional(null, forInit),
            token.punctuator(";")), parse_lang.then(parse.optional(null, expression.expressionNoIn),
            token.punctuator(";")), parse_lang.then(parse.optional(null, expression.expressionNoIn),
            token.punctuator(")")), statement))), ast_statement.ForStatement.create)));
    var forInLeft = parse.either(ecma_parse.node(parse.next(token.keyword("var"), parse.expected(
        "variable declaration", parse.memo(variableDeclarationNoIn))), (function(loc, x) {
        return ast_declaration.VariableDeclaration.create(loc, [x]);
    })), expression.leftHandSideExpression);
    (forInStatement = parse.Parser("For In Statement", ecma_parse.nodea(parse.next(token.keyword("for"), parse.next(
            token.punctuator("("), parse.enumeration(parse_lang.then(forInLeft, token.keyword("in")),
                parse_lang.then(expression.expressionNoIn, token.punctuator(")")), statement))),
        ast_statement.ForInStatement.create)));
    (iterationStatement = parse.Parser("Iteration Statement", parse.choice(doWhileStatement, whileStatement,
        parse.attempt(forInStatement), forStatement)));
    (continueStatement = parse.Parser("Continue Statement", ecma_parse.node(parse_lang.between(token.keyword(
            "continue"), logicalSemiColon, parse.optional(null, noLineTerminator(value.identifier))),
        ast_statement.ContinueStatement.create)));
    (breakStatement = parse.Parser("Break Statement", ecma_parse.node(parse_lang.between(token.keyword("break"),
            logicalSemiColon, parse.optional(null, noLineTerminator(value.identifier))), ast_statement.BreakStatement
        .create)));
    (returnStatement = parse.Parser("Return Statement", ecma_parse.node(parse_lang.between(token.keyword(
            "return"), logicalSemiColon, parse.optional(null, noLineTerminator(expression.expression))),
        ast_statement.ReturnStatement.create)));
    (throwStatement = parse.Parser("Throw Statement", ecma_parse.node(parse_lang.between(token.keyword("throw"),
        logicalSemiColon, parse.expected("throw argument", noLineTerminator(expression.expression))
    ), ast_statement.ThrowStatement.create)));
    (withStatement = parse.Parser("With Statement", ecma_parse.nodea(parse.next(token.keyword("with"), parse.enumeration(
            parse_lang.between(token.punctuator("("), token.punctuator(")"), parse.expected(
                "with object", expression.expression)), parse.expected("with body", statement))),
        ast_statement.WithStatement.create)));
    (labeledStatement = parse.Parser("Labeled Statement", ecma_parse.nodea(parse.enumeration(parse_lang.then(
        value.identifier, token.punctuator(":")), statement), ast_statement.LabeledStatement.create)));
    var caseClause = ecma_parse.nodea(parse.next(token.keyword("case"), parse.enumeration(parse_lang.then(parse
            .expected("case test", expression.expression), token.punctuator(":")), statementList)), ast_clause.SwitchCase
        .create),
        defaultClause = ecma_parse.node(parse.next(token.keyword("default"), parse.next(token.punctuator(":"),
            statementList)), (function(loc, consequent) {
            return ast_clause.SwitchCase.create(loc, null, consequent);
        })),
        caseClauses = parse.eager(parse.many(caseClause)),
        caseBlock = parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.binds(parse.enumeration(
            parse.optional([], caseClauses), parse.optional(null, defaultClause), parse.optional([],
                caseClauses)), (function(first, defaultClause0, rest) {
            return parse.always((defaultClause0 ? first.concat(defaultClause0, rest) : first.concat(
                rest)));
        })));
    (switchStatement = parse.Parser("Switch Statement", ecma_parse.nodea(parse.next(token.keyword("switch"),
        parse.enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"),
            expression.expression), caseBlock)), ast_statement.SwitchStatement.create)));
    var catchBlock = ecma_parse.nodea(parse.next(token.keyword("catch"), parse.enumeration(parse_lang.between(
        token.punctuator("("), token.punctuator(")"), value.identifier), parse.expected(
        "block statement", blockStatement))), ast_clause.CatchClause.create),
        finallyBlock = parse.next(token.keyword("finally"), parse.expected("block statement", blockStatement));
    (tryStatement = parse.Parser("Try Statement", ecma_parse.nodea(parse.next(token.keyword("try"), parse.enumeration(
        parse.expected("block statement", blockStatement), parse.optional(null, catchBlock),
        parse.optional(null, finallyBlock))), ast_statement.TryStatement.create)));
    (debuggerStatement = parse.Parser("Debugger Statement", ecma_parse.node(parse.next(token.keyword("debugger"),
        token.punctuator(";")), ast_statement.DebuggerStatement.create)));
    (statement = parse.Parser("Statement", parse.expected("statement", parse.choice(blockStatement,
        variableStatement, emptyStatement, ifStatement, iterationStatement, continueStatement,
        breakStatement, returnStatement, withStatement, switchStatement, throwStatement,
        tryStatement, debuggerStatement, parse.attempt(labeledStatement), expressionStatement))));
    (exports["blockStatement"] = blockStatement);
    (exports["variableStatement"] = variableStatement);
    (exports["emptyStatement"] = emptyStatement);
    (exports["expressionStatement"] = expressionStatement);
    (exports["ifStatement"] = ifStatement);
    (exports["forStatement"] = forStatement);
    (exports["forInStatement"] = forInStatement);
    (exports["whileStatement"] = whileStatement);
    (exports["doWhileStatement"] = doWhileStatement);
    (exports["iterationStatement"] = iterationStatement);
    (exports["continueStatement"] = continueStatement);
    (exports["breakStatement"] = breakStatement);
    (exports["returnStatement"] = returnStatement);
    (exports["withStatement"] = withStatement);
    (exports["labeledStatement"] = labeledStatement);
    (exports["switchStatement"] = switchStatement);
    (exports["throwStatement"] = throwStatement);
    (exports["tryStatement"] = tryStatement);
    (exports["debuggerStatement"] = debuggerStatement);
    (exports["statement"] = statement);
}));