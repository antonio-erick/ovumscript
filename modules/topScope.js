const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;
topScope.print = value => {
  console.log(value);
  return value;
};
topScope.array = (...values) => {
  return [...values];
};
topScope.length = (array) => {
  if (typeof array !== 'object') {
    throw new SyntaxError(`Invalid array: ${array}`);
  };
  return array.length;
};
topScope.element = (array, n) => {
  return array[n - 1];
};

exports.topScope = topScope;