/**
 * @fileOverview
 */
define(['parse/parse',
        'stream/stream',
        'ecma/position',
        'ecma/lex/token',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexToken,
        program){
//"use strict";

/* Streams
 ******************************************************************************/
/**
 * Filters lex stream to remove whitespace and comments.
 * 
 * TODO: better line terminator check
 */
var langElementStream = (function(){
    var whitespaceFilter = function(x) {
        return (x.type !== 'Whitespace');
    };
    
    var commentFilter = function(s) {
        if (stream.isEmpty(s)) {
            return s;
        }
        var first = stream.first(s),
            rest = stream.rest(s);
        if (first.type === 'Comment') {
            return (first.value.indexOf('\n') !== -1 ?
                stream.cons(new lexToken.LineTerminatorToken(first.loc, '\n'), commentFilter(rest)) :
                commentFilter(rest));
        }
        return stream.memoStream(first, commentFilter.bind(undefined, rest));
    };
    
    return function(s) {
        return commentFilter(stream.filter(s, whitespaceFilter));
    };
}());

/**
 * Filters lex stream to remove line terminators and note tokens following
 * a line terminator.
 */
var lineTerminatorStream = function(s) {
    if (stream.isEmpty(s)) {
        return s;
    }
    
    var first = stream.first(s), rest = stream.rest(s);
    
    if (first.type === 'LineTerminator') {
        while (first.type === 'LineTerminator') {
            if (stream.isEmpty(rest)) {
                return rest;
            } else {
                first = stream.first(rest)
                rest = stream.rest(rest);
            }
        }
        var tok = new lexToken.Token(first.loc, first.value);
        tok.type = first.type;
        tok.lineTerminator = true;
        
        first = tok;
    }
    return stream.memoStream(first, lineTerminatorStream.bind(undefined, rest));
};


/**
 * Maps a lex stream to a parse stream.
 * 
 * @param s Stream of tokens.
 * 
 * @return Stream suitable for parsing.
 */
var parserStream = function(s) {
    return lineTerminatorStream(langElementStream(s));
};

/* Position
 ******************************************************************************/
var ParserPosition = function(tokenPosition, sourcePosition) {
    this.tokenPosition = tokenPosition;
    this.sourcePosition = sourcePosition;
};

ParserPosition.prototype.increment = function(tok, end) {
    return new ParserPosition(this.tokenPosition.increment(tok), end);
};

ParserPosition.prototype.toString = function() {
    return '' + this.sourcePosition;
};

ParserPosition.prototype.compare = function(pos) {
    return this.tokenPosition.compare(pos.tokenPosition);
};

/* State
 ******************************************************************************/
var ParserState = function(stream, pos, prevEnd) {
    parse.InputState.call(this, stream, pos);
    this._prevEnd = prevEnd;
};
ParserState.prototype = new parse.InputState;

ParserState.prototype.next = function(tok) {
    var rest = stream.rest(this.input);
    var end = (stream.isEmpty(rest) ? tok.loc.end : stream.first(rest).loc.start);
    return (this._next ||
        (this._next = new ParserState(rest, this.pos.increment(tok, end), this.loc.end)));
};

Object.defineProperty(ParserState.prototype, 'loc', {
    'get': function() {
        return (stream.isEmpty(this.input) ?
            new position.SourceLocation(this._prevEnd, this._prevEnd) :
            stream.first(this.input).loc);
    }
});

/* Running
 ******************************************************************************/
/**
 * Parses a lex stream into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param s Stream of tokens.
 * 
 * @return AST.
 */
var parseStream = function(s) {
    var state = new ParserState(
        parserStream(s),
        new ParserPosition(new parse.Position(0), new position.SourcePosition(0, 0)),
        new position.SourcePosition(0, 0));
    return parse.runState(program.program, state);
};

/**
 * Parses a lex array into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param input Array like object of tokens.
 * 
 * @return AST.
 */
var parseInput = function(input, ast) {
    return parseStream(stream.from(input), ast);
};

/* Export
 ******************************************************************************/
return {
    'parserStream': parserStream,
    
    'ParserPosition': ParserPosition,
    'ParserState': ParserState,
    
    'parse': parseInput,
    'parseStream': parseStream
};

});