import './ExistingGame.css';
import { useLoaderData } from 'react-router-dom';

function ExistingGame() {
  const game = useLoaderData();

  return (
    <div>
      <h2>Existing Game</h2>
      <div>
        {[...Array(game.length)].map((x, i) =>
          <span className="word-letter" key={i}>_</span>
        )}
      </div>
    </div>
  );
}

export default ExistingGame;