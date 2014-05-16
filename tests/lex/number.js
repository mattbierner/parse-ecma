var parse = require('bennu').parse;
var number_lexer = require('../../index').lex.number_lexer;


exports.decimal_digits = function(test) {
    test.equal(parse.run(number_lexer.decimalDigits, '012'), '012');
    test.equal(parse.run(number_lexer.decimalDigits, '123a3'), '123');
    
    test.done();
};

exports.hex_digits = function(test) {
    test.equal(parse.run(number_lexer.hexDigits, '0a21f'), '0a21f');
    test.equal(parse.run(number_lexer.hexDigits, 'ba1'), 'ba1');
    
    test.done();
};

exports.unsigned_integer = function(test) {
    test.equal(parse.run(number_lexer.unsignedInteger, '012'), 12);
    test.equal(parse.run(number_lexer.unsignedInteger, '123a3'), 123);
    
    test.throws(parse.run.bind(undefined, number_lexer.unsignedInteger, '-3'));
    test.throws(parse.run.bind(undefined, number_lexer.unsignedInteger, '+3'));
    
    test.done();
};

exports.signed_integer = function(test) {
    test.equal(parse.run(number_lexer.signedInteger, '012'), 12);
    test.equal(parse.run(number_lexer.signedInteger, '123a3'), 123);
    
    test.equal(parse.run(number_lexer.signedInteger, '-391'), -391);
    test.equal(parse.run(number_lexer.signedInteger, '+391'), 391);
    
    test.done();
};

exports.exponent_part = function(test) {
    test.equal(parse.run(number_lexer.exponentPart, 'e012'), 12);
    test.equal(parse.run(number_lexer.exponentPart, 'E123a3'), 123);
    
    test.equal(parse.run(number_lexer.exponentPart, 'e-391'), -391);
    test.equal(parse.run(number_lexer.exponentPart, 'E+391'), 391);
    
    test.done();
};

exports.hex_integer_literal = function(test) {
    test.equal(parse.run(number_lexer.hexIntegerLiteral, '0x00123'), 291);
    test.equal(parse.run(number_lexer.hexIntegerLiteral, '0XAf01'), 44801);
    test.done();
};

exports.decimal_integer_literal = function(test) {
    test.equal(parse.run(number_lexer.decimalIntegerLiteral, '00123'), 123);
    test.equal(parse.run(number_lexer.decimalIntegerLiteral, '99'), 99);
    test.done();
};

exports.decimal_literal = function(test) {
    test.equal(parse.run(number_lexer.decimalLiteral, '00123'), 123);
    test.equal(parse.run(number_lexer.decimalLiteral, '123.'), 123);
    test.equal(parse.run(number_lexer.decimalLiteral, '99.9'), 99.9);
    test.equal(parse.run(number_lexer.decimalLiteral, '.123'), .123);
    
    test.equal(parse.run(number_lexer.decimalLiteral, '00123e3'), 123000);
    test.equal(parse.run(number_lexer.decimalLiteral, '123.e3'), 123000);
    test.equal(parse.run(number_lexer.decimalLiteral, '99.9e3'), 99900);
    test.equal(parse.run(number_lexer.decimalLiteral, '.123e3'), 123);
    
    test.equal(parse.run(number_lexer.decimalLiteral, '00123e+3'), 123000);
    test.equal(parse.run(number_lexer.decimalLiteral, '123.e+3'), 123000);
    test.equal(parse.run(number_lexer.decimalLiteral, '99.9e+3'), 99900);
    test.equal(parse.run(number_lexer.decimalLiteral, '.123e+3'), 123);
    
    test.equal(parse.run(number_lexer.decimalLiteral, '00123e-3'), 0.123);
    test.equal(parse.run(number_lexer.decimalLiteral, '123.e-3'), 0.123);
    test.equal(parse.run(number_lexer.decimalLiteral, '99.9e-3'), 0.0999);
    test.equal(parse.run(number_lexer.decimalLiteral, '.123e-3'), 0.000123);
    
    test.done();
};
