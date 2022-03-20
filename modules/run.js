const {parseExpr, parseApply, parse} = require('./parsers.js');
const {evaluate} = require('./evaluators.js');
const {topScope} = require('./topScope.js');

exports.run = function(program) {
  return evaluate(parse(program), Object.create(topScope));
};