#!/usr/bin/env node
var reporter = require('nodeunit').reporters.default;
reporter.run(['tests/lex', 'tests/parse']);