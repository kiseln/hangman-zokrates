# Overview

Implementation of the game [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)) in Zokrates using zero-knowledge proofs to verify the existence of letters in a secret word

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

# Solidity contract

To verify generated proof in solidity we need to provide an input which is an array of 25 elements.

- Elements [0-7] - sha-256 hash of the word
- Element [8] - symbol to verify
- Element [9-25] - expected output of zokrates program

## Game Flow

### Starting a game

To start a game the host provides a proof and an input where Element 8 is `0`:

[3761131727, 136112416, 3268038706, 2457801632, 1996555359, 1620074674, 4194013285, 3301479362, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]

This allows players to figure out the length of the word based on the 0/1 mask at the end of the input. In the example the length is 8 symbols.

Game is started by calling `createGame(Proof proof, uint[25] input)`

### Guessing a letter

To guess a letter player calls `guessLetter(uint gameId, uint8 letter)`. For example: 

`12180669030456798691483404173535495703392310150306364875580628243936442299105, 101)`

This registers symbol `101` as the latest guess.

### Verifying player's guesses

Then it's turn for the game host to proof whether the letter exists in the word. Host again provides a proof and an input. This time Element 8 will be the latest guess, which is `101`:

`[3761131727, 136112416, 3268038706, 2457801632, 1996555359, 1620074674, 4194013285, 3301479362, 101, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

If the proof is accepted, letters 1, 4, and 6 of the word are considered discovered and stored in `game.word`. Once all of the word's letters are discovered, the game ends.

# TODO
- Introduce seed to prevent brute-forcing
- Front-end
- Deploy script
- Gas optimizations
