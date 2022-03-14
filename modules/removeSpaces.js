// Repeatedly removes whitespace from a string
exports.removeSpaces = function removeSpaces(string) {
	// Whitespace to be removed
	const first = string.search(/\S/);

	// If there are no elements besides whitespace,
	// returns an empty string
	if (first == -1) return '';
	
	// Returns the string without the whitespace,
	// at the position search was working on
	return string.slice(first);
};