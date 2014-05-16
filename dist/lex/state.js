/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/state.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream"], (function(require, exports, __o, __o0) {
    "use strict";
    var State, ParserState = __o["ParserState"],
        Parser = __o["Parser"],
        rest = __o0["rest"];
    (State = (function(input, pos, prevTok) {
        var self = this;
        ParserState.call(self, input, pos);
        (self.prevTok = prevTok);
    }));
    (State.prototype = new(ParserState)());
    (State.prototype.next = (function(tok, s) {
        var self = this;
        if ((!self._next)) {
            var s0 = new(State)(rest(self.input), self.position.increment(tok, s0), self.prevTok);
            (self._next = new(Parser)((function(_, m, cok) {
                return cok(tok, s0, m);
            })));
        }
        return self._next;
    }));
    (State.prototype.consume = (function(tok) {
        var self = this;
        switch (tok.type) {
            case "Comment":
            case "Whitespace":
            case "LineTerminator":
                return self;
            default:
                return new(State)(self.input, self.position, tok);
        }
    }));
    return State;
}));