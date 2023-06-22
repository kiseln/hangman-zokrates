# Overview

The resulting contract is built using Zokrates output with additional game related logic.

The project is configured with hardhat. Before running commands rename `.env.example`  to `env` and populate values.

- `npx hardhat compile` to build the project
- `npx hardhat run scripts/deploy.js` to deploy.

# Proof verification

> To understand this section make sure to read Zokrates section from the [main](../README.md) README.

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

`(12180669030456798691483404173535495703392310150306364875580628243936442299105, 101)`

This registers symbol `101` as the latest guess.

### Verifying player's guesses

Then it's turn for the game host to prove whether the letter exists in the word. Host again provides a proof and an input. This time Element 8 will be the latest guess, which is `101`:

`[3761131727, 136112416, 3268038706, 2457801632, 1996555359, 1620074674, 4194013285, 3301479362, 101, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

If the proof is accepted, letters 1, 4, and 6 of the word are considered discovered and stored in `game.word`. Once all of the word's letters are discovered, the game ends.