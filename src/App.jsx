import { useState } from "react";
import "./App.css";

function App() {
  const [deckListText, setDeckListText] = useState("");
  const [fetchCardList, setFetchCardList] = useState([]);

  const deckSubmit = () => {
    const names = deckListText
      .split("\n")
      .map((line) => line.split(" ").slice(1).join(" "));
    const query = names.map((n) => `!"${n}"`).join(" or ");
    fetch(`https://api.scryfall.com/cards/search?q=${query}`)
      .then((response) => response.json())
      .then((data) => setFetchCardList(data.data));
  };

  const checkLegality = (c) => {
    return c.legalities.standard === "legal" ? true : false;
  };

  return (
    <div className="App">
      <h1>MTG Standard Deck Checker</h1>
      <textarea
        rows="20"
        cols="33"
        value={deckListText}
        placeholder="Enter Decklist"
        onChange={(e) => setDeckListText(e.target.value)}
      />
      <p>
        <button onClick={deckSubmit}>Submit</button>
      </p>

      {fetchCardList.every(checkLegality) ? (
        <h3>Standard Legal</h3>
      ) : (
        <h3>Not Standard Legal</h3>
      )}
      <div className="result-text">
        {fetchCardList.map((c) =>
          checkLegality(c) ? (
            <div>{c.name}</div>
          ) : (
            <div style={{ color: "red" }}>{c.name}</div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
