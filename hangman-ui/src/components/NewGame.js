import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import prover from '../proof-generation';
import gameWriter from '../blockchain/game-writer';


function NewGame() {
  const [createGameProof, setCreateGameProof] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  async function handleGenerateProof(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const word = formData.get("word");

    if (word.length < 3 || word.length > 16) return;
    
    const proof = await prover.generateCreateGameProof(word, async (status) => { 
      setStatus(status);
      setLoading(true);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      }) 
    });
    
    setLoading(false);
    setCreateGameProof(proof);
  }

  async function handleSubmitProofToCreateGame(e) {    
    e.preventDefault();
    
    setLoading(true);    
    const gameId = await gameWriter.createGame(createGameProof);    
    setLoading(false);

    navigate(`game/${gameId}`);
  }

  return (
    <div>
      <div className={`Fade ${loading ? "Fade-display" : ""}`}></div>

      {!createGameProof ?
      (<form className="Form" name="generate-proof" onSubmit={handleGenerateProof}>
          <label className="Form-label">
          Pick a word:
          <input className="Form-text" name="word" type="text" />
          </label>
          <button className="Form-submit" type="submit">Generate proof</button>
      </form>) :

      (<form name="submit-proof" onSubmit={handleSubmitProofToCreateGame}>
          <button className="Form-submit" type="submit">Create game</button>
      </form>)
      }
      {status}
    </div>
  );
}

export default NewGame;