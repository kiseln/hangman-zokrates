import './ExistingGame.css';
import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import gameWriter from '../blockchain/game-writer';
import WordToGuess from './WordToGuess';
import LetterSelect from './LetterSelect';
import VerifyGuess from './VerifyGuess';

function ExistingGame() {
  const loadedGame = useLoaderData();
  const [ game, updateGame ] = useState(loadedGame);

  async function handleSubmit(selectedLetter) {
    await gameWriter.suggestLetter(game.id, selectedLetter);
    game.attempts.push(selectedLetter);
    game.isGuesserTurn = false;
    updateGame(game);
  }

  if (game.length === 0) {
    return (<div className="game">Game doesn't exist</div>)
  }

  let form;
  if (game.isHost && !game.isGuesserTurn) {
    form = <VerifyGuess gameId={game.id} latestGuess={game.attempts.slice(-1)} secretWordHash={game.secretWordHash} />;
  } else if (game.isHost) {
    form = <h5>Now it's guesser's turn</h5>
  } else if (!game.isGuesserTurn) {
    form = <h5>Wait for the latest guess to be verified</h5>
  } else {
    form = <LetterSelect attempts={game.attempts} onSubmit={handleSubmit} />;
  }

  return (
    <div className="game">
      <WordToGuess length={game.length} />
      {form}
    </div>
  );
}

export default ExistingGame;