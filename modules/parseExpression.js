// removeSpaces removes all whitespace from a string
const { removeSpaces } = require('./removeSpaces.js');

// Main parser for the language
exports.parseExpression = function parseExpression(program) {
	program = removeSpaces(program);
	let match, expression;

	// Strings
	if (match = /^"([^"]*)"/.exec(program)) {
		return expression = {type: 'value', value: match[1]};

	// Numbers
	} else if (match = /^\d+\b/.exec(program)) {
		return expression = {type: 'value', value: match[0]};

	// Words
	} else if (match = /^[^\s(),#"]+/.exec(program)) {
		expression = {type: 'word', name: match[0]};

	// If the program doesn't match any of the expression types
	} else throw new SyntaxError(`Unexpected syntax ${program}`);
	
	// Using parseApply to check if the expression is an application
	return parseApply(expression, program.slice(match[0].length));
};