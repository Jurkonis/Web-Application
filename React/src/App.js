import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Continent from "./components/Continent";
import ContinentDetail from "./components/ContinentDetail";
import TeamDetail from "./components/TeamDetail";
import PlayerDetail from "./components/PlayerDetail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Continent} />
          <Route path="/continents" component={Continent} />
          <Route path="/continent/:cid" exact component={ContinentDetail} />
          <Route path="/continent/:cid/team/:tid" exact component={TeamDetail} />
          <Route path="/continent/:cid/team/:tid/player/:pid" component={PlayerDetail} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
