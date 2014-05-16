var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(lexer.lex(stream));
    return result.body[0].expression;
};


exports.this_expression = function(test) {
    var expr = testParser("this;");
    test.equal(expr.type, 'ThisExpression');
    
    test.done();
};

exports.assignment_expression = function(test) {
    var expr = testParser("a = b = c;");
    test.equal(expr.type, 'AssignmentExpression');
    
    // Check Associativity
    test.equal(expr.left.name, 'a');
    test.equal(expr.right.type, 'AssignmentExpression');
    test.equal(expr.right.left.name, 'b');
    test.equal(expr.right.right.name, 'c');
    
    test.done();
};

exports.simple_conditional = function(test) {
    var expr = testParser("a ? b : c");
    test.equal(expr.type, 'ConditionalExpression');
    test.equal(expr.test.name, 'a');
    test.equal(expr.consequent.name, 'b');
    test.equal(expr.alternate.name, 'c');

    test.done();
};

exports.conditional_associativity = function(test) {
    var expr = testParser("a ? b : c ? d : e");
    test.equal(expr.type, 'ConditionalExpression');
    test.equal(expr.test.name, 'a');
    test.equal(expr.consequent.name, 'b');
    test.equal(expr.alternate.type, 'ConditionalExpression');
    test.equal(expr.alternate.test.name, 'c');
    test.equal(expr.alternate.consequent.name, 'd');
    test.equal(expr.alternate.alternate.name, 'e');

    test.done();
};

exports.conditional_conditional_consequent = function(test) {
    var expr = testParser("a ? b ? c : d : e");
    test.equal(expr.type, 'ConditionalExpression');
    test.equal(expr.test.name, 'a');
    test.equal(expr.consequent.type, 'ConditionalExpression');
    test.equal(expr.consequent.test.name, 'b');
    test.equal(expr.consequent.consequent.name, 'c');
    test.equal(expr.consequent.alternate.name, 'd');
    test.equal(expr.alternate.name, 'e');

    test.done();
};

exports.conditional_test_conditional = function(test) {
    var expr = testParser("(a ? b : c) ? d : e");
    test.equal(expr.type, 'ConditionalExpression');
    test.equal(expr.test.type, 'ConditionalExpression');
    test.equal(expr.test.test.name, 'a');
    test.equal(expr.test.consequent.name, 'b');
    test.equal(expr.test.alternate.name, 'c');
    test.equal(expr.consequent.name, 'd');
    test.equal(expr.alternate.name, 'e');
    
    test.done();
};

exports.simple_binary = function(test) {
    var expr = testParser("a + b");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '+');
    test.equal(expr.left.name, 'a');
    test.equal(expr.right.name, 'b');
    
    test.done();
};

exports.binary_associativity = function(test) {
    var expr = testParser("a + b + c");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '+');
    test.equal(expr.left.type, 'BinaryExpression');
    test.equal(expr.left.left.name, 'a');
    test.equal(expr.left.right.name, 'b');
    test.equal(expr.right.name, 'c');
    
    test.done();
};

exports.binary_paren = function(test) {
    var expr = testParser("a + (b + c)");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '+');
    test.equal(expr.left.name, 'a');
    test.equal(expr.right.type, 'BinaryExpression');
    test.equal(expr.right.operator, '+');
    test.equal(expr.right.left.name, 'b');
    test.equal(expr.right.right.name, 'c');
    
    test.done();
};

exports.binary_precedence = function(test) {
    var expr = testParser("a + b * c");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '+');
    test.equal(expr.left.name, 'a');
    test.equal(expr.right.type, 'BinaryExpression');
    test.equal(expr.right.operator, '*');
    test.equal(expr.right.left.name, 'b');
    test.equal(expr.right.right.name, 'c');
    
    test.done();
};

exports.simple_unary = function(test) {
    var expr = testParser("!a");
    test.equal(expr.type, 'UnaryExpression');
    test.equal(expr.operator, '!');
    test.equal(expr.argument.name, 'a');
    
    test.done();
};

exports.unary_right_associative = function(test) {
    var expr = testParser("~!a");
    test.equal(expr.type, 'UnaryExpression');
    test.equal(expr.operator, '~');
    test.equal(expr.argument.type, 'UnaryExpression');
    test.equal(expr.argument.operator, '!');
    test.equal(expr.argument.argument.name, 'a');
    
    test.done();
};

exports.prefix_update = function(test) {
    var expr = testParser("++a");
    test.equal(expr.type, 'UpdateExpression');
    test.equal(expr.operator, '++');
    test.equal(expr.prefix, true);
    test.equal(expr.argument.name, 'a');
    test.done();
};

exports.postfix_update = function(test) {
    var expr = testParser("a++");
    test.equal(expr.type, 'UpdateExpression');
    test.equal(expr.operator, '++');
    test.equal(expr.prefix, false);
    test.equal(expr.argument.name, 'a');
    
    test.done();
};

exports.new_expression = function(test) {
    var expr = testParser("new a");
    test.equal(expr.type, 'NewExpression');
    test.equal(expr.callee.name, 'a');
    test.equal(expr.args.length, 0);
    
    test.done();
};

exports.many_new = function(test) {
    var expr = testParser("new new a");
    test.equal(expr.type, 'NewExpression');
    test.equal(expr.callee.type, 'NewExpression');
    test.equal(expr.callee.callee.name, 'a');
    test.equal(expr.callee.args.length, 0);
    test.equal(expr.args.length, 0);
    
    test.done();
};

exports.new_with_args = function(test) {
    var expr = testParser("new a(1)");
    test.equal(expr.type, 'NewExpression');
    test.equal(expr.callee.name, 'a');
    test.equal(expr.args.length, 1);
    test.equal(expr.args[0].value, 1);
    
    test.done();
};

exports.many_new_with_args = function(test) {
    var expr = testParser("new new a(1)(2)");
    test.equal(expr.type, 'NewExpression');
    test.equal(expr.callee.type, 'NewExpression');
    test.equal(expr.callee.callee.name, 'a');
    test.equal(expr.callee.args.length, 1);
    test.equal(expr.callee.args[0].value, 1);
    test.equal(expr.args.length, 1);
    test.equal(expr.args[0].value, 2);
    
    test.done();
};

exports.call = function(test) {
    var expr = testParser("a()");
    test.equal(expr.type, 'CallExpression');
    test.equal(expr.callee.name, 'a');
    test.equal(expr.args.length, 0);
    
    test.done();
};

exports.call_args = function(test) {
    var expr = testParser("a(b)");
    test.equal(expr.type, 'CallExpression');
    test.equal(expr.callee.name, 'a');
    test.equal(expr.args.length, 1);
    test.equal(expr.args[0].name, 'b');
    test.done();
};

exports.multi_call = function(test) {
    var expr = testParser("a(b)(c)");
    test.equal(expr.type, 'CallExpression');
    test.equal(expr.callee.type, 'CallExpression');
    test.equal(expr.callee.callee.name, 'a');
    test.equal(expr.callee.args.length, 1);
    test.equal(expr.callee.args[0].name, 'b');
    test.equal(expr.args.length, 1);
    test.equal(expr.args[0].name, 'c');
    
    test.done();
};

exports.simple_dot_accessor = function(test) {
    var expr = testParser("a.b");
    test.equal(expr.type, 'MemberExpression');
    test.equal(expr.object.name, 'a');
    test.equal(expr.property.name, 'b');
    test.equal(expr.computed, false);
    
    test.done();
};

exports.simple_dot_with_potential_number_lexing = function(test) {
    var expr = testParser("a3.b");
    test.equal(expr.type, 'MemberExpression');
    test.equal(expr.object.name, 'a3');
    test.equal(expr.property.name, 'b');
    test.equal(expr.computed, false);
    
    test.done();
};

exports.many_dot_left = function(test) {
    var expr = testParser("a.b.c");
    test.equal(expr.type, 'MemberExpression');
    test.equal(expr.object.type, 'MemberExpression');
    test.equal(expr.object.object.name, 'a');
    test.equal(expr.object.property.name, 'b');
    test.equal(expr.object.computed, false);
    test.equal(expr.property.name, 'c');
    test.equal(expr.computed, false);
    
    test.done();
};

exports.simle_bracket_accessor = function(test) {
    var expr = testParser("a[b]");
    test.equal(expr.type, 'MemberExpression');
    test.equal(expr.object.name, 'a');
    test.equal(expr.property.name, 'b');
    test.equal(expr.computed, true);
    
    test.done();
};

exports.many_bracket_left = function(test) {
    var expr = testParser("a[b][c]");
    test.equal(expr.type, 'MemberExpression');
    test.equal(expr.object.type, 'MemberExpression');
    test.equal(expr.object.object.name, 'a');
    test.equal(expr.object.property.name, 'b');
    test.equal(expr.object.computed, true);
    test.equal(expr.property.name, 'c');
    test.equal(expr.computed, true);
    
    test.done();
};