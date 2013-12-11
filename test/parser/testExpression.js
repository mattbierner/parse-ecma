define(['parse/parse',
        'nu/stream',
        'ecma/lex/lexer',
        'ecma/parse/parser'],
function(parse,
        stream,
        lexer,
        parser) {
    
    var testParser = function(stream) {
        var expr = parser.parse(stream);
        return expr.body[0].expression;
    };
    
    return {
        'module': "Expression Tests",
        'tests': [
            ["This Expression",
            function(){
                var expr = testParser("this;");
                assert.equal(expr.type, 'ThisExpression');
            }],
            
            ["Assignment Expression",
            function(){
                var expr = testParser("a = b = c");
                assert.equal(expr.type, 'AssignmentExpression');
                
                // Check Associativity
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'AssignmentExpression');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.name, 'c');
            }],
            
            ["Simple Conditional Expression",
            function(){
                var expr = testParser("a ? b : c");
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.name, 'b');
                assert.equal(expr.alternate.name, 'c');
            }],
            ["Conditional Expression Associativity",
            function(){
                var expr = testParser("a ? b : c ? d : e");
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.name, 'b');
                assert.equal(expr.alternate.type, 'ConditionalExpression');
                assert.equal(expr.alternate.test.name, 'c');
                assert.equal(expr.alternate.consequent.name, 'd');
                assert.equal(expr.alternate.alternate.name, 'e');
            }],
            ["Conditional Expression ConditionalExpression in Consequent",
            function(){
                var expr = testParser("a ? b ? c : d : e");
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.type, 'ConditionalExpression');
                assert.equal(expr.consequent.test.name, 'b');
                assert.equal(expr.consequent.consequent.name, 'c');
                assert.equal(expr.consequent.alternate.name, 'd');
                assert.equal(expr.alternate.name, 'e');
            }],
            ["Conditional Expression ConditionalExpression in test",
            function(){
                var expr = testParser("(a ? b : c) ? d : e");
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.type, 'ConditionalExpression');
                assert.equal(expr.test.test.name, 'a');
                assert.equal(expr.test.consequent.name, 'b');
                assert.equal(expr.test.alternate.name, 'c');
                assert.equal(expr.consequent.name, 'd');
                assert.equal(expr.alternate.name, 'e');
            }],
            
            ["Simple Binary Expression",
            function(){
                var expr = testParser("a + b");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.name, 'b');
            }],
            ["Binary Expression Left Associativity",
            function(){
                var expr = testParser("a + b + c");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.type, 'BinaryExpression');
                assert.equal(expr.left.left.name, 'a');
                assert.equal(expr.left.right.name, 'b');
                assert.equal(expr.right.name, 'c');
            }],
            ["Binary Expression Paren",
            function(){
                var expr = testParser("a + (b + c)");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'BinaryExpression');
                assert.equal(expr.right.operator, '+');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.name, 'c');
            }],
            ["Binary Expression Precedence",
            function(){
                var expr = testParser("a + b * c");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'BinaryExpression');
                assert.equal(expr.right.operator, '*');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.name, 'c');
            }],
            
            ["Simple Unary Expression",
            function(){
                var expr = testParser("!a");
                assert.equal(expr.type, 'UnaryExpression');
                assert.equal(expr.operator, '!');
                assert.equal(expr.argument.name, 'a');
            }],
            ["Unary Expression Right Associativity",
            function(){
                var expr = testParser("~!a");
                assert.equal(expr.type, 'UnaryExpression');
                assert.equal(expr.operator, '~');
                assert.equal(expr.argument.type, 'UnaryExpression');
                assert.equal(expr.argument.operator, '!');
                assert.equal(expr.argument.argument.name, 'a');
            }],
            
            ["Simple Prefix Update Expression",
            function(){
                var expr = testParser("++a");
                assert.equal(expr.type, 'UpdateExpression');
                assert.equal(expr.operator, '++');
                assert.equal(expr.prefix, true);
                assert.equal(expr.argument.name, 'a');
            }],
            ["Simple Postfix Update Expression",
            function(){
                var expr = testParser("a++");
                assert.equal(expr.type, 'UpdateExpression');
                assert.equal(expr.operator, '++');
                assert.equal(expr.prefix, false);
                assert.equal(expr.argument.name, 'a');
            }],
           
            ["Simple New Expression",
            function(){
                var expr = testParser("new a");
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 0);
            }],
            ["Many New Expression",
            function(){
                var expr = testParser("new new a");
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.type, 'NewExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 0);
                assert.equal(expr.args.length, 0);
            }],
            ["New Expression Args",
            function(){
                var expr = testParser("new a(1)");
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].value, 1);
            }],
            ["Many New Expression Args",
            function(){
                var expr = testParser("new new a(1)(2)");
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.type, 'NewExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 1);
                assert.equal(expr.callee.args[0].value, 1);
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].value, 2);
            }],
            
            ["Simple Call Expression ",
            function(){
                var expr = testParser("a()");
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 0);
            }],
            ["Call Expression with args",
            function(){
                var expr = testParser("a(b)");
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].name, 'b');
            }],
            ["Multiple Call Expression",
            function(){
                var expr = testParser("a(b)(c)");
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.type, 'CallExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 1);
                assert.equal(expr.callee.args[0].name, 'b');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].name, 'c');
            }],
            
            ["Simple Dot Accessor",
            function(){
                var expr = testParser("a.b");
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.name, 'a');
                assert.equal(expr.property.name, 'b');
                assert.equal(expr.computed, false);
            }],
            ["Simple Dot Accessor with potential number lexing ",
            function(){
                var expr = testParser("a3.b");
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.name, 'a3');
                assert.equal(expr.property.name, 'b');
                assert.equal(expr.computed, false);
            }],
            ["Many Dot Accessor Left Associativity",
            function(){
                var expr = testParser("a.b.c");
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.type, 'MemberExpression');
                assert.equal(expr.object.object.name, 'a');
                assert.equal(expr.object.property.name, 'b');
                assert.equal(expr.object.computed, false);
                assert.equal(expr.property.name, 'c');
                assert.equal(expr.computed, false);
            }],
            
            ["Simple Bracket Accessor",
            function(){
                var expr = testParser("a[b]");
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.name, 'a');
                assert.equal(expr.property.name, 'b');
                assert.equal(expr.computed, true);
            }],
            ["Many Bracket Accessor Left Associativity",
            function(){
                var expr = testParser("a[b][c]");
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.type, 'MemberExpression');
                assert.equal(expr.object.object.name, 'a');
                assert.equal(expr.object.property.name, 'b');
                assert.equal(expr.object.computed, true);
                assert.equal(expr.property.name, 'c');
                assert.equal(expr.computed, true);
            }],
            
            
            ["Simple Regexp",
            function(){
                var expr = testParser("/ab/c");
                assert.equal(expr.type, 'Literal');
                assert.equal(expr.kind, 'regexp');
                assert.equal(expr.value.body, 'ab');
                assert.equal(expr.value.flags, 'c');
            }],
            ["Potential RegExp parsed as Div",
            function(){
                var expr = testParser("a/b/c");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '/');
                assert.equal(expr.left.type, 'BinaryExpression');
                assert.equal(expr.left.operator, '/');
                assert.equal(expr.left.left.name, 'a');
                assert.equal(expr.left.right.name, 'b');
                assert.equal(expr.right.name, 'c');
            }],
            ["Mixed Div and RegExp RegExp and Div",
            function(){
                var expr = testParser("/a/g/ /c/g");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '/');
                assert.equal(expr.left.type, 'Literal');
                assert.equal(expr.left.kind, 'regexp');
                assert.equal(expr.left.value.body, 'a');
                assert.equal(expr.left.value.flags, 'g');
                assert.equal(expr.right.type, 'Literal');
                assert.equal(expr.right.kind, 'regexp');
                assert.equal(expr.right.value.body, 'c');
                assert.equal(expr.right.value.flags, 'g');
            }],
            
            ["Mixed Div and RegExp RegExp and Div",
            function(){
                var expr = testParser("/a/c/3");
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '/');
                assert.equal(expr.left.type, 'Literal');
                assert.equal(expr.left.kind, 'regexp');
                assert.equal(expr.left.value.body, 'a');
                assert.equal(expr.left.value.flags, 'c');
                assert.equal(expr.right.type, 'Literal');
                assert.equal(expr.right.kind, 'number');
                assert.equal(expr.right.value, '3');
            }],
            ["Regexp with keyword",
            function(){
                var expr = testParser("new /a/c");
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.type, 'Literal');
                assert.equal(expr.callee.kind, 'regexp');
                assert.equal(expr.callee.value.body, 'a');
                assert.equal(expr.callee.value.flags, 'c')
            }],
        ],
    };
});
