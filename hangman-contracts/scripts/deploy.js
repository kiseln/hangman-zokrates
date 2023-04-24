async function main() {
    const hangmanFactory = await ethers.getContractFactory("Hangman");
 
    // Start deployment, returning a promise that resolves to a contract object
    const hangman = await hangmanFactory.deploy();
    console.log("Contract deployed to address:", hangman.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });