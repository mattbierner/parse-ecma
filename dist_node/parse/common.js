/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/common.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    lang = require("bennu")["lang"],
    position = require("ecma-ast")["position"],
    __o = require("nu-stream")["stream"],
    token = require("./token_parser"),
    precedence, node, nodea, extract = parse["extract"],
    cons = __o["cons"],
    toArray = __o["toArray"],
    NIL = __o["NIL"];
(precedence = (function(p, table) {
    var punts = Object.keys(table)
        .reduce((function(p0, c) {
            return ((table[c].type === "punctuator") ? p0.concat(c) : p0);
        }), []),
        kws = Object.keys(table)
            .reduce((function(p0, c) {
                return ((table[c].type === "keyword") ? p0.concat(c) : p0);
            }), []),
        lookup = (function(x) {
            if ((!((x.type === "Punctuator") || (x.type === "Keyword")))) return x;
            var item = table[x.value];
            return ({
                "value": x.value,
                "node": item.node,
                "precedence": item.precedence
            });
        }),
        sep = parse.either(token.punctuator.apply(undefined, punts), token.keyword.apply(undefined, kws));
    return parse.bind(parse.rec((function(self) {
        return parse.cons(p, parse.optional(NIL, parse.cons(sep, parse.expected("binary expression",
            self))));
    })), (function(x) {
        var list = toArray(x),
            stack = [],
            out = [];
        while ((list.length > 0)) {
            var tok = lookup(list.shift());
            if (tok.type) {
                out.push(tok);
            } else {
                while ((stack.length > 0)) {
                    var o2 = stack[(stack.length - 1)];
                    if ((o2.precedence <= tok.precedence)) {
                        stack.pop();
                        var rt = out.pop(),
                            lf = out.pop();
                        out.push(new(o2.node)(position.SourceLocation.merge(lf.loc, rt.loc), o2.value,
                            lf, rt));
                    } else {
                        break;
                    }
                }
                stack.push(tok);
            }
        }
        while ((stack.length > 0)) {
            var o = stack.pop(),
                rt0 = out.pop(),
                lf0 = out.pop();
            out.push(new(o.node)(position.SourceLocation.merge(lf0.loc, rt0.loc), o.value, lf0, rt0));
        }
        return parse.always(out.pop());
    }));
}));
var positionParser = extract((function(__o0) {
    var position0 = __o0["position"];
    return position0.sourcePosition;
})),
    prevEnd = extract((function(__o0) {
        var position0 = __o0["position"];
        return position0.prevEnd;
    }));
(node = (function(p, f) {
    return parse.binds(parse.enumeration(positionParser, p, prevEnd), (function(o, x, c) {
        return parse.always(f(new(position.SourceLocation)(o, c, o.file), x));
    }));
}));
(nodea = (function(p, f) {
    return parse.binds(parse.enumeration(positionParser, p, prevEnd), (function(o, x, c) {
        return parse.always(f.apply(undefined, toArray(cons(new(position.SourceLocation)(o, c, o.file),
            x))));
    }));
}));
(exports["precedence"] = precedence);
(exports["node"] = node);
(exports["nodea"] = nodea);