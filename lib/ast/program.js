/**
 * @fileOverview AST program Nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/**
 * @constructor
 */
var Program = function(loc, body) {
    node.Node.call(this, loc);
    this.body = body;
};
Program.prototype = new node.Node;
Program.prototype.type = "Program";

/* Export
 ******************************************************************************/
return {
    'Program': Program,
};

});