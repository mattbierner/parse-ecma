/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "ecma-ast/expression",
    "ecma-ast/position", "ecma-ast/value", "./program_parser", "./token_parser", "./value_parser", "./common"
], (function(require, exports, parse, parse_lang, stream, ast_expression, position, ast_value, program, token,
    value, ecma_parse) {
    "use strict";
    var arrayElement, arrayElements, arrayLiteral, propertyName, propertySetParameterList,
            propertyValueInitializer, propertyGetInitializer, propertySetInitializer, propertyInitializer,
            propertyList, objectLiteral, primaryExpression, thisExpression, args, argumentList, dotAccessor,
            bracketAccessor, accessor, memberExpression, newExpression, leftHandSideExpression, postfixOperator,
            postfixExpression, unaryOperator, unaryExpression, binaryExpression, binaryExpressionNoIn,
            conditionalExpression, conditionalExpressionNoIn, assignmentOperator, assignmentExpression,
            assignmentExpressionNoIn, expression, expressionNoIn, obj, props, obj0, props0, functionExpression =
            (function() {
            var args = arguments,
                __o = require("ecma/parse/program_parser"),
                functionExpression0 = __o["functionExpression"];
            return functionExpression0.apply(undefined, args);
        }),
        functionBody = (function() {
            var args = arguments,
                __o = require("ecma/parse/program_parser"),
                functionBody0 = __o["functionBody"];
            return functionBody0.apply(undefined, args);
        });
    (assignmentExpression = (function() {
        var args = arguments;
        return assignmentExpression.apply(undefined, args);
    }));
    (assignmentExpressionNoIn = (function() {
        var args = arguments;
        return assignmentExpressionNoIn.apply(undefined, args);
    }));
    (expression = (function() {
        var args = arguments;
        return expression.apply(undefined, args);
    }));
    (newExpression = (function() {
        var args = arguments;
        return newExpression.apply(undefined, args);
    }));
    (arrayElement = parse.Parser("Array Element", parse.either(assignmentExpression, parse.next(parse.look(
        token.punctuator(",")), parse.always(null)))));
    (arrayElements = parse.Parser("Array Elements", parse.eager(parse_lang.sepEndBy(token.punctuator(","),
        arrayElement))));
    (arrayLiteral = parse.Parser("Array Literal", ecma_parse.node(parse_lang.between(token.punctuator("["),
        token.punctuator("]"), arrayElements), ast_expression.ArrayExpression.create)));
    (propertyName = parse.Parser("Property Name", parse.expected("property name", parse.choice(value.identifier,
        value.stringLiteral, value.numericLiteral))));
    (propertySetParameterList = parse.bind(value.identifier, (function(x) {
        return parse.always([x]);
    })));
    var propertyValueKey = parse.Parser("Property Value Key", parse_lang.then(propertyName, token.punctuator(
        ":")));
    (propertyValueInitializer = parse.Parser("Property Value Initializer", assignmentExpression));
    var valueProperty = parse.Parser("Value Property", ecma_parse.nodea(parse.enumeration(parse.attempt(
            propertyValueKey), parse.expected("Assignment Expression", propertyValueInitializer)),
        ast_value.ObjectValue.create)),
        propertyGetterKey = parse.Parser("Property Getter Key", parse.next(token.identifier("get"),
            propertyName));
    (propertyGetInitializer = parse.Parser("Property Get Initializer", ecma_parse.node(parse.next(parse.next(
        token.punctuator("("), token.punctuator(")")), parse_lang.between(token.punctuator("{"),
        token.punctuator("}"), functionBody)), (function(loc, body) {
        return new(ast_expression.FunctionExpression)(loc, null, [], body);
    }))));
    var getterProperty = parse.Parser("Getter Property", ecma_parse.nodea(parse.enumeration(propertyGetterKey,
        propertyGetInitializer), ast_value.ObjectGetter.create)),
        propertySetterKey = parse.Parser("Property Setter Key", parse.next(token.identifier("set"),
            propertyName));
    (propertySetInitializer = parse.Parser("Property Set Initializer", ecma_parse.nodea(parse.enumeration(
        parse_lang.between(token.punctuator("("), token.punctuator(")"), propertySetParameterList),
        parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody)), (function(
        loc, params, body) {
        return new(ast_expression.FunctionExpression)(loc, null, params, body);
    }))));
    var setterProperty = parse.Parser("Setter Property", ecma_parse.nodea(parse.enumeration(propertySetterKey,
        propertySetInitializer), ast_value.ObjectSetter.create));
    (propertyInitializer = parse.Parser("Property Initializer", parse.choice(valueProperty, getterProperty,
        setterProperty)));
    (propertyList = parse.Parser("Property List", parse.eager(parse_lang.sepEndBy(token.punctuator(","),
        propertyInitializer))));
    (objectLiteral = parse.Parser("Object Literal", ecma_parse.node(parse_lang.between(token.punctuator("{"),
        token.punctuator("}"), propertyList), ast_expression.ObjectExpression.create)));
    (thisExpression = parse.Parser("This Expression", ecma_parse.node(token.keyword("this"), ast_expression.ThisExpression
        .create)));
    (primaryExpression = parse.memo(parse.Parser("Primary Expression", parse.choice(functionExpression,
        thisExpression, value.identifier, value.literal, arrayLiteral, objectLiteral, parse_lang.between(
            token.punctuator("("), token.punctuator(")"), expression)))));
    (argumentList = parse.Parser("Argument List", parse.eager(parse_lang.sepBy(token.punctuator(","), parse.expected(
        "assignment expression", assignmentExpression)))));
    (args = parse.Parser("Arguments", ecma_parse.node(parse_lang.between(token.punctuator("("), token.punctuator(
        ")"), argumentList), (function(loc, args0) {
        (args0.loc = loc);
        return args0;
    }))));
    (dotAccessor = parse.Parser("Dot Accessor", ecma_parse.node(parse.next(token.punctuator("."), value.identifier), (
        function(loc, x) {
            return ({
                "loc": loc,
                "property": x,
                "computed": false
            });
        }))));
    (bracketAccessor = parse.Parser("Bracket Accessor", ecma_parse.node(parse_lang.between(token.punctuator("["),
        token.punctuator("]"), parse.expected("expression", expression)), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": true
        });
    }))));
    (accessor = parse.Parser("Accessor", parse.either(dotAccessor, bracketAccessor)));
    var reducer = (function(p, c) {
        return ast_expression.MemberExpression.create(position.SourceLocation.merge(p.loc, c.loc), p, c.property,
            c.computed);
    });
    (memberExpression = parse.memo(parse.Parser("Member Expression", parse.binds(parse.enumeration(parse.either(
        newExpression, primaryExpression), parse.many(accessor)), (function(expression0, props) {
        return parse.always(stream.foldl(reducer, expression0, props));
    })))));
    (newExpression = parse.memo(parse.Parser("New Expression", ecma_parse.nodea(parse.next(token.keyword("new"),
        parse.enumeration(parse.expected("member expression", memberExpression), parse.optional(
            [], args))), ast_expression.NewExpression.create))));
    var reducer0 = (function(p, c) {
        var loc = position.SourceLocation.merge(p.loc, c.loc);
        return (c.hasOwnProperty("property") ? ast_expression.MemberExpression.create(loc, p, c.property, c
            .computed) : ast_expression.CallExpression.create(loc, p, c));
    });
    (leftHandSideExpression = parse.memo(parse.Parser("Left Hand Side Expression", parse.binds(parse.enumeration(
        memberExpression, parse.many(parse.either(args, accessor))), (function(member,
        accessors) {
        return parse.always(stream.foldl(reducer0, member, accessors));
    })))));
    (postfixOperator = parse.Parser("Postfix Operator", token.punctuator("++", "--")));
    (postfixExpression = parse.Parser("Postfix Expression", ecma_parse.nodea(parse.enumeration(
        leftHandSideExpression, parse.optional(null, postfixOperator)), (function(loc, argument, op) {
        return ((!op) ? argument : ast_expression.UpdateExpression.create(position.SourceLocation
            .merge(argument.loc, op.loc), op.value, argument, false));
    }))));
    (unaryOperator = parse.Parser("Unary Operator", parse.either(token.keyword("delete", "void", "typeof"),
        token.punctuator("++", "--", "+", "-", "~", "!"))));
    var reducer1 = (function(argument, op) {
        var loc = position.SourceLocation.merge(op.loc, argument.loc);
        return (((op.value === "++") || (op.value === "--")) ? new(ast_expression.UpdateExpression)(loc, op
            .value, argument, true) : new(ast_expression.UnaryExpression)(loc, op.value, argument));
    });
    (unaryExpression = parse.Parser("Unary Expression", parse.binds(parse.enumeration(parse.many(unaryOperator),
        parse.expected("postfix expression", postfixExpression)), (function(ops, expression0) {
        return parse.always(stream.foldr(reducer1, expression0, ops));
    }))));
    var basePrecedenceTable = ({
        "*": ({
            "type": "punctuator",
            "precedence": 1,
            "node": ast_expression.BinaryExpression
        }),
        "%": ({
            "type": "punctuator",
            "precedence": 1,
            "node": ast_expression.BinaryExpression
        }),
        "/": ({
            "type": "punctuator",
            "precedence": 1,
            "node": ast_expression.BinaryExpression
        }),
        "+": ({
            "type": "punctuator",
            "precedence": 2,
            "node": ast_expression.BinaryExpression
        }),
        "-": ({
            "type": "punctuator",
            "precedence": 2,
            "node": ast_expression.BinaryExpression
        }),
        "<<": ({
            "type": "punctuator",
            "precedence": 3,
            "node": ast_expression.BinaryExpression
        }),
        ">>": ({
            "type": "punctuator",
            "precedence": 3,
            "node": ast_expression.BinaryExpression
        }),
        ">>>": ({
            "type": "punctuator",
            "precedence": 3,
            "node": ast_expression.BinaryExpression
        }),
        "==": ({
            "type": "punctuator",
            "precedence": 5,
            "node": ast_expression.BinaryExpression
        }),
        "!=": ({
            "type": "punctuator",
            "precedence": 5,
            "node": ast_expression.BinaryExpression
        }),
        "===": ({
            "type": "punctuator",
            "precedence": 5,
            "node": ast_expression.BinaryExpression
        }),
        "!==": ({
            "type": "punctuator",
            "precedence": 5,
            "node": ast_expression.BinaryExpression
        }),
        "&": ({
            "type": "punctuator",
            "precedence": 6,
            "node": ast_expression.BinaryExpression
        }),
        "^": ({
            "type": "punctuator",
            "precedence": 7,
            "node": ast_expression.BinaryExpression
        }),
        "|": ({
            "type": "punctuator",
            "precedence": 8,
            "node": ast_expression.BinaryExpression
        }),
        "||": ({
            "type": "punctuator",
            "precedence": 9,
            "node": ast_expression.LogicalExpression
        }),
        "&&": ({
            "type": "punctuator",
            "precedence": 9,
            "node": ast_expression.LogicalExpression
        })
    }),
        precedenceTable = ((obj = basePrecedenceTable), (props = ({
            "<": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            ">": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            "<=": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            ">=": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            "instanceof": ({
                "type": "keyword",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            "in": ({
                "type": "keyword",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            })
        })), Object.defineProperties(Object.getOwnPropertyNames(obj)
            .reduce((function(p, key) {
                return Object.defineProperty(p, key, Object.getOwnPropertyDescriptor(obj, key));
            }), ({})), Object.keys(props)
            .reduce((function(p, c) {
                (p[c] = ({
                    "value": props[c],
                    "enumerable": true
                }));
                return p;
            }), ({})))),
        precedenceTableNoIn = ((obj0 = basePrecedenceTable), (props0 = ({
            "<": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            ">": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            "<=": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            ">=": ({
                "type": "punctuator",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            }),
            "instanceof": ({
                "type": "keyword",
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            })
        })), Object.defineProperties(Object.getOwnPropertyNames(obj0)
            .reduce((function(p, key) {
                return Object.defineProperty(p, key, Object.getOwnPropertyDescriptor(obj0, key));
            }), ({})), Object.keys(props0)
            .reduce((function(p, c) {
                (p[c] = ({
                    "value": props0[c],
                    "enumerable": true
                }));
                return p;
            }), ({}))));
    (binaryExpression = parse.Parser("Binary Expression", ecma_parse.precedence(unaryExpression,
        precedenceTable)));
    (binaryExpressionNoIn = parse.Parser("Binary Expression", ecma_parse.precedence(unaryExpression,
        precedenceTableNoIn)));
    var binExpr, assignExpr;
    (conditionalExpression = parse.Parser("Conditional Expression", ((binExpr = binaryExpression), (assignExpr =
        parse.expected("assignment expression", assignmentExpression)), parse.either(ecma_parse.nodea(
        parse.enumeration(parse.attempt(parse_lang.then(parse.memo(binExpr), token.punctuator(
            "?"))), parse_lang.then(assignExpr, token.punctuator(":")), assignExpr),
        ast_expression.ConditionalExpression.create), parse.memo(binExpr)))));
    var binExpr0, assignExpr0;
    (conditionalExpressionNoIn = parse.Parser("Conditional Expression No In", ((binExpr0 = binaryExpressionNoIn), (
            assignExpr0 = parse.expected("assignment expression no in", assignmentExpressionNoIn)),
        parse.either(ecma_parse.nodea(parse.enumeration(parse.attempt(parse_lang.then(parse.memo(
            binExpr0), token.punctuator("?"))), parse_lang.then(assignExpr0, token.punctuator(
            ":")), assignExpr0), ast_expression.ConditionalExpression.create), parse.memo(binExpr0)))));
    (assignmentOperator = parse.Parser("Assignment Operator", token.punctuator("=", "*=", "*=", "/=", "%=",
        "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=")));
    var condExpr;
    (assignmentExpression = parse.Parser("Assignment Expression", ((condExpr = conditionalExpression), parse.rec(
        (function(self) {
            return parse.either(parse.binds(parse.attempt(parse.enumeration(
                leftHandSideExpression, assignmentOperator)), (function(left, operator) {
                return parse.bind(parse.expected("assignment expression", self), (
                    function(right) {
                        return parse.always(ast_expression.AssignmentExpression
                            .create(position.SourceLocation.merge(left.loc,
                                right.loc), operator.value, left, right));
                    }));
            })), condExpr);
        })))));
    var condExpr0;
    (assignmentExpressionNoIn = parse.Parser("Assignment Expression No In", ((condExpr0 =
        conditionalExpressionNoIn), parse.rec((function(self) {
        return parse.either(parse.binds(parse.attempt(parse.enumeration(
            leftHandSideExpression, assignmentOperator)), (function(left, operator) {
            return parse.bind(parse.expected("assignment expression", self), (
                function(right) {
                    return parse.always(ast_expression.AssignmentExpression
                        .create(position.SourceLocation.merge(left.loc,
                            right.loc), operator.value, left, right));
                }));
        })), condExpr0);
    })))));
    var expr;
    (expression = parse.Parser("Expression", ((expr = parse.expected("expression", assignmentExpression)),
        ecma_parse.node(parse.eager(parse_lang.sepBy1(token.punctuator(","), expr)), (function(loc,
            list) {
            return ((list.length > 1) ? new(ast_expression.SequenceExpression)(loc, list) :
                list[0]);
        })))));
    var expr0;
    (expressionNoIn = parse.Parser("Expression No In", ((expr0 = parse.expected("expression no in",
        assignmentExpressionNoIn)), ecma_parse.node(parse.eager(parse_lang.sepBy1(token.punctuator(
        ","), expr0)), (function(loc, list) {
        return ((list.length > 1) ? new(ast_expression.SequenceExpression)(loc, list) :
            list[0]);
    })))));
    (exports["arrayElement"] = arrayElement);
    (exports["arrayElements"] = arrayElements);
    (exports["arrayLiteral"] = arrayLiteral);
    (exports["propertyName"] = propertyName);
    (exports["propertySetParameterList"] = propertySetParameterList);
    (exports["propertyValueInitializer"] = propertyValueInitializer);
    (exports["propertyGetInitializer"] = propertyGetInitializer);
    (exports["propertySetInitializer"] = propertySetInitializer);
    (exports["propertyInitializer"] = propertyInitializer);
    (exports["propertyList"] = propertyList);
    (exports["objectLiteral"] = objectLiteral);
    (exports["primaryExpression"] = primaryExpression);
    (exports["thisExpression"] = thisExpression);
    (exports["args"] = args);
    (exports["argumentList"] = argumentList);
    (exports["dotAccessor"] = dotAccessor);
    (exports["bracketAccessor"] = bracketAccessor);
    (exports["accessor"] = accessor);
    (exports["memberExpression"] = memberExpression);
    (exports["newExpression"] = newExpression);
    (exports["leftHandSideExpression"] = leftHandSideExpression);
    (exports["postfixOperator"] = postfixOperator);
    (exports["postfixExpression"] = postfixExpression);
    (exports["unaryOperator"] = unaryOperator);
    (exports["unaryExpression"] = unaryExpression);
    (exports["binaryExpression"] = binaryExpression);
    (exports["binaryExpressionNoIn"] = binaryExpressionNoIn);
    (exports["conditionalExpression"] = conditionalExpression);
    (exports["conditionalExpressionNoIn"] = conditionalExpressionNoIn);
    (exports["assignmentOperator"] = assignmentOperator);
    (exports["assignmentExpression"] = assignmentExpression);
    (exports["assignmentExpressionNoIn"] = assignmentExpressionNoIn);
    (exports["expression"] = expression);
    (exports["expressionNoIn"] = expressionNoIn);
}));