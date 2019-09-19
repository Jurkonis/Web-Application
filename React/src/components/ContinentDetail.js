import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function ContinentDetail({ match }) {
  useEffect(() => {
    fetchContinent();
  }, []);

  const [item, setItem] = useState({
    teams: []
  });

  const fetchContinent = async () => {
    const data = await fetch(`http://localhost:56625/api/continents/${match.params.cid}`);
    const item = await data.json();
    setItem(item);
  };

  return (
    <div className="App">
      <h1>Continent</h1>
      {item.teams.map(team => (
        <h3 key={team.id}>
          <Link to={`/continent/${item.id}/team/${team.id}`} style={{ textDecoration: "none" }}>
            {team.name.replace("_", " ")}
          </Link>
        </h3>
      ))}
    </div>
  );
}

export default ContinentDetail;
