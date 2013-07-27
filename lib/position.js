/**
 * @fileOverview Data structures used to track locations in ECMAScript source
 *   text.
 */
define(['parse/parse'],
function(parse){
"use strict";

/* Positions
 ******************************************************************************/
// SourcePosition
////////////////////////////////////////
/**
 * Data structure for a point in source code.
 */
var SourcePosition = function(line, column) {
    this.line = line;
    this.column = column;
};
SourcePosition.prototype = new parse.Position;
SourcePosition.prototype.constructor = SourcePosition;

/**
 * Initial SourcePosition in a stream.
 */
SourcePosition.initial = new SourcePosition(1, 0);

SourcePosition.prototype.increment = function(tok) {
    return (tok === '\n' ?
        new SourcePosition(this.line + 1, 0):
        new SourcePosition(this.line, this.column + 1));
};

SourcePosition.prototype.toString = function() {
    return "{line:" + this.line + " col:" + this.column + "}";
};

SourcePosition.prototype.compare = function(pos) {
    return (this.line === pos.line ?
        (this.column - pos.column) :
        (this.line - pos.line));
};

// SourceLocation
////////////////////////////////////////
/**
 * Data structure for a location in source code. Locations are a range of
 * characters in source code.
 */
var SourceLocation = function(start, end) {
    this.start = start;
    this.end = end;
};

SourceLocation.prototype.toString = function() {
    return '{start:' + this.start + ' end:' + this.end + '}';
};

SourceLocation.merge = function(s1, s2) {
    return new SourceLocation(
        (s1.start.compare(s2.start) > 0 ? s2.start : s1.start),
        (s1.end.compare(s2.end) > 0 ? s1.end : s2.end));
};

/* Export
 ******************************************************************************/
return {
    'SourcePosition': SourcePosition,
    'SourceLocation': SourceLocation
};
});