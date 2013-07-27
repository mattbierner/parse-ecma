# ChangeLog #

## 3.0.0 - July XX, 2013 ##
* Split out AST nodes to `ecma-ast` library.
* Position line starts at 1 instead of 0 since most editors use this indexing. 
* Fixed allowing function expressions as top level source elements.

## 2.1.0 - May 29, 2013 ##
* Removed non standard guard param from CaseClause ast node.

## 2.0.0 - May 24, 2013 ##
* Lexer refactored to fully support both ECMAScript contexts with leading 
  divisions and those without.
** Both versions of 'lex', 'inputElement', and 'lexer' are exported.
* Lexer lexes non lazily be default.
* Added 'SoucePosition.initial' for initial SourcePosition.

## 1.0.0 - April 30, 2013 ##
* All AST node constructors take SourceLocations are first argument. These may
  be null. 
** Removed non functional workaround used previously.
* Exported many more parsers to allow better use of library.

## 0.2.1 - April 22, 2013 ##
* Made lexer error messages useful as well.

## 0.2.0 - April 20, 2013 ##
* Made most error messages from expressions actually useful.
** Most errors display readable expected values when a parser fails and
  no input is consumed.
* Fixed source locations being inconsistent.
* Most expressions now have location information attached.
* Improved debug console.
** AST printed as tree instead of big text block
** Displays tabs characters as tabs instead of regular spaces

## 0.1.7 - April 19, 2013 ##
* * Updated to parse.js 12.0.0.
  
## 0.1.6 - April 18, 2013 ##
* Fixed lexer treating true, false, and null as identifiers after change to 
  how 'parse_string.trie' is implemented.

## 0.1.5 - April 13, 2013 ##
* Updated to parse.js 11.0.0.

## 0.1.4 - March 27, 2013 ##
* Parser errors display source locations instead of token stream locations.

## 0.1.3 - March 18, 2013 ##
* Fixed object literal get and set to also use block statement nodes instead of
  array of source elements.

## 0.1.2 - March 17, 2013 ##
* Function nodes created with block nodes instead of array of source elements.

## 0.1.1 - February 1, 2013 ##
* Lexer must reach the end of the stream or else if will fail. Before, it lexed
  as much of the stream as possible. Note that for lazy streams, the stream
  may fail for any token and this error must be handled correctly when pulling
  values from the lex stream.

## 0.1.0 - February 10, 2013 ##
* Initial release.