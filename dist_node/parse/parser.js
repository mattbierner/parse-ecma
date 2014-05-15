/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    stream = require("nu-stream")["stream"],
    position = require("ecma-ast")["position"],
    lexToken = require("ecma-ast")["token"],
    lexer = require("../lex/lexer"),
    program = require("./program_parser"),
    labelState, parseStream, parse, always = __o["always"],
    bind = __o["bind"],
    eof = __o["eof"],
    choice = __o["choice"],
    rec = __o["rec"],
    runState = __o["runState"],
    parseState = __o["parseState"],
    expected = __o["expected"],
    next = __o["next"],
    setlabelState = __o["setlabelState"],
    many = __o["many"],
    never = __o["never"],
    BennulabelState = __o["labelState"],
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
            var onLineTerminator = bind(next(many(lexer.lineTerminator), self), followLineTerminator);
            return expected("token, comment, or whitespace", choice(eof, bind(lexer.comment, (function(x) {
                return ((x.value.indexOf("\n") >= 0) ? onLineTerminator : self);
            })), next(lexer.whitespace, self), next(lexer.lineTerminator, onLineTerminator), token));
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
    return parseState(inputElementRegExp, new(BennulabelState)(input, pos), (function(x, state) {
        return ok(new(labelState)(file, ((x === null) ? stream.end : input), new(Position)(state.position,
            pos), x, state.input));
    }), err);
});
(labelState = (function(file, input, pos, first, rest) {
    var self = this;
    BennulabelState.call(self, input, pos);
    (self.file = file);
    (self._first = first);
    (self._rest = rest);
}));
(labelState.prototype = new(BennulabelState)());
Object.defineProperty(labelState.prototype, "loc", ({
    "get": (function() {
        var self = this;
        return (self.isEmpty() ? new(position.SourceLocation)(self.file, self.position.previousEnd, self.position
            .previousEnd) : self._first.loc);
    })
}));
(labelState.prototype.first = (function() {
    var self = this;
    return self._first;
}));
(labelState.prototype.setInput = (function(input) {
    var self = this;
    return new(labelState)(self.file, input, self.pos, self._first, self._rest);
}));
(labelState.prototype.next = (function(tok) {
    var self = this;
    if ((!self._next)) {
        var end = (self.loc ? self.loc.end : self.position.previousEnd);
        (self._next = parseState(inputElementDiv, new(BennulabelState)(self._rest, end, self.file), (function(x,
            state) {
            var s = new(labelState)(self.file, ((x === null) ? stream.end : self._rest), self.position
                .next(state.position), x, state.input);
            return (function(_, m, cok) {
                return cok(tok, s, m);
            });
        }), never));
    }
    return self._next;
}));
(labelState.prototype.asRegExp = (function(tok) {
    var self = this;
    if ((!self._as)) {
        (self._as = createNextRegExpState(self.file, self.input, self.position.previousEnd, setlabelState,
            never));
    }
    return self._as;
}));
(parseStream = (function(s, file) {
    return runState(next(new(labelState)(file, s, new(Position)(position.SourcePosition.initial, position.SourcePosition
            .initial), ({}), s)
        .next(null), program.program), new(BennulabelState)());
}));
(parse = (function(input, file) {
    return parseStream(stream.from(input), file);
}));
(exports["labelState"] = labelState);
(exports["parseStream"] = parseStream);
(exports["parse"] = parse);