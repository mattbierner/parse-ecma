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
"use strict";

// Operator Precedence
////////////////////////////////////////
var precedence = function(p, table) {
    var sep = parse.choice.apply(undefined, table.map(function(entry) {
        return parse.bind(entry.sep, function(v) {
            return parse.always({
                'value': v.value,
                'node': entry.node,
                'precedence': entry.precedence
            }, v.value);
        });
    }));
    
    return parse.bind(
        parse.rec(function(self) {
            return parse.cons(p,
                parse.optional(stream.end,
                    parse.cons(sep,
                        parse.expected("binary expression", self))));
        }),
        function(x) {
            var list = stream.toArray(x);
            var stack = [], out = [];
            
            while (list.length > 0) {
                var tok = list.shift();
                if (tok.type) {
                    out.push(tok);
                } else {
                    while (stack.length > 0) {
                        var o2 = stack[stack.length - 1];
                        if (o2.precedence <= tok.precedence) {
                            stack.pop();
                            var rt = out.pop(),
                                lf = out.pop();
                            out.push(new (o2.node)(position.SourceLocation.merge(lf.loc, rt.loc), o2.value, lf, rt));
                        } else {
                            break;
                        }
                    }
                    stack.push(tok);
                }
            }
            
            while (stack.length > 0){
                var o = stack.pop();
                var rt = out.pop(),
                    lf = out.pop();
                out.push(new (o.node)(position.SourceLocation.merge(lf.loc, rt.loc), o.value, lf, rt));
            }
            
            return parse.always(out.pop());
        });
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
var node = function(p, f) {
    return parse.binds(
        parse.sequence(
            locParser,
            p,
            prevEnd),
        function(o, x, c) {
            return parse.always(f(new position.SourceLocation(o.start, c), x));
        });
};

var nodea = function(p, f) {
    return parse.binds(
        parse.sequence(
            locParser,
            p,
            prevEnd),
        function(o, x, c) {
            return parse.always(f.apply(undefined, [new position.SourceLocation(o.start, c)].concat(stream.toArray(x))));
        });
};


/* Export
 ******************************************************************************/
return {
    'precedence': precedence,
    
    'node': node,
    'nodea': nodea,

    'position': positionParser
};

});