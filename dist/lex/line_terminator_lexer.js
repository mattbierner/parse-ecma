/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/line_terminator_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var lf, cr, ls, ps, lineTerminator, lineTerminatorSequence, always = __o["always"],
        choice = __o["choice"],
        optional = __o["optional"],
        next = __o["next"],
        label = __o["label"],
        character = __o0["character"],
        oneOf = __o0["oneOf"];
    (lf = character("\n"));
    (cr = character("\r"));
    (ls = character("\u2028"));
    (ps = character("\u2029"));
    (lineTerminator = label("Line Terminator Lexer", oneOf(["\n", "\r", "\u2028", "\u2029"])));
    (lineTerminatorSequence = label("Line Terminator Sequence Lexer", choice(lf, ls, ps, next(cr, optional("\r",
        next(lf, always("\r\n")))))));
    (exports["lf"] = lf);
    (exports["cr"] = cr);
    (exports["ls"] = ls);
    (exports["ps"] = ps);
    (exports["lineTerminator"] = lineTerminator);
    (exports["lineTerminatorSequence"] = lineTerminatorSequence);
}));