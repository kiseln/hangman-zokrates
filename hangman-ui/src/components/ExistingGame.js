import './ExistingGame.css';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import WordToGuess from './WordToGuess';
import LetterSelect from './LetterSelect';
import VerifyGuess from './VerifyGuess';

function ExistingGame() {
  const game = useLoaderData();
  const revalidator = useRevalidator();

  function revalidateData() {
    revalidator.revalidate();
  }

  if (game.length === 0) {
    return (<div className="game">Game doesn't exist</div>)
  }

  const gameFinished = game.word
    .slice(0, game.length)
    .every(v => v !== 0);

  return (
    <div className="game">
      <div>
        <h3>{gameFinished ? "Game finished!" : "Guess the word below"}</h3>
        <WordToGuess game={game} />
      </div>
      <h5>{gameFinished ? "" : game.isGuesserTurn ? "It is a player's turn to select a letter" : "It is a turn for the host to verify latest guess"}</h5>
      <LetterSelect game={game} onSubmit={revalidateData} />
      {game.isHost && !game.isGuesserTurn 
        ? <VerifyGuess game={game} onProofSubmitted={revalidateData} />
        : <span></span>
      }
    </div>
  );
}

export default ExistingGame;