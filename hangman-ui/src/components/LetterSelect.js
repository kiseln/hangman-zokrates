import './LetterSelect.css';
import { useState } from 'react';
import classNames from "classnames";
import BlockUi from '@availity/block-ui';

export default function LetterSelect({ attempts, word, isGuesserTurn, onSubmit }) {
  const [selectedLetter, updateSelectedLetter] = useState(0);

  function letterAttempted(letter) {
    return attempts.includes(letter);
  }

  function letterPending(letter) {
    return attempts[attempts.length - 1] === letter && !isGuesserTurn;
  }

  function letterCorrect(letter) {
    return word.includes(letter);
  }

  function letterIncorrect(letter) {
    return letterAttempted(letter) && !letterCorrect(letter) && !letterPending(letter);
  }

  function handleSelect(e) {
    const selected = Number(e.target.attributes['code'].value);
    if (letterAttempted(selected)) return;

    if (selected === selectedLetter)
      updateSelectedLetter(0);
    else
      updateSelectedLetter(selected);
  }

  async function handleSubmit() {
    await onSubmit(selectedLetter);
  }

  const charOffset = 97;

  return (
    <BlockUi blocking={!isGuesserTurn}>
      <h5 className="pick-letter">Pick a letter:</h5>
      <div className="alphabet">
        {[...Array(26)].map((_, i) =>
          <span onClick={handleSelect} key={charOffset + i} code={charOffset + i} className={classNames({
            "alphabet-letter": true,
            "alphabet-letter-selected": selectedLetter == charOffset + i,
            "alphabet-letter-pending": letterPending(charOffset + i),
            "alphabet-letter-correct": letterCorrect(charOffset + i),
            "alphabet-letter-incorrect": letterIncorrect(charOffset + i)
          })}>
            {String.fromCharCode(charOffset + i)}
          </span>
        )}
      </div>
      {selectedLetter ? <button onClick={handleSubmit}>Submit</button> : <div></div>}
    </BlockUi>
  );
}