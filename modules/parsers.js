const {skipSpace} = require('./skipSpace.js');

function parseExpr(program) {
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
  return parseApply(expr, program.slice(match[0].length));
};

function parseApply(expr, program) {
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
    let arg = parseExpr(program);
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
  return parseApply(expr, program.slice(1));
};

// Verifying that the expression has reached its end
function parse(program) {
  const {expr, rest} = parseExpr(program);
  // If for some reason rest has unparsed text
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after the program");
  };
  // Returning the syntax tree
  return expr;
};

const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;
topScope.print = value => {
  console.log(value);
  return value;
};
const specialForms = Object.create(null);
specialForms.do = (args, scope) => {
  let value = false;
  for (let arg of args) {
    value = evaluate(arg, scope);
  };
  return value;
};
specialForms.define = (args, scope) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError(`Incorrect use of define`);
  };
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
}
specialForms.if = (args, scope) => {
  if (args.length !== 3) {
    throw new SyntaxError(`Wrong number of arguments to if`);
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  };
};
specialForms.while = (args, scope) => {
  if (args.length !== 2) {
    throw new SyntaxError(`Wrong number of arguments to while`);
  };
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  };
  return false;
};
let prog = parse('if(true, false, true)');
for (let op of ['+', '-', '*', '/', '==', '<', '>']) {
  topScope[op] = Function('a, b', `return a ${op} b;`);
};
function evaluate(expr, scope) {
  // A value expression produces its value
  if (expr.type === 'value') {
    return expr.value;
  // A binding fetches its value(if it exists)
  } else if (expr.type === 'word') {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(`Undefined binding ${expr.name}`);
    };
  // An application must first define its form 
  } else if (expr.type === 'apply') {
    let {operator, args} = expr;
    // If its a specialForm the application passes the arguments
    // alongside the scope and does nothing else
    if (operator.type === 'word' && operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    // For a normal call the operator is evaluated and
    // called with its arguments
    } else {
      let op = evaluate(operator, scope);
      if (typeof op === 'function') {
        return op(...args.map(arg => evaluate(arg, scope)));
      // Not a function
      } else {
        throw new TypeError(`Applying a non-function`);
      };
    };
  };
};

exports.run = function(program) {
  return evaluate(parse(program), Object.create(topScope));
};
