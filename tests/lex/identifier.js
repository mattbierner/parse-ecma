
var parse = require('bennu').parse;
var identifier_lexer = require('../../index').lex.identifier_lexer;


exports.basic_identifier = function(test) {
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a0bc'),
        'a0bc');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a0bc efd'),
        'a0bc');
    
    test.done();
};

exports.fail_start_digit = function(test) {
    test.throws(
        parse.run.bind(undefined, identifier_lexer.identifier, '0abc'));
    
    test.done();
};

exports.reserved_words = function(test) {
    test.throws(
        parse.run.bind(undefined, identifier_lexer.identifier, 'while'));
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'While'),
        'While');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'awhile'),
        'awhile');
    
    test.done();
};

exports.start_chars = function(test) {
    test.deepEqual(
        parse.run(identifier_lexer.identifier, '$ab$c$'),
        '$ab$c$');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, '_ab_c_'),
        '_ab_c_');
    
    test.done();
};

exports.does_not_capture_puctuation = function(test) {
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a.c.d'),
        'a');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a(c)'),
        'a');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a+'),
        'a');
    
    test.deepEqual(
        parse.run(identifier_lexer.identifier, 'a\\'),
        'a');
    
    test.done();
};


exports.unicode = function(test) {
    test.deepEqual(
        parse.run(identifier_lexer.identifier, '\\u0041BC'),
        'ABC');
    
    test.deepEqual(
       parse.run(identifier_lexer.identifier, 'A\\u0042\\u0043'),
       'ABC');
    
    test.done();
};