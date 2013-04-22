---
layout: base
---

# About #
parse.js is a library for creating [combinatorial parsers][CombinatorialParsers] in Javascript. 
It is based on Nate Young's [Parsatron][Parsatron] which in turn is based on
[Parsec][Parsec].

Combinatorial parsers allow complex parsers to be constructed from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.


## Examples ##
* [parse-ecma][parseecma] - Combinatory parsers for lexing and parsing ECMAScript 5.


## Modules ##
All files live in the top level 'parse' module.

### parse/parse ###
Core functionality. Defines core parsers and data structures for creating and
running parsers.

### parse/parse_string ###
Parsers for working specifically with strings.

### parse/parse_eager ###
Redefines iterative core parsers to return regular Javascript arrays instead
of Nu streams.


# Usage #

## To clone ##
    git clone https://github.com/mattbierner/parse.js parse
    cd parse
    git submodule update --init --recursive

## Dependencies ##
parse.js depends on [Nu][nu] internally and also uses Nu objects in the API.

## With AMD ##
Include any AMD style module loader and load parse:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
            requirejs.config({
                paths: {
                    'parse': './lib',
                    'nu': './dependencies/nu/lib'
                }
            });
            require(['parse/parse'], function(parse) {
                ...
            });
        </script>
    </body>

# Code #
parse.js is written in Javascript / Khepri. [Khepri][khepri] is a ECMAScript subset
that, among other things, adds a shorted lambda function syntax. It is also
implemented using parse.js. Besides lambda functions, Khepri files (*.kep) are
pretty much plain old Javascript.

For now, both the .js and .kep versions of source code will be kept in 'lib/',
but only Khepri sources will be developed and Javascript files will be
generated from it.



[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parseecma]: https://github.com/mattbierner/parse-ecma
[khepri]: https://github.com/mattbierner/khepri
[nu]: https://github.com/mattbierner/nu