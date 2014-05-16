/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "ecma-ast/expression",
    "ecma-ast/position", "ecma-ast/value", "./program_parser", "./token_parser", "./value_parser", "./common"
], (function(require, exports, parse, __o, stream, ast_expression, position, ast_value, program, token, value, __o0) {
    "use strict";
    var arrayElement, arrayElements, arrayLiteral, propertyName, propertySetParameterList,
            propertyValueInitializer, propertyGetInitializer, propertySetInitializer, propertyInitializer,
            propertyList, objectLiteral, primaryExpression, thisExpression, args, argumentList, dotAccessor,
            bracketAccessor, accessor, memberExpression, newExpression, leftHandSideExpression, postfixOperator,
            postfixExpression, unaryOperator, unaryExpression, binaryExpression, binaryExpressionNoIn,
            conditionalExpression, conditionalExpressionNoIn, assignmentOperator, assignmentExpression,
            assignmentExpressionNoIn, expression, expressionNoIn, choice = parse["choice"],
        either = parse["either"],
        late = parse["late"],
        eager = parse["eager"],
        between = __o["between"],
        sepBy = __o["sepBy"],
        sepBy1 = __o["sepBy1"],
        sepEndBy = __o["sepEndBy"],
        then = __o["then"],
        keyword = token["keyword"],
        punctuator = token["punctuator"],
        node = __o0["node"],
        nodea = __o0["nodea"],
        precedence = __o0["precedence"],
        obj, props, obj0, props0, functionExpression = late((function() {
            var __o1 = require("ecma/parse/program_parser"),
                functionExpression0 = __o1["functionExpression"];
            return functionExpression0;
        })),
        functionBody = late((function() {
            var __o1 = require("ecma/parse/program_parser"),
                functionBody0 = __o1["functionBody"];
            return functionBody0;
        }));
    (assignmentExpression = late((function() {
        return assignmentExpression;
    })));
    (assignmentExpressionNoIn = late((function() {
        return assignmentExpressionNoIn;
    })));
    (expression = late((function() {
        return expression;
    })));
    (newExpression = late((function() {
        return newExpression;
    })));
    (arrayElement = parse.label("Array Element", either(assignmentExpression, parse.next(parse.look(punctuator(
        ",")), parse.always(null)))));
    (arrayElements = parse.label("Array Elements", sepEndBy(punctuator(","), arrayElement)));
    (arrayLiteral = parse.label("Array Literal", node(between(punctuator("["), punctuator("]"), eager(
        arrayElements)), ast_expression.ArrayExpression.create)));
    (propertyName = parse.label("Property Name", parse.expected("property name", choice(value.identifier, value
        .stringLiteral, value.numericLiteral))));
    (propertySetParameterList = parse.bind(value.identifier, (function(x) {
        return parse.always([x]);
    })));
    var propertyValueKey = parse.label("Property Value Key", then(propertyName, punctuator(":")));
    (propertyValueInitializer = parse.label("Property Value Initializer", assignmentExpression));
    var valueProperty = parse.label("Value Property", nodea(parse.enumeration(parse.attempt(propertyValueKey),
        parse.expected("Assignment Expression", propertyValueInitializer)), ast_value.ObjectValue.create)),
        propertyGetterKey = parse.label("Property Getter Key", parse.next(token.identifier("get"), propertyName));
    (propertyGetInitializer = parse.label("Property Get Initializer", node(parse.next(parse.next(punctuator("("),
        punctuator(")")), between(punctuator("{"), punctuator("}"), functionBody)), (function(loc,
        body) {
        return new(ast_expression.FunctionExpression)(loc, null, [], body);
    }))));
    var getterProperty = parse.label("Getter Property", nodea(parse.enumeration(propertyGetterKey,
        propertyGetInitializer), ast_value.ObjectGetter.create)),
        propertySetterKey = parse.label("Property Setter Key", parse.next(token.identifier("set"), propertyName));
    (propertySetInitializer = parse.label("Property Set Initializer", nodea(parse.enumeration(between(
        punctuator("("), punctuator(")"), propertySetParameterList), between(punctuator("{"),
        punctuator("}"), functionBody)), (function(loc, params, body) {
        return new(ast_expression.FunctionExpression)(loc, null, params, body);
    }))));
    var setterProperty = parse.label("Setter Property", nodea(parse.enumeration(propertySetterKey,
        propertySetInitializer), ast_value.ObjectSetter.create));
    (propertyInitializer = parse.label("Property Initializer", choice(valueProperty, getterProperty,
        setterProperty)));
    (propertyList = parse.label("Property List", sepEndBy(punctuator(","), propertyInitializer)));
    (objectLiteral = parse.label("Object Literal", node(between(punctuator("{"), punctuator("}"), eager(
        propertyList)), ast_expression.ObjectExpression.create)));
    (thisExpression = parse.label("This Expression", node(keyword("this"), ast_expression.ThisExpression.create)));
    (primaryExpression = parse.memo(parse.label("Primary Expression", choice(functionExpression, thisExpression,
        value.identifier, value.literal, arrayLiteral, objectLiteral, between(punctuator("("),
            punctuator(")"), expression)))));
    (argumentList = parse.label("Argument List", sepBy(punctuator(","), parse.expected("assignment expression",
        assignmentExpression))));
    (args = parse.label("Arguments", node(between(punctuator("("), punctuator(")"), eager(argumentList)), (
        function(loc, args0) {
            (args0.loc = loc);
            return args0;
        }))));
    (dotAccessor = parse.label("Dot Accessor", node(parse.next(punctuator("."), value.identifier), (function(
        loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": false
        });
    }))));
    (bracketAccessor = parse.label("Bracket Accessor", node(between(punctuator("["), punctuator("]"), parse.expected(
        "expression", expression)), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": true
        });
    }))));
    (accessor = parse.label("Accessor", either(dotAccessor, bracketAccessor)));
    var reducer = (function(p, c) {
        return ast_expression.MemberExpression.create(position.SourceLocation.merge(p.loc, c.loc), p, c.property,
            c.computed);
    });
    (memberExpression = parse.memo(parse.label("Member Expression", parse.binds(parse.enumeration(either(
        newExpression, primaryExpression), parse.many(accessor)), (function(expression0, props) {
        return parse.always(stream.foldl(reducer, expression0, props));
    })))));
    (newExpression = parse.memo(parse.label("New Expression", nodea(parse.next(keyword("new"), parse.enumeration(
            parse.expected("member expression", memberExpression), parse.optional([], args))),
        ast_expression.NewExpression.create))));
    var reducer0 = (function(p, c) {
        var loc = (c.loc ? position.SourceLocation.merge(p.loc, c.loc) : p.loc);
        return (c.hasOwnProperty("property") ? ast_expression.MemberExpression.create(loc, p, c.property, c
            .computed) : ast_expression.CallExpression.create(loc, p, c));
    });
    (leftHandSideExpression = parse.memo(parse.label("Left Hand Side Expression", parse.binds(parse.enumeration(
        memberExpression, parse.many(either(args, accessor))), (function(member, accessors) {
        return parse.always(stream.foldl(reducer0, member, accessors));
    })))));
    (postfixOperator = parse.label("Postfix Operator", punctuator("++", "--")));
    (postfixExpression = parse.label("Postfix Expression", nodea(parse.enumeration(leftHandSideExpression,
        parse.optional(postfixOperator)), (function(loc, argument, op) {
        return ((!op) ? argument : ast_expression.UpdateExpression.create(position.SourceLocation
            .merge(argument.loc, op.loc), op.value, argument, false));
    }))));
    (unaryOperator = parse.label("Unary Operator", either(keyword("delete", "void", "typeof"), punctuator("++",
        "--", "+", "-", "~", "!"))));
    var reducer1 = (function(argument, op) {
        var loc = position.SourceLocation.merge(op.loc, argument.loc);
        return (((op.value === "++") || (op.value === "--")) ? new(ast_expression.UpdateExpression)(loc, op
            .value, argument, true) : new(ast_expression.UnaryExpression)(loc, op.value, argument));
    });
    (unaryExpression = parse.label("Unary Expression", parse.binds(parse.enumeration(parse.many(unaryOperator),
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
    (binaryExpression = parse.label("Binary Expression", precedence(unaryExpression, precedenceTable)));
    (binaryExpressionNoIn = parse.label("Binary Expression", precedence(unaryExpression, precedenceTableNoIn)));
    var binExpr, assignExpr;
    (conditionalExpression = parse.label("Conditional Expression", ((binExpr = binaryExpression), (assignExpr =
        parse.expected("assignment expression", assignmentExpression)), either(nodea(parse.enumeration(
        parse.attempt(then(parse.memo(binExpr), punctuator("?"))), then(assignExpr,
            punctuator(":")), assignExpr), ast_expression.ConditionalExpression.create), parse.memo(
        binExpr)))));
    var binExpr0, assignExpr0;
    (conditionalExpressionNoIn = parse.label("Conditional Expression No In", ((binExpr0 = binaryExpressionNoIn), (
            assignExpr0 = parse.expected("assignment expression no in", assignmentExpressionNoIn)),
        either(nodea(parse.enumeration(parse.attempt(then(parse.memo(binExpr0), punctuator("?"))), then(
                assignExpr0, punctuator(":")), assignExpr0), ast_expression.ConditionalExpression.create),
            parse.memo(binExpr0)))));
    (assignmentOperator = parse.label("Assignment Operator", punctuator("=", "*=", "*=", "/=", "%=", "+=", "-=",
        "<<=", ">>=", ">>>=", "&=", "^=", "|=")));
    var condExpr;
    (assignmentExpression = parse.label("Assignment Expression", ((condExpr = conditionalExpression), parse.rec(
        (function(self) {
            return either(parse.binds(parse.attempt(parse.enumeration(leftHandSideExpression,
                assignmentOperator)), (function(left, operator) {
                return parse.bind(parse.expected("assignment expression", self), (
                    function(right) {
                        return parse.always(ast_expression.AssignmentExpression
                            .create(position.SourceLocation.merge(left.loc,
                                right.loc), operator.value, left, right));
                    }));
            })), condExpr);
        })))));
    var condExpr0;
    (assignmentExpressionNoIn = parse.label("Assignment Expression No In", ((condExpr0 =
        conditionalExpressionNoIn), parse.rec((function(self) {
        return either(parse.binds(parse.attempt(parse.enumeration(leftHandSideExpression,
            assignmentOperator)), (function(left, operator) {
            return parse.bind(parse.expected("assignment expression", self), (
                function(right) {
                    return parse.always(ast_expression.AssignmentExpression
                        .create(position.SourceLocation.merge(left.loc,
                            right.loc), operator.value, left, right));
                }));
        })), condExpr0);
    })))));
    var expr;
    (expression = parse.label("Expression", ((expr = parse.expected("expression", assignmentExpression)), node(
        eager(sepBy1(punctuator(","), expr)), (function(loc, list) {
            return ((list.length > 1) ? new(ast_expression.SequenceExpression)(loc, list) :
                list[0]);
        })))));
    var expr0;
    (expressionNoIn = parse.label("Expression No In", ((expr0 = parse.expected("expression no in",
        assignmentExpressionNoIn)), node(eager(sepBy1(punctuator(","), expr0)), (function(loc, list) {
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