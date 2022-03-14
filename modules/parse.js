const {parseExpression} = require('./parseExpression.js');
const {removeSpaces} = require('./removeSpaces.js');

exports.parse = function parse(program) {
	let {expression, rest} = parseExpression(program);
	if (removeSpaces(rest).length > 0) {
		throw new SyntaxError('Unexpected text after the program');
	};
	return expression;
};