/**
 * @fileOverview AST Declaration Nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/**
 * 
 */
var Declaration = function() { };
Declaration.prototype = new node.Node;

/**
 * 
 */
var FunctionDeclaration = function(loc, id, params, body) {
    node.Node.call(this, loc);
    this.id = id;
    this.params = params;
    this.body = body;
};
FunctionDeclaration.prototype = new Declaration;
FunctionDeclaration.prototype.type = "FunctionDeclaration";

/**
 * 
 */
var VariableDeclaration = function(loc, declarations) {
    node.Node.call(this, loc);
    this.declarations = declarations;
};
VariableDeclaration.prototype = new Declaration;
VariableDeclaration.prototype.type = "VariableDeclaration";

/**
 * 
 */
var VariableDeclarator = function(loc, id, init) {
    node.Node.call(this, loc);
    this.id = id;
    this.init = (init || null);
};
VariableDeclarator.prototype = new Declaration;
VariableDeclarator.prototype.type = "VariableDeclarator";


/* Export
 ******************************************************************************/
return {
    'Declaration': Declaration,
    
    'FunctionDeclaration': FunctionDeclaration,
    
    'VariableDeclaration': VariableDeclaration,
    'VariableDeclarator': VariableDeclarator
};

});