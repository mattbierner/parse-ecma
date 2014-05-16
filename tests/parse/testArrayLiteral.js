var lexer = require('../../index').lex.lexer;
var parser = require('../../index').parse.parser;


var testParser = function(stream) {
    var result = parser.parseStream(stream);
    return result.body[0].expression;
};


exports.empty = function(test) {
    var result = testParser("[];");
    test.equal(result.elements.length, 0);
    
    test.done();
};

exports_single element = function(test) {
    var result = testParser("[3];");
    test.equal(result.elements.length, 1);
    test.equal(result.elements[0].value, 3);

    var result2 = testParser("[3,];");
    test.equal(result2.elements.length, 1);
    test.equal(result2.elements[0].value, 3);
    
    test.done();
};

exports.multi_element = function(test) {
    var result = testParser("[3, 4];");
    test.equal(result.elements.length, 2);
    test.equal(result.elements[0].value, 3);
    test.equal(result.elements[1].value, 4);

    var result2 = testParser("[3, 4 ,];");
    test.equal(result2.elements.length, 2);
    test.equal(result2.elements[0].value, 3);
    test.equal(result2.elements[1].value, 4);
    
    test.done();
};

exports.empty_element_array_literal = function(test) {
    var result = testParser("[,];");
    test.equal(result.elements.length, 1);
    test.equal(result.elements[0], null);
    
    var result2 = testParser("[,,,];");
    test.equal(result2.elements.length, 3);
    test.equal(result2.elements[0], null);
    test.equal(result2.elements[1], null);
    test.equal(result2.elements[2], null);
    test.done();
};
[" Multi Element Array With Empty elements",
exports.with_empty_elements = function(test) {
    var result = testParser("[3,, 4];");
    test.equal(result.elements.length, 3);
    test.equal(result.elements[0].value, 3);
    test.equal(result.elements[1], null);
    test.equal(result.elements[2].value, 4);

    var result2 = testParser("[3,, 4,];");
    test.equal(result2.elements.length, 3);
    
    var result3 = testParser("[,, 3,, 4,,];");
    test.equal(result3.elements.length, 6);
    test.equal(result3.elements[0], null);
    test.equal(result3.elements[1], null);
    test.equal(result3.elements[2].value, 3);
    test.equal(result3.elements[3], null);
    test.equal(result3.elements[4].value, 4);
    test.equal(result3.elements[5], null);
    
    test.done();
};
