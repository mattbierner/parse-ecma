/**
 * @fileOverview 
 */
define(['parse/parse',
        'parse/lang',
        'ecma_ast/position',
        'ecma/parse/token_parser',
        'nu/stream'],
function(parse,
        lang,
        position,
        token,
        stream){
//"use strict";

// Operator Precedence
////////////////////////////////////////
var precedence = function(p, table) {
    var punts = Object.keys(table).reduce(function(p, c) {
        return (table[c].type === 'punctuator' ? p.concat(c) : p);
    }, []);
    
    var kws = Object.keys(table).reduce(function(p, c) {
        return (table[c].type === 'keyword' ? p.concat(c) : p);
    }, []);
    
    var lookup = function(x) {
        if (!(x.type === 'Punctuator' || x.type === 'Keyword'))
            return x;
        var item =  table[x.value];
        return {
            'value': x.value,
            'node': item.node,
            'precedence': item.precedence
        };
    };
    
    var sep = parse.either(
        token.punctuator.apply(undefined, punts),
        token.keyword.apply(undefined, kws));
    
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
                var tok = lookup(list.shift());
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
            
            while (stack.length > 0) {
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
    return state.position.previousEnd;
});

// Ast Node
////////////////////////////////////////
var node = function(p, f) {
    return parse.binds(
        parse.enumeration(
            locParser,
            p,
            prevEnd),
        function(o, x, c) {
            return parse.always(f(new position.SourceLocation(o.file, o.start, c), x));
        });
};

var nodea = function(p, f) {
    return parse.binds(
        parse.enumeration(
            locParser,
            p,
            prevEnd),
        function(o, x, c) {
            return parse.always(f.apply(undefined, stream.toArray(stream.cons(new position.SourceLocation(o.file, o.start, c), x))));
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