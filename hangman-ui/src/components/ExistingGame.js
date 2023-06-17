import './ExistingGame.css';
import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import classNames from "classnames";
import gameWriter from '../blockchain/game-writer';

function ExistingGame() {
  const game = useLoaderData();
  const [selectedLetter, updateSelectedLetter] = useState(0);

  function letterAttempted(letter) {
    return game.attempts.includes(letter);
  }

  function handleSelect(e) {
    const selected = e.target.attributes['code'].value;
    if (selected === selectedLetter)
      updateSelectedLetter(0);
    else
      updateSelectedLetter(selected);
  }

  async function handleSubmit() {
    await gameWriter.suggestLetter(game.id, selectedLetter);
  }

  if (game.length === 0) {
    return (<div className="game">Game doesn't exist</div>)
  }

  return (
    <div className="game">
      <h3>Guess the word below</h3>
      <div className="word">
        {[...Array(game.length)].map((_, i) =>
          <span className="word-letter" key={i}>_</span>
        )}
      </div>
      <h5 className="pick-letter">Pick a letter:</h5>
      <div className="alphabet">
        {[...Array(26)].map((_, i) =>
          <span onClick={handleSelect} key={97+i} code={97+i} className={classNames({
            "alphabet-letter": true,
            "alphabet-letter-selected": selectedLetter == 97+i,
            "alphabet-letter-attempted": letterAttempted(97+i)
          })}>            
            {String.fromCharCode(97+i)}
          </span>
        )}
      </div>
      {selectedLetter ? <button onClick={handleSubmit}>Submit</button> : <div></div>}
    </div>
  );
}

export default ExistingGame;