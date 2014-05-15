/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/line_terminator_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["text"],
    lf, cr, ls, ps, lineTerminator, lineTerminatorSequence, always = __o["always"],
    choice = __o["choice"],
    optional = __o["optional"],
    next = __o["next"],
    Parser = __o["Parser"],
    character = __o0["character"];
(lf = character("\n"));
(cr = character("\r"));
(ls = character("\u2028"));
(ps = character("\u2029"));
(lineTerminator = Parser("Line Terminator Lexer", choice(lf, cr, ls, ps)));
(lineTerminatorSequence = Parser("Line Terminator Sequence Lexer", choice(lf, ls, ps, next(cr, optional("\r", next(lf,
    always("\r\n")))))));
(exports["lf"] = lf);
(exports["cr"] = cr);
(exports["ls"] = ls);
(exports["ps"] = ps);
(exports["lineTerminator"] = lineTerminator);
(exports["lineTerminatorSequence"] = lineTerminatorSequence);