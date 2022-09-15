/**
 * Camelize a string, cutting the string by separator character.
 * @param text to camelize
 * @param separator Word separator (string or regexp)
 * @return string Camelized text
 */
 export function camelize(text: string, separator = /[_.\- ]/) {

  // Cut the string into words
  const words = text.split(separator);

  // Concatenate all capitalized words to get camelized string
  let result = "";
  for (let i = 0 ; i < words.length ; i++) {
    const word = words[i];
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    result += capitalizedWord;
  }

  return result;

}
