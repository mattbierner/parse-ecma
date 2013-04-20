/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'nu/stream', 
        'ecma/parse/_common',
        'ecma/parse/program_parser', 'ecma/parse/token_parser', 'ecma/parse/value_parser',
        'ecma/ast/node', 'ecma/ast/expression', 'ecma/ast/statement', 'ecma/ast/value'],
function(require,
        parse, parse_eager,
        stream,
        ecma_parse,
        program, token, value,
        astNode, astExpression, astStatement, astValue){
"use strict";

/* Forward Declarations
 ******************************************************************************/
var assignmentExpression = function() { return assignmentExpression.apply(undefined, arguments); };

var assignmentExpressionNoIn = function() { return assignmentExpressionNoIn.apply(undefined, arguments); };

var expression = function() { return expression.apply(undefined, arguments); };

var newExpression = function() { return newExpression.apply(undefined, arguments); };

var functionExpression = function() {
    return require('ecma/parse/program_parser').functionExpression.apply(undefined, arguments);
};

var functionBody = function() {
    return require('ecma/parse/program_parser').functionBody.apply(undefined, arguments);
};

/* Helpers 
 ******************************************************************************/
var precedence = function(p, table) {
    var sep = parse.choice.apply(undefined, table.map(function(entry) {
        return parse.bind(entry.sep, function(v) {
            return parse.always({
                'value': v.value,
                'node': entry.node,
                'precedence': entry.precedence
            }, v.value);
        });
    }));
    
    return parse.bind(
        parse.rec(function(self) {
            return parse.cons(p,
                parse.optional(parse.cons(sep, parse.expected("binary expression", self)), stream.end));
            }),
        function(x) {
            var list = stream.toArray(x);
            var stack = [], out = [];
            
            while (list.length > 0) {
                var tok = list.shift();
                if (tok.type) {
                    out.push(tok);
                } else {
                    while (stack.length > 0) {
                        var o2 = stack[stack.length - 1];
                        if (o2.precedence <= tok.precedence) {
                            stack.pop();
                            var rt = out.pop(),
                                lf = out.pop();
                            out.push(new astExpression[o2.node](o2.value, lf, rt));
                        } else {
                            break;
                        }
                    }
                    stack.push(tok);
                }
            }
            
            while (stack.length > 0){
                var o = stack.pop();
                var rt = out.pop(),
                    lf = out.pop();
                out.push(new astExpression[o.node](o.value, lf, rt));
            }
            
            return parse.always(out.pop());
        });

};

/* Parsers
 ******************************************************************************/
// Array Literal
////////////////////////////////////////
var elementList = parse_eager.sepBy(token.punctuator(','),
    parse.either(
        assignmentExpression,
        parse.next(parse.lookahead(token.punctuator(',')),
            parse.always(null))));


var arrayElements = parse.binda(
     parse.sequence(
        elementList,
        parse.optional(token.punctuator(','))),
    function(elements) {
        return parse.always(elements);
    });

/**
 * Parser for an ECMASccript array literal.
 */
var arrayLiteral = parse.Parser('Array Literal',
    ecma_parse.astNode(parse.between(token.punctuator('['), token.punctuator(']'),
        parse.bind(
            arrayElements,
            function(elements) {
                return parse.always(new astExpression.ArrayExpression(elements));
            }))));

// Object Literal
////////////////////////////////////////
var propertyName = parse.choice(
    value.identifier,
    value.stringLiteral,
    value.numericLiteral);

var propertySetParameterList = parse.bind(
    value.identifier,
    function(x) {
        return parse.always([x]);
    });

var propertyValueInitilizer = parse.binda(
    parse.sequence(
        parse.expected("property name", propertyName),
        token.punctuator(':'),
        assignmentExpression),
    function(name, _, value) {
        return parse.always({
            'key': name,
            'kind': 'init',
            'value': value
        });
    });

var propertyGetInitilizer = parse.next(token.identifier('get'),
    parse.binda(
        parse.sequence(
            parse.expected("property name", propertyName),
            token.punctuator('('),
            token.punctuator(')'),
            parse.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(name, _0, _1, body) {
            return parse.always({
                'key': name,
                'kind': 'get',
                'value': new astExpression.FunctionExpression(null, [], body)
            });
        }));

var propertySetInitilizer = parse.next(token.identifier('set'),
    parse.binda(
        parse.sequence(
            parse.expected("property name", propertyName),
            parse.between(token.punctuator('('), token.punctuator(')'),
                propertySetParameterList),
            parse.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(name, parameters, body) {
            return parse.always({
                'key': name,
                'kind': 'set',
                'value': new astExpression.FunctionExpression(null, parameters, body)
            });
        }));

var propertyAssignment = parse.choice(
    parse.attempt(propertyValueInitilizer),
    propertyGetInitilizer,
    propertySetInitilizer);

var propertyNameAndValueList = parse_eager.sepBy(token.punctuator(','),
    propertyAssignment);

/**
 * Parser for an ECMAScript object literal.
 */
var objectLiteral = parse.Parser('Object Literal',
    ecma_parse.astNode(parse.between(token.punctuator('{'), token.punctuator('}'),
        parse.binda(
            parse.sequence(
                propertyNameAndValueList,
                parse.optional(token.punctuator(','))),
            function(properties, _) {
                return parse.always(new astExpression.ObjectExpression(properties));
            }))));

// This Expression
////////////////////////////////////////
var thisExpression = parse.Parser('This Expression',
    ecma_parse.astNode(parse.bind(
        token.keyword('this'),
        function() {
            return parse.always(new astExpression.ThisExpression());
        })));

// Primary Expression
////////////////////////////////////////
var primaryExpression = parse.Parser('Primary Expression',
    parse.choice(
        thisExpression,
        value.identifier,
        value.literal,
        arrayLiteral,
        objectLiteral,
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression)));

// Member Expression
////////////////////////////////////////
var argumentList = parse_eager.sepBy(token.punctuator(','),
    assignmentExpression);

var args = parse.between(token.punctuator('('), token.punctuator(')'),
    argumentList);

var dotAccessor = parse.bind(
    parse.next(token.punctuator('.'),
        value.identifier),
    function(x) {
        return parse.always({
            'property': x,
            'computed': false
        });
    });

var bracketAccessor = parse.bind(
    parse.between(token.punctuator('['), token.punctuator(']'),
        parse.expected("expression", expression)),
    function(x) {
        return parse.always({
            'property': x,
            'computed': true
        });
    });

var accessor = parse.either(
    dotAccessor,
    bracketAccessor);

/**
 * 
 */
var memberExpression = (function(){
    var reducer = function(p, c){
        return new astExpression.MemberExpression(p, c.property, c.computed);
    };
    
    return parse.RecParser('Member Expression', function(self) {
        return parse.binda(
            parse.sequence(
                parse.choice(
                    newExpression,
                    functionExpression,
                    primaryExpression),
                parse.many(accessor)),
            function(expression, props) {
                return parse.always(stream.foldl(reducer, expression, props));
            });
    });
}());

// New Expression
////////////////////////////////////////
/**
 * 
 */
var newExpression = parse.next(token.keyword('new'),
    parse.binda(
        parse.sequence(
            parse.expected("member expression", memberExpression),
            parse.optional(args, [])),
        function(expression, a) {
            return parse.always(new astExpression.NewExpression(expression, a));
        }));

// Left Hand Side Expression
////////////////////////////////////////
/**
 * 
 */
var leftHandSideExpression = parse.Parser('Left Hand Side Expression',
(function(){
    var reducer = function(p, c) {
        return (c.hasOwnProperty('property') ?
             new astExpression.MemberExpression(p, c.property, c.computed) :
             new astExpression.CallExpression(p, c))
    };
    
    return parse.binda(
        parse.sequence(
            parse.memo(memberExpression),
            parse.many(parse.either(
                args,
                accessor))),
        function(member, accessors) {
            return parse.always(stream.foldl(reducer, member, accessors));
        });
}()));

// Postfix Expression
////////////////////////////////////////
var postfixOperator = parse.either(
    token.punctuator('++'),
    token.punctuator('--'));

/**
 * 
 */
var postfixExpression = parse.binda(
    parse.sequence(
        parse.memo(leftHandSideExpression),
        parse.optional(postfixOperator)),
    function(argument, op) {
        return parse.always(op ?
            new astExpression.UpdateExpression(op.value, argument, false) :
            argument);
    });

// Unary Expression
////////////////////////////////////////
var unaryOperator = parse.choice(
    token.keyword('delete'),
    token.keyword('void'),
    token.keyword('typeof'),
    token.punctuator('++'),
    token.punctuator('--'),
    token.punctuator('+'),
    token.punctuator('-'),
    token.punctuator('~'),
    token.punctuator('!'));

/**
 * 
 */
var unaryExpression = (function(){
    var reducer = function(argument, op) {
        return (op.value === '++' || op.value === '--' ?
            new astExpression.UpdateExpression(op.value, argument, true) :
            new astExpression.UnaryExpression(op.value, argument));
    };
    
    return parse.binda(
        parse.sequence(
            parse.many(unaryOperator),
            parse.expected("postfix expression", postfixExpression)),
        function(ops, expression) {
            return parse.always(stream.foldr(reducer, expression, ops));
        });
}());

// Binary Expressions
////////////////////////////////////////
var multiplicativeOperator = parse.choice(
    token.punctuator('*'),
    token.punctuator('/'),
    token.punctuator('%'));

var additiveOperator = parse.either(
    token.punctuator('+'),
    token.punctuator('-'));

var shiftOperator = parse.choice(
    token.punctuator('<<'),
    token.punctuator('>>'),
    token.punctuator('>>>'));

var relationalOperatorNoIn = parse.choice(
    token.punctuator('<'),
    token.punctuator('>'),
    token.punctuator('<='),
    token.punctuator('>='),
    token.keyword('instanceof'));

var relationalOperator = parse.either(
    relationalOperatorNoIn,
    token.keyword('in'));

var equalityOperator = parse.choice(
    token.punctuator('=='),
    token.punctuator('!='),
    token.punctuator('==='),
    token.punctuator('!=='));

var bitwiseANDOperator = token.punctuator('&');

var bitwiseXOROperator = token.punctuator('^');

var bitwiseOROperator = token.punctuator('|');

var logicalANDOperator = token.punctuator('&&');

var logicalOROperator = token.punctuator('||');

var basePrecedenceTable = [
    {
        'sep': multiplicativeOperator,
        'precedence': 1,
        'node': 'BinaryExpression'
    },
    {
        'sep': additiveOperator,
        'precedence': 2,
        'node': 'BinaryExpression'
    },
    {
        'sep': shiftOperator,
        'precedence': 3,
        'node': 'BinaryExpression'
    },
    {
        'sep': equalityOperator,
        'precedence': 5,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseANDOperator,
        'precedence': 6,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseXOROperator,
        'precedence': 7,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseOROperator,
        'precedence': 8,
        'node': 'BinaryExpression'
    },
    {
        'sep': logicalOROperator,
        'precedence': 9,
        'node': 'LogicalExpression'
    },
    {
        'sep': logicalANDOperator,
        'precedence': 10,
        'node': 'LogicalExpression'
    }
];

var precedenceTable = basePrecedenceTable.concat([
    {
        'sep': relationalOperator,
        'precedence': 4,
        'node': 'BinaryExpression'
    }
]);

var precedenceTableNoIn = basePrecedenceTable.concat([
    {
        'sep': relationalOperatorNoIn,
        'precedence': 4,
        'node': 'BinaryExpression'
    }
]);

var binExpression = parse.Parser('Binary Expression',
    precedence(unaryExpression, precedenceTable));

var binExpressionNoIn = parse.Parser('Binary Expression',
    precedence(unaryExpression, precedenceTableNoIn));

// Conditional Expression
////////////////////////////////////////
var _baseConditionalExpressionParser = function(binExpr, assignExpr){
    return parse.bind(
        binExpr,
        function(bin) {
            return parse.either(
                parse.next(token.punctuator('?'),
                    parse.binda(
                        parse.sequence(
                            parse.expected("assignment expression", assignExpr),
                            token.punctuator(':'),
                            parse.expected("assignment expression", assignExpr)),
                        function(consequent, _, alternate) {
                            return parse.always(new astExpression.ConditionalExpression(bin, consequent, alternate))
                        })),
                parse.always(bin));
        });
};

/**
 * 
 */
var conditionalExpression = parse.Parser('Conditional Expression',
    _baseConditionalExpressionParser(binExpression, assignmentExpression));

/**
 * 
 */
var conditionalExpressionNoIn = parse.Parser('Conditional Expression No In',
    _baseConditionalExpressionParser(binExpressionNoIn, assignmentExpressionNoIn));


// Assignment Expression
////////////////////////////////////////
var assignmentOperator = parse.choice(
    token.punctuator('='),
    token.punctuator('*='),
    token.punctuator('*='),
    token.punctuator('/='),
    token.punctuator('%='),
    token.punctuator('+='),
    token.punctuator('-='),
    token.punctuator('<<='),
    token.punctuator('>>='),
    token.punctuator('>>>='),
    token.punctuator('&='),
    token.punctuator('^='),
    token.punctuator('|='));

var _baseAssignmentExpressionParser = function(condExpr) {
    return parse.rec(function(self) {
        return parse.backtrack(parse.either(
            parse.binda(
                parse.attempt(parse.sequence(
                    parse.memo(leftHandSideExpression),
                    assignmentOperator)),
                function(left, operator) {
                    return parse.bind(
                        parse.expected("assignment expression", self),
                        function(right) {
                            return parse.always(new astExpression.AssignmentExpression(operator.value, left, right));
                    });
                }),
            condExpr));
        });
};

/**
 * 
 */
assignmentExpression = parse.Parser('Assignment Expression',
    _baseAssignmentExpressionParser(conditionalExpression));

/**
 * 
 */
var assignmentExpressionNoIn = parse.Parser('Assignment Expression No In', 
    _baseAssignmentExpressionParser(conditionalExpressionNoIn));

// Expression
////////////////////////////////////////
var _baseExpressionParser = function(expr){
    return parse.bind(
        parse_eager.sepBy1(token.punctuator(','),
            parse.expected("expression", expr)),
        function(list) {
            return parse.always(list.length > 1 ?
                new astExpression.SequenceExpression(list) :
                list[0]);
        });
};

/**
 * 
 */
expression = parse.Parser('Expression',
    _baseExpressionParser(assignmentExpression));

/**
 * 
 */
var expressionNoIn = parse.Parser('Expression No In',
    _baseExpressionParser(assignmentExpressionNoIn));


/* Export
 ******************************************************************************/
return {
    'arrayLiteral': arrayLiteral,
    'objectLiteral': objectLiteral,
    
    'leftHandSideExpression': leftHandSideExpression,
    
    'assignmentExpression': assignmentExpression,
    'assignmentExpressionNoIn': assignmentExpressionNoIn,
    
    'expression': expression,
    'expressionNoIn': expressionNoIn
};

});