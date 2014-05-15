/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lex/comment_lexer.kep'
 * DO NOT EDIT
*/
"use strict";
var parse = require("bennu")["parse"],
    __o = require("bennu")["text"],
    __o0 = require("nu-stream")["stream"],
    line_terminator = require("./line_terminator_lexer"),
    singleLineCommentMarker, singleLineCommentChar, singleLineCommentChars, singleLineComment,
        multiLineCommentStartMarker, multiLineCommentEndMarker, multiLineCommentChars, multiLineComment, comment,
        always = parse["always"],
    rec = parse["rec"],
    character = __o["character"],
    string = __o["string"],
    foldl = __o0["foldl"],
    NIL = __o0["NIL"],
    __add = (function(x, y) {
        return (x + y);
    });
(singleLineCommentMarker = string("//"));
(singleLineCommentChar = parse.token((function(tok) {
    return (!parse.test(line_terminator.lineTerminator, tok));
})));
(singleLineCommentChars = parse.many(singleLineCommentChar));
var p;
(singleLineComment = parse.label("Single Line Comment Lexer", parse.next(singleLineCommentMarker, ((p =
    singleLineCommentChars), parse.bind(p, (function(s) {
    return always(foldl(__add, "", s));
}))))));
(multiLineCommentStartMarker = string("/*"));
(multiLineCommentEndMarker = string("*/"));
(multiLineCommentChars = parse.label("Multi Line Comment Characters Lexer", rec((function(self) {
    return parse.either(parse.next(character("*"), parse.either(parse.next(character("/"), always(NIL)),
        parse.cons(parse.always("*"), self))), parse.cons(parse.anyToken, self));
}))));
var p0;
(multiLineComment = parse.label("Multi Line Comment Lexer", parse.next(multiLineCommentStartMarker, ((p0 =
    multiLineCommentChars), parse.bind(p0, (function(s) {
    return always(foldl(__add, "", s));
}))))));
(comment = parse.label("Comment Lexer", parse.either(singleLineComment, multiLineComment)));
(exports["singleLineCommentMarker"] = singleLineCommentMarker);
(exports["singleLineCommentChar"] = singleLineCommentChar);
(exports["singleLineCommentChars"] = singleLineCommentChars);
(exports["singleLineComment"] = singleLineComment);
(exports["multiLineCommentStartMarker"] = multiLineCommentStartMarker);
(exports["multiLineCommentEndMarker"] = multiLineCommentEndMarker);
(exports["multiLineCommentChars"] = multiLineCommentChars);
(exports["multiLineComment"] = multiLineComment);
(exports["comment"] = comment);