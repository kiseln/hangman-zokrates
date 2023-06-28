export default function WordToGuess({ game }) {
  return (
    <div className="word">
      {[...Array(game.length)].map((_, i) =>
        <span className="word-letter" key={i}>
          {game.word[i] === 0 ? "_" : String.fromCharCode(game.word[i])}
        </span>
      )}
    </div>
  );
}