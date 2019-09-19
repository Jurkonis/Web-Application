import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

function Player() {
  useEffect(() => {
    fetchPlayers();
  }, []);

  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    Axios.get(`http://localhost:56625/api/players`).then(res => {
      setPlayers(res.data);
    });
  };

  return (
    <div className="App">
      <h1>Select player</h1>
      {players.map(item => (
        <h3 key={item.id}>
          <Link to={`/player/${item.id}`} style={{ textDecoration: "none" }}>
            {item.username}
          </Link>
        </h3>
      ))}
    </div>
  );
}

export default Player;
