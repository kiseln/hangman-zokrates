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

  return (
    <div className="game">
      <WordToGuess length={game.length} word={game.word} />
      <h5>{game.isGuesserTurn ? "It is a player's turn to select a letter" : "It is a turn for the host to verify latest guess"}</h5>
      <LetterSelect game={game} onSubmit={revalidateData} />
      {game.isHost && !game.isGuesserTurn 
        ? <VerifyGuess game={game} onProofSubmitted={revalidateData} />
        : <span></span>
      }
    </div>
  );
}

export default ExistingGame;