/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "ecma-ast/clause", "ecma-ast/declaration",
    "ecma-ast/statement", "ecma-ast/node", "./token_parser", "./common", "./expression_parser", "./value_parser"
], (function(require, exports, parse, __o, ast_clause, ast_declaration, ast_statement, __o0, __o1, __o2, _, __o3) {
    "use strict";
    var blockStatement, variableStatement, emptyStatement, expressionStatement, ifStatement, forStatement,
            forInStatement, whileStatement, doWhileStatement, iterationStatement, continueStatement,
            breakStatement, returnStatement, withStatement, labeledStatement, switchStatement, throwStatement,
            tryStatement, debuggerStatement, statement, attempt = parse["attempt"],
        eager = parse["eager"],
        enumeration = parse["enumeration"],
        expected = parse["expected"],
        late = parse["late"],
        label = parse["label"],
        look = parse["look"],
        next = parse["next"],
        not = parse["not"],
        optional = parse["optional"],
        between = __o["between"],
        sepBy1 = __o["sepBy1"],
        then = __o["then"],
        getData = __o0["getData"],
        keyword = __o1["keyword"],
        punctuator = __o1["punctuator"],
        node = __o2["node"],
        nodea = __o2["nodea"],
        identifier = __o3["identifier"],
        expression = late((function() {
            var __o4 = require("./expression_parser"),
                expression0 = __o4["expression"];
            return expression0;
        })),
        expressionNoIn = late((function() {
            var __o4 = require("./expression_parser"),
                expressionNoIn0 = __o4["expressionNoIn"];
            return expressionNoIn0;
        })),
        assignmentExpression = late((function() {
            var __o4 = require("./expression_parser"),
                assignmentExpression0 = __o4["assignmentExpression"];
            return assignmentExpression0;
        })),
        assignmentExpressionNoIn = late((function() {
            var __o4 = require("./expression_parser"),
                assignmentExpressionNoIn0 = __o4["assignmentExpressionNoIn"];
            return assignmentExpressionNoIn0;
        })),
        leftHandSideExpression = late((function() {
            var __o4 = require("./expression_parser"),
                leftHandSideExpression0 = __o4["leftHandSideExpression"];
            return leftHandSideExpression0;
        }));
    (statement = late((function() {
        return statement;
    })));
    var lineTerminator = look(parse.token((function(node0) {
        return getData(node0, "lineTerminator");
    }))),
        noLineTerminator = next.bind(null, not(lineTerminator)),
        logicalSemiColon = parse.expected("logical semicolon", parse.choice(punctuator(";"), look(punctuator(
            "}")), lineTerminator, parse.eof)),
        statementList = eager(parse.many(statement));
    (blockStatement = label("Block Statement", node(between(punctuator("{"), punctuator("}"), statementList),
        ast_statement.BlockStatement.create)));
    var initialiser = next(punctuator("="), expected("initialiser expression", assignmentExpression)),
        initialiserNoIn = next(punctuator("="), expected("initialiser expression", assignmentExpressionNoIn)),
        variableDeclaration = nodea(enumeration(identifier, optional(initialiser)), ast_declaration.VariableDeclarator
            .create),
        variableDeclarationNoIn = nodea(enumeration(identifier, optional(initialiserNoIn)), ast_declaration.VariableDeclarator
            .create),
        variableDeclarationList = eager(sepBy1(punctuator(","), expected("variable declaration",
            variableDeclaration))),
        variableDeclarationListNoIn = eager(sepBy1(punctuator(","), expected("variable declaration",
            variableDeclarationNoIn)));
    (variableStatement = label("Variable Statement", node(between(keyword("var"), logicalSemiColon, expected(
            "variable declaration list", variableDeclarationList)), ast_declaration.VariableDeclaration
        .create)));
    (emptyStatement = label("Empty Statement", node(punctuator(";"), ast_statement.EmptyStatement.create)));
    (expressionStatement = label("Expression Statement", node(then(expression, logicalSemiColon), ast_statement
        .ExpressionStatement.create)));
    var test, consequent, alternate;
    (ifStatement = label("If Statement", ((test = between(punctuator("("), punctuator(")"), expected("if test",
        expression))), (consequent = expected("if consequent", statement)), (alternate = next(
        keyword("else"), expected("if alternate", statement))), nodea(next(keyword("if"),
        enumeration(test, consequent, optional(alternate))), ast_statement.IfStatement.create))));
    (whileStatement = label("While Statement", nodea(next(keyword("while"), enumeration(between(punctuator("("),
        punctuator(")"), parse.expected("while test", expression)), parse.expected(
        "while body", statement))), ast_statement.WhileStatement.create)));
    (doWhileStatement = label("Do While Statement", nodea(next(keyword("do"), enumeration(parse.expected(
            "do-while body", statement), next(keyword("while"), between(punctuator("("),
            punctuator(")"), parse.expected("do-while test", expression))), punctuator(";"))),
        ast_statement.DoWhileStatement.create)));
    var forInit = parse.either(node(next(keyword("var"), parse.expected("variable declaration list", parse.memo(
        variableDeclarationListNoIn))), ast_declaration.VariableDeclaration.create), expressionNoIn);
    (forStatement = parse.label("For Statement", nodea(next(keyword("for"), next(punctuator("("), enumeration(
            then(optional(forInit), punctuator(";")), then(optional(expressionNoIn), punctuator(
                ";")), then(optional(expressionNoIn), punctuator(")")), statement))), ast_statement.ForStatement
        .create)));
    var forInLeft = parse.either(node(next(keyword("var"), parse.expected("variable declaration", parse.memo(
        variableDeclarationNoIn))), (function(loc, x) {
        return ast_declaration.VariableDeclaration.create(loc, [x]);
    })), leftHandSideExpression);
    (forInStatement = parse.label("For In Statement", nodea(next(keyword("for"), next(punctuator("("),
        enumeration(then(forInLeft, keyword("in")), then(expressionNoIn, punctuator(")")),
            statement))), ast_statement.ForInStatement.create)));
    (iterationStatement = parse.label("Iteration Statement", parse.choice(doWhileStatement, whileStatement,
        attempt(forInStatement), forStatement)));
    var label0;
    (continueStatement = label("Continue Statement", ((label0 = noLineTerminator(identifier)), node(between(
            keyword("continue"), logicalSemiColon, optional(label0)), ast_statement.ContinueStatement
        .create))));
    var label1;
    (breakStatement = label("Break Statement", ((label1 = noLineTerminator(identifier)), node(between(keyword(
        "break"), logicalSemiColon, optional(label1)), ast_statement.BreakStatement.create))));
    var argument;
    (returnStatement = label("Return Statement", ((argument = noLineTerminator(expression)), node(between(
            keyword("return"), logicalSemiColon, optional(argument)), ast_statement.ReturnStatement
        .create))));
    var argument0;
    (throwStatement = label("Throw Statement", ((argument0 = expected("throw argument", noLineTerminator(
        expression))), node(between(keyword("throw"), logicalSemiColon, argument0), ast_statement.ThrowStatement
        .create))));
    var object, body;
    (withStatement = label("With Statement", ((object = between(punctuator("("), punctuator(")"), expected(
        "with object", expression))), (body = expected("with body", statement)), nodea(next(keyword(
        "with"), enumeration(object, body)), ast_statement.WithStatement.create))));
    (labeledStatement = label("Labeled Statement", nodea(enumeration(then(identifier, punctuator(":")),
        statement), ast_statement.LabeledStatement.create)));
    var caseClause = nodea(next(keyword("case"), enumeration(then(parse.expected("case test", expression),
        punctuator(":")), statementList)), ast_clause.SwitchCase.create),
        defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (function(loc,
            consequent0) {
            return ast_clause.SwitchCase.create(loc, null, consequent0);
        })),
        caseClauses = eager(parse.many(caseClause)),
        caseBlock = between(punctuator("{"), punctuator("}"), parse.binds(enumeration(parse.optional([],
            caseClauses), optional(defaultClause), parse.optional([], caseClauses)), (function(first,
            defaultClause0, rest) {
            return parse.always((defaultClause0 ? first.concat(defaultClause0, rest) : first.concat(
                rest)));
        })));
    (switchStatement = parse.label("Switch Statement", nodea(next(keyword("switch"), enumeration(between(
        punctuator("("), punctuator(")"), expression), caseBlock)), ast_statement.SwitchStatement.create)));
    var catchBlock = nodea(next(keyword("catch"), enumeration(between(punctuator("("), punctuator(")"),
        identifier), blockStatement)), ast_clause.CatchClause.create),
        finallyBlock = next(keyword("finally"), blockStatement);
    (tryStatement = label("Try Statement", nodea(next(keyword("try"), enumeration(blockStatement, optional(
        catchBlock), optional(finallyBlock))), ast_statement.TryStatement.create)));
    (debuggerStatement = label("Debugger Statement", node(next(keyword("debugger"), punctuator(";")),
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