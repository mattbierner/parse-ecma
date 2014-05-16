var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(lexer.lex(stream));
    return result.body[0].expression;
};


exports.empty = function(test) {
    var result = testParser("({});");
    test.equal(result.properties.length, 0);
    
    var result2 = testParser("({,});");
    test.equal(result2.properties.length, 0);
    
    test.done();
};

exports.init = function(test) {
    var result = testParser("({ a: 0 , 'b': 1, 9: 2,});");
    test.equal(result.properties.length, 3);
    test.equal(result.properties[0].type, 'ObjectValue');
    test.equal(result.properties[0].key.name, 'a');
    test.equal(result.properties[0].value.value, 0);
    
    test.equal(result.properties[1].type, 'ObjectValue');
    test.equal(result.properties[1].key.value, 'b');
    test.equal(result.properties[1].value.value, 1);
    
    test.equal(result.properties[2].type, 'ObjectValue');
    test.equal(result.properties[2].key.value, 9);
    test.equal(result.properties[2].value.value, 2);
    
    test.done();
};

exports.init_get_set_key = function(test) {
    var result = testParser("({ get: 0 , set: 1});");
    test.equal(result.properties.length, 2);
    test.equal(result.properties[0].type, 'ObjectValue');
    test.equal(result.properties[0].key.name, 'get');
    test.equal(result.properties[0].value.value, 0);
    
    test.equal(result.properties[1].type, 'ObjectValue');
    test.equal(result.properties[1].key.name, 'set');
    test.equal(result.properties[1].value.value, 1);
    
    test.done();
};

exports.getter = function(test) {
    var result = testParser("({ get a() { return 3; }, get b(){ return {}; } });");
    test.equal(result.properties.length, 2);
    test.equal(result.properties[0].type, 'ObjectGetter');
    test.equal(result.properties[0].key.name, 'a');
    test.equal(result.properties[0].value.type, 'FunctionExpression');
    
    test.done();
};

exports.setter = function(test) {
    var result = testParser("({ set a(b) { }, set b(a) { return {};} });");
    test.equal(result.properties.length, 2);
    test.equal(result.properties[0].type, 'ObjectSetter');
    test.equal(result.properties[0].key.name, 'a');
    test.equal(result.properties[0].value.type, 'FunctionExpression');
    test.equal(result.properties[0].value.params.length, 1);
    test.equal(result.properties[0].value.params[0].name, 'b');
    
    test.done();
};