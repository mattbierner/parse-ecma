/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("bennu")["parse"],
    __o0 = require("nu-stream")["stream"],
    Position = require("./position"),
    parserStream = require("./parser_stream"),
    __o1 = require("./program_parser"),
    parseStream, parse, runState = __o["runState"],
    ParserState = __o["ParserState"],
    streamFrom = __o0["from"],
    program = __o1["program"];
(parseStream = (function(s) {
    return runState(program, new(ParserState)(parserStream(s), Position.initial));
}));
(parse = (function(z) {
    return parserStream(streamFrom(z));
}));
(exports["parseStream"] = parseStream);
(exports["parse"] = parse);