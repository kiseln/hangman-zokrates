import { ethers } from 'ethers';
import hangmanContract from '../abi/hangman';
import config from '../config';

async function read(id) {
    const provider = getProvider();
    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, provider);

    const game = await contract.games(id);
    const attempts = await contract.gameAttempts(id);
    const word = await contract.gameWord(id);
    
    return { 
        id,
        length: Number(game.getValue("length")),
        guesserTurn: game.getValue("guesserTurn"),
        attempts: attempts.map(a => Number(a)),
        word: word.map(l => Number(l))
    };
}

function getProvider() {
    return new ethers.BrowserProvider(window.ethereum);
}

export default { read };