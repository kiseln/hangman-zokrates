import { initialize } from "zokrates-js";
import utils from './utils';

function generateCreateGameProof(word, updateStatus) {
    return generateProof(word, "0", updateStatus);
}

function generateLetterProof(word, letter, updateStatus) {
    return generateProof(word, letter, updateStatus);
}

async function generateProof(word, symbol, updateStatus) {
    await updateStatus("Initializing zokrates...");
    const zokratesProvider = await initialize();

    const code = `
        import "hashes/sha256/sha256Padded" as sha256;

        def main(private u8[16] word, u32[8] hash, u8 symbol) -> bool[16] {
            u32[8] computedHash = sha256(word);
            for u32 i in 0..7 {
                assert(computedHash[i] == hash[i]);
            }
        
            bool[16] mut result = [false;16];
            for u32 i in 0..16 {
                bool match = word[i] == symbol;
                result[i] = match;
                assert(result[i] == match);
            }
            
            return result;
        }
    `;

    await updateStatus("Compiling zokrates program...");
    const artifacts = zokratesProvider.compile(code);

    await updateStatus("Computing witness...");
    const { witness } = zokratesProvider.computeWitness(artifacts, generateGameInput(word, symbol));

    await updateStatus("Generating proof...");
    const proovingKey = await getProovingKey();
    const proof = zokratesProvider.generateProof(artifacts.program, witness, proovingKey);

    await updateStatus("");
    
    return proof;
}

function generateGameInput(word, symbol) {
    const input = [[]];

    // First input is a padded word
    for (let i = 0; i < 16; i++) {
        input[0].push(word[i] === undefined ? "0" : word[i].charCodeAt(0).toString());
    }

    // Second input is a hashed word
    const hashedWord = utils.paddedHash(word);
    input.push(hashedWord);

    // Third input is a character we are verifying (0 for new game)
    input.push(symbol);
    return input;
}

async function getProovingKey() {
    const response = await fetch('/proving.key')
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return [...new Uint8Array(buffer)];
}

export default { generateCreateGameProof, generateLetterProof };