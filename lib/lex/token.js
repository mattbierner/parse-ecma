/**
 * @fileOverview Lexer tokens.
 */
define(function(node){
"use strict";

/**
 * 
 */
var Token = function(loc, value) {
    this.loc = loc;
    this.value = value;
};

/**
 * 
 */
var StringToken = function(loc, value) {
    Token.call(this, loc, value);
};
StringToken.prototype = new Token;
StringToken.prototype.type = "String";
StringToken.prototype.constructor = StringToken;

/**
 * 
 */
var NumberToken = function(loc, value) {
    Token.call(this, loc, value);
};
NumberToken.prototype = new Token;
NumberToken.prototype.type = "Number";
NumberToken.prototype.constructor = NumberToken;

/**
 * 
 */
var RegularExpressionToken = function(loc, value) {
    Token.call(this, loc, value);
};
RegularExpressionToken.prototype = new Token;
RegularExpressionToken.prototype.type = "RegularExpression";
RegularExpressionToken.prototype.constructor = RegularExpressionToken;

/**
 * 
 */
var BooleanToken = function(loc, value) {
    Token.call(this, loc, value);
};
BooleanToken.prototype = new Token;
BooleanToken.prototype.type = "Boolean";
BooleanToken.prototype.constructor = BooleanToken;

/**
 * 
 */
var NullToken = function(loc, value) {
    Token.call(this, loc, value);
};
NullToken.prototype = new Token;
NullToken.prototype.type = "Null";
NullToken.prototype.constructor = NullToken;

/**
 * 
 */
var IdentifierToken = function(loc, value) {
    Token.call(this, loc, value);
};
IdentifierToken.prototype = new Token;
IdentifierToken.prototype.type = "Identifier";
IdentifierToken.prototype.constructor = IdentifierToken;

/**
 * 
 */
var KeywordToken = function(loc, value) {
    Token.call(this, loc, value);
};
KeywordToken.prototype = new Token;
KeywordToken.prototype.type = "Keyword";
KeywordToken.prototype.constructor = KeywordToken;

/**
 * 
 */
var PunctuatorToken = function(loc, value) {
    Token.call(this, loc, value);
};
PunctuatorToken.prototype = new Token;
PunctuatorToken.prototype.type = "Punctuator";
PunctuatorToken.prototype.constructor = PunctuatorToken;

/**
 * 
 */
var CommentToken = function(loc, value) {
    Token.call(this, loc, value);
};
CommentToken.prototype = new Token;
CommentToken.prototype.type = "Comment";
CommentToken.prototype.constructor = CommentToken;

/**
 * 
 */
var WhitespaceToken = function(loc, value) {
    Token.call(this, loc, value);
};
WhitespaceToken.prototype = new Token;
WhitespaceToken.prototype.type = "Whitespace";
WhitespaceToken.prototype.constructor = WhitespaceToken;

/**
 * 
 */
var LineTerminatorToken = function(loc, value) {
    Token.call(this, loc, value);
};
LineTerminatorToken.prototype = new Token;
LineTerminatorToken.prototype.type = "LineTerminator";
LineTerminatorToken.prototype.constructor = LineTerminatorToken;

/* Export
 ******************************************************************************/
return {
    'Token': Token,
    
    'StringToken': StringToken,
    'NumberToken': NumberToken,
    'RegularExpressionToken': RegularExpressionToken,
    'BooleanToken': BooleanToken,
    'NullToken': NullToken,
    
    'IdentifierToken': IdentifierToken,
    'KeywordToken': KeywordToken,
    'PunctuatorToken': PunctuatorToken,
    
    'CommentToken': CommentToken,
    'WhitespaceToken': WhitespaceToken,
    'LineTerminatorToken': LineTerminatorToken
};

});