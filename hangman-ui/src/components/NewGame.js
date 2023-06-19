import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import BlockUi from '@availity/block-ui';
import prover from '../proof-generation';
import gameWriter from '../blockchain/game-writer';


function NewGame() {
  const [createGameProof, setCreateGameProof] = useState();
  const [[loading, loadingMessage], setLoading] = useState([false, ""]);
  const navigate = useNavigate();

  async function handleGenerateProof(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const word = formData.get("word");

    if (word.length < 3 || word.length > 16) return;
    
    const proof = await prover.generateCreateGameProof(word, async (status) => { 
      setLoading([true, status]);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      }) 
    });
    
    setLoading([false, ""]);
    setCreateGameProof(proof);
  }

  async function handleSubmitProofToCreateGame(e) {
    e.preventDefault();
    
    setLoading([true, "Submitting transaction"]);
    const gameId = await gameWriter.createGame(createGameProof);    
    setLoading([false, ""]);

    navigate(`game/${gameId}`);
  }

  return (
    <BlockUi blocking={loading} message={loadingMessage}>
      <div className={`Fade ${loading ? "Fade-display" : ""}`}></div>

      <h5>Choose a secret word (3-16 characters)</h5>
      {!createGameProof ?
      (<form className="Form" name="generate-proof" onSubmit={handleGenerateProof}>
          <input className="Form-text" name="word" type="text" />
          <button className="Form-submit" type="submit">Generate proof</button>
      </form>) :

      (<form name="submit-proof" onSubmit={handleSubmitProofToCreateGame}>
          <button className="Form-submit" type="submit">Create game (submit proof to the blockchain)</button>
      </form>)
      }
    </BlockUi>
  );
}

export default NewGame;