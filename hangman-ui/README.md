# Overview

This front-end is built based on [Create React App](https://github.com/facebook/create-react-app). 

## Running the app

To run the app you need to add contract address in `config.js`.

Then, in the project directory run `npm start`. This will run the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

## Client-side proof generation

Proofs are generated using [zokrates.js](https://zokrates.github.io/toolbox/zokrates_js.html)

Prooving key is located in the [`public`](./public/) directory and is being served by the web server. Front-end needs to download the key before generating the proof.

Proof generation is CPU-intensive and can block UI for a bit. It usually takes under 30-45 seconds.