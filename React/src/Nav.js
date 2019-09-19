import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  const navStyle = {
    color: "white"
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link style={navStyle} to="/">
        <li className="navbar-brand">Home</li>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link style={navStyle} to="/about">
            <li className="nav-item nav-link">About</li>
          </Link>
          <Link style={navStyle} to="/continents">
            <li className="nav-item nav-link">Continent</li>
          </Link>
          <Link style={navStyle} to="/teams">
            <li className="nav-item nav-link">Team</li>
          </Link>
          <Link style={navStyle} to="/players">
            <li className="nav-item nav-link">Player</li>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
