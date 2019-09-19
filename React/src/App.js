import React from "react";
import Nav from "./Nav";
import About from "./About";
import Home from "./Home";
import Continent from "./components/Continent";
import ContinentDetail from "./components/ContinentDetail";
import Team from "./components/Team";
import TeamDetail from "./components/TeamDetail";
import Player from "./components/Player";
import PlayerDetail from "./components/PlayerDetail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Continent} />
          <Route path="/about" component={About} />
          <Route path="/continents" component={Continent} />
          <Route path="/continent/:cid" exact component={ContinentDetail} />
          <Route path="/teams" component={Team} />
          <Route path="/team/:tid" component={TeamDetail} />
          <Route path="/continent/:cid/team/:tid" exact component={TeamDetail} />
          <Route path="/players" component={Player} />
          <Route path="/player/:pid" component={PlayerDetail} />
          <Route path="/continent/:cid/team/:tid/player/:pid" component={PlayerDetail} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
