# Overview

Implementation of the game [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)) in Zokrates using zero-knowledge proofs to prove the presence of letters in a secret word.

The repo contains:
- [Zokrates program](./hangman-contracts/hangman.zok)
- [Solidity contract](./hangman-contracts)
- [React front-end](./hangman-ui/)

Documentation related to the contract and the UI is in the respective sub-folders.

# Zokrates Program

The game is implemented in one Zokrates program that accepts:
- A secret word as a *private* input (an array of ASCII characters with a size of 16)
- A sha-256 hash of the secret word as a public input
- A symbol(letter) that we want to check

The output is a mask that indicates positions of the symbol within the word.

`def main(private u8[16] word, u32[8] hash, u8 symbol) -> bool[16]`

## Example

Let's say the secret word is **ethereum**.

ASCII representation in decimal (padded with zeros to 16 characters) is:

`101 116 104 101 114 101 117 109 0 0 0 0 0 0 0 0`

Therefore the private input is: 

`[101, 116, 104, 101, 114, 101, 117, 109, 0, 0, 0, 0, 0, 0, 0, 0]`

sha-256 hash of this input is: 

`e02e50cf081ce920c2ca5032927f13a07701045f609060b2f9fb9065c4c893c2`

Converted to u32[8] it's:

 `[3761131727, 136112416, 3268038706, 2457801632, 1996555359, 1620074674, 4194013285, 3301479362]`

Letter that we want to check is **e** which is `101`

The output of the program will be [**true**, false, false, **true**, false, **true**, false, false, false, false, false, false, false, false, false, false]

## Run the program

```bash
zokrates compile -i hangman.zok
# Compiling hangman.zok
 
# Compiled code written to 'out'
# Number of constraints: 26519

zokrates setup
# Performing setup...
# Verification key written to 'verification.key'
# Proving key written to 'proving.key'
# Setup completed

zokrates compute-witness -a 65 74 68 65 72 65 75 6d 00 00 00 00 00 00 00 00 3761131727 136112416 3268038706 2457801632 1996555359 1620074674 4194013285 3301479362 101
# Computing witness...
# Witness file written to 'witness'

zokrates generate-proof
# Generating proof...
# Proof written to 'proof.json'

zokrates verify
# Performing verification...
# PASSED
```

# TODO
- Introduce seed to prevent brute-forcing
- UI improvements
- Chain selector
- Test coverage