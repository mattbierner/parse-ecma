/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "ecma-ast/clause", "ecma-ast/declaration",
    "ecma-ast/statement", "./token_parser", "./common", "./expression_parser", "./value_parser"
], (function(require, exports, parse, parse_lang, ast_clause, ast_declaration, ast_statement, token, __o,
    expression, value) {
    "use strict";
    var eager = parse["eager"],
        late = parse["late"],
        next = parse["next"],
        not = parse["not"],
        between = parse_lang["between"],
        then = parse_lang["then"],
        keyword = token["keyword"],
        punctuator = token["punctuator"],
        node = __o["node"],
        nodea = __o["nodea"],
        blockStatement, variableStatement, emptyStatement, expressionStatement, ifStatement, forStatement,
            forInStatement, whileStatement, doWhileStatement, iterationStatement, continueStatement,
            breakStatement, returnStatement, withStatement, labeledStatement, switchStatement, throwStatement,
            tryStatement, debuggerStatement, statement;
    (statement = late((function() {
        return statement;
    })));
    var lineTerminator = parse.look(parse.token((function(x) {
        return x.lineTerminator;
    }))),
        noLineTerminator = next.bind(null, not(lineTerminator)),
        logicalSemiColon = parse.expected("logical semicolon", parse.choice(punctuator(";"), parse.look(
            punctuator("}")), lineTerminator, parse.eof)),
        statementList = eager(parse.many(statement));
    (blockStatement = parse.label("Block Statement", node(between(punctuator("{"), punctuator("}"),
        statementList), ast_statement.BlockStatement.create)));
    var initialiser = next(punctuator("="), parse.expected("initialiser expression", expression.assignmentExpression)),
        initialiserNoIn = next(punctuator("="), parse.expected("initialiser expression", expression.assignmentExpressionNoIn)),
        variableDeclaration = nodea(parse.enumeration(value.identifier, parse.optional(initialiser)),
            ast_declaration.VariableDeclarator.create),
        variableDeclarationNoIn = nodea(parse.enumeration(value.identifier, parse.optional(initialiserNoIn)),
            ast_declaration.VariableDeclarator.create),
        variableDeclarationList = eager(parse_lang.sepBy1(punctuator(","), parse.expected(
            "variable declaration", variableDeclaration))),
        variableDeclarationListNoIn = eager(parse_lang.sepBy1(punctuator(","), parse.expected(
            "variable declaration", variableDeclarationNoIn)));
    (variableStatement = parse.label("Variable Statement", node(between(keyword("var"), logicalSemiColon, parse
            .expected("variable declaration list", variableDeclarationList)), ast_declaration.VariableDeclaration
        .create)));
    (emptyStatement = parse.label("Empty Statement", node(punctuator(";"), ast_statement.EmptyStatement.create)));
    (expressionStatement = parse.label("Expression Statement", node(then(expression.expression,
        logicalSemiColon), ast_statement.ExpressionStatement.create)));
    (ifStatement = parse.label("If Statement", nodea(next(keyword("if"), parse.enumeration(between(punctuator(
        "("), punctuator(")"), parse.expected("if test", expression.expression)), parse.expected(
        "if consequent", statement), parse.optional(next(keyword("else"), parse.expected(
        "if alternate", statement))))), ast_statement.IfStatement.create)));
    (whileStatement = parse.label("While Statement", nodea(next(keyword("while"), parse.enumeration(between(
        punctuator("("), punctuator(")"), parse.expected("while test", expression.expression)
    ), parse.expected("while body", statement))), ast_statement.WhileStatement.create)));
    (doWhileStatement = parse.label("Do While Statement", nodea(next(keyword("do"), parse.enumeration(parse.expected(
            "do-while body", statement), next(keyword("while"), between(punctuator("("),
            punctuator(")"), parse.expected("do-while test", expression.expression))),
        punctuator(";"))), ast_statement.DoWhileStatement.create)));
    var forInit = parse.either(node(next(keyword("var"), parse.expected("variable declaration list", parse.memo(
        variableDeclarationListNoIn))), ast_declaration.VariableDeclaration.create), expression.expressionNoIn);
    (forStatement = parse.label("For Statement", nodea(next(keyword("for"), next(punctuator("("), parse.enumeration(
        then(parse.optional(forInit), punctuator(";")), then(parse.optional(expression.expressionNoIn),
            punctuator(";")), then(parse.optional(expression.expressionNoIn), punctuator(
            ")")), statement))), ast_statement.ForStatement.create)));
    var forInLeft = parse.either(node(next(keyword("var"), parse.expected("variable declaration", parse.memo(
        variableDeclarationNoIn))), (function(loc, x) {
        return ast_declaration.VariableDeclaration.create(loc, [x]);
    })), expression.leftHandSideExpression);
    (forInStatement = parse.label("For In Statement", nodea(next(keyword("for"), next(punctuator("("), parse.enumeration(
        then(forInLeft, keyword("in")), then(expression.expressionNoIn, punctuator(")")),
        statement))), ast_statement.ForInStatement.create)));
    (iterationStatement = parse.label("Iteration Statement", parse.choice(doWhileStatement, whileStatement,
        parse.attempt(forInStatement), forStatement)));
    (continueStatement = parse.label("Continue Statement", node(between(keyword("continue"), logicalSemiColon,
        parse.optional(noLineTerminator(value.identifier))), ast_statement.ContinueStatement.create)));
    (breakStatement = parse.label("Break Statement", node(between(keyword("break"), logicalSemiColon, parse.optional(
        noLineTerminator(value.identifier))), ast_statement.BreakStatement.create)));
    (returnStatement = parse.label("Return Statement", node(between(keyword("return"), logicalSemiColon, parse.optional(
        noLineTerminator(expression.expression))), ast_statement.ReturnStatement.create)));
    (throwStatement = parse.label("Throw Statement", node(between(keyword("throw"), logicalSemiColon, parse.expected(
        "throw argument", noLineTerminator(expression.expression))), ast_statement.ThrowStatement.create)));
    (withStatement = parse.label("With Statement", nodea(next(keyword("with"), parse.enumeration(between(
        punctuator("("), punctuator(")"), parse.expected("with object", expression.expression)
    ), parse.expected("with body", statement))), ast_statement.WithStatement.create)));
    (labeledStatement = parse.label("Labeled Statement", nodea(parse.enumeration(then(value.identifier,
        punctuator(":")), statement), ast_statement.LabeledStatement.create)));
    var caseClause = nodea(next(keyword("case"), parse.enumeration(then(parse.expected("case test", expression.expression),
        punctuator(":")), statementList)), ast_clause.SwitchCase.create),
        defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (function(loc,
            consequent) {
            return ast_clause.SwitchCase.create(loc, null, consequent);
        })),
        caseClauses = eager(parse.many(caseClause)),
        caseBlock = between(punctuator("{"), punctuator("}"), parse.binds(parse.enumeration(parse.optional([],
            caseClauses), parse.optional(defaultClause), parse.optional([], caseClauses)), (function(
            first, defaultClause0, rest) {
            return parse.always((defaultClause0 ? first.concat(defaultClause0, rest) : first.concat(
                rest)));
        })));
    (switchStatement = parse.label("Switch Statement", nodea(next(keyword("switch"), parse.enumeration(between(
            punctuator("("), punctuator(")"), expression.expression), caseBlock)), ast_statement.SwitchStatement
        .create)));
    var catchBlock = nodea(next(keyword("catch"), parse.enumeration(between(punctuator("("), punctuator(")"),
        value.identifier), parse.expected("block statement", blockStatement))), ast_clause.CatchClause.create),
        finallyBlock = next(keyword("finally"), parse.expected("block statement", blockStatement));
    (tryStatement = parse.label("Try Statement", nodea(next(keyword("try"), parse.enumeration(parse.expected(
        "block statement", blockStatement), parse.optional(catchBlock), parse.optional(
        finallyBlock))), ast_statement.TryStatement.create)));
    (debuggerStatement = parse.label("Debugger Statement", node(next(keyword("debugger"), punctuator(";")),
        ast_statement.DebuggerStatement.create)));
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