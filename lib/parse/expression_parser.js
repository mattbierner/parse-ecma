/**
 * @fileOverview Parser for ECMAScript 5.1 expressions.
 */
define(['require',
        'parse/parse',
        'parse/lang',
        'nu/stream',
        'ecma_ast/expression',
        'ecma/position',
        'ecma/parse/common',
        'ecma/parse/program_parser',
        'ecma/parse/token_parser',
        'ecma/parse/value_parser'],
function(require,
        parse,
        parse_lang,
        stream,
        ast_expression,
        position,
        ecma_parse,
        program,
        token,
        value){
"use strict";

/* Circular
 ******************************************************************************/
var functionExpression = function(/*...*/) {
    return require('ecma/parse/program_parser').functionExpression.apply(undefined, arguments);
};

var functionBody = function(/*...*/) {
    return require('ecma/parse/program_parser').functionBody.apply(undefined, arguments);
};

/* Forward Declarations
 ******************************************************************************/
var assignmentExpression = function() { return assignmentExpression.apply(undefined, arguments); };

var assignmentExpressionNoIn = function() { return assignmentExpressionNoIn.apply(undefined, arguments); };

var expression = function() { return expression.apply(undefined, arguments); };

var newExpression = function() { return newExpression.apply(undefined, arguments); };

/* Parsers
 ******************************************************************************/
// Array Literal
////////////////////////////////////////
/**
 * Parser for an element in an array literal.
 */
var arrayElement = parse.Parser('Array Element',
    parse.either(
        assignmentExpression,
        parse.next(
            parse.lookahead(token.punctuator(',')),
            parse.always(null))));

/**
 * Parser for the elements of an array literal.
 */
var arrayElements = parse.Parser('Array Elements',
    parse.eager(parse_lang.sepEndBy(token.punctuator(','),
        arrayElement)));

/**
 * Parser for an ECMASccript array literal.
 */
var arrayLiteral = parse.Parser('Array Literal',
    ecma_parse.node(
        parse_lang.between(token.punctuator('['), token.punctuator(']'),
            arrayElements),
        ast_expression.ArrayExpression.create));

// Object Literal
////////////////////////////////////////
/**
 * Parser for an object property name.
 */
var propertyName = parse.Parser('Property Name',
    parse.expected('property name', parse.choice(
        value.identifier,
        value.stringLiteral,
        value.numericLiteral)));

/**
 * Parser for the argument list of a object set initializer property.
 */
var propertySetParameterList = parse.bind(
    value.identifier,
    function(x) {
        return parse.always([x]);
    });

/**
 * Parser for the key of a value initialized property .
 */
var propertyValueKey = parse.Parser('Property Value Key',
    parse_lang.then(
        propertyName,
        token.punctuator(':')));

/**
 * Parser for the standard key to value property initializer.
 */
var propertyValueInitializer = parse.Parser('Property Value Initializer',
    assignmentExpression);

/**
 * Parser for the value property
 */
var valueProperty = parse.Parser('Value Property',
    ecma_parse.nodea(
        parse.enumeration(
            parse.attempt(propertyValueKey),
            parse.expected('Assignment Expression', propertyValueInitializer)),
        function(loc, key, value) {
            return {
                'kind': 'init',
                'loc': loc,
                'key': key,
                'value': value
            };
        }));
/**
 * Parser for the key of a property getter.
 */
var propertyGetterKey = parse.Parser('Property Getter Key',
    parse.next(
        token.identifier('get'),
        propertyName));

/**
 * Parser for a getter for a property.
 */
var propertyGetInitializer = parse.Parser('Property Get Initializer',
    ecma_parse.node(
        parse.next(
            parse.next(
                token.punctuator('('),
                token.punctuator(')')),
            parse_lang.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(loc, body) {
            return new ast_expression.FunctionExpression(loc, null, [], body);
        }));

/**
 * Parser for a property getter.
 */
var getterProperty = parse.Parser('Getter Property',
    ecma_parse.nodea(
        parse.enumeration(
            propertyGetterKey,
            propertyGetInitializer),
        function(loc, name, value) {
            return {
                'kind': 'get',
                'loc': loc,
                'key': name,
                'value': value
            };
        }));

/**
 * Parser for the key of a property getter.
 */
var propertySetterKey = parse.Parser('Property Setter Key',
    parse.next(
        token.identifier('set'),
        propertyName));

/**
 * Parser for a setter for a property.
 */
var propertySetInitializer = parse.Parser('Property Set Initializer',
    ecma_parse.nodea(
        parse.enumeration(
            parse_lang.between(token.punctuator('('), token.punctuator(')'),
                propertySetParameterList),
            parse_lang.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(loc, params, body) {
            return new ast_expression.FunctionExpression(loc, null, params, body)
        }));

/**
 * Parser for a property setter.
 */
var setterProperty = parse.Parser('Setter Property',
    ecma_parse.nodea(
        parse.enumeration(
            propertySetterKey,
            propertySetInitializer),
        function(loc, key, value) {
            return {
                'kind': 'set',
                'loc': loc,
                'key': key,
                'value': value
            };
        }));


/**
 * Parser for any property initializer.
 */
var propertyInitializer = parse.Parser('Property Initializer',
    parse.choice(
        valueProperty,
        getterProperty,
        setterProperty));

/**
 * Parser for a set or more properties in an object literal.
 */
var propertyList = parse.Parser('Property List',
    parse.eager(parse_lang.sepEndBy1(token.punctuator(','),
        propertyInitializer)));

/**
 * Parser for the body of an object literal.
 */
var objectProperties = parse.Parser('Object Properties',
    parse.either(
        propertyList,
        parse.next(
            parse.optional(null, token.punctuator(',')),
            parse.always([]))));

/**
 * Object Literal
 */
var objectLiteral = parse.Parser('Object Literal',
    ecma_parse.node(
        parse_lang.between(token.punctuator('{'), token.punctuator('}'),
            objectProperties),
        ast_expression.ObjectExpression.create));

// This Expression
////////////////////////////////////////
/**
 * This Expression
 */
var thisExpression = parse.Parser('This Expression',
    ecma_parse.node(
        token.keyword('this'),
        ast_expression.ThisExpression.create));

// Primary Expression
////////////////////////////////////////
/**
 * Primary Expression
 */
var primaryExpression = parse.Parser('Primary Expression',
    parse.choice(
        functionExpression,
        thisExpression,
        value.identifier,
        value.literal,
        arrayLiteral,
        objectLiteral,
        parse_lang.between(token.punctuator('('), token.punctuator(')'),
            expression)));

// Calling
////////////////////////////////////////
/**
 * Parser for a list of arguments.
 */
var argumentList = parse.Parser('Argument List',
    parse.eager(parse_lang.sepBy(token.punctuator(','),
        parse.expected("assignment expression", assignmentExpression))));

/**
 * Parser for a argument list part of a call expression.
 */
var args = parse.Parser('Arguments',
    ecma_parse.node(
        parse_lang.between(token.punctuator('('), token.punctuator(')'),
            argumentList),
        function(loc, args){
            args.loc = loc;
            return args;
        }));

// Accessors
////////////////////////////////////////
/**
 * Parser for a dot accessor in a member expression.
 */
var dotAccessor = parse.Parser('Dot Accessor',
    ecma_parse.node(
        parse.next(
            token.punctuator('.'),
            value.identifier),
        function(loc, x) {
            return {
                'loc': loc,
                'property': x,
                'computed': false
            };
        }));

/**
 * Parser for a bracket accessor in a member expression.
 */
var bracketAccessor = parse.Parser('Bracket Accessor',
    ecma_parse.node(
        parse_lang.between(token.punctuator('['), token.punctuator(']'),
            parse.expected("expression", expression)),
        function(loc, x) {
            return {
                'loc': loc,
                'property': x,
                'computed': true
            };
        }));

/**
 * Parser for an accessor in a member expression.
 */
var accessor = parse.Parser('Accessor',
    parse.either(
        dotAccessor,
        bracketAccessor));

// Member Expression
////////////////////////////////////////
/**
 * Parser for a member expression.
 */
var memberExpression = (function(){
    var reducer = function(p, c){
        return ast_expression.MemberExpression.create(
            position.SourceLocation.merge(p.loc, c.loc),
            p,
            c.property,
            c.computed);
    };
    
    return parse.Parser('Member Expression',
        parse.binds(
            parse.enumeration(
                parse.either(
                    newExpression,
                    primaryExpression),
                parse.many(accessor)),
            function(expression, props) {
                return parse.always(stream.foldl(reducer, expression, props));
            }));
}());

// New Expression
////////////////////////////////////////
/**
 * Parser for a new expression
 */
var newExpression = parse.Parser('New Expression',
    ecma_parse.nodea(
        parse.next(
            token.keyword('new'),
            parse.enumeration(
                parse.expected("member expression", memberExpression),
                parse.optional([], args))),
        ast_expression.NewExpression.create));

// Left Hand Side Expression
////////////////////////////////////////
/**
 * Parser for a left hand side expression.
 */
var leftHandSideExpression = (function(){
    var reducer = function(p, c) {
        var loc = position.SourceLocation.merge(p.loc, c.loc);
        return (c.hasOwnProperty('property') ?
             ast_expression.MemberExpression.create(loc, p, c.property, c.computed) :
             ast_expression.CallExpression.create(loc, p, c));
    };
    
    return parse.Parser('Left Hand Side Expression',
        parse.binds(
            parse.enumeration(
                parse.memo(memberExpression),
                parse.many(parse.either(
                    args,
                    accessor))),
            function(member, accessors) {
                return parse.always(stream.foldl(reducer, member, accessors));
            }));
}());

// Postfix Expression
////////////////////////////////////////
/**
 * Parser for a postfix operator
 */
var postfixOperator = parse.Parser('Postfix Operator',
    token.punctuator('++', '--'));

/**
 * Parser for a postfix expression.
 */
var postfixExpression = parse.Parser('Postfix Expression',
    ecma_parse.nodea(
        parse.enumeration(
            parse.memo(leftHandSideExpression),
            parse.optional(null, postfixOperator)),
        function(loc, argument, op) {
            return (!op ?
                argument :
                ast_expression.UpdateExpression.create(
                    position.SourceLocation.merge(argument.loc, op.loc),
                    op.value,
                    argument,
                    false));
        }));

// Unary Expression
////////////////////////////////////////
var unaryOperator = parse.Parser('Unary Operator',
    parse.either(
        token.keyword(
            'delete',
            'void',
            'typeof'),
        token.punctuator(
            '++',
            '--',
            '+',
            '-',
            '~',
            '!')));

/**
 * Parser for a unary (prefix) expression.
 */
var unaryExpression = (function(){
    var reducer = function(argument, op) {
        var loc = position.SourceLocation.merge(op.loc, argument.loc);
        return (op.value === '++' || op.value === '--' ?
            new ast_expression.UpdateExpression(loc, op.value, argument, true) :
            new ast_expression.UnaryExpression(loc, op.value, argument));
    };
    
    return parse.Parser('Unary Expression',
        parse.binds(
            parse.enumeration(
                parse.many(unaryOperator),
                parse.expected("postfix expression", postfixExpression)),
            function(ops, expression) {
                return parse.always(stream.foldr(reducer, expression, ops));
            }));
}());

// Binary Expressions
////////////////////////////////////////
var multiplicativeOperator = parse.either(
    token.punctuator(
        '*',
        '%'),
    parse.bind(parse.getParserState, function(state) {
        return parse.next(parse.setParserState(state.asDiv()), token.punctuator('/'));
    }));

var additiveOperator = token.punctuator(
    '+',
    '-');

var shiftOperator = token.punctuator(
    '<<',
    '>>',
    '>>>');

var relationalOperatorNoIn = parse.either(
    token.punctuator(
        '<',
        '>',
        '<=',
        '>='),
    token.keyword('instanceof'));

var relationalOperator = parse.either(
    relationalOperatorNoIn,
    token.keyword('in'));

var equalityOperator = parse.choice(
    token.punctuator(
        '==',
        '!=',
        '===',
        '!=='));

var bitwiseANDOperator = token.punctuator('&');

var bitwiseXOROperator = token.punctuator('^');

var bitwiseOROperator = token.punctuator('|');

var logicalANDOperator = token.punctuator('&&');

var logicalOROperator = token.punctuator('||');

var basePrecedenceTable = [
    {
        'sep': multiplicativeOperator,
        'precedence': 1,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': additiveOperator,
        'precedence': 2,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': shiftOperator,
        'precedence': 3,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': equalityOperator,
        'precedence': 5,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': bitwiseANDOperator,
        'precedence': 6,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': bitwiseXOROperator,
        'precedence': 7,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': bitwiseOROperator,
        'precedence': 8,
        'node': ast_expression.BinaryExpression
    },
    {
        'sep': logicalOROperator,
        'precedence': 9,
        'node': ast_expression.LogicalExpression
    },
    {
        'sep': logicalANDOperator,
        'precedence': 10,
        'node': ast_expression.LogicalExpression
    }
];

var precedenceTable = basePrecedenceTable.concat([
    {
        'sep': relationalOperator,
        'precedence': 4,
        'node': ast_expression.BinaryExpression
    }
]);

var precedenceTableNoIn = basePrecedenceTable.concat([
    {
        'sep': relationalOperatorNoIn,
        'precedence': 4,
        'node': ast_expression.BinaryExpression
    }
]);

var binaryExpression = parse.Parser('Binary Expression',
    ecma_parse.precedence(unaryExpression, precedenceTable));

var binaryExpressionNoIn = parse.Parser('Binary Expression',
    ecma_parse.precedence(unaryExpression, precedenceTableNoIn));

// Conditional Expression
////////////////////////////////////////
var _baseConditionalExpressionParser = function(binExpr, assignExpr){
    binExpr = parse.memo(binExpr);
    return parse.either(
        parse.attempt(ecma_parse.nodea(
            parse.enumeration(
                parse_lang.then(
                    binExpr,
                    token.punctuator('?')),
                parse_lang.then(
                    assignExpr,
                    token.punctuator(':')),
                assignExpr),
            ast_expression.ConditionalExpression.create)),
        binExpr);
};

/**
 * Parser for a standard conditional expression.
 */
var conditionalExpression = parse.Parser('Conditional Expression',
    _baseConditionalExpressionParser(binaryExpression,
        parse.expected("assignment expression", assignmentExpression)));

/**
 * Parser for a conditional expression without the in operator.
 */
var conditionalExpressionNoIn = parse.Parser('Conditional Expression No In',
    _baseConditionalExpressionParser(binaryExpressionNoIn,
        parse.expected("assignment expression no in", assignmentExpressionNoIn)));


// Assignment Expression
////////////////////////////////////////
/**
 * Parser for an assignment operator.
 */
var assignmentOperator = parse.Parser('Assignment Operator',
    token.punctuator(
        '=',
        '*=',
        '*=',
        '/=',
        '%=',
        '+=',
        '-=',
        '<<=',
        '>>=',
        '>>>=',
        '&=',
        '^=',
        '|='));

var _baseAssignmentExpressionParser = function(condExpr) {
    return parse.rec(function(self) {
        return parse.either(
            parse.binds(
                parse.attempt(parse.enumeration(
                    parse.memo(leftHandSideExpression),
                    assignmentOperator)),
                function(left, operator) {
                    return parse.bind(
                        parse.expected("assignment expression", self),
                        function(right) {
                            return parse.always(ast_expression.AssignmentExpression.create(
                                position.SourceLocation.merge(left.loc, right.loc),
                                operator.value,
                                left,
                                right));
                    });
                }),
            condExpr);
        });
};

/**
 * Parser for a standard assignment expression.
 */
assignmentExpression = parse.Parser('Assignment Expression',
    _baseAssignmentExpressionParser(conditionalExpression));

/**
 * Parser for an assignment expression without the in operator.
 */
var assignmentExpressionNoIn = parse.Parser('Assignment Expression No In', 
    _baseAssignmentExpressionParser(conditionalExpressionNoIn));

// Expression
////////////////////////////////////////
var _baseExpressionParser = function(expr){
    return ecma_parse.node(
        parse.eager(parse_lang.sepBy1(token.punctuator(','),
            expr)),
        function(loc, list) {
            return (list.length > 1 ?
                new ast_expression.SequenceExpression(loc, list) :
                list[0]);
        });
};

/**
 * Parser for a standard expression.
 */
expression = parse.Parser('Expression',
    _baseExpressionParser(parse.expected("expression",
        assignmentExpression)));

/**
 * Parser for an expression without the in operator.
 */
var expressionNoIn = parse.Parser('Expression No In',
    _baseExpressionParser(parse.expected("expression no in",
        assignmentExpressionNoIn)));

/* Export
 ******************************************************************************/
return {
// Array Literal
    'arrayElement': arrayElement,
    'arrayElements': arrayElements,
    'arrayLiteral': arrayLiteral,
    
// Object Literal
    'propertyName': propertyName,
    'propertySetParameterList': propertySetParameterList,
    'propertyValueInitializer': propertyValueInitializer,
    'propertyGetInitializer': propertyGetInitializer,
    'propertySetInitializer': propertySetInitializer,
    'propertyInitializer': propertyInitializer,
    'propertyList': propertyList,
    'objectProperties': objectProperties,
    'objectLiteral': objectLiteral,
    
// Primary Expression
    'primaryExpression': primaryExpression,
    
// This Expression
    'thisExpression': thisExpression,
    
// Call Expression
    'args': args,
    'argumentList': argumentList,
    
// Member Expression
    'dotAccessor': dotAccessor,
    'bracketAccessor': bracketAccessor,
    'accessor': accessor,
    'memberExpression': memberExpression,
    
// New Expression
    'newExpression': newExpression,
    
// Left hand side expression
    'leftHandSideExpression': leftHandSideExpression,
    
// Postfix Expression
    'postfixOperator': postfixOperator,
    'postfixExpression': postfixExpression,
    
// Unary Expression
    'unaryOperator': unaryOperator,
    'unaryExpression': unaryExpression,
    
// Binary Expression
    'binaryExpression': binaryExpression,
    'binaryExpressionNoIn': binaryExpressionNoIn,
    
// Conditional Expression
    'conditionalExpression': conditionalExpression,
    'conditionalExpressionNoIn': conditionalExpressionNoIn,
    
// Assignment Expression
    'assignmentOperator': assignmentOperator,
    'assignmentExpression': assignmentExpression,
    'assignmentExpressionNoIn': assignmentExpressionNoIn,
    
// Expression
    'expression': expression,
    'expressionNoIn': expressionNoIn
};

});