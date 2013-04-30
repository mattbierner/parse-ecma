/**
 * @fileOverview AST statement nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/**
 * @constructor
 */
var Statement = function() { };
Statement.prototype = new node.Node;

/**
 * @constructor
 */
var EmptyStatement = function(loc) {
    node.Node.call(this, loc);
};
EmptyStatement.prototype = new Statement;
EmptyStatement.prototype.type = "EmptyStatement";

/**
 * @constructor
 */
var DebuggerStatement = function(loc) {
    node.Node.call(this, loc);
};
DebuggerStatement.prototype = new Statement;
DebuggerStatement.prototype.type = "DebuggerStatement";

/**
 * @constructor
 * 
 * A set of statements, the body, inside of a block.
 */
var BlockStatement = function(loc, body) {
    node.Node.call(this, loc);
    this.body = body;
};
BlockStatement.prototype = new Statement;
BlockStatement.prototype.type = "BlockStatement";

/**
 * @constructor
 */
var ExpressionStatement = function(loc, expression) {
    node.Node.call(this, loc);
    this.expression = expression;
};
ExpressionStatement.prototype = new Statement;
ExpressionStatement.prototype.type = "ExpressionStatement";

/**
 * @constructor
 */
var IfStatement = function(loc, test, consequent, alternate) {
    node.Node.call(this, loc);
    this.test = test;
    this.consequent = consequent;
    this.alternate = (alternate || null);
};
IfStatement.prototype = new Statement;
IfStatement.prototype.type = "IfStatement";

/**
 * @constructor
 */
var LabeledStatement = function(loc, label, body) {
    node.Node.call(this, loc);
    this.label = label;
    this.body = body;
};
LabeledStatement.prototype = new Statement;
LabeledStatement.prototype.type = "LabeledStatement";

/**
 * @constructor
 */
var BreakStatement = function(loc, label) {
    node.Node.call(this, loc);
    this.label = (label || null);
};
BreakStatement.prototype = new Statement;
BreakStatement.prototype.type = "BreakStatement";

/**
 * @constructor
 */
var ContinueStatement = function(loc, label) {
    node.Node.call(this, loc);
    this.label = (label || null);
};
ContinueStatement.prototype = new Statement;
ContinueStatement.prototype.type = "ContinueStatement";

/**
 * @constructor
 */
var WithStatement = function(loc, object, body) {
    node.Node.call(this, loc);
    this.object = object;
    this.body = body;
};
WithStatement.prototype = new Statement;
WithStatement.prototype.type = "WithStatement";

/**
 * @constructor
 */
var SwitchStatement = function(loc, discriminant, cases) {
    node.Node.call(this, loc);
    this.discriminant = discriminant;
    this.cases = cases;
};
SwitchStatement.prototype = new Statement;
SwitchStatement.prototype.type = "SwitchStatement";

/**
 * @constructor
 */
var ReturnStatement = function(loc, argument) {
    node.Node.call(this, loc);
    this.argument = (argument || null);
};
ReturnStatement.prototype = new Statement;
ReturnStatement.prototype.type = "ReturnStatement";

/**
 * @constructor
 */
var ThrowStatement = function(loc, argument) {
    node.Node.call(this, loc);
    this.argument = argument;
};
ThrowStatement.prototype = new Statement;
ThrowStatement.prototype.type = "ThrowStatement";

/**
 * @constructor
 */
var TryStatement = function(loc, block, handler, finalizer) {
    node.Node.call(this, loc);
    this.block = block;
    this.handler = handler;
    this.finalizer = finalizer;
};
TryStatement.prototype = new Statement;
TryStatement.prototype.type = "TryStatement";

/**
 * @constructor
 */
var WhileStatement = function(loc, test, body) {
    node.Node.call(this, loc);
    this.test = test;
    this.body = body;
};
WhileStatement.prototype = new Statement;
WhileStatement.prototype.type = "WhileStatement";

/**
 * @constructor
 */
var DoWhileStatement = function(loc, body, test) {
    node.Node.call(this, loc);
    this.test = test;
    this.body = body;
};
DoWhileStatement.prototype = new Statement;
DoWhileStatement.prototype.type = "DoWhileStatement";

/**
 * @constructor
 */
var ForStatement = function(loc, init, test, update, body) {
    node.Node.call(this, loc);
    this.init = (init || null);
    this.test = (test || null);
    this.update = (update || null);
    this.body = body;
};
ForStatement.prototype = new Statement;
ForStatement.prototype.type = "ForStatement";

/**
 * @constructor
 */
var ForInStatement = function(loc, left, right, body, each) {
    node.Node.call(this, loc);
    this.left = left;
    this.right = right;
    this.body = body;
    this.each = each;
};
ForInStatement.prototype = new Statement;
ForInStatement.prototype.type = "ForInStatement";

/* Export
 ******************************************************************************/
return {
    'Statement': Statement,
    
    'EmptyStatement': EmptyStatement,
    'DebuggerStatement': DebuggerStatement,
    'BlockStatement': BlockStatement,
    'ExpressionStatement': ExpressionStatement,
    'IfStatement': IfStatement,
    'LabeledStatement': LabeledStatement,
    'BreakStatement': BreakStatement,
    'ContinueStatement': ContinueStatement,
    'WithStatement': WithStatement,
    'SwitchStatement': SwitchStatement,
    'ReturnStatement': ReturnStatement,
    
    'ThrowStatement': ThrowStatement,
    'TryStatement': TryStatement,
    
    'WhileStatement': WhileStatement,
    'DoWhileStatement': DoWhileStatement,
    'ForStatement': ForStatement,
    'ForInStatement': ForInStatement
};

});