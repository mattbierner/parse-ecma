/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/comment_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("bennu")["lang"],
    __o1 = require("bennu")["text"],
    __o2 = require("nu-stream")["stream"],
    __o3 = require("./line_terminator_lexer"),
    singleLineCommentMarker, singleLineCommentChar, singleLineCommentChars, singleLineComment,
        multiLineCommentStartMarker, multiLineCommentEndMarker, multiLineCommentChars, multiLineComment, comment,
        anyToken = __o["anyToken"],
    either = __o["either"],
    label = __o["label"],
    map = __o["map"],
    many = __o["many"],
    next = __o["next"],
    not = __o["not"],
    between = __o0["between"],
    string = __o1["string"],
    foldl = __o2["foldl"],
    lineTerminator = __o3["lineTerminator"],
    __add = (function(x, y) {
        return (x + y);
    }),
    join = map.bind(null, foldl.bind(null, __add, ""));
(singleLineCommentMarker = string("//"));
(singleLineCommentChar = next(not(lineTerminator), anyToken));
(singleLineCommentChars = many(singleLineCommentChar));
(singleLineComment = label("Single Line Comment Lexer", next(singleLineCommentMarker, join(singleLineCommentChars))));
(multiLineCommentStartMarker = string("/*"));
(multiLineCommentEndMarker = string("*/"));
(multiLineCommentChars = many(next(not(multiLineCommentEndMarker), anyToken)));
(multiLineComment = label("Multi Line Comment Lexer", between(multiLineCommentStartMarker, multiLineCommentEndMarker,
    join(multiLineCommentChars))));
(comment = label("Comment Lexer", either(singleLineComment, multiLineComment)));
(exports["singleLineCommentMarker"] = singleLineCommentMarker);
(exports["singleLineCommentChar"] = singleLineCommentChar);
(exports["singleLineCommentChars"] = singleLineCommentChars);
(exports["singleLineComment"] = singleLineComment);
(exports["multiLineCommentStartMarker"] = multiLineCommentStartMarker);
(exports["multiLineCommentEndMarker"] = multiLineCommentEndMarker);
(exports["multiLineCommentChars"] = multiLineCommentChars);
(exports["multiLineComment"] = multiLineComment);
(exports["comment"] = comment);