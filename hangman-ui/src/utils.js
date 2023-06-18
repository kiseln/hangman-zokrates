import sha256 from 'crypto-js/sha256';

// Generates hash of the word padded to 16 characters. Outputs in the format required for proof generation.
function paddedHash(word) {
  if (word.length > 16) throw new Error("Word must be 16 characters or less.");

  let result = [];

  let paddedWord = word;
  for (var i = 0; i < 16 - word.length; i++) {
      paddedWord += String.fromCharCode(0);
  }

  // Second input is a hashed word
  const sha256Array = sha256(paddedWord);
  for (var i = 0; i < 8; i++) {
      const unsignedSha256Word = sha256Array.words[i] >>> 0;
      result.push(unsignedSha256Word.toString());
  }

  return result;
}

export default { paddedHash };