define(['ecma/lex/lexer',
        'ecma/parse/parser',
        'ecma/parse/expression_parser'],
function(lexer,
        parser,
        expression){
    
    var testParser = function(stream) {
        var result = parser.parse(stream);
        return result.body[0].expression;
    };
    
    return {
        'module': "Object Literal",
        'tests': [
            ["Empty Object Literal",
            function(){
                var result = testParser("({});");
                assert.equal(result.properties.length, 0);
                
                var result2 = testParser("({,});");
                assert.equal(result2.properties.length, 0);
            }],
            ["Init Values Object Literal",
            function(){
                var result = testParser("({ a: 0 , 'b': 1, 9: 2,});");
                assert.equal(result.properties.length, 3);
                assert.equal(result.properties[0].type, 'ObjectValue');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.value, 0);
                
                assert.equal(result.properties[1].type, 'ObjectValue');
                assert.equal(result.properties[1].key.value, 'b');
                assert.equal(result.properties[1].value.value, 1);
                
                assert.equal(result.properties[2].type, 'ObjectValue');
                assert.equal(result.properties[2].key.value, 9);
                assert.equal(result.properties[2].value.value, 2);
            }],
            ["Init Values with get set keys",
            function(){
                var result = testParser("({ get: 0 , set: 1});");
                assert.equal(result.properties.length, 2);
                assert.equal(result.properties[0].type, 'ObjectValue');
                assert.equal(result.properties[0].key.name, 'get');
                assert.equal(result.properties[0].value.value, 0);
                
                assert.equal(result.properties[1].type, 'ObjectValue');
                assert.equal(result.properties[1].key.name, 'set');
                assert.equal(result.properties[1].value.value, 1);
            }],
            ["Get Value Object Literal",
            function(){
                var result = testParser("({ get a() { return 3; }, get b(){ return {}; } });");
                assert.equal(result.properties.length, 2);
                assert.equal(result.properties[0].type, 'ObjectGetter');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.type, 'FunctionExpression');
            }],
            ["Set Value Object Literal",
            function(){
                var result = testParser("({ set a(b) { }, set b(a) { return {};} });");
                assert.equal(result.properties.length, 2);
                assert.equal(result.properties[0].type, 'ObjectSetter');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.type, 'FunctionExpression');
                assert.equal(result.properties[0].value.params.length, 1);
                assert.equal(result.properties[0].value.params[0].name, 'b');
            }],
        ],
    };
});
