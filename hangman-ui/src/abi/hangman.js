export default
{
    "abi": [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            }
          ],
          "name": "GameAlreadyExsits",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            }
          ],
          "name": "GameNotActive",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "letter",
              "type": "uint8"
            }
          ],
          "name": "InvalidGuess",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidProof",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            }
          ],
          "name": "InvalidWordHash",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            }
          ],
          "name": "InvalidWordInput",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "wordLength",
              "type": "uint8"
            }
          ],
          "name": "InvalidWordLength",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "letter",
              "type": "uint8"
            }
          ],
          "name": "LetterWasUsed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            }
          ],
          "name": "NotAStartGameInput",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotGuesserTurn",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "latestGuess",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "verificationForGuess",
              "type": "uint8"
            }
          ],
          "name": "NotLatestGuess",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotTurnToVerify",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint8",
              "name": "wordLength",
              "type": "uint8"
            }
          ],
          "name": "GameCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint8[16]",
              "name": "word",
              "type": "uint8[16]"
            }
          ],
          "name": "GameEnded",
          "type": "event"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "a",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256[2]",
                      "name": "X",
                      "type": "uint256[2]"
                    },
                    {
                      "internalType": "uint256[2]",
                      "name": "Y",
                      "type": "uint256[2]"
                    }
                  ],
                  "internalType": "struct Pairing.G2Point",
                  "name": "b",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "c",
                  "type": "tuple"
                }
              ],
              "internalType": "struct Verifier.Proof",
              "name": "proof",
              "type": "tuple"
            },
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            }
          ],
          "name": "createGame",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "letter",
              "type": "uint8"
            }
          ],
          "name": "guessLetter",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "a",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256[2]",
                      "name": "X",
                      "type": "uint256[2]"
                    },
                    {
                      "internalType": "uint256[2]",
                      "name": "Y",
                      "type": "uint256[2]"
                    }
                  ],
                  "internalType": "struct Pairing.G2Point",
                  "name": "b",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "c",
                  "type": "tuple"
                }
              ],
              "internalType": "struct Verifier.Proof",
              "name": "proof",
              "type": "tuple"
            },
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            },
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            }
          ],
          "name": "verifyLetter",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "a",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256[2]",
                      "name": "X",
                      "type": "uint256[2]"
                    },
                    {
                      "internalType": "uint256[2]",
                      "name": "Y",
                      "type": "uint256[2]"
                    }
                  ],
                  "internalType": "struct Pairing.G2Point",
                  "name": "b",
                  "type": "tuple"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "X",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "Y",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Pairing.G1Point",
                  "name": "c",
                  "type": "tuple"
                }
              ],
              "internalType": "struct Verifier.Proof",
              "name": "proof",
              "type": "tuple"
            },
            {
              "internalType": "uint256[25]",
              "name": "input",
              "type": "uint256[25]"
            }
          ],
          "name": "verifyTx",
          "outputs": [
            {
              "internalType": "bool",
              "name": "r",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
}