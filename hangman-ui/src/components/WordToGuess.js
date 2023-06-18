export default function WordToGuess({ length }) {
  return (
    <div>
      <h3>Guess the word below</h3>
      <div className="word">
        {[...Array(length)].map((_, i) =>
          <span className="word-letter" key={i}>_</span>
        )}
      </div>
    </div>
  );
}