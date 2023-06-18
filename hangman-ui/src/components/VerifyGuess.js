import { useState } from 'react';
import prover from '../proof-generation';
import gameWriter from '../blockchain/game-writer';
import utils from '../utils';

export default function VerifyGuess({ gameId, latestGuess, secretWordHash }) {
  const [proof, setProof] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState();

  async function handleGenerateProof(e) {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const word = formData.get("word");
    
    const hash = utils.paddedHash(word);
    for (var i = 0; i < 8; i++) {
      if (Number(hash[i]) !== secretWordHash[i]) {
        setStatus("Secret word is not correct, hashes don't match!");
        return;
      }
    }

    const proof = await prover.generateLetterProof(word, latestGuess.toString(), async (status) => { 
      setStatus(status);
      setLoading(true);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      }) 
    });
    
    setLoading(false);
    setProof(proof);
  }

  async function handleSubmitProof(e) {
    e.preventDefault();
    
    setLoading(true);    
    await gameWriter.verifyLetter(proof, gameId);    
    setLoading(false);
  }

  return(
    <div>
      <div className={`Fade ${loading ? "Fade-display" : ""}`}></div>
      <h5>The current guess is <span style={{color:"orange"}}>{String.fromCharCode(latestGuess)}</span></h5>

      {!proof ?
      (<form className="Form" name="generate-proof" onSubmit={handleGenerateProof}>
          <label className="Form-label">
          To generate proof for the guess re-enter the secret word:
          <input className="Form-text" name="word" type="text" />
          </label>
          <button className="Form-submit" type="submit">Generate proof</button>
      </form>) :

      (<form name="submit-proof" onSubmit={handleSubmitProof}>
          <button className="Form-submit" type="submit">Submit proof</button>
      </form>)
      }
      {status}
    </div>
  );
}