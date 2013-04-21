/**
 * @fileOverview 
 */
define(['parse/parse',
        'ecma/position',
        'nu/stream',
        'ecma/ast/value'],
function(parse,
        position,
        stream,
        astValue){
//"use strict";

var end = parse.always(stream.end);

/**
 * 
 */
var sepEndBy1 = function(sep, p) {
    return parse.rec(function(self) {
        return parse.cons(p,
            parse.either(
                parse.next(sep, parse.either(self, end)),
                end));
    });
};

var sepEndBy = function(sep, p) {
    return parse.either(
        sepEndBy1(sep, p),
        parse.always(stream.end));
};

// State Interaction
////////////////////////////////////////
var positionParser = parse.extract(function(state) {
    return state.position;
});

var locParser = parse.extract(function(state) {
    return state.loc;
});

var prevEnd = parse.extract(function(state) {
    return state._prevEnd;
});


// Ast Node
////////////////////////////////////////
var astNode = function(p) {
    return parse.binda(
        parse.sequence(
            locParser,
            p,
            prevEnd),
        function(o, node, c) {
            //TODO: not functional here
            node.loc = new position.SourceLocation(o.start, c);
            return parse.always(node);
        });
};

/* Export
 ******************************************************************************/
return {
    'sepEndBy1': sepEndBy1,
    'sepEndBy': sepEndBy,
    
    'astNode': astNode,
    
    'position': positionParser
};

});