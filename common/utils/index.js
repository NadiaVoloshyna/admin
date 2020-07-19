/**
 * Replace all the keys of `replacements` in `original` with their values
 *
 * @param {string} original - the original string to make the replacements within
 * @param {Object} [replacements] - an object where the keys are strings to be replaced,
 *                                  and the values are what they should be replaced with
 * @returns {String}
 */
export const insertReplacements = (original, replacements) => {
  if (!original || typeof original !== 'string' || !replacements) {
    return original;
  }
  return Object.keys(replacements).reduce((acc, key) => {
    // Only replace key with brackets around it
    const pattern = RegExp(`\\[${key}\\]`, 'g');
    return acc.replace(pattern, replacements[key]);
  }, original);
};