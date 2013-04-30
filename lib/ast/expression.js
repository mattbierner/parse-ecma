/**
 * @fileOverview AST expression Nodes for ECMAScript 5.1 based on the
 *   SpiderMonkey Parser API.
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/**
 * @constructor
 */
var Expression = function() { };
Expression.prototype = new node.Node;

/**
 * @constructor
 */
var ThisExpression = function(loc) {
    node.Node.call(this, loc);
};
ThisExpression.prototype = new Expression;
ThisExpression.prototype.type = "ThisExpression";

/**
 * @constructor
 */
var SequenceExpression = function(loc, expressions) {
    node.Node.call(this, loc);
    this.expressions = expressions;
};
SequenceExpression.prototype = new Expression;
SequenceExpression.prototype.type = "SequenceExpression";

/**
 * @constructor
 */
var UnaryExpression = function(loc, operator, argument) {
    node.Node.call(this, loc);
    this.operator = operator;
    this.argument = argument;
};
UnaryExpression.prototype = new Expression;
UnaryExpression.prototype.type = "UnaryExpression";

/**
 * @constructor
 */
var BinaryExpression = function(loc, operator, left, right) {
    node.Node.call(this, loc);
    this.operator = operator;
    this.left = left;
    this.right = right;
};
BinaryExpression.prototype = new Expression;
BinaryExpression.prototype.type = "BinaryExpression";

/**
 * @constructor
 */
var AssignmentExpression = function(loc, operator, left, right) {
    node.Node.call(this, loc);
    this.operator = operator;
    this.left = left;
    this.right = right;
};
AssignmentExpression.prototype = new Expression;
AssignmentExpression.prototype.type = "AssignmentExpression";

/**
 * @constructorUpdate, increment or decrement, operator expression.
 */
var UpdateExpression = function(loc, operator, argument, prefix) {
    node.Node.call(this, loc);
    this.operator = operator;
    this.argument = argument;
    this.prefix = prefix;
};
UpdateExpression.prototype = new Expression;
UpdateExpression.prototype.type = "UpdateExpression";

/**
 * @constructor
 */
var LogicalExpression = function(loc, operator, left, right) {
    node.Node.call(this, loc);
    this.operator = operator;
    this.left = left;
    this.right = right;
};
LogicalExpression.prototype = new Expression;
LogicalExpression.prototype.type = "LogicalExpression";

/**
 * @constructor
 */
var ConditionalExpression = function(loc, test, consequent, alternate) {
    node.Node.call(this, loc);
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
};
ConditionalExpression.prototype = new Expression;
ConditionalExpression.prototype.type = "ConditionalExpression";

/**
 * @constructor
 */
var NewExpression = function(loc, callee, args) {
    node.Node.call(this, loc);
    this.callee = callee;
    this.args = args;
};
NewExpression.prototype = new Expression;
NewExpression.prototype.type = "NewExpression";

/**
 * @constructor
 */
var CallExpression = function(loc, callee, args) {
    node.Node.call(this, loc);
    this.callee = callee;
    this.args = args;
};
CallExpression.prototype = new Expression;
CallExpression.prototype.type = "CallExpression";

/**
 * @constructor
 */
var MemberExpression = function(loc, object, property, computed) {
    node.Node.call(this, loc);
    this.object = object;
    this.property = property;
    this.computed = computed;
};
MemberExpression.prototype = new Expression;
MemberExpression.prototype.type = "MemberExpression";

/**
 * @constructor
 */
var FunctionExpression = function(loc, id, params, body) {
    node.Node.call(this, loc);
    this.id = (id || null);
    this.params = params;
    this.body = body;
};
FunctionExpression.prototype = new Expression;
FunctionExpression.prototype.type = "FunctionExpression";

/**
 * @constructor
 */
var ArrayExpression = function(loc, elements) {
    node.Node.call(this, loc);
    this.elements = elements;
};
ArrayExpression.prototype = new Expression;
ArrayExpression.prototype.type = "ArrayExpression";

/**
 * @constructor
 */
var ObjectExpression = function(loc, properties) {
    node.Node.call(this, loc);
    this.properties = properties;
};
ObjectExpression.prototype = new Expression;
ObjectExpression.prototype.type = "ObjectExpression";

/* Export
 ******************************************************************************/
return {
    'Expression': Expression,
    
    'ThisExpression': ThisExpression,
    'SequenceExpression': SequenceExpression,
    'UnaryExpression': UnaryExpression,
    'BinaryExpression': BinaryExpression,
    'AssignmentExpression': AssignmentExpression,
    'UpdateExpression': UpdateExpression,
    'LogicalExpression': LogicalExpression,
    'ConditionalExpression': ConditionalExpression,
    'NewExpression': NewExpression,
    'CallExpression': CallExpression,
    'MemberExpression': MemberExpression,
    
    'FunctionExpression': FunctionExpression,
    'ArrayExpression': ArrayExpression,
    'ObjectExpression': ObjectExpression
};

});