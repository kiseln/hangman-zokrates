import { useState } from 'react';
import classNames from "classnames";

export default function LetterSelect({ attempts, onSubmit }) {
  const [selectedLetter, updateSelectedLetter] = useState(0);

  function letterAttempted(letter) {
    return attempts.includes(letter);
  }

  function handleSelect(e) {
    const selected = Number(e.target.attributes['code'].value);
    if (letterAttempted(selected)) return;

    if (selected === selectedLetter)
      updateSelectedLetter(0);
    else
      updateSelectedLetter(selected);
  }

  function handleSubmit() {
    onSubmit(selectedLetter);
  }

  return (
    <div>
      <h5 className="pick-letter">Pick a letter:</h5>
      <div className="alphabet">
        {[...Array(26)].map((_, i) =>
          <span onClick={handleSelect} key={97 + i} code={97 + i} className={classNames({
            "alphabet-letter": true,
            "alphabet-letter-selected": selectedLetter == 97 + i,
            "alphabet-letter-attempted": letterAttempted(97 + i)
          })}>
            {String.fromCharCode(97 + i)}
          </span>
        )}
      </div>
      {selectedLetter ? <button onClick={handleSubmit}>Submit</button> : <div></div>}
    </div>
  );
}