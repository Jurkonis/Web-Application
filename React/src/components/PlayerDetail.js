import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";
function PlayerDetail({ match }) {
  useEffect(() => {
    fetchPlayer();
  }, []);

  const [item, setItem] = useState({});

  const fetchPlayer = async () => {
    const data = await fetch(`http://localhost:56625/api/players/${match.params.pid}`);
    const item = await data.json();
    setItem(item);
  };

  return (
    <div className="App">
      <h1>Player</h1>
      {<h3 key={item.username}>{item.username}</h3>}
    </div>
  );
}

export default PlayerDetail;
