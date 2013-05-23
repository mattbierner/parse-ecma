/**
 * @fileOverview
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'ecma/lex/lexer',
        'ecma/parse/parser',
        'ecma/parse/program_parser'],
function(parse,
        stream,
        position,
        lexer,
        parser,
        program_parser){
"use strict";

/* Running
 ******************************************************************************/
var runStream = function(s) {
    return parse.parseStream(lexer.lexDivStream(s),
            function(x) { return x; },
            function() { return parse.parseStream(lexer.lexRegExpStream(s)); })
};

/**
 * 
 */
var run = function(input) {
    return runStream(stream.from(input));
};

/* Export
 ******************************************************************************/
return {
    'runStream': runStream,
    'run': run
};

});