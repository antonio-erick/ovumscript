exports.skipSpace = function (string) {
  // All the whitespaces before the first
  // non-whitespace element
  const firstWhitespaces = string.search(/\S/);
  // Verifying if it's an empty string
  if (firstWhitespaces == -1) return '';
  // Returns the string without whitespaces
  // before the first non-whitespace element
  return string.slice(firstWhitespaces);
};