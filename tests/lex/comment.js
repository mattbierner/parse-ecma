var parse = require('bennu').parse;
var comment_lexer = require('../../index').lex.comment_lexer;


exports.basic_singleline_comment = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '//abc efd'),
        'abc efd');
    
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '//abc \nefd'),
        'abc ');
    
    test.done();
};

exports.empty_singleline_comment = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '//'),
        '');
    
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '//\ndasfdsa'),
        '');
    
    test.done();
};

exports.single_line_nested_slash = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '///'),
        '/');
    
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '////'),
        '//');
    test.deepEqual(
        parse.run(comment_lexer.singleLineComment, '//a//ad/\n/a'),
        'a//ad/');
    
    test.done();
};

exports.basic_bultiLine_comment = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/*abc*/'),
        'abc');
    
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/*a b\nc*/'),
        'a b\nc');
    
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/*abc*/fdsafsda'),
        'abc');
    
    test.done();
};

exports.empty_multiLine_comment = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/**/'),
        '');
    
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment,'/**/\ndfasds'),
        '');
    
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/*\n*/'),
        '\n');
    
    test.done();

};

exports.multiline_comment_nested = function(test) {
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/***/'),
        '*');
    test.deepEqual(
        parse.run(comment_lexer.multiLineComment, '/*/*/'),
        '/');
    test.done();
};