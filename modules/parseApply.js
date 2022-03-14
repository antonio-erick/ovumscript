const {removeSpaces} = require('./removeSpaces.js');
const {parseExpression} = require('./parseExpression.js');

exports.parseApply = function parseApply(expression, program) {
	program = removeSpaces(program);

	// Not an application
	if (program[0] != '(') {
		// The value simply gets returned
		return {expression: expression, rest: program};
	};

	// The program skips the opening parenthesis
	program = removeSpaces(program.slice(1));
	// Since the expression is an application
	// it gets assigned different properties and different values
	expression = {type: 'apply', operator: expression, args: []};

	// Looping until the closing parenthesis is found
	while (program[0] != ')') {
		//
		let arg = parseExpression(program);
		//
		expression.args.push(arg.expression);
		//
		if (program[0] == ',') {
			program = removeSpaces(program.slice(1));
		// If there's no closing parenthesis or a comma
		// at the end of the expression
		} else if (program[0] != ')') {
			throw new SyntaxError("Expected ',' or ')'");
		};
	};

	return parseApply(expression, program.slice(1));
};