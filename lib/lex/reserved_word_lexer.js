/**
 * @fileOverview Lexers for ECMAScript 5.1 reserved words.
 */
define(['bennu/parse', 'bennu/text',
        'ecma/lex/boolean_lexer', 'ecma/lex/null_lexer'],
function(parse, parse_text,
        boolean_lexer, null_lexer){
"use strict";


var keywordList = [
    'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 
    'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 
    'typeof', 'new', 'var', 'return', 'void', 'switch', 'while', 'this', 
    'with', 'throw', 'try', 'class', 'enum', 'extends', 'super', 'const',
    'export', 'import', 'implements', 'let', 'private', 'public', 'interface',
    'package', 'protected', 'static', 'yield',
    
    'true', 'false', 'null']; 

/* Lexers
 ******************************************************************************/
// Keywords
////////////////////////////////////////
var breakKeyword = parse_text.string('break');
var caseKeyword = parse_text.string('case');
var catchKeyword = parse_text.string('catch');
var continueKeyword = parse_text.string('continue');
var debuggerKeyword = parse_text.string('debugger');
var defaultKeyword = parse_text.string('default');
var deleteKeyword = parse_text.string('delete');
var doKeyword = parse_text.string('do');
var elseKeyword = parse_text.string('else');
var finallyKeyword = parse_text.string('finally');
var forKeyword = parse_text.string('for');
var functionKeyword = parse_text.string('function');
var ifKeyword = parse_text.string('if');
var inKeyword = parse_text.string('in');
var instanceofKeyword = parse_text.string('instanceof');
var typeofKeyword = parse_text.string('typeof');
var newKeyword = parse_text.string('new');
var varKeyword = parse_text.string('var');
var returnKeyword = parse_text.string('return');
var voidKeyword = parse_text.string('void');
var switchKeyword = parse_text.string('switch');
var whileKeyword = parse_text.string('while');
var thisKeyword = parse_text.string('this');
var withKeyword = parse_text.string('with');
var throwKeyword = parse_text.string('throw');
var tryKeyword = parse_text.string('try');

var keyword = parse.choice(
    breakKeyword,
    caseKeyword,
    catchKeyword,
    continueKeyword,
    debuggerKeyword,
    defaultKeyword,
    deleteKeyword,
    doKeyword,
    elseKeyword,
    finallyKeyword,
    forKeyword,
    functionKeyword,
    ifKeyword,
    inKeyword,
    instanceofKeyword,
    typeofKeyword,
    newKeyword,
    varKeyword,
    returnKeyword,
    voidKeyword,
    switchKeyword,
    whileKeyword,
    thisKeyword,
    withKeyword,
    throwKeyword,
    tryKeyword);

// Future Reserved Words
////////////////////////////////////////
var classKeyword = parse_text.string('class');
var enumKeyword = parse_text.string('enum');
var extendsKeyword = parse_text.string('extends');
var superKeyword = parse_text.string('super');
var constKeyword = parse_text.string('const');
var exportKeyword = parse_text.string('export');
var importKeyword = parse_text.string('import');
var implementsKeyword = parse_text.string('implements');
var letKeyword = parse_text.string('let');
var privateKeyword = parse_text.string('private');
var publicKeyword = parse_text.string('public');
var interfaceKeyword = parse_text.string('interface');
var packageKeyword = parse_text.string('package');
var protectedKeyword = parse_text.string('protected');
var staticKeyword = parse_text.string('static');
var yieldKeyword = parse_text.string('yield');

var futureReservedWord = parse.choice(
    classKeyword,
    enumKeyword,
    extendsKeyword,
    superKeyword,
    constKeyword,
    exportKeyword,
    importKeyword,
    implementsKeyword,
    letKeyword,
    privateKeyword,
    publicKeyword,
    interfaceKeyword,
    packageKeyword,
    protectedKeyword,
    staticKeyword,
    yieldKeyword);

// Reserved Word
////////////////////////////////////////
/**
 * 
 */
var reservedWord = parse.Parser('Reserved Word Lexer',
    parse.choice(
        parse.attempt(null_lexer.nullLiteral), 
        parse.attempt(boolean_lexer.booleanLiteral),
        parse_text.trie(keywordList)));

/* Export
 ******************************************************************************/

return {
    'keywordList': keywordList,
    
    'reservedWord': reservedWord,
    
// keywords
    'breakKeyword': breakKeyword,
    'caseKeyword': caseKeyword,
    'catchKeyword': catchKeyword,
    'continueKeyword': continueKeyword,
    'debuggerKeyword': debuggerKeyword,
    'defaultKeyword': defaultKeyword,
    'deleteKeyword': deleteKeyword,
    'doKeyword': doKeyword,
    'elseKeyword': elseKeyword,
    'finallyKeyword': finallyKeyword,
    'forKeyword': forKeyword,
    'functionKeyword': functionKeyword,
    'ifKeyword': ifKeyword,
    'inKeyword': inKeyword,
    'instanceofKeyword': instanceofKeyword,
    'typeofKeyword': typeofKeyword,
    'newKeyword': newKeyword,
    'varKeyword': varKeyword,
    'returnKeyword': returnKeyword,
    'voidKeyword': voidKeyword,
    'switchKeyword': switchKeyword,
    'whileKeyword': whileKeyword,
    'thisKeyword': thisKeyword,
    'withKeyword': withKeyword,
    'throwKeyword': throwKeyword,
    'tryKeyword': tryKeyword,
    'keyword': keyword,

// Future Reserved Word
    'classKeyword': classKeyword,
    'enumKeyword': enumKeyword,
    'extendsKeyword': extendsKeyword,
    'superKeyword': superKeyword,
    'constKeyword': constKeyword,
    'exportKeyword': exportKeyword,
    'importKeyword': importKeyword,
    'implementsKeyword': implementsKeyword,
    'letKeyword': letKeyword,
    'privateKeyword': privateKeyword,
    'publicKeyword': publicKeyword,
    'interfaceKeyword': interfaceKeyword,
    'packageKeyword': packageKeyword,
    'protectedKeyword': protectedKeyword,
    'staticKeyword': staticKeyword,
    'yieldKeyword': yieldKeyword
};

});