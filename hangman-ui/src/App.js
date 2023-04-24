import './App.css';
import { proof } from './proof-verification';

function App() {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const word = formData.get("word");

    if (word.length < 3 || word.length > 16) return;

    await proof(word);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Play "Hangman" powered by Zero Knowledge Proofs
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="Form-label">
            Pick a word:
            <input className="Form-text" name="word" type="text" />
          </label>
          <button className="Form-submit" type="submit">Create game</button>
        </form>
      </header>
    </div>
  );
}

export default App;
