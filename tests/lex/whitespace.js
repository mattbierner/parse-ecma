var parse = require('bennu').parse;
var whitespace_lexer = require('../../index').lex.whitespace_lexer;


exports.whitespace = function(test) {
    test.equal(parse.run(whitespace_lexer.whitespace, '\u0009'), '\u0009');
    test.equal(parse.run(whitespace_lexer.whitespace, '\u000B'), '\u000B');
    test.equal(parse.run(whitespace_lexer.whitespace, '\u000B'), '\u000B');
    test.equal(parse.run(whitespace_lexer.whitespace, '\u0020'), '\u0020');
    test.equal(parse.run(whitespace_lexer.whitespace, '\u00A0'), '\u00A0');
    test.equal(parse.run(whitespace_lexer.whitespace, '\uFEFF'), '\uFEFF');
    
    test.done();
};
