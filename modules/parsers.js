const {skipSpace} = require('./skipSpace.js');

exports.parseExpr = function(program) {
	// Skipping whitespaces
  program = skipSpace(program);
  let match, expr;
  // String expression
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
   // Number expression
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
   // Word expression
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
   // Syntax error if the expression doesn't match
   // Ovale's data patterns
  } else {
    throw new SyntaxError(`Unexpected syntax: ${program}`);
  };
  // Verifying if the expression is an application
  return exports.parseApply(expr, program.slice(match[0].length));
};

exports.parseApply = function(expr, program) {
	// Skipping whitespaces
  program = skipSpace(program);
  // Checking for an opening parenthesis
  if (program[0] !== '(') {
    // Returning the expression it was given
    return {expr: expr, rest: program};
  };
  // Skipping the opening parenthesis
  program = skipSpace(program.slice(1));
  // Defining this expression as an application
  expr = {type: 'apply', operator: expr, args: []};
  // Looping until a closing parenthesis is found
  while (program[0] != ')') {
    // Parsing the arguments
    let arg = exports.parseExpr(program);
    expr.args.push(arg.expr);
    // 
    program = skipSpace(arg.rest);
    if (program[0] == ',') {
      // Skipping the comma and the whitespaces
      program = skipSpace(program.slice(1));
    // If the expression doesn't have a closing parenthesis
    } else if (program[0] != ')') {
      throw new SyntaxError(`Expected ',' or ')'`);
    };
  };
  // Recursion to check if there's anything left to do
  return exports.parseApply(expr, program.slice(1));
};

// Verifying that the expression has reached its end
exports.parse = function(program) {
  const {expr, rest} = exports.parseExpr(program);
  // If for some reason rest has unparsed text
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after the program");
  };
  // Returning the syntax tree
  return expr;
};