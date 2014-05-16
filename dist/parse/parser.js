/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream", "ecma-ast/node", "ecma-ast/token", "ecma-ast/position",
    "../lex/lexer", "./position", "./program_parser"
], (function(require, exports, __o, stream, __o0, __o1, __o2, lexer, Position, program) {
    "use strict";
    var parseStream, parse, runState = __o["runState"],
        ParserState = __o["ParserState"],
        first = stream["first"],
        rest = stream["rest"],
        isEmpty = stream["isEmpty"],
        filter = stream["filter"],
        setData = __o0["setData"],
        LineTerminatorToken = __o1["LineTerminatorToken"],
        whitespaceFilter, commentFilter, x, y, x0, y0, langElementStream = ((whitespaceFilter = (function(z) {
            var y = z.type;
            return ("Whitespace" !== y);
        })), (commentFilter = (function(x) {
            if ((x.type === "Comment")) {
                return ((x.value.indexOf("\n") >= 0) ? stream.cons(new(LineTerminatorToken)(x.loc,
                    "\n"), stream.end) : stream.end);
            }
            return stream.cons(x, stream.end);
        })), (x = filter.bind(null, whitespaceFilter)), (y = stream.bind.bind(null, commentFilter)), (
            function(z) {
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
            return stream.memoStream(x0, lineTerminatorStream.bind(null, xs));
        }),
        parserStream = ((x0 = langElementStream), (y0 = lineTerminatorStream), (function(z) {
            return y0(x0(z));
        }));
    (parseStream = (function(s, file) {
        return runState(program.program, new(ParserState)(parserStream(lexer.lexStream(s)), Position.initial));
    }));
    (parse = (function(input, file) {
        return parseStream(stream.from(input), file);
    }));
    (exports["parseStream"] = parseStream);
    (exports["parse"] = parse);
}));