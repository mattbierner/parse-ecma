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
            tryStatement, debuggerStatement, statement, late = parse["late"],
        keyword = token["keyword"],
        punctuator = token["punctuator"];
    (statement = late((function() {
        return statement;
    })));
    var lineTerminator = parse.look(parse.token((function(x) {
        return x.lineTerminator;
    }))),
        noLineTerminator = parse.next.bind(null, parse.not(lineTerminator)),
        logicalSemiColon = parse.expected("logical semicolon", parse.choice(punctuator(";"), parse.look(
            punctuator("}")), lineTerminator, parse.eof)),
        statementList = parse.eager(parse.many(statement));
    (blockStatement = parse.label("Block Statement", ecma_parse.node(parse_lang.between(punctuator("{"),
        punctuator("}"), statementList), ast_statement.BlockStatement.create)));
    var initialiser = parse.next(punctuator("="), parse.expected("initialiser expression", expression.assignmentExpression)),
        initialiserNoIn = parse.next(punctuator("="), parse.expected("initialiser expression", expression.assignmentExpressionNoIn)),
        variableDeclaration = ecma_parse.nodea(parse.enumeration(value.identifier, parse.optional(initialiser)),
            ast_declaration.VariableDeclarator.create),
        variableDeclarationNoIn = ecma_parse.nodea(parse.enumeration(value.identifier, parse.optional(
            initialiserNoIn)), ast_declaration.VariableDeclarator.create),
        variableDeclarationList = parse.eager(parse_lang.sepBy1(punctuator(","), parse.expected(
            "variable declaration", variableDeclaration))),
        variableDeclarationListNoIn = parse.eager(parse_lang.sepBy1(punctuator(","), parse.expected(
            "variable declaration", variableDeclarationNoIn)));
    (variableStatement = parse.label("Variable Statement", ecma_parse.node(parse_lang.between(keyword("var"),
            logicalSemiColon, parse.expected("variable declaration list", variableDeclarationList)),
        ast_declaration.VariableDeclaration.create)));
    (emptyStatement = parse.label("Empty Statement", ecma_parse.node(punctuator(";"), ast_statement.EmptyStatement
        .create)));
    (expressionStatement = parse.label("Expression Statement", ecma_parse.node(parse_lang.then(expression.expression,
        logicalSemiColon), ast_statement.ExpressionStatement.create)));
    (ifStatement = parse.label("If Statement", ecma_parse.nodea(parse.next(keyword("if"), parse.enumeration(
            parse_lang.between(punctuator("("), punctuator(")"), parse.expected("if test",
                expression.expression)), parse.expected("if consequent", statement), parse.optional(
                parse.next(keyword("else"), parse.expected("if alternate", statement))))),
        ast_statement.IfStatement.create)));
    (whileStatement = parse.label("While Statement", ecma_parse.nodea(parse.next(keyword("while"), parse.enumeration(
            parse_lang.between(punctuator("("), punctuator(")"), parse.expected("while test",
                expression.expression)), parse.expected("while body", statement))), ast_statement.WhileStatement
        .create)));
    (doWhileStatement = parse.label("Do While Statement", ecma_parse.nodea(parse.next(keyword("do"), parse.enumeration(
        parse.expected("do-while body", statement), parse.next(keyword("while"), parse_lang.between(
            punctuator("("), punctuator(")"), parse.expected("do-while test", expression.expression)
        )), punctuator(";"))), ast_statement.DoWhileStatement.create)));
    var forInit = parse.either(ecma_parse.node(parse.next(keyword("var"), parse.expected(
            "variable declaration list", parse.memo(variableDeclarationListNoIn))), ast_declaration.VariableDeclaration
        .create), expression.expressionNoIn);
    (forStatement = parse.label("For Statement", ecma_parse.nodea(parse.next(keyword("for"), parse.next(
        punctuator("("), parse.enumeration(parse_lang.then(parse.optional(forInit), punctuator(
            ";")), parse_lang.then(parse.optional(expression.expressionNoIn), punctuator(
            ";")), parse_lang.then(parse.optional(expression.expressionNoIn), punctuator(
            ")")), statement))), ast_statement.ForStatement.create)));
    var forInLeft = parse.either(ecma_parse.node(parse.next(keyword("var"), parse.expected(
        "variable declaration", parse.memo(variableDeclarationNoIn))), (function(loc, x) {
        return ast_declaration.VariableDeclaration.create(loc, [x]);
    })), expression.leftHandSideExpression);
    (forInStatement = parse.label("For In Statement", ecma_parse.nodea(parse.next(keyword("for"), parse.next(
            punctuator("("), parse.enumeration(parse_lang.then(forInLeft, keyword("in")),
                parse_lang.then(expression.expressionNoIn, punctuator(")")), statement))),
        ast_statement.ForInStatement.create)));
    (iterationStatement = parse.label("Iteration Statement", parse.choice(doWhileStatement, whileStatement,
        parse.attempt(forInStatement), forStatement)));
    (continueStatement = parse.label("Continue Statement", ecma_parse.node(parse_lang.between(keyword(
            "continue"), logicalSemiColon, parse.optional(noLineTerminator(value.identifier))),
        ast_statement.ContinueStatement.create)));
    (breakStatement = parse.label("Break Statement", ecma_parse.node(parse_lang.between(keyword("break"),
            logicalSemiColon, parse.optional(noLineTerminator(value.identifier))), ast_statement.BreakStatement
        .create)));
    (returnStatement = parse.label("Return Statement", ecma_parse.node(parse_lang.between(keyword("return"),
            logicalSemiColon, parse.optional(noLineTerminator(expression.expression))), ast_statement.ReturnStatement
        .create)));
    (throwStatement = parse.label("Throw Statement", ecma_parse.node(parse_lang.between(keyword("throw"),
        logicalSemiColon, parse.expected("throw argument", noLineTerminator(expression.expression))
    ), ast_statement.ThrowStatement.create)));
    (withStatement = parse.label("With Statement", ecma_parse.nodea(parse.next(keyword("with"), parse.enumeration(
            parse_lang.between(punctuator("("), punctuator(")"), parse.expected("with object",
                expression.expression)), parse.expected("with body", statement))), ast_statement.WithStatement
        .create)));
    (labeledStatement = parse.label("Labeled Statement", ecma_parse.nodea(parse.enumeration(parse_lang.then(
        value.identifier, punctuator(":")), statement), ast_statement.LabeledStatement.create)));
    var caseClause = ecma_parse.nodea(parse.next(keyword("case"), parse.enumeration(parse_lang.then(parse.expected(
        "case test", expression.expression), punctuator(":")), statementList)), ast_clause.SwitchCase.create),
        defaultClause = ecma_parse.node(parse.next(keyword("default"), parse.next(punctuator(":"),
            statementList)), (function(loc, consequent) {
            return ast_clause.SwitchCase.create(loc, null, consequent);
        })),
        caseClauses = parse.eager(parse.many(caseClause)),
        caseBlock = parse_lang.between(punctuator("{"), punctuator("}"), parse.binds(parse.enumeration(parse.optional(
            [], caseClauses), parse.optional(defaultClause), parse.optional([], caseClauses)), (
            function(first, defaultClause0, rest) {
                return parse.always((defaultClause0 ? first.concat(defaultClause0, rest) : first.concat(
                    rest)));
            })));
    (switchStatement = parse.label("Switch Statement", ecma_parse.nodea(parse.next(keyword("switch"), parse.enumeration(
            parse_lang.between(punctuator("("), punctuator(")"), expression.expression), caseBlock)),
        ast_statement.SwitchStatement.create)));
    var catchBlock = ecma_parse.nodea(parse.next(keyword("catch"), parse.enumeration(parse_lang.between(
        punctuator("("), punctuator(")"), value.identifier), parse.expected("block statement",
        blockStatement))), ast_clause.CatchClause.create),
        finallyBlock = parse.next(keyword("finally"), parse.expected("block statement", blockStatement));
    (tryStatement = parse.label("Try Statement", ecma_parse.nodea(parse.next(keyword("try"), parse.enumeration(
        parse.expected("block statement", blockStatement), parse.optional(catchBlock), parse.optional(
            finallyBlock))), ast_statement.TryStatement.create)));
    (debuggerStatement = parse.label("Debugger Statement", ecma_parse.node(parse.next(keyword("debugger"),
        punctuator(";")), ast_statement.DebuggerStatement.create)));
    (statement = parse.label("Statement", parse.expected("statement", parse.choice(blockStatement,
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