/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/token_parser.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    punctuator, keyword, identifier, anyIdentifier, nullLiteral, booleanLiteral, numericLiteral, stringLiteral,
        regularExpressionLiteral, ExpectError = __o["ExpectError"],
    token = __o["token"],
    indexOf = Function.prototype.call.bind(Array.prototype.indexOf),
    join = Function.prototype.call.bind(Array.prototype.join),
    expectError = (function(msg) {
        return (function(pos, tok) {
            return new(ExpectError)(pos, msg, (tok ? tok.value : "end of input"));
        });
    });
(punctuator = (function() {
    var options = arguments;
    return token((function(tok) {
        return ((tok.type === "Punctuator") && (indexOf(options, tok.value) >= 0));
    }), expectError(join(options, ", ")));
}));
(keyword = (function() {
    var options = arguments;
    return token((function(tok) {
        return ((tok.type === "Keyword") && (indexOf(options, tok.value) >= 0));
    }), expectError(join(options, ", ")));
}));
(anyIdentifier = token((function(tok) {
    return (tok.type === "Identifier");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "any identifier", (tok ? tok.value : "end of input"));
})));
(identifier = (function() {
    var options = arguments;
    return token((function(tok) {
        return ((tok.type === "Identifier") && (indexOf(options, tok.value) >= 0));
    }), expectError(join(options, ", ")));
}));
(nullLiteral = token((function(tok) {
    return (tok.type === "Null");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "Null literal", (tok ? tok.value : "end of input"));
})));
(booleanLiteral = token((function(tok) {
    return (tok.type === "Boolean");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "boolean literal", (tok ? tok.value : "end of input"));
})));
(numericLiteral = token((function(tok) {
    return (tok.type === "Number");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "numeric literal", (tok ? tok.value : "end of input"));
})));
(stringLiteral = token((function(tok) {
    return (tok.type === "String");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "string literal", (tok ? tok.value : "end of input"));
})));
(regularExpressionLiteral = token((function(tok) {
    return (tok.type === "RegularExpression");
}), (function(pos, tok) {
    return new(ExpectError)(pos, "regular expression literal", (tok ? tok.value : "end of input"));
})));
(exports["punctuator"] = punctuator);
(exports["keyword"] = keyword);
(exports["identifier"] = identifier);
(exports["anyIdentifier"] = anyIdentifier);
(exports["nullLiteral"] = nullLiteral);
(exports["booleanLiteral"] = booleanLiteral);
(exports["numericLiteral"] = numericLiteral);
(exports["stringLiteral"] = stringLiteral);
(exports["regularExpressionLiteral"] = regularExpressionLiteral);