import { initialize } from "zokrates-js";
import sha256 from 'crypto-js/sha256';

async function generateCreateGameProof(word, updateStatus) {
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
    const { witness, _ } = zokratesProvider.computeWitness(artifacts, generateCreateGameInput(word));

    await updateStatus("Generating proof...");
    const proovingKey = await getProovingKey();
    const proof = zokratesProvider.generateProof(artifacts.program, witness, proovingKey);

    await updateStatus("");
    
    return proof;
}

function generateCreateGameInput(word) {
    const input = [[], []];

    // First input is a padded word
    for (var i = 0; i < 16; i++) {
        input[0].push(word[i] === undefined ? "0" : word[i].charCodeAt(0).toString());
    }

    let paddedWord = word;
    for (var i = 0; i < 16 - word.length; i++) {
        paddedWord += String.fromCharCode(0);
    }

    // Second input is a hashed word
    const sha256Array = sha256(paddedWord);
    for (var i = 0; i < 8; i++) {
        const unsignedSha256Word = sha256Array.words[i] >>> 0;
        input[1].push(unsignedSha256Word.toString());
    }

    // Third input is a character we are verifying (0 for new game)
    input.push("0");
    return input;
}

async function getProovingKey() {
    const response = await fetch('./proving.key')
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return [...new Uint8Array(buffer)];
}

export default { generateCreateGameProof };