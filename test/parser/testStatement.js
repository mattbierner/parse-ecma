define(['parse/parse', 'nu/stream', 'ecma/lex/lexer', 'ecma/parse/parser', 'ecma/parse/statement_parser'],
function(parse, stream, lexer, parser, statement){
    
    var testParser = function(stream) {
        var stmt = parser.parseStream(stream);
        return stmt.body[0];
    };
    
    return {
        'module': "Statement Tests",
        'tests': [
            ["Debugger",
            function(){
                var stmt = testParser(lexer.lex("debugger;"));
                assert.equal(stmt.type, "DebuggerStatement");
            }],
            
            ["Empty Block",
            function(){
                var stmt = testParser(lexer.lex("{}"));
                assert.equal(stmt.type, "BlockStatement");
                assert.ok(stmt.body.length === 0);
            }],
            ["Non Empty Block",
            function(){
                var stmt = testParser(lexer.lex("{debugger;{}debugger;}"));
                assert.equal(stmt.type, "BlockStatement");
                assert.ok(stmt.body.length === 3);
                assert.equal(stmt.body[0].type, "DebuggerStatement");
                assert.equal(stmt.body[1].type, "BlockStatement");
                assert.equal(stmt.body[2].type, "DebuggerStatement");
            }],
            
            ["Single Variable Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("var a;")));
                assert.equal(stmt.type, "VariableDeclaration");
                assert.deepEqual(stmt.declarations.length, 1);
                assert.deepEqual(stmt.declarations[0].id.name, 'a');
                assert.ok(!stmt.declarations[0].init);
            }],
            ["Single Initilizer Variable Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("var a = 1;")));
                assert.equal(stmt.type, "VariableDeclaration");
                assert.deepEqual(stmt.declarations.length, 1);
                assert.deepEqual(stmt.declarations[0].id.name, 'a');
                assert.deepEqual(stmt.declarations[0].init.value, 1);
            }],
            ["Multi Variable Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("var a = 1, b;")));
                assert.equal(stmt.type, "VariableDeclaration");
                assert.deepEqual(stmt.declarations.length, 2);
                assert.deepEqual(stmt.declarations[0].id.name, 'a');
                assert.deepEqual(stmt.declarations[0].init.value, 1);
                assert.deepEqual(stmt.declarations[1].id.name, 'b');
                assert.ok(!stmt.declarations[1].init);
            }],
            
            ["Simple if Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("if (a) debugger;")));
                assert.equal(stmt.type, "IfStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.consequent.type, 'DebuggerStatement');
                assert.ok(!stmt.alternate);
            }],
            ["Simple if Block Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("if (a) { debugger; return 3; }")));
                assert.equal(stmt.type, "IfStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.consequent.type, 'BlockStatement');
                assert.equal(stmt.consequent.body[0].type, 'DebuggerStatement');
                assert.equal(stmt.consequent.body[1].type, 'ReturnStatement');
                assert.ok(!stmt.alternate);
            }],
            ["Simple if else Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("if (a) debugger; else ;")));
                assert.equal(stmt.type, "IfStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.consequent.type, 'DebuggerStatement');
                assert.equal(stmt.alternate.type, 'EmptyStatement');
            }],
            
            ["Simple Do While Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("do debugger; while (a);")));
                assert.equal(stmt.type, "DoWhileStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["Do While While Body Test",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("do while (a) debugger; while (b);")));
                assert.equal(stmt.type, "DoWhileStatement");
                assert.equal(stmt.test.name, 'b');
                assert.equal(stmt.body.type, 'WhileStatement');
            }],
            
            ["Simple While Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("while (a) debugger;")));
                assert.equal(stmt.type, "WhileStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["While Statement Do While Body Test",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("while (a) do debugger; while (b);")));
                assert.equal(stmt.type, "WhileStatement");
                assert.equal(stmt.test.name, 'a');
                assert.equal(stmt.body.type, 'DoWhileStatement');
            }],
            
            ["Simple For Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (a; b; c) debugger;")));
                assert.equal(stmt.type, "ForStatement");
                assert.equal(stmt.init.name, 'a');
                assert.equal(stmt.test.name, 'b');
                assert.equal(stmt.update.name, 'c');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Init",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (; b; c) debugger;")));
                assert.equal(stmt.type, "ForStatement");
                assert.ok(!stmt.init);
                assert.equal(stmt.test.name, 'b');
                assert.equal(stmt.update.name, 'c');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Test",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (; ; c) debugger;")));
                assert.equal(stmt.type, "ForStatement");
                assert.ok(!stmt.init);
                assert.ok(!stmt.test);
                assert.equal(stmt.update.name, 'c');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Update",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (;;) debugger;")));
                assert.equal(stmt.type, "ForStatement");
                assert.ok(!stmt.init);
                assert.ok(!stmt.test);
                assert.ok(!stmt.update);
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["For Statement Var Init",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (var a = 3; b; c) debugger;")));
                assert.equal(stmt.type, "ForStatement");
                assert.equal(stmt.init.type, 'VariableDeclaration');
                assert.equal(stmt.init.declarations[0].id.name, 'a');
                assert.equal(stmt.init.declarations[0].init.value, 3);
                assert.equal(stmt.test.name, 'b');
                assert.equal(stmt.update.name, 'c');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["For Statement in operator expression",
            function(){
                testParser(parser.parserStream(lexer.lex("for (var a = (x in y); (x in y); (x in y)) debugger;")));
                assert.ok(true);
            }],
            ["For Statement Bad In operator",
            function(){
                assert.throws(
                    testParser.bind(undefined, parser.parserStream(lexer.lex("for (var a = x in y; ; ) debugger;"))));
            }],
            
            ["Simple For In Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (a in b) debugger;")));
                assert.equal(stmt.type, "ForInStatement");
                assert.equal(stmt.left.name, 'a');
                assert.equal(stmt.right.name, 'b');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement Var",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (var a in b) debugger;")));
                assert.equal(stmt.type, "ForInStatement");
                assert.equal(stmt.left.type, 'VariableDeclaration');
                assert.equal(stmt.left.declarations[0].id.name, 'a');
                assert.ok(!stmt.left.declarations[0].id.init);
                assert.equal(stmt.right.name, 'b');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement Var Init",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("for (var a = 3 in b) debugger;")));
                assert.equal(stmt.type, "ForInStatement");
                assert.equal(stmt.left.type, 'VariableDeclaration');
                assert.equal(stmt.left.declarations[0].id.name, 'a');
                assert.equal(stmt.left.declarations[0].init.value, 3);
                assert.equal(stmt.right.name, 'b');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement With In Operator",
            function(){
                testParser(parser.parserStream(lexer.lex("for (a in (b in z)) debugger;")));
                testParser(parser.parserStream(lexer.lex("for (var a = (z in y) in (b in z)) debugger;")));
                assert.ok(true);
            }],
            
            ["Simple Continue Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("continue;")));
                assert.equal(stmt.type, "ContinueStatement");
                assert.ok(!stmt.label);
            }],
            ["Simple Labeled Continue Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("continue a;")));
                assert.equal(stmt.type, "ContinueStatement");
                assert.equal(stmt.label.name, 'a');
            }],
            ["Semicolon Insertion Labeled Continue Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("continue a")));
                assert.equal(stmt.type, "ContinueStatement");
                assert.equal(stmt.label.name, 'a');
                
                var stmt2 = testParser(parser.parserStream(lexer.lex("continue a\n debugger;")));
                assert.equal(stmt2.type, "ContinueStatement");
                assert.equal(stmt2.label.name, 'a');
            }],
            ["Breakline continue Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("continue \n a;")));
                assert.equal(stmt.type, "ContinueStatement");
                assert.ok(!stmt.label);
            }],
            
            ["Simple Break Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("break;")));
                assert.equal(stmt.type, "BreakStatement");
                assert.ok(!stmt.label);
            }],
            ["Simple Labeled Break Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("break a;")));
                assert.equal(stmt.type, "BreakStatement");
                assert.equal(stmt.label.name, 'a');
            }],
            ["Semicolon Insertion Labeled Break Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("break a")));
                assert.equal(stmt.type, "BreakStatement");
                assert.equal(stmt.label.name, 'a');
                
                var stmt2 = testParser(parser.parserStream(lexer.lex("break a\n debugger;")));
                assert.equal(stmt2.type, "BreakStatement");
                assert.equal(stmt2.label.name, 'a');
            }],
            ["Breakline Break Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("break \n a;")));
                assert.equal(stmt.type, "BreakStatement");
                assert.ok(!stmt.label);
            }],
            
            ["Simple Return Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("return;")));
                assert.equal(stmt.type, "ReturnStatement");
                assert.ok(!stmt.argument);
            }],
            ["Simple Return Statement With Value",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("return 3;")));
                assert.equal(stmt.type, "ReturnStatement");
                assert.equal(stmt.argument.value, 3);
            }],
            [" Return Statement With Sequence Expression",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("return 3, 4, 5;")));
                assert.equal(stmt.type, "ReturnStatement");
                assert.equal(stmt.argument.expressions[2].value, 5);
            }],
            ["Return Statement With SemiColon Insertion",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("return 3")));
                assert.equal(stmt.type, "ReturnStatement");
                
                var stmt2 = testParser(parser.parserStream(lexer.lex("return 3\n debugger;")));
                assert.equal(stmt2.type, "ReturnStatement");
            }],
            ["Return Statement With Newline SemiColon Insertion",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("return\n 3")));
                assert.equal(stmt.type, "ReturnStatement");
                assert.ok(!stmt.type.argument);
            }],
            
            ["Simple With Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("with (a) debugger;")));
                assert.equal(stmt.type, "WithStatement");
                assert.equal(stmt.object.name, 'a');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["With Statement Expression",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("with (a = 3) debugger;")));
                assert.equal(stmt.type, "WithStatement");
                assert.equal(stmt.object.type, 'AssignmentExpression');
                assert.equal(stmt.body.type, 'DebuggerStatement');
            }],
            ["With Statement Correct Grouping",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("with (a) with (b) debugger; ")));
                assert.equal(stmt.type, "WithStatement");
                assert.equal(stmt.object.name, 'a');
                assert.equal(stmt.body.type, 'WithStatement');
            }],
            
            ["Simple Switch Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("switch (a) {}")));
                assert.equal(stmt.type, "SwitchStatement");
                assert.equal(stmt.discriminant.name, 'a');
                assert.deepEqual(stmt.cases, []);
            }],
            ["Switch Statement With Cases",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("switch (a) { case x: break; case y: debugger; break; }")));
                assert.equal(stmt.type, "SwitchStatement");
                assert.equal(stmt.discriminant.name, 'a');
                assert.equal(stmt.cases.length, 2);
                assert.equal(stmt.cases[0].test.name, 'x');
                assert.equal(stmt.cases[0].consequent[0].type, 'BreakStatement');
                assert.equal(stmt.cases[1].test.name, 'y');
                assert.equal(stmt.cases[1].consequent[0].type, 'DebuggerStatement');
                assert.equal(stmt.cases[1].consequent[1].type, 'BreakStatement');
            }],
            ["Switch Statement With Default",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("switch (a) { case x: break; default: break; case y: debugger; break; }")));
                assert.equal(stmt.type, "SwitchStatement");
                assert.equal(stmt.discriminant.name, 'a');
                assert.equal(stmt.cases.length, 3);
                assert.equal(stmt.cases[0].test.name, 'x');
                assert.equal(stmt.cases[0].consequent[0].type, 'BreakStatement');
                assert.ok(!stmt.cases[1].test);
                assert.equal(stmt.cases[2].test.name, 'y');
                assert.equal(stmt.cases[2].consequent[0].type, 'DebuggerStatement');
                assert.equal(stmt.cases[2].consequent[1].type, 'BreakStatement');
            }],
            ["Switch Statement With Fallthrough Cases",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("switch (a) { case x: case y: debugger; break; }")));
                assert.equal(stmt.type, "SwitchStatement");
                assert.equal(stmt.discriminant.name, 'a');
                assert.equal(stmt.cases.length, 2);
                assert.equal(stmt.cases[0].test.name, 'x');
                assert.ok(!stmt.cases[0].consequent[0]);
                assert.equal(stmt.cases[1].test.name, 'y');
                assert.equal(stmt.cases[1].consequent[0].type, 'DebuggerStatement');
                assert.equal(stmt.cases[1].consequent[1].type, 'BreakStatement');
            }],
            
            ["Simple Throw Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("throw a;")));
                assert.equal(stmt.type, "ThrowStatement");
                assert.equal(stmt.argument.name, 'a');
            }],
            ["Semicolon Insertion Labeled Throw Statement",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("throw a")));
                assert.equal(stmt.type, "ThrowStatement");
                assert.equal(stmt.argument.name, 'a');
                
                var stmt2 = testParser(parser.parserStream(lexer.lex("throw a\n debugger;")));
                assert.equal(stmt2.type, "ThrowStatement");
                assert.equal(stmt2.argument.name, 'a');
            }],
            ["Breakline Throw Statement",
            function(){
                assert.throws(
                    testParser.bind(undefined, parser.parserStream(lexer.lex("throw \n a;"))));
            }],
            
            ["Simple Try Statement ",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("try {debugger;}")));
                assert.equal(stmt.type, "TryStatement");
                assert.equal(stmt.block.body.length, 1);
                assert.equal(stmt.block.body[0].type, "DebuggerStatement");
            }],
            ["Simple Try Statement With Finally",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("try {} finally { debugger; }")));
                assert.equal(stmt.type, "TryStatement");
                assert.equal(stmt.block.body.length, 0);
                assert.equal(stmt.finalizer.body[0].type, "DebuggerStatement");
            }],
             ["Simple Try Statement With Catch",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("try {} catch (a) { debugger; }")));
                assert.equal(stmt.type, "TryStatement");
                assert.equal(stmt.block.body.length, 0);
                assert.equal(stmt.handler.param.name, "a");
                assert.equal(stmt.handler.body.body[0].type, "DebuggerStatement");
            }],
            ["Simple Try Statement With Catch and Finally",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("try {} finally { debugger; }")));
                assert.equal(stmt.type, "TryStatement");
                assert.equal(stmt.block.body.length, 0);
                assert.equal(stmt.finalizer.body[0].type, "DebuggerStatement");
            }],
        ],
    };
});
