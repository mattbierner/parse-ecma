/**
 * @fileOverview 
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'ecma/lex/lexer',
        'ecma_ast/token',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexer,
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
 * Lexer for a top level element in division contexts.
 */
var inputElementDiv = parse.rec(function(self) {
    return parse.choice(
        parse.next(parse.eof, parse.always(null)),
        parse.bind(parse.expected("comment", lexer.comment), function(x){
            return (x.value.indexOf('\n') !== -1 ?
                parse.bind(parse.next(parse.many(lexer.lineTerminator), self), function(x) {
                    return parse.always(!x ? null :Object.create(x, {
                        'loc': {
                            'value': x.loc
                        },
                        'value': {
                            'value': x.value
                        },
                        'lineTerminator': {
                            'value': true
                        }
                    }) )}) :
                self);
        }),
        parse.next(parse.expected("whitespace", lexer.whitespace), self),
        parse.expected("line terminator", parse.bind(parse.next(parse.many1(lexer.lineTerminator), self), function(x) {
            return parse.always(!x ? null: Object.create(x, {
                'loc': {
                    'value': x.loc
                },
                'value': {
                    'value': x.value
                },
                'lineTerminator': {
                    'value': true
                }
            }));
        })),
        lexer.tokenDiv);
});

var inputElementRegExp = parse.rec(function(self) {
    return parse.choice(
        parse.next(parse.eof, parse.always(null)),
        parse.bind(parse.expected("comment", lexer.comment), function(x){
            return (x.value.indexOf('\n') !== -1 ?
                parse.bind(parse.next(parse.many(lexer.lineTerminator), self), function(x) {
                    return parse.always(!x ? null :Object.create(x, {
                        'loc': {
                            'value': x.loc
                        },
                        'value': {
                            'value': x.value
                        },
                        'lineTerminator': {
                            'value': true
                        }
                    }) )}) :
                self);
        }),
        parse.next(parse.expected("whitespace", lexer.whitespace), self),
        parse.expected("line terminator", parse.bind(parse.next(parse.many1(lexer.lineTerminator), self), function(x) {
            return parse.always(!x ? null: Object.create(x, {
                'loc': {
                    'value': x.loc
                },
                'value': {
                    'value': x.value
                },
                'lineTerminator': {
                    'value': true
                }
            }));
        })),
        lexer.tokenRegExp);
});


/* State
 ******************************************************************************/
var createNextDivState = function(input, loc, ok, err) {
    return parse.perform(
        inputElementDiv,
        new parse.ParserState(input, loc.end),
        function(x, state) {
            return ok(new ParserState(x, state.input, input, false, x === null, state.position, loc.end));
        },
        function(x, state) {
            return err(new ParserState(x, state.input, input, false, true, state.position, loc.end));
        });
};

var createNextRegExpState = function(input, loc, ok, err) {
    return parse.perform(
        inputElementRegExp,
        new parse.ParserState(input, loc.end),
        function(x, state) {
            return ok(new ParserState(x, state.input, input, false, x === null, state.position, loc.end));
        },
        function(x, state) {
            return err(new ParserState(x, state.input, input, false, true, state.position, loc.end));
        });
};

/* State
 ******************************************************************************/
// ParserState
////////////////////////////////////////
/**
 * State for an ECMAScript parser.
 * 
 */
var ParserState = function(first, rest, input, error, isEmpty, pos, prevEnd) {
    parse.ParserState.call(this, input, pos);
    this._first = first;
    this._rest = rest;
    this._error = error;
    this._isEmpty = isEmpty;
    this._prevEnd = prevEnd;
};
ParserState.prototype = new parse.ParserState;


ParserState.prototype.isEmpty = function() {
    return this._isEmpty;
};

ParserState.prototype.first = function() {
    return this._first;
};

ParserState.prototype.next = function(tok) {
    if (!this._next) {
        this._next = createNextRegExpState(this._rest, this.loc, function(x) { return x; }, function(x) { return x; });
    }
    return this._next;
};

ParserState.prototype.asDiv = function(tok) {
    if (!this._as) {
        this._as = createNextDivState(this.input, new position.SourceLocation(position.SourcePosition.initial, this._prevEnd), function(x) { return x; }, function(x) { return x; });
    }
    return this._as;
};

Object.defineProperty(ParserState.prototype, 'loc', {
    'get': function() {
        return (this.isEmpty() ?
            new position.SourceLocation(this._prevEnd, this._prevEnd) :
            this.first().loc);
    }
});

/* Running
 ******************************************************************************/
/**
 * Parses a lex stream into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param state Parsing state..
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
 * @param s Stream of characters.
 * 
 * @return AST.
 */
var parseStream = function(s) {
    return parseState(
        createNextDivState(
            s,
            new position.SourceLocation(position.SourcePosition.initial, position.SourcePosition.initial),
            function(state) {
                return state;
            },
            function(x) {
                debugger;
                throw x;
            }));
};

/**
 * Parses a lex array into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param input Array like object of characters.
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