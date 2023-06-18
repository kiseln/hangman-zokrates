export default function WordToGuess({ length, word }) {
  return (
    <div>
      <h3>Guess the word below</h3>
      <div className="word">
        {[...Array(length)].map((_, i) =>
          <span className="word-letter" key={i}>
            {word[i] === 0 ? "_" : String.fromCharCode(word[i])}
          </span>
        )}
      </div>
    </div>
  );
}