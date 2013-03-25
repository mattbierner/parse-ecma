/**
 * @fileOverview 
 */
define(['parse/parse'],
function(parse){
"use strict";

// SourcePosition
////////////////////////////////////////
/**
 * Data structure for a single point in source code.
 */
var SourcePosition = function(line, column) {
    this.line = line;
    this.column = column;
};
SourcePosition.prototype = new parse.Position;

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

/**
 * Combine two SourceLocations into a SourceLocation representing the combined
 * location of the two.
 */
SourceLocation.merge = function(s1, s2) {
    return new SourceLocation(s1.start, s2.end);
};

/* Export
 ******************************************************************************/
return {
    'SourcePosition': SourcePosition,
    'SourceLocation': SourceLocation
};

});