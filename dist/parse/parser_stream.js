/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser_stream.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu-stream/stream", "ecma-ast/node", "ecma-ast/token"], (function(require, exports, __o,
    __o0, __o1) {
    "use strict";
    var parserStream, cons = __o["cons"],
        bind = __o["bind"],
        first = __o["first"],
        rest = __o["rest"],
        isEmpty = __o["isEmpty"],
        filter = __o["filter"],
        memoStream = __o["memoStream"],
        NIL = __o["NIL"],
        setData = __o0["setData"],
        LineTerminatorToken = __o1["LineTerminatorToken"],
        whitespaceFilter, commentFilter, x, y, langElementStream = ((whitespaceFilter = (function(z) {
            var y = z.type;
            return ("Whitespace" !== y);
        })), (commentFilter = (function(x) {
            if ((x.type === "Comment")) {
                return ((x.value.indexOf("\n") >= 0) ? cons(new(LineTerminatorToken)(x.loc, "\n"),
                    NIL) : NIL);
            }
            return cons(x, NIL);
        })), (x = filter.bind(null, whitespaceFilter)), (y = bind.bind(null, commentFilter)), (function(z) {
            return y(x(z));
        })),
        lineTerminatorStream = (function(s) {
            if (isEmpty(s)) return s;
            var x0 = first(s),
                xs = rest(s);
            if ((x0.type === "LineTerminator")) {
                while ((x0.type === "LineTerminator")) {
                    if (isEmpty(xs)) return xs;
                    (x0 = first(xs));
                    (xs = rest(xs));
                }
                (x0 = setData(x0, "lineTerminator", true));
            }
            return memoStream(x0, lineTerminatorStream.bind(null, xs));
        });
    (parserStream = (function(z) {
        return lineTerminatorStream(langElementStream(z));
    }));
    return parserStream;
}));