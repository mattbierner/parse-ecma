var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(lexer.lex(stream));
    return result.body[0];
};

exports.debugger_statement = function(test) {
    var stmt = testParser("debugger;");
    test.equal(stmt.type, "DebuggerStatement");

    test.done();
};

exports.empty_block = function(test) {
    var stmt = testParser("{}");
    test.equal(stmt.type, "BlockStatement");
    test.ok(stmt.body.length === 0);
    test.done();
};

exports.block = function(test) {
    var stmt = testParser("{debugger;{}debugger;}");
    test.equal(stmt.type, "BlockStatement");
    test.ok(stmt.body.length === 3);
    test.equal(stmt.body[0].type, "DebuggerStatement");
    test.equal(stmt.body[1].type, "BlockStatement");
    test.equal(stmt.body[2].type, "DebuggerStatement");
    
    test.done();
};

exports.single_var_decl = function(test) {
    var stmt = testParser("var a;");
    test.equal(stmt.type, "VariableDeclaration");
    test.deepEqual(stmt.declarations.length, 1);
    test.deepEqual(stmt.declarations[0].id.name, 'a');
    test.ok(!stmt.declarations[0].init);
    
    test.done();
};

exports.init_var_decl = function(test) {
    var stmt = testParser("var a = 1;");
    test.equal(stmt.type, "VariableDeclaration");
    test.deepEqual(stmt.declarations.length, 1);
    test.deepEqual(stmt.declarations[0].id.name, 'a');
    test.deepEqual(stmt.declarations[0].init.value, 1);
    
    test.done();
};

exports.multi_var_decl = function(test) {
    var stmt = testParser("var a = 1, b;");
    test.equal(stmt.type, "VariableDeclaration");
    test.deepEqual(stmt.declarations.length, 2);
    test.deepEqual(stmt.declarations[0].id.name, 'a');
    test.deepEqual(stmt.declarations[0].init.value, 1);
    test.deepEqual(stmt.declarations[1].id.name, 'b');
    test.ok(!stmt.declarations[1].init);
    
    test.done();
};

exports.simple_if = function(test) {
    var stmt = testParser("if (a) debugger;");
    test.equal(stmt.type, "IfStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.consequent.type, 'DebuggerStatement');
    test.ok(!stmt.alternate);
    
    test.done();
};

exports.simple_if_block = function(test) {
    var stmt = testParser("if (a) { debugger; return 3; }");
    test.equal(stmt.type, "IfStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.consequent.type, 'BlockStatement');
    test.equal(stmt.consequent.body[0].type, 'DebuggerStatement');
    test.equal(stmt.consequent.body[1].type, 'ReturnStatement');
    test.ok(!stmt.alternate);
    
    test.done();
};

exports.simple_if_else = function(test) {
    var stmt = testParser("if (a) debugger; else ;");
    test.equal(stmt.type, "IfStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.consequent.type, 'DebuggerStatement');
    test.equal(stmt.alternate.type, 'EmptyStatement');
    
    test.done();
};

exports.simple_do_while = function(test) {
    var stmt = testParser("do debugger; while (a);");
    test.equal(stmt.type, "DoWhileStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.do_while_while_body = function(test) {
    var stmt = testParser("do while (a) debugger; while (b);");
    test.equal(stmt.type, "DoWhileStatement");
    test.equal(stmt.test.name, 'b');
    test.equal(stmt.body.type, 'WhileStatement');
    
    test.done();
};

exports.simple_while = function(test) {
    var stmt = testParser("while (a) debugger;");
    test.equal(stmt.type, "WhileStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.while_do_while_body = function(test) {
    var stmt = testParser("while (a) do debugger; while (b);");
    test.equal(stmt.type, "WhileStatement");
    test.equal(stmt.test.name, 'a');
    test.equal(stmt.body.type, 'DoWhileStatement');
    
    test.done();
};

exports.simple_for = function(test) {
    var stmt = testParser("for (a; b; c) debugger;");
    test.equal(stmt.type, "ForStatement");
    test.equal(stmt.init.name, 'a');
    test.equal(stmt.test.name, 'b');
    test.equal(stmt.update.name, 'c');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_no_init = function(test) {
    var stmt = testParser("for (; b; c) debugger;");
    test.equal(stmt.type, "ForStatement");
    test.ok(!stmt.init);
    test.equal(stmt.test.name, 'b');
    test.equal(stmt.update.name, 'c');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_empty_test = function(test) {
    var stmt = testParser("for (; ; c) debugger;");
    test.equal(stmt.type, "ForStatement");
    test.ok(!stmt.init);
    test.ok(!stmt.test);
    test.equal(stmt.update.name, 'c');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_empty_update = function(test) {
    var stmt = testParser("for (;;) debugger;");
    test.equal(stmt.type, "ForStatement");
    test.ok(!stmt.init);
    test.ok(!stmt.test);
    test.ok(!stmt.update);
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_var_init = function(test) {
    var stmt = testParser("for (var a = 3; b; c) debugger;");
    test.equal(stmt.type, "ForStatement");
    test.equal(stmt.init.type, 'VariableDeclaration');
    test.equal(stmt.init.declarations[0].id.name, 'a');
    test.equal(stmt.init.declarations[0].init.value, 3);
    test.equal(stmt.test.name, 'b');
    test.equal(stmt.update.name, 'c');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_update_in_exprssion = function(test) {
    testParser("for (var a = (x in y); (x in y); (x in y)) debugger;");
    test.ok(true);
    
    test.done();
};

exports.for_var_in_op = function(test) {
    test.throws(
        testParser.bind(undefined, "for (var a = x in y; ; ) debugger;"));
    
    test.done();
};

exports.simple_for_in = function(test) {
    var stmt = testParser("for (a in b) debugger;");
    test.equal(stmt.type, "ForInStatement");
    test.equal(stmt.left.name, 'a');
    test.equal(stmt.right.name, 'b');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.simple_for_var_in = function(test) {
    var stmt = testParser("for (var a in b) debugger;");
    test.equal(stmt.type, "ForInStatement");
    test.equal(stmt.left.type, 'VariableDeclaration');
    test.equal(stmt.left.declarations[0].id.name, 'a');
    test.ok(!stmt.left.declarations[0].id.init);
    test.equal(stmt.right.name, 'b');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.for_in_var_init = function(test) {
    var stmt = testParser("for (var a = 3 in b) debugger;");
    test.equal(stmt.type, "ForInStatement");
    test.equal(stmt.left.type, 'VariableDeclaration');
    test.equal(stmt.left.declarations[0].id.name, 'a');
    test.equal(stmt.left.declarations[0].init.value, 3);
    test.equal(stmt.right.name, 'b');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.simple_for_init_with_in_op = function(test) {
    testParser("for (a in (b in z)) debugger;");
    testParser("for (var a = (z in y) in (b in z)) debugger;");
    test.ok(true);
    
    test.done();
};

exports.continue_statement = function(test) {
    var stmt = testParser("continue;");
    test.equal(stmt.type, "ContinueStatement");
    test.ok(!stmt.label);
    
    test.done();
};

exports.labeled_continue = function(test) {
    var stmt = testParser("continue a;");
    test.equal(stmt.type, "ContinueStatement");
    test.equal(stmt.label.name, 'a');
    
    test.done();
};

exports.semicolor_insert_labeled_continue = function(test) {
    var stmt = testParser("continue a");
    test.equal(stmt.type, "ContinueStatement");
    test.equal(stmt.label.name, 'a');
    
    var stmt2 = testParser("continue a\n debugger;");
    test.equal(stmt2.type, "ContinueStatement");
    test.equal(stmt2.label.name, 'a');
    
    test.done();
};

exports.breakline_continue_statement = function(test) {
    var stmt = testParser("continue \n a;");
    test.equal(stmt.type, "ContinueStatement");
    test.ok(!stmt.label);
    
    test.done();
};

exports.simple_break = function(test) {
    var stmt = testParser("break;");
    test.equal(stmt.type, "BreakStatement");
    test.ok(!stmt.label);
    
    test.done();
};

exports.simple_labeled_break = function(test) {
    var stmt = testParser("break a;");
    test.equal(stmt.type, "BreakStatement");
    test.equal(stmt.label.name, 'a');
    
    test.done();
};

exports.semicolon_insertion_labeled_break = function(test) {
    var stmt = testParser("break a");
    test.equal(stmt.type, "BreakStatement");
    test.equal(stmt.label.name, 'a');
    
    var stmt2 = testParser("break a\n debugger;");
    test.equal(stmt2.type, "BreakStatement");
    test.equal(stmt2.label.name, 'a');
    
    test.done();
};

exports.breakline_break = function(test) {
    var stmt = testParser("break \n a;");
    test.equal(stmt.type, "BreakStatement");
    test.ok(!stmt.label);
    
    test.done();
};

exports.empty_return = function(test) {
    var stmt = testParser("return;");
    test.equal(stmt.type, "ReturnStatement");
    test.ok(!stmt.argument);
    
    test.done();
};

exports.return_with_arg = function(test) {
    var stmt = testParser("return 3;");
    test.equal(stmt.type, "ReturnStatement");
    test.equal(stmt.argument.value, 3);
    
    test.done();
};

exports.return_sequence = function(test) {
    var stmt = testParser("return 3, 4, 5;");
    test.equal(stmt.type, "ReturnStatement");
    test.equal(stmt.argument.expressions[2].value, 5);
    
    test.done();
};

exports.reutnr_semicolon_insertion = function(test) {
    var stmt = testParser("return 3");
    test.equal(stmt.type, "ReturnStatement");
    
    var stmt2 = testParser("return 3\n debugger;");
    test.equal(stmt2.type, "ReturnStatement");
    
    test.done();
};

exports.return_newline_semicolon = function(test) {
    var stmt = testParser("return\n 3");
    test.equal(stmt.type, "ReturnStatement");
    test.ok(!stmt.type.argument);
    
    test.done();
};

exports.simple_with = function(test) {
    var stmt = testParser("with (a) debugger;");
    test.equal(stmt.type, "WithStatement");
    test.equal(stmt.object.name, 'a');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.with_expression = function(test) {
    var stmt = testParser("with (a = 3) debugger;");
    test.equal(stmt.type, "WithStatement");
    test.equal(stmt.object.type, 'AssignmentExpression');
    test.equal(stmt.body.type, 'DebuggerStatement');
    
    test.done();
};

exports.with_grouping = function(test) {
    var stmt = testParser("with (a) with (b) debugger;");
    test.equal(stmt.type, "WithStatement");
    test.equal(stmt.object.name, 'a');
    test.equal(stmt.body.type, 'WithStatement');
    
    test.done();
};

exports.simple_switch = function(test) {
    var stmt = testParser("switch (a) {}");
    test.equal(stmt.type, "SwitchStatement");
    test.equal(stmt.discriminant.name, 'a');
    test.deepEqual(stmt.cases, []);
    test.done();
};

exports.switch_cases = function(test) {
    var stmt = testParser("switch (a) { case x: break; case y: debugger; break; }");
    test.equal(stmt.type, "SwitchStatement");
    test.equal(stmt.discriminant.name, 'a');
    test.equal(stmt.cases.length, 2);
    test.equal(stmt.cases[0].test.name, 'x');
    test.equal(stmt.cases[0].consequent[0].type, 'BreakStatement');
    test.equal(stmt.cases[1].test.name, 'y');
    test.equal(stmt.cases[1].consequent[0].type, 'DebuggerStatement');
    test.equal(stmt.cases[1].consequent[1].type, 'BreakStatement');

    test.done();
};

exports.switch_default = function(test) {
    var stmt = testParser("switch (a) { case x: break; default: break; case y: debugger; break; }");
    test.equal(stmt.type, "SwitchStatement");
    test.equal(stmt.discriminant.name, 'a');
    test.equal(stmt.cases.length, 3);
    test.equal(stmt.cases[0].test.name, 'x');
    test.equal(stmt.cases[0].consequent[0].type, 'BreakStatement');
    test.ok(!stmt.cases[1].test);
    test.equal(stmt.cases[2].test.name, 'y');
    test.equal(stmt.cases[2].consequent[0].type, 'DebuggerStatement');
    test.equal(stmt.cases[2].consequent[1].type, 'BreakStatement');
    
    test.done();
};

exports.switch_fallthrough = function(test) {
    var stmt = testParser("switch (a) { case x: case y: debugger; break; }");
    test.equal(stmt.type, "SwitchStatement");
    test.equal(stmt.discriminant.name, 'a');
    test.equal(stmt.cases.length, 2);
    test.equal(stmt.cases[0].test.name, 'x');
    test.ok(!stmt.cases[0].consequent[0]);
    test.equal(stmt.cases[1].test.name, 'y');
    test.equal(stmt.cases[1].consequent[0].type, 'DebuggerStatement');
    test.equal(stmt.cases[1].consequent[1].type, 'BreakStatement');
    
    test.done();
};

exports.simple_throw = function(test) {
    var stmt = testParser("throw a;");
    test.equal(stmt.type, "ThrowStatement");
    test.equal(stmt.argument.name, 'a');
    
    test.done();
};

exports.semicolon_throw = function(test) {
    var stmt = testParser("throw a");
    test.equal(stmt.type, "ThrowStatement");
    test.equal(stmt.argument.name, 'a');
    
    var stmt2 = testParser("throw a\n debugger;");
    test.equal(stmt2.type, "ThrowStatement");
    test.equal(stmt2.argument.name, 'a');
    
    test.done();
};

exports.breakine_throw = function(test) {
    test.throws(
        testParser.bind(undefined, "throw \n a;"));
    
    test.done();
};

exports.simple_try = function(test) {
    var stmt = testParser("try {debugger;}");
    test.equal(stmt.type, "TryStatement");
    test.equal(stmt.block.body.length, 1);
    test.equal(stmt.block.body[0].type, "DebuggerStatement");
    
    test.done();
};

exports.try_finally = function(test) {
    var stmt = testParser("try {} finally { debugger; }");
    test.equal(stmt.type, "TryStatement");
    test.equal(stmt.block.body.length, 0);
    test.equal(stmt.finalizer.body[0].type, "DebuggerStatement");
    
    test.done();
};

exports.try_catch = function(test) {
    var stmt = testParser("try {} catch (a) { debugger; }");
    test.equal(stmt.type, "TryStatement");
    test.equal(stmt.block.body.length, 0);
    test.equal(stmt.handler.param.name, "a");
    test.equal(stmt.handler.body.body[0].type, "DebuggerStatement");
    
    test.done();
};

exports.try_finally_catch = function(test) {
    var stmt = testParser("try {} finally { debugger; }");
    test.equal(stmt.type, "TryStatement");
    test.equal(stmt.block.body.length, 0);
    test.equal(stmt.finalizer.body[0].type, "DebuggerStatement");
    
    test.done();
};

