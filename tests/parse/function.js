var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(lexer.lex(stream));
    return result.body[0].expression;
};



exports.empty_function_expr = function(test) {
    var result = testParser("z = function() {};");
    test.equal(result.right.type, 'FunctionExpression');
    test.equal(result.right.params.length, 0);
    test.equal(result.right.name, null);
    test.equal(result.right.body.type, 'BlockStatement');
    
    test.done();
};

exports.simple_function = function(test) {
    var result = testParser("z = function(x){ return x; };");
    test.equal(result.right.type, 'FunctionExpression');
    test.equal(result.right.name, null);
    test.equal(result.right.params.length, 1);
    test.equal(result.right.params[0].name, 'x');
    test.equal(result.right.body.body[0].type, 'ReturnStatement');
    
    test.done();
};

exports.named_function_expr = function(test) {
    var result = testParser("z = function z(x){ return x; };");
    test.equal(result.right.type, 'FunctionExpression');
    test.equal(result.right.id.name, 'z');
    test.equal(result.right.params.length, 1);
    test.equal(result.right.params[0].name, 'x');
    test.equal(result.right.body.body[0].type, 'ReturnStatement');
    
    test.done();
};