/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/whitespace_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["text"],
    tab, vt, ff, sp, nbsp, bom, usp, whitespace, label = __o["label"],
    character = __o0["character"],
    oneOf = __o0["oneOf"],
    match = __o0["match"];
(tab = character("\t"));
(vt = character("\u000b"));
(ff = character("\f"));
(sp = character(" "));
(nbsp = character(" "));
(bom = character("﻿"));
(usp = match(/^\s$/));
(whitespace = label("Whitespace Lexer", oneOf(["\t", "\u000b", "\f", " ", " ", "﻿"])));
(exports["tab"] = tab);
(exports["vt"] = vt);
(exports["ff"] = ff);
(exports["sp"] = sp);
(exports["nbsp"] = nbsp);
(exports["bom"] = bom);
(exports["usp"] = usp);
(exports["whitespace"] = whitespace);