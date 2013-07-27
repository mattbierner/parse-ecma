/**
 * @fileOverview 
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'ecma_ast/token',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexToken,
        program){
"use strict";

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
    
    var commentFilter = function(x) {
        if (x.type === 'Comment') {
            return (x.value.indexOf('\n') !== -1 ?
                stream.cons(new lexToken.LineTerminatorToken(x.loc, '\n'), stream.end) :
                stream.end);
        }
        return stream.cons(x, stream.end);
    };
    
    return function(s) {
        return stream.bind(commentFilter, stream.filter(whitespaceFilter, s));
    };
}());

/**
 * Filters lex stream to remove line terminators and note tokens following
 * a line terminator.
 */
var lineTerminatorStream = function(s) {
    if (stream.isEmpty(s))
        return s;
    
    var first = stream.first(s), rest = stream.rest(s);
    
    if (first.type === 'LineTerminator') {
        while (first.type === 'LineTerminator') {
            if (stream.isEmpty(rest))
                return rest;
            first = stream.first(rest)
            rest = stream.rest(rest);
        }
        first = Object.create(first, {
            'loc': {
                'value': first.loc
            },
            'value': {
                'value': first.value
            },
            'lineTerminator': {
                'value': true
            }
        });
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
/**
 * Position in an ECMAScript parser.
 * 
 * Tracks position in lex stream and source positions.
 */
var ParserPosition = function(tokenPosition, sourcePosition) {
    this.tokenPosition = tokenPosition;
    this.sourcePosition = sourcePosition;
};
ParserPosition.prototype = new parse.Position;
ParserPosition.prototype.constructor = ParserPosition;

ParserPosition.initial = new ParserPosition(
    parse.Position.initial,
    position.SourcePosition.initial);

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
/**
 * State for an ECMAScript parsers.
 * 
 */
var ParserState = function(stream, pos, prevEnd) {
    parse.ParserState.call(this, stream, pos);
    this._prevEnd = prevEnd;
};
ParserState.prototype = new parse.ParserState;

ParserState.prototype.next = function(tok) {
    if (!this._next) {
        var rest = stream.rest(this.input);
        var end = (stream.isEmpty(rest) ? tok.loc.end : stream.first(rest).loc.start);
        this._next = new ParserState(rest, this.position.increment(tok, end), this.loc.end);
    }
    return this._next;
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
var parseState = function(state) {
    return parse.runState(program.program, state);
};

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
    return parseState(new ParserState(
        parserStream(s),
        ParserPosition.initial,
        position.SourcePosition.initial));
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

// running
    'parseState': parseState,
    'parseStream': parseStream,
    'parse': parseInput,

};

});