import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewGame from './NewGame';
import ExistingGame from './ExistingGame';
import gameLoader from '../data/game-loader';
import config from '../config';
  
const router = createBrowserRouter([
  {
    path: "/",
    element: <NewGame />,
  },
  {
    path: "/game/:id",
    loader: gameLoader,
    element: <ExistingGame />
  }
]);

if (window.ethereum.chainId !== config.chain.chainId) {
  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [config.chain]
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Play "Hangman" powered by Zero Knowledge Proofs
        </h2>
        <div className="App-container">
          <RouterProvider router={router} />
        </div>
      </header>
    </div>
  );
}

export default App;
