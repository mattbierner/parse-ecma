# ChangeLog #

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