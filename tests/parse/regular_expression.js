var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(lexer.lex(stream));
    return result.body[0].expression;
};

exports.simple_regexp = function(test) {
    var expr = testParser("/ab/c");
    test.equal(expr.type, 'Literal');
    test.equal(expr.kind, 'regexp');
    test.equal(expr.value.body, 'ab');
    test.equal(expr.value.flags, 'c');
    
    test.done();
};

exports.potential_regexp_is_div = function(test) {
    var expr = testParser("a/b/c");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '/');
    test.equal(expr.left.type, 'BinaryExpression');
    test.equal(expr.left.operator, '/');
    test.equal(expr.left.left.name, 'a');
    test.equal(expr.left.right.name, 'b');
    test.equal(expr.right.name, 'c');
    
    test.done();
};

exports.div_regexps = function(test) {
    var expr = testParser("/a/g/ /c/g");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '/');
    test.equal(expr.left.type, 'Literal');
    test.equal(expr.left.kind, 'regexp');
    test.equal(expr.left.value.body, 'a');
    test.equal(expr.left.value.flags, 'g');
    test.equal(expr.right.type, 'Literal');
    test.equal(expr.right.kind, 'regexp');
    test.equal(expr.right.value.body, 'c');
    test.equal(expr.right.value.flags, 'g');
    
        test.done();

};

exports.mixed_div_and_regexp = function(test) {
    var expr = testParser("/a/c/3");
    test.equal(expr.type, 'BinaryExpression');
    test.equal(expr.operator, '/');
    test.equal(expr.left.type, 'Literal');
    test.equal(expr.left.kind, 'regexp');
    test.equal(expr.left.value.body, 'a');
    test.equal(expr.left.value.flags, 'c');
    test.equal(expr.right.type, 'Literal');
    test.equal(expr.right.kind, 'number');
    test.equal(expr.right.value, '3');
    
    test.done();
};

exports.regexp_with_keyword = function(test) {
    var expr = testParser("new /a/c");
    test.equal(expr.type, 'NewExpression');
    test.equal(expr.callee.type, 'Literal');
    test.equal(expr.callee.kind, 'regexp');
    test.equal(expr.callee.value.body, 'a');
    test.equal(expr.callee.value.flags, 'c')
    
    test.done();
};
