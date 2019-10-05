import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Button } from "reactstrap";
import Axios from "axios";

export default class ContinentDetail extends Component {
  state = {
    continent: { teams: [] },
    newTeamData: {
      name: "",
      wins: "",
      defeats: "",
      fk_continent: this.props.match.params.cid
    },
    editTeamData: {
      id: "",
      name: "",
      wins: "",
      defeats: "",
      fk_continent: this.props.match.params.cid
    },
    newTeamModal: false,
    editTeamModal: false,
    config: {
      headers: { Authorization: "bearer " + sessionStorage.getItem("token") }
    }
  };

  componentDidMount() {
    this._refreshContinent();
  }
  toggleNewTeamModal() {
    this.setState({
      newTeamModal: !this.state.newTeamModal
    });
  }

  addTeam() {
    Axios.post("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams", this.state.newTeamData, this.state.config).then(response => {
      let { teams } = this.state.continent;
      teams.push(response.data);
      this.setState({
        teams,
        newTeamModal: false,
        newTeamData: {
          name: "",
          wins: "",
          defeats: "",
          fk_continent: this.props.match.params.cid
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
    Axios.put(
      "http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.state.editTeamData.id,
      { id, name, wins, defeats, fk_continent },
      this.state.config
    ).then(response => {
      this._refreshContinent();
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
    Axios.delete("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + id, this.state.config).then(response => {
      this._refreshContinent();
    });
  }

  _refreshContinent() {
    Axios.get("http://localhost:56625/api/continents/" + this.props.match.params.cid).then(response => {
      this.setState({
        continent: response.data
      });
    });
  }
  render() {
    let teams = this.state.continent.teams.map(team => {
      return (
        <tr key={team.id}>
          <td>
            <Link to={`${this.props.match.params.cid}/team/${team.id}`} style={{ textDecoration: "none" }}>
              {team.name}{" "}
            </Link>
          </td>
          <td>{team.wins}</td>
          <td>{team.defeats}</td>
          {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? (
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.editTeam.bind(this, team.id, team.name, team.wins, team.defeats, team.fk_continent)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={this.deleteTeam.bind(this, team.id)}>
                Delete
              </Button>
            </td>
          ) : null}
        </tr>
      );
    });
    return (
      <div className="App container">
        <h2>{this.state.continent.name}</h2>
        {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? (
          <Button className="my-3" color="primary" onClick={this.toggleNewTeamModal.bind(this)}>
            Add Team
          </Button>
        ) : null}

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
        {this.state.continent.teams.length !== 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Wins</th>
                <th>Defeats</th>
                {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>{teams}</tbody>
          </Table>
        ) : (
          <div className="d-flex justify-content-center">
            <h4>No teams</h4>
          </div>
        )}
      </div>
    );
  }
}
