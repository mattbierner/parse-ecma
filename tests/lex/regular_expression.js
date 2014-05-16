var parse = require('bennu').parse;
var regular_expression_lexer = require('../../index').lex.regular_expression_lexer;


var reEq = function(test, x, y) {
    test.equal(x.body, y.body);
    test.equal(x.flags, y.flags);
};


exports.basic = function(test) {
    reEq(test, 
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/"),
        {'body': 'abc', 'flags':''});
    
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/i"),
        {'body': 'abc', 'flags': 'i'});
    
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/igm"),
        {'body': 'abc', 'flags': 'igm'});
    
    test.done();
};

exports.char_class = function(test) {
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral,"/[abc]/"),
        {'body':'[abc]', 'flags': ''});
    
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/[^*. 3][]/"),
        {'body':'[^*. 3][]', 'flags': ''})

    test.done();
};

exports.escape_class = function(test) {
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/[\\]]/"),
        {'body':'[\\]]', 'flags': ''});
    
    test.done();
};


exports.escape_slash = function(test) {
    reEq(test,
        parse.run(regular_expression_lexer.regularExpressionLiteral, "/\\/ab/"),
        {'body':'\\/ab', 'flags':''});
    
    test.done();
};