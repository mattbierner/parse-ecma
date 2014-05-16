var parse = require('bennu').parse;
var string_lexer = require('../../index').lex.string_lexer;



exports.basic_single_strings = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, "'abc'"), 'abc');
    test.deepEqual(parse.run(string_lexer.stringLiteral, "'abc efg''bla'"), 'abc efg');
    
    test.done();
};

exports.basic_double_strings = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"abc"'), 'abc');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"abc efg""bla"'), 'abc efg');
    
    test.done();
};

exports.empty_string = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '""'), '');
    test.deepEqual(parse.run(string_lexer.stringLiteral, "''"), '');
    
    test.done();
};

exports.line_continuation = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"a\\\nbc"'), 'abc');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"a\\\n\\\nbc\\\n"'), 'abc');
    test.deepEqual(parse.run(string_lexer.stringLiteral, "'a\\\nbc'"), 'abc');
    
    test.done();
};

exports.character_escape = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\\\"'), '\\');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\\'"'), "'");
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\""'), '"');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\b"'), '\u0008');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\t"'), '\u0009');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\n"'), '\u000A');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\v"'), '\u000B');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\f"'), '\u000C');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\\r"'), '\u000D');
    
    test.done();
};

exports.hex_escape = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\x41"'), 'A');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\x4F"'), 'O');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\x20"'), ' ');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"x\x2020"'), 'x 20');
    
    test.done();
};

exports.unicode_escape = function(test) {
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\u0041"'), 'A');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\u004f"'), 'O');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\u0020"'), ' ');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"\u102f"'), '\u102f');
    test.deepEqual(parse.run(string_lexer.stringLiteral, '"u\u0020ff"'), 'u ff');
    
    test.done();
};
