/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream", "ecma-ast/position", "ecma-ast/token", "../lex/lexer",
    "./program_parser"
], (function(require, exports, __o, stream, position, lexToken, lexer, program) {
    "use strict";
    var ParserState, parseStream, parse, always = __o["always"],
        bind = __o["bind"],
        eof = __o["eof"],
        choice = __o["choice"],
        rec = __o["rec"],
        runState = __o["runState"],
        parseState = __o["parseState"],
        expected = __o["expected"],
        next = __o["next"],
        setParserState = __o["setParserState"],
        many = __o["many"],
        never = __o["never"],
        Parser = __o["Parser"],
        BennuParserState = __o["ParserState"],
        tokenizer = (function(token) {
            var followLineTerminator = (function(x) {
                return always(((!x) ? null : Object.create(x, ({
                    "loc": ({
                        "value": x.loc
                    }),
                    "value": ({
                        "value": x.value
                    }),
                    "lineTerminator": ({
                        "value": true
                    })
                }))));
            });
            return rec((function(self) {
                var onLineTerminator = bind(next(many(lexer.lineTerminator), self),
                    followLineTerminator);
                return expected("token, comment, or whitespace", choice(eof, bind(lexer.comment, (
                    function(x) {
                        return ((x.value.indexOf("\n") >= 0) ? onLineTerminator : self);
                    })), next(lexer.whitespace, self), next(lexer.lineTerminator,
                    onLineTerminator), token));
            }));
        }),
        inputElementDiv = tokenizer(lexer.tokenDiv),
        inputElementRegExp = tokenizer(lexer.tokenRegExp),
        Position = (function(position0, previousEnd) {
            var self = this;
            (self.position = position0);
            (self.previousEnd = previousEnd);
        });
    (Position.prototype.increment = (function(tok) {
        var self = this;
        return new(Position)(tok.loc, self.position);
    }));
    (Position.prototype.compare = (function(pos) {
        var self = this;
        return self.position.compare(pos.position);
    }));
    (Position.prototype.next = (function(position0) {
        var self = this;
        return new(Position)(position0, self.position);
    }));
    var createNextRegExpState = (function(file, input, pos, ok, err) {
        return parseState(inputElementRegExp, new(BennuParserState)(input, pos), (function(x, state) {
            return ok(new(ParserState)(file, ((x === null) ? stream.end : input), new(Position)(
                state.position, pos), x, state.input));
        }), err);
    });
    (ParserState = (function(file, input, pos, first, rest) {
        var self = this;
        BennuParserState.call(self, input, pos);
        (self.file = file);
        (self._first = first);
        (self._rest = rest);
    }));
    (ParserState.prototype = new(BennuParserState)());
    Object.defineProperty(ParserState.prototype, "loc", ({
        "get": (function() {
            var self = this;
            return (self.isEmpty() ? new(position.SourceLocation)(self.file, self.position.previousEnd,
                self.position.previousEnd) : self._first.loc);
        })
    }));
    (ParserState.prototype.first = (function() {
        var self = this;
        return self._first;
    }));
    (ParserState.prototype.setInput = (function(input) {
        var self = this;
        return new(ParserState)(self.file, input, self.pos, self._first, self._rest);
    }));
    (ParserState.prototype.next = (function(tok) {
        var self = this;
        if ((!self._next)) {
            var end = (self.loc ? self.loc.end : self.position.previousEnd);
            (self._next = parseState(inputElementDiv, new(BennuParserState)(self._rest, end, self.file), (
                function(x, state) {
                    var s = new(ParserState)(self.file, ((x === null) ? stream.end : self._rest),
                        self.position.next(state.position), x, state.input);
                    return new(Parser)((function(_, m, cok) {
                        return cok(tok, s, m);
                    }));
                }), never));
        }
        return self._next;
    }));
    (ParserState.prototype.asRegExp = (function(tok) {
        var self = this;
        if ((!self._as)) {
            (self._as = createNextRegExpState(self.file, self.input, self.position.previousEnd,
                setParserState, never));
        }
        return self._as;
    }));
    (parseStream = (function(s, file) {
        return runState(next(new(ParserState)(file, s, new(Position)(position.SourcePosition.initial,
                position.SourcePosition.initial), ({}), s)
            .next(null), program.program), new(BennuParserState)());
    }));
    (parse = (function(input, file) {
        return parseStream(stream.from(input), file);
    }));
    (exports["ParserState"] = ParserState);
    (exports["parseStream"] = parseStream);
    (exports["parse"] = parse);
}));