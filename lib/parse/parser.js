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
var tokenizer = function(token) {
    var followLineTerminator = function(x) {
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
        }));
    };
    
    return parse.rec(function(self){
        var onLineTerminator = parse.bind(parse.next(parse.many(lexer.lineTerminator), self), followLineTerminator);
        return parse.expected('token, comment, or whitespace', parse.choice(
            parse.next(parse.eof, parse.always(null)),
            parse.bind(
                lexer.comment,
                function(x){
                    return (x.value.indexOf('\n') !== -1 ?
                        onLineTerminator :
                        self);
                }),
            parse.next(lexer.whitespace, self),
            parse.next(lexer.lineTerminator, onLineTerminator),
            token));
    });
};

var inputElementDiv = tokenizer(lexer.tokenDiv);

var inputElementRegExp = tokenizer(lexer.tokenRegExp);


/* State
 ******************************************************************************/
var createNextRegExpState = function(input, pos, ok, err) {
    return parse.parseState(
        inputElementRegExp,
        new parse.ParserState(input, pos),
        function(x, state) {
            return ok(new ParserState(input, state.position, x, state.input, x === null, pos));
        },
        function(x, state) {
            return err(x);
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
var ParserState = function(input, pos, first, rest, isEmpty, prevEnd) {
    parse.ParserState.call(this, input, pos);
    this._first = first;
    this._rest = rest;
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
        var self = this;
        this._next = parse.parseState(
            inputElementDiv,
            new parse.ParserState(self._rest, self.loc.end),
            function(x, state) {
                var s = new ParserState(self._rest, state.position, x, state.input, x === null, self.loc.end);
                return function(_, m, cok) { return cok(tok, s, m); };
            },
            function(x, state) {
                return function(s, m, cok, cerr, eok, eerr) { return eerr(x, s, m); };
            });
    }
    return this._next;
};

ParserState.prototype.asRegExp = function(tok) {
    if (!this._as) {
        this._as = createNextRegExpState(
            this.input,
            this._prevEnd,
            function(s) {
                return parse.setParserState(s);
            },
            function(x) {
                return function(s, m, cok, cerr, eok, eerr) { return eerr(x, s, m); };
            });
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
        createNextRegExpState(
            s,
            position.SourcePosition.initial,
            function(state) {
                return state;
            },
            function(x) {
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