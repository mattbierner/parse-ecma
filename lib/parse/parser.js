/**
 * @fileOverview 
 */
define(['parse/parse',
        'nu/stream',
        'ecma_ast/position',
        'ecma_ast/token',
        'ecma/lex/lexer',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexToken,
        lexer,
        program){
"use strict";


/* State
 ******************************************************************************/
var tokenizer = function(token) {
    var followLineTerminator = function(x) {
        return parse.always(!x ? null : Object.create(x, {
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
        var onLineTerminator = parse.bind(
            parse.next(parse.many(lexer.lineTerminator), self),
            followLineTerminator);
        
        return parse.expected('token, comment, or whitespace', parse.choice(
            parse.eof,
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
var createNextRegExpState = function(file, input, pos, ok, err) {
    return parse.parseState(
        inputElementRegExp,
        new parse.ParserState(input, pos),
        function(x, state) {
            return ok(new ParserState(
                file,
                (x === null ? stream.end : input),
                new Position(state.position, pos),
                x,
                state.input));
        },
        err);
};

/* Position
 ******************************************************************************/
var Position = function(position, previousEnd) {
    this.position = position;
    this.previousEnd = previousEnd;
};
Position.prototype = new parse.Position;

Position.prototype.increment = function(tok) {
    return new Position(
        tok.loc,
        this.position);
};

Position.prototype.compare = function(pos) {
    return this.position.compare(pos.position);
};

Position.prototype.next = function(position) {
    return new Position(
        position,
        this.position);
};

/* State
 ******************************************************************************/
// ParserState
////////////////////////////////////////
/**
 * State for an ECMAScript parser.
 * 
 */
var ParserState = function(file, input, pos, first, rest) {
    parse.ParserState.call(this, input, pos);
    this.file = file;
    this._first = first;
    this._rest = rest;
};
ParserState.prototype = new parse.ParserState;

Object.defineProperty(ParserState.prototype, 'loc', {
    'get': function() {
        return (this.isEmpty() ?
            new position.SourceLocation(this.file, this.position.previousEnd, this.position.previousEnd) :
            this._first.loc);
    }
});

ParserState.prototype.first = function() {
    return this._first;
};

ParserState.prototype.setInput = function(input) {
    return new ParserState(
        this.file,
        input,
        this.pos,
        this._first,
        this._rest);
};

ParserState.prototype.next = function(tok) {
    if (!this._next) {
        var self = this;
        var end = (self.loc ? self.loc.end : self.position.previousEnd);
        
        this._next = parse.parseState(
            inputElementDiv,
            new parse.ParserState(self._rest, end, this.file),
            function(x, state) {
                var s = new ParserState(
                    self.file,
                    (x === null ? stream.end : self._rest),
                    self.position.next(state.position),
                    x,
                    state.input);
                return function(_, m, cok) { return cok(tok, s, m); };
            },
            parse.never);
    }
    return this._next;
};

ParserState.prototype.asRegExp = function(tok) {
    if (!this._as) {
        this._as = createNextRegExpState(
            this.file,
            this.input,
            this.position.previousEnd,
            parse.setParserState,
            parse.never);
    }
    return this._as;
};

/* Running
 ******************************************************************************/
/**
 * Parses a lex stream into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param s Stream of characters.
 * 
 * @return AST.
 */
var parseStream = function(s, file) {
    return parse.runState(
        parse.next(
            new ParserState(
                file,
                s,
                new Position(position.SourcePosition.initial, position.SourcePosition.initial),
                {},
                s).next(null),
            program.program),
         new parse.ParserState);
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
var parseInput = function(input, file) {
    return parseStream(
        stream.from(input),
        file);
};

/* Export
 ******************************************************************************/
return {
    'ParserState': ParserState,

// running
    'parseStream': parseStream,
    'parse': parseInput
};

});