import { ethers } from 'ethers';
import hangmanContract from '../abi/hangman';
import config from '../config';

async function read(id) {
    const provider = getProvider();
    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, provider);
    
    let events = await contract.queryFilter(
        contract.filters.GameCreated(id)
    );
    
    return { id, length: parseInt(events[0].data) };
}

function getProvider() {
    return new ethers.BrowserProvider(window.ethereum);
}

export default { read };