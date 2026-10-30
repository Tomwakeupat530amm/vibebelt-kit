// Counts the words in a text for the editor's live counter. A word is a run of letters (with
// their accents), digits or apostrophes; every other character separates words.
export function wordCount(text) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  const words = text.match(/[\p{L}\p{M}\p{N}']+/gu);
  return words === null ? 0 : words.length;
}
