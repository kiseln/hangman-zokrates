import './App.css';
import { generateCreateGameProof } from './proof-generation';
import { ethers } from 'ethers';
import hangmanContract from './abi/hangman';
import config from './config';
import { useState } from 'react';

function App() {
  const [createGameProof, setCreateGameProof] = useState();
  const [status, setStatus] = useState();

  async function handleGenerateProof(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const word = formData.get("word");

    if (word.length < 3 || word.length > 16) return;
    
    const proof = await generateCreateGameProof(word, async (status) => { 
      setStatus(status);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      }) 
    });
    
    setCreateGameProof(proof);
  }

  async function handleSubmitProofToCreateGame(e) {    
    e.preventDefault();
    
    const signer = await connectWallet();
    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, signer);    
    const tx = await contract.createGame(createGameProof.proof, createGameProof.inputs);
    await tx.wait();
  }

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return await provider.getSigner();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Play "Hangman" powered by Zero Knowledge Proofs
        </h2>
        {!createGameProof ?
        (<form name="generate-proof" onSubmit={handleGenerateProof}>
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
      </header>
    </div>
  );
}

export default App;
