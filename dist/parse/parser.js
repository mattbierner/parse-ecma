/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream", "./position", "./parser_stream", "./program_parser"], (
    function(require, exports, __o, __o0, Position, parserStream, __o1) {
        "use strict";
        var parseStream, parse, runState = __o["runState"],
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
    }));