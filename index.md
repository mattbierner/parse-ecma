---
layout: base
articleClass: page
---
# About

parse-ecma is a library of [parse.js][parsejs] combinatory parsers for lexing
and parsing [ECMAScript 5.1][ecma51]. It is designed for flexibility,
extensibility, and completeness.

## Modules

### ecma/lex ###
Parsers for tokenizing ECMAScript 5.1 input streams.

### ecma/parse ###
Parsers for building abstract syntax trees from token streams.

## Examples
* [Atum][atum] - Javascript interpreter implemented in functional Javascript.
  parse-ecma provides the AST for interpretation and is used for hosted language
  reflection.
   
* [Khepri][khepri] - ECMAScript derived language focused on making functional
style programming easier in Javascript. Khepri was forked from parse-ecma and 
uses parse-ecma for common functionality.


# Usage

## To clone ##
    git clone https://github.com/mattbierner/parse-ecma parse-ecma
    cd parse-ecma
    git submodule update --init


## Dependencies ##
* [ecma-ast][ecmaast] - ECMAScript ast node structures.
* [parse.js][parsejs] - Parser combinator library
* [Nu][nu] - Stream library



[ecmaast]: https://github.com/mattbierner/ecma-ast
[parsejs]: https://github.com/mattbierner/parse.js
[ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
[parseapi]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
[nu]: https://github.com/mattbierner/nu
[atum]: https://github.com/mattbierner/atum
[khepri]: https://github.com/mattbierner/khepri
