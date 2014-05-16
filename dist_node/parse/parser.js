/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    stream = require("nu-stream")["stream"],
    lexToken = require("ecma-ast")["token"],
    __o0 = require("ecma-ast")["position"],
    lexer = require("../lex/lexer"),
    program = require("./program_parser"),
    ParserState, parseStream, parse, runState = __o["runState"],
    Parser = __o["Parser"],
    Position = __o["Position"],
    BennuParserState = __o["ParserState"],
    SourcePosition = __o0["SourcePosition"],
    SourceLocation = __o0["SourceLocation"],
    whitespaceFilter, commentFilter, x, y, x0, y0, langElementStream = ((whitespaceFilter = (function(z) {
        var y = z.type;
        return ("Whitespace" !== y);
    })), (commentFilter = (function(x) {
        if ((x.type === "Comment")) {
            return ((x.value.indexOf("\n") >= 0) ? stream.cons(new(lexToken.LineTerminatorToken)(x.loc,
                "\n"), stream.end) : stream.end);
        }
        return stream.cons(x, stream.end);
    })), (x = stream.filter.bind(null, whitespaceFilter)), (y = stream.bind.bind(null, commentFilter)), (function(z) {
        return y(x(z));
    })),
    lineTerminatorStream = (function(s) {
        if (stream.isEmpty(s)) return s;
        var first = stream.first(s),
            rest = stream.rest(s);
        if ((first.type === "LineTerminator")) {
            while ((first.type === "LineTerminator")) {
                if (stream.isEmpty(rest)) return rest;
                (first = stream.first(rest));
                (rest = stream.rest(rest));
            }
            (first = Object.create(first, ({
                "loc": ({
                    "value": first.loc
                }),
                "value": ({
                    "value": first.value
                }),
                "lineTerminator": ({
                    "value": true
                })
            })));
        }
        return stream.memoStream(first, lineTerminatorStream.bind(undefined, rest));
    }),
    parserStream = ((x0 = langElementStream), (y0 = lineTerminatorStream), (function(z) {
        return y0(x0(z));
    })),
    ParserPosition = (function(tokenPosition, sourcePosition) {
        var self = this;
        (self.tokenPosition = tokenPosition);
        (self.sourcePosition = sourcePosition);
    });
(ParserPosition.initial = new(ParserPosition)(Position.initial, SourcePosition.initial));
(ParserPosition.prototype.increment = (function(tok, end) {
    var self = this;
    return new(ParserPosition)(self.tokenPosition.increment(tok), end);
}));
(ParserPosition.prototype.toString = (function() {
    var self = this;
    return ("" + self.sourcePosition);
}));
(ParserPosition.prototype.compare = (function(pos) {
    var self = this;
    return self.tokenPosition.compare(pos.tokenPosition);
}));
(ParserState = (function(stream0, pos, prevEnd) {
    var self = this;
    BennuParserState.call(self, stream0, pos);
    (self._prevEnd = prevEnd);
}));
(ParserState.prototype = new(BennuParserState)());
(ParserState.prototype.next = (function(tok) {
    var self = this;
    if ((!self._next)) {
        var rest = stream.rest(self.input),
            end = (stream.isEmpty(rest) ? tok.loc.end : stream.first(rest)
                .loc.start),
            s = new(ParserState)(rest, self.position.increment(tok, end), self.loc.end);
        (self._next = new(Parser)((function(_, m, cok) {
            return cok(tok, s, m);
        })));
    }
    return self._next;
}));
Object.defineProperty(ParserState.prototype, "loc", ({
    "get": (function() {
        var self = this;
        return (stream.isEmpty(self.input) ? new(SourceLocation)(self._prevEnd, self._prevEnd) : stream.first(
                self.input)
            .loc);
    })
}));
(parseStream = (function(s, file) {
    return runState(program.program, new(ParserState)(parserStream(lexer.lexStream(s)), ParserPosition.initial,
        SourcePosition.initial));
}));
(parse = (function(input, file) {
    return parseStream(stream.from(input), file);
}));
(exports["ParserState"] = ParserState);
(exports["parseStream"] = parseStream);
(exports["parse"] = parse);