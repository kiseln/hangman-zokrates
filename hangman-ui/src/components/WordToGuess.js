export default function WordToGuess({ game }) {
  const gameFinished = game.word
    .slice(0, game.length)
    .every(v => v !== 0);

  return (
    <div>
      <h3>{gameFinished ? "Game finished!" : "Guess the word below"}</h3>
      <div className="word">
        {[...Array(game.length)].map((_, i) =>
          <span className="word-letter" key={i}>
            {game.word[i] === 0 ? "_" : String.fromCharCode(game.word[i])}
          </span>
        )}
      </div>
    </div>
  );
}