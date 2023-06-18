import { ethers } from 'ethers';
import hangmanContract from '../abi/hangman';
import config from '../config';

async function createGame(createGameProof) {
    const signer = await connectWallet();
    
    const tx = await getContract(signer).createGame(createGameProof.proof, createGameProof.inputs);
    const receipt = await tx.wait();
    
    const gameId = receipt.logs[0].topics[1];

    return gameId;
}

async function suggestLetter(gameId, letter) {
    const signer = await connectWallet();

    const tx = await getContract(signer).guessLetter(gameId, letter);
    await tx.wait();
}

async function verifyLetter(verifyLetterProof, gameId) {
    const signer = await connectWallet();

    const tx = await getContract(signer).verifyLetter(verifyLetterProof.proof, verifyLetterProof.inputs, gameId);
    await tx.wait();
}

function getContract(signer) {
    return new ethers.Contract(config.contractAddress, hangmanContract.abi, signer);
}

async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return await provider.getSigner();
}

export default { createGame, suggestLetter, verifyLetter };