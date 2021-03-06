import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Button } from "reactstrap";
import Axios from "axios";

class Player extends Component {
  state = {
    Players: [],
    teams: [],
    newPlayerData: {
      username: "",
      first_name: "",
      last_name: "",
      country: "",
      age: "",
      fk_team: "1"
    },
    editPlayerData: {
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      country: "",
      age: "",
      fk_team: ""
    },
    newPlayerModal: false,
    editPlayerModal: false
  };

  componentDidMount() {
    Axios.get("http://localhost:56625/api/teams").then(response => {
      this.setState({
        teams: response.data
      });
    });
    this._refreshPlayers();
  }

  toggleNewPlayerModal() {
    this.setState({
      newPlayerModal: !this.state.newPlayerModal
    });
  }

  addPlayer() {
    Axios.post("http://localhost:56625/api/Players", this.state.newPlayerData).then(response => {
      let { Players } = this.state;
      Players.push(response.data);
      this.setState({
        Players,
        newPlayerModal: false,
        newPlayerData: {
          username: "",
          first_name: "",
          last_name: "",
          country: "",
          age: "",
          fk_team: "1"
        }
      });
    });
  }

  editPlayer(id, username, first_name, last_name, country, age, fk_team) {
    this.setState({
      editPlayerData: { id, username, first_name, last_name, country, age, fk_team },
      editPlayerModal: !this.state.editPlayerModal
    });
  }

  toggleEditPlayerModal() {
    this.setState({
      editPlayerModal: !this.state.editPlayerModal
    });
  }

  updatePlayer() {
    let { id, username, first_name, last_name, country, age, fk_team } = this.state.editPlayerData;
    Axios.put("http://localhost:56625/api/Players/" + this.state.editPlayerData.id, { id, username, first_name, last_name, country, age, fk_team }).then(response => {
      this._refreshPlayers();
      this.setState({
        editPlayerModal: false,
        editPlayerData: {
          id: "",
          username: "",
          first_name: "",
          last_name: "",
          country: "",
          age: "",
          fk_team: ""
        }
      });
    });
  }

  deletePlayer(id) {
    Axios.delete("http://localhost:56625/api/Players/" + id).then(response => {
      this._refreshPlayers();
    });
  }

  _refreshPlayers() {
    Axios.get("http://localhost:56625/api/Players").then(response => {
      this.setState({
        Players: response.data
      });
    });
  }
  render() {
    let Players = this.state.Players.map(Player => {
      return (
        <tr key={Player.id}>
          <td>
            <Link to={`/player/${Player.id}`} style={{ textDecoration: "none" }}>
              {Player.username}
            </Link>
          </td>
          <td>{Player.first_name}</td>
          <td>{Player.last_name}</td>
          <td>
            <Button
              color="success"
              size="sm"
              className="mr-2"
              onClick={this.editPlayer.bind(this, Player.id, Player.username, Player.first_name, Player.last_name, Player.country, Player.age, Player.fk_team)}
            >
              Edit
            </Button>
            <Button color="danger" size="sm" onClick={this.deletePlayer.bind(this, Player.id)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <div className="App container">
        <Button className="my-3" color="primary" onClick={this.toggleNewPlayerModal.bind(this)}>
          Add Player
        </Button>

        <Modal isOpen={this.state.newPlayerModal} toggle={this.toggleNewPlayerModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewPlayerModal.bind(this)}>Add a new Player</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                value={this.state.newPlayerData.username}
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.username = e.target.value;
                  this.setState({ newPlayerData });
                }}
              />
              <Label for="first_name">First name</Label>
              <Input
                id="first_name"
                value={this.state.newPlayerData.first_name}
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.first_name = e.target.value;
                  this.setState({ newPlayerData });
                }}
              />
              <Label for="last_name">Last name</Label>
              <Input
                id="last_name"
                value={this.state.newPlayerData.last_name}
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.last_name = e.target.value;
                  this.setState({ newPlayerData });
                }}
              />
              <Label for="country">Country</Label>
              <Input
                id="country"
                value={this.state.newPlayerData.country}
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.country = e.target.value;
                  this.setState({ newPlayerData });
                }}
              />
              <Label for="age">Age</Label>
              <Input
                id="age"
                value={this.state.newPlayerData.age}
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.age = e.target.value;
                  this.setState({ newPlayerData });
                }}
              />
              <Label for="fk_team">Team</Label>
              <Input
                type="select"
                id="fk_team"
                onChange={e => {
                  let { newPlayerData } = this.state;
                  newPlayerData.fk_team = e.target.value;
                  this.setState({ newPlayerData });
                }}
              >
                {this.state.teams.map(team => {
                  return (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addPlayer.bind(this)}>
              Add Player
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleNewPlayerModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editPlayerModal} toggle={this.toggleEditPlayerModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditPlayerModal.bind(this)}>Edit a Player</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                value={this.state.editPlayerData.username}
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.username = e.target.value;
                  this.setState({ editPlayerData });
                }}
              />
              <Label for="first_name">First name</Label>
              <Input
                id="first_name"
                value={this.state.editPlayerData.first_name}
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.first_name = e.target.value;
                  this.setState({ editPlayerData });
                }}
              />
              <Label for="last_name">Last name</Label>
              <Input
                id="last_name"
                value={this.state.editPlayerData.last_name}
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.last_name = e.target.value;
                  this.setState({ editPlayerData });
                }}
              />
              <Label for="country">Country</Label>
              <Input
                id="country"
                value={this.state.editPlayerData.country}
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.country = e.target.value;
                  this.setState({ editPlayerData });
                }}
              />
              <Label for="age">Age</Label>
              <Input
                id="age"
                value={this.state.editPlayerData.age}
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.age = e.target.value;
                  this.setState({ editPlayerData });
                }}
              />
              <Label for="fk_team">Team</Label>
              <Input
                type="select"
                id="fk_team"
                onChange={e => {
                  let { editPlayerData } = this.state;
                  editPlayerData.fk_team = e.target.value;
                  this.setState({ editPlayerData });
                }}
              >
                {this.state.teams.map(team => {
                  return (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updatePlayer.bind(this)}>
              Update Player
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleEditPlayerModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{Players}</tbody>
        </Table>
      </div>
    );
  }
}

export default Player;
