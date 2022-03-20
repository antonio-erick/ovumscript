const {parseExpr, parseApply, parse} = require('./parsers.js');
const {topScope} = require('./topScope.js');
const {operators} = require('./operators.js');

for (const operator of operators) {
  topScope[operator] = Function('a, b', `return a ${operator} b;`);
};

const specialForms = Object.create(null);

specialForms.do = (args, scope) => {
  let value = false;

  for (const arg of args) {
    value = exports.evaluate(arg, scope);
  };
  // Do returns the last value produced
  return value;
};
specialForms.define = (args, scope) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError(`Incorrect use of define`);
  };
  let value = exports.evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
}
specialForms.if = (args, scope) => {
  if (args.length !== 3) {
    throw new SyntaxError(`Wrong number of arguments to if`);
  } else if (exports.evaluate(args[0], scope) !== false) {
    return exports.evaluate(args[1], scope);
  } else {
    return exports.evaluate(args[2], scope);
  };
};
specialForms.while = (args, scope) => {
  // While expects exactly three arguments
  if (args.length !== 2) {
    throw new SyntaxError(`Wrong number of arguments to while`);
  };
  // Looping until all arguments are evaluated
  while (exports.evaluate(args[0], scope) !== false)  {
   exports.evaluate(args[1], scope);
  };
  return false;
};
specialForms.function = function(args, scope) {
  if (!args.length) {
    throw new SyntaxError(`Functions need a body`);
  };
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type !== 'word') {
      throw new SyntaxError(`Parameter names must be words`);
    };
    return expr.name;
  });

  return function() {
    if (arguments.length !== params.length) {
      throw new TypeError(`Wrong number of arguments`);
    };
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    };
    return exports.evaluate(body, localScope);
  };
};

exports.evaluate = function(expr, scope) {
  // A value expression produces its own value
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
      let op = exports.evaluate(operator, scope);
      if (typeof op === 'function') {
        return op(...args.map(arg => exports.evaluate(arg, scope)));
      } else {
        throw new TypeError(`Applying a non-function`);
      };
    };
  };
};

exports.specialForms = specialForms;
