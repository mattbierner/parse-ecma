var parse = require('bennu').parse;
var line_terminator_lexer = require('../../index').lex.line_terminator_lexer;


exports.line_terminator = function(test) {
    test.equal(parse.run(line_terminator_lexer.lineTerminator, '\u000A'), '\u000A');
    test.equal(parse.run(line_terminator_lexer.lineTerminator, '\u000D'), '\u000D');
    test.equal(parse.run(line_terminator_lexer.lineTerminator, '\u2028'), '\u2028');
    test.equal(parse.run(line_terminator_lexer.lineTerminator, '\u2029'), '\u2029');
    
    test.done();
};

exports.line_terminator_sequence = function(test) {
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u000A'), '\u000A');
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u2028'), '\u2028');
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u2029'), '\u2029');
    
    // CR
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u000D'), '\u000D');
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u000Dabc'), '\u000D');
    test.equal(parse.run(line_terminator_lexer.lineTerminatorSequence, '\u000D\u000A'), '\u000D\u000A');
    
    test.done();
};
