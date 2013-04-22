---
layout: base
articleClass: page
---
# About

parse-ecma is a library of [parse.js][parsejs] combinatory parsers for lexing
and parsing [ECMAScript 5.1][ecma51]. It is designed for flexibility,
extensibility, and completeness.


## Modules ##

### ecma/lex ###
Parsers for tokenizing ECMAScript 5.1 input streams.

### ecma/parse ###
Parsers for building abstract syntax trees from token streams.

### ecma/ast ###
[SpiderMonkey][parseapi] abstract syntax tree node definitions.


# Usage

## To clone ##
    git clone https://github.com/mattbierner/parse-ecma parse-ecma
    cd parse-ecma
    git submodule update --init


## Dependencies ##
* [parse.js][parsejs] - Parser combinator library
* [Nu][nu] - Stream library



 
 [parsejs]: https://github.com/mattbierner/parse.js
 [ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
 [parseapi]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
 [nu]: https://github.com/mattbierner/nu
