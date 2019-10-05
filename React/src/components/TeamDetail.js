import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Button } from "reactstrap";
import Axios from "axios";

export default class TeamDetail extends Component {
  state = {
    team: { players: [] },
    newPlayerData: {
      username: "",
      first_name: "",
      last_name: "",
      country: "",
      age: "",
      fk_team: this.props.match.params.tid
    },
    editPlayerData: {
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      age: "",
      country: "",
      fk_rating: "",
      fk_team: this.props.match.params.tid
    },
    newPlayerModal: false,
    editPlayerModal: false,
    config: {
      headers: { Authorization: "bearer " + sessionStorage.getItem("token") }
    }
  };

  componentDidMount() {
    this._refreshTeam();
  }
  toggleNewPlayerModal() {
    this.setState({
      newPlayerModal: !this.state.newPlayerModal
    });
  }

  addPlayer() {
    Axios.post(
      "http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/Players",
      this.state.newPlayerData,
      this.state.config
    ).then(response => {
      let { players } = this.state.team;
      players.push(response.data);
      this.setState({
        players,
        newPlayerModal: false,
        newPlayerData: {
          username: "",
          first_name: "",
          last_name: "",
          country: "",
          age: "",
          fk_team: this.props.match.params.tid
        }
      });
    });
  }

  editPlayer(id, username, first_name, last_name, country, age, fk_rating, fk_team) {
    this.setState({
      editPlayerData: { id, username, first_name, last_name, country, age, fk_rating, fk_team },
      editPlayerModal: !this.state.editPlayerModal
    });
  }

  toggleEditPlayerModal() {
    this.setState({
      editPlayerModal: !this.state.editPlayerModal
    });
  }

  updatePlayer() {
    let { id, username, first_name, last_name, country, age, fk_rating, fk_team } = this.state.editPlayerData;
    Axios.put(
      "http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/Players/" + this.state.editPlayerData.id,
      {
        id,
        username,
        first_name,
        last_name,
        country,
        age,
        fk_rating,
        fk_team
      },
      this.state.config
    ).then(response => {
      this._refreshTeam();
      this.setState({
        editPlayerModal: false,
        editPlayerData: {
          id: "",
          username: "",
          first_name: "",
          last_name: "",
          country: "",
          age: "",
          fk_rating: "",
          fk_team: this.props.match.params.tid
        }
      });
    });
  }

  deletePlayer(id) {
    Axios.delete("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/Players/" + id, this.state.config).then(
      response => {
        this._refreshTeam();
      }
    );
  }

  _refreshTeam() {
    Axios.get("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid).then(response => {
      this.setState({
        team: response.data
      });
    });
  }
  render() {
    let players = this.state.team.players.map(player => {
      return (
        <tr key={player.id}>
          <td>
            <Link to={`${this.props.match.params.tid}/player/${player.id}`} style={{ textDecoration: "none" }}>
              {player.username}
            </Link>
          </td>
          <td>{player.first_name}</td>
          <td>{player.last_name}</td>
          <td>{player.age}</td>
          <td>{player.country}</td>
          {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? (
            <td>
              <Button
                color="success"
                size="sm"
                className="mr-2"
                onClick={this.editPlayer.bind(this, player.id, player.username, player.first_name, player.last_name, player.country, player.age, player.fk_rating, player.fk_team)}
              >
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={this.deletePlayer.bind(this, player.id)}>
                Delete
              </Button>
            </td>
          ) : null}
        </tr>
      );
    });
    return (
      <div className="App container">
        <h2>{this.state.team.name}</h2>
        {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? (
          <Button className="my-3" color="primary" onClick={this.toggleNewPlayerModal.bind(this)}>
            Add Player
          </Button>
        ) : null}
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
        {this.state.team.players.length !== 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Username</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Age</th>
                <th>Country</th>
                {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>{players}</tbody>
          </Table>
        ) : (
          <div className="d-flex justify-content-center">
            <h4>No players</h4>
          </div>
        )}
      </div>
    );
  }
}
