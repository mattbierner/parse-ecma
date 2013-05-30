/**
 * @fileOverview AST clause for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/* 
 ******************************************************************************/
/**
 * 
 */
var SwitchCase = function(loc, test, consequent) {
    node.Node.call(this, loc);
    this.test = (test || null);
    this.consequent = consequent;
};
SwitchCase.prototype = new node.Node;
SwitchCase.prototype.type = "SwitchCase";

/**
 * 
 */
var CatchClause = function(loc, param, body) {
    node.Node.call(this, loc);
    this.param = param;
    this.body = body;
};
CatchClause.prototype = new node.Node;
CatchClause.prototype.type = "CatchClause";


/* Export
 ******************************************************************************/
return {
    'SwitchCase': SwitchCase,
    'CatchClause': CatchClause
};

});