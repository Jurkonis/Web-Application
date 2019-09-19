import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function TeamDetail({ match }) {
  useEffect(() => {
    fetchTeam();
  }, []);

  const [item, setItem] = useState({
    players: []
  });

  const fetchTeam = async () => {
    const data = await fetch(`http://localhost:56625/api/teams/${match.params.tid}`);
    const item = await data.json();
    setItem(item);
    console.log(item);
  };

  return (
    <div className="App">
      <h1>Team</h1>
      {item.players.map(player => (
        <Link to={`/continent/${match.params.cid}/team/${item.id}/player/${player.id}`} style={{ textDecoration: "none" }}>
          <h3>{player.username}</h3>
        </Link>
      ))}
    </div>
  );
}

export default TeamDetail;
