const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;
topScope.print = value => {
  console.log(value);
  return value;
};

exports.topScope = topScope;