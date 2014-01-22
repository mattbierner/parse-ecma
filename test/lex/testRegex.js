define(['bennu/parse', 'ecma/lex/regular_expression_lexer'], function(parse, regular_expression_lexer){
    
    var reEq = function(x, y) {
        assert.equal(x.body, y.body);
        assert.equal(x.flags, y.flags);
    };
    
    return {
        'module': "Regular Expression Tests",
        'tests': [
            ["Basic Regex",
            function(){
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/"), {'body': 'abc', 'flags':''});
                
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/i"), {'body': 'abc', 'flags': 'i'});
                
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/abc/igm"), {'body': 'abc', 'flags': 'igm'});
            }],
            ["Simple Class",
            function(){
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/[abc]/"), {'body':'[abc]', 'flags': ''});
                
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/[^*. 3][]/"), {'body':'[^*. 3][]', 'flags': ''})
            }],
            ["Escape Class",
            function(){
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/[\\]]/"), {'body':'[\\]]', 'flags': ''})
                
            }],
            ["Escape Slash",
            function(){
                reEq(parse.run(regular_expression_lexer.regularExpressionLiteral, "/\\/ab/"), {'body':'\\/ab', 'flags':''});
                
            }],
           
        ],
    };
});
