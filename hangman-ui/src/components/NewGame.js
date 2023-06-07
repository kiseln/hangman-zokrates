import { ethers } from 'ethers';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { generateCreateGameProof } from '../proof-generation';
import hangmanContract from '../abi/hangman';
import config from '../config';


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
    
    const proof = await generateCreateGameProof(word, async (status) => { 
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
    
    const signer = await connectWallet();
    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, signer);    
    const tx = await contract.createGame(createGameProof.proof, createGameProof.inputs);
    const receipt = await tx.wait();
    const gameId = receipt.logs[0].topics[0];
    
    setLoading(false);

    navigate(`game/${gameId}`);
  }

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return await provider.getSigner();
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