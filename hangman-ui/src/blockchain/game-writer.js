import { ethers } from 'ethers';
import hangmanContract from '../abi/hangman';
import config from '../config';

async function createGame(createGameProof) {
    const signer = await connectWallet();
    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, signer);    
    
    const tx = await contract.createGame(createGameProof.proof, createGameProof.inputs);
    const receipt = await tx.wait();
    
    const gameId = receipt.logs[0].topics[0];

    return gameId;
}

async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return await provider.getSigner();
}

export default { createGame };