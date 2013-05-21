/**
 * @fileOverview
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'ecma/lex/token',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexToken,
        program){
"use strict";

/* Export
 ******************************************************************************/
var runStream;

/**
 * 
 */
var run = function(input) {
    return runStream(stream.from(input));
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
    'parse': parse,

};

});