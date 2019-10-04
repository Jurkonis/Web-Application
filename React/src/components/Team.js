import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Button } from "reactstrap";
import Axios from "axios";

class Team extends Component {
  state = {
    teams: [],
    continents: [],
    newTeamData: {
      name: "",
      wins: "",
      defeats: "",
      fk_continent: "1"
    },
    editTeamData: {
      id: "",
      name: "",
      wins: "",
      defeats: "",
      fk_continent: ""
    },
    newTeamModal: false,
    editTeamModal: false
  };

  componentDidMount() {
    Axios.get("http://localhost:56625/api/continents").then(response => {
      this.setState({
        continents: response.data
      });
    });
    this._refreshTeams();
  }

  toggleNewTeamModal() {
    this.setState({
      newTeamModal: !this.state.newTeamModal
    });
  }

  addTeam() {
    console.log(this.state.newTeamData);
    Axios.post("http://localhost:56625/api/Teams", this.state.newTeamData).then(response => {
      let { teams } = this.state;
      teams.push(response.data);
      this.setState({
        teams,
        newTeamModal: false,
        newTeamData: {
          name: "",
          wins: "",
          defeats: "",
          fk_continent: "1"
        }
      });
    });
  }

  editTeam(id, name, wins, defeats, fk_continent) {
    this.setState({
      editTeamData: { id, name, wins, defeats, fk_continent },
      editTeamModal: !this.state.editTeamModal
    });
  }

  toggleEditTeamModal() {
    this.setState({
      editTeamModal: !this.state.editTeamModal
    });
  }

  updateTeam() {
    let { id, name, wins, defeats, fk_continent } = this.state.editTeamData;
    Axios.put("http://localhost:56625/api/Teams/" + this.state.editTeamData.id, { id, name, wins, defeats, fk_continent }).then(response => {
      this._refreshTeams();
      this.setState({
        editTeamModal: false,
        editTeamData: {
          id: "",
          name: "",
          wins: "",
          defeats: "",
          fk_continent: ""
        }
      });
    });
  }

  deleteTeam(id) {
    Axios.delete("http://localhost:56625/api/Teams/" + id).then(response => {
      this._refreshTeams();
    });
  }

  _refreshTeams() {
    Axios.get("http://localhost:56625/api/teams").then(response => {
      this.setState({
        teams: response.data
      });
    });
  }
  render() {
    let teams = this.state.teams.map(team => {
      return (
        <tr key={team.id}>
          <td>
            <Link to={`/team/${team.id}`} style={{ textDecoration: "none" }}>
              {team.name}{" "}
            </Link>
          </td>
          <td>{team.wins}</td>
          <td>{team.defeats}</td>
          <td>{team.fk_continent}</td>
          <td>
            <Button color="success" size="sm" className="mr-2" onClick={this.editTeam.bind(this, team.id, team.name, team.wins, team.defeats, team.fk_continent)}>
              Edit
            </Button>
            <Button color="danger" size="sm" onClick={this.deleteTeam.bind(this, team.id)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <div className="App container">
        <Button className="my-3" color="primary" onClick={this.toggleNewTeamModal.bind(this)}>
          Add Team
        </Button>

        <Modal isOpen={this.state.newTeamModal} toggle={this.toggleNewTeamModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewTeamModal.bind(this)}>Add a new team</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.newTeamData.name}
                onChange={e => {
                  let { newTeamData } = this.state;
                  newTeamData.name = e.target.value;
                  this.setState({ newTeamData });
                }}
              />
              <Label for="wins">Wins</Label>
              <Input
                id="wins"
                value={this.state.newTeamData.wins}
                onChange={e => {
                  let { newTeamData } = this.state;
                  newTeamData.wins = e.target.value;
                  this.setState({ newTeamData });
                }}
              />
              <Label for="defeats">Defeats</Label>
              <Input
                id="defeats"
                value={this.state.newTeamData.defeats}
                onChange={e => {
                  let { newTeamData } = this.state;
                  newTeamData.defeats = e.target.value;
                  this.setState({ newTeamData });
                }}
              />
              <Label for="fk_continent">Continent</Label>
              <Input
                type="select"
                id="fk_continent"
                onChange={e => {
                  let { newTeamData } = this.state;
                  newTeamData.fk_continent = e.target.value;
                  this.setState({ newTeamData });
                }}
              >
                {this.state.continents.map(continent => {
                  return (
                    <option key={continent.id} value={continent.id}>
                      {continent.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addTeam.bind(this)}>
              Add Team
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleNewTeamModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editTeamModal} toggle={this.toggleEditTeamModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditTeamModal.bind(this)}>Edit a team</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.editTeamData.name}
                onChange={e => {
                  let { editTeamData } = this.state;
                  editTeamData.name = e.target.value;
                  this.setState({ editTeamData });
                }}
              />
              <Label for="wins">Wins</Label>
              <Input
                id="wins"
                value={this.state.editTeamData.wins}
                onChange={e => {
                  let { editTeamData } = this.state;
                  editTeamData.wins = e.target.value;
                  this.setState({ editTeamData });
                }}
              />
              <Label for="defeats">Defeats</Label>
              <Input
                id="defeats"
                value={this.state.editTeamData.defeats}
                onChange={e => {
                  let { editTeamData } = this.state;
                  editTeamData.defeats = e.target.value;
                  this.setState({ editTeamData });
                }}
              />
              <Label for="fk_continent">Continent</Label>
              <Input
                type="select"
                id="fk_continent"
                value={this.state.editTeamData.fk_continent}
                onChange={e => {
                  let { editTeamData } = this.state;
                  editTeamData.fk_continent = e.target.value;
                  this.setState({ editTeamData });
                }}
              >
                {this.state.continents.map(continent => {
                  return (
                    <option key={continent.id} value={continent.id}>
                      {continent.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateTeam.bind(this)}>
              Update Team
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleEditTeamModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Wins</th>
              <th>Defeats</th>
              <th>Continent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{teams}</tbody>
        </Table>
      </div>
    );
  }
}

export default Team;
