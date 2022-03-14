const {parseApply} = require('./removeSpaces.js');
const {parseExpression} = require('./parseExpression.js');

exports.parseApply = function parseApply(expression, program) {
	program = removeSpaces(program);
	if (program[0] != '(') {
		return {expression: expression, rest: program};
	};

	program = removeSpaces(program.slice(1));
	expression = {type: 'apply', operator: expression, args: []};
	while (program[0] != ')') {
		let arg = parseExpression(program);
		expression.args.push(arg.expression);
		if (program[0] == ',') {
			program = removeSpaces(program.slice(1));
		} else if (program[0] != ')') {
			throw new SyntaxError("Expected ',' or ')'");
		};
	};

	return parseApply(expression, program.slice(1));
};