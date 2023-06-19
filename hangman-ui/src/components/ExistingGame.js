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

  return (
    <div className="game">
      <WordToGuess length={game.length} word={game.word} />
      <h5>{game.isGuesserTurn ? "It is a player's turn to select a letter" : "It is a turn for the host to verify latest guess"}</h5>
      <LetterSelect attempts={game.attempts} word={game.word} isGuesserTurn={game.isGuesserTurn} onSubmit={handleSubmit} />
      {game.isHost && !game.isGuesserTurn 
        ? <VerifyGuess gameId={game.id} latestGuess={game.attempts.slice(-1)} secretWordHash={game.secretWordHash} />
        : <span></span>
      }
    </div>
  );
}

export default ExistingGame;