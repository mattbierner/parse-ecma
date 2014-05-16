/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/position.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream", "ecma-ast/position"], (function(require, exports, __o,
    __o0, __o1) {
    "use strict";
    var ParserPosition, Position = __o["Position"],
        isEmpty = __o0["isEmpty"],
        first = __o0["first"],
        SourcePosition = __o1["SourcePosition"];
    (ParserPosition = (function(tokenPosition, sourcePosition, prevEnd) {
        var self = this;
        (self.tokenPosition = tokenPosition);
        (self.sourcePosition = sourcePosition);
        (self.prevEnd = prevEnd);
    }));
    (ParserPosition.initial = new(ParserPosition)(Position.initial, SourcePosition.initial, Position.initial));
    (ParserPosition.prototype.increment = (function(tok, r) {
        var self = this;
        return new(ParserPosition)(self.tokenPosition.increment(tok), (isEmpty(r) ? tok.loc.end : first(
                r)
            .loc.start), tok.loc.end);
    }));
    (ParserPosition.prototype.toString = (function() {
        var self = this;
        return ("" + self.sourcePosition);
    }));
    (ParserPosition.prototype.compare = (function(pos) {
        var self = this;
        return self.tokenPosition.compare(pos.tokenPosition);
    }));
    return ParserPosition;
}));