import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from "reactstrap";
import Axios from "axios";

export default class TeamDetail extends Component {
  state = {
    player: {},
    editPlayerData: {
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      country: "",
      age: "",
      fk_team: ""
    },
    editPlayerModal: false
  };

  componentDidMount() {
    Axios.get("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/players/" + this.props.match.params.pid).then(
      response => {
        this.setState({
          player: response.data
        });
      }
    );
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
    Axios.put("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/players/" + this.state.editPlayerData.id, {
      id,
      username,
      first_name,
      last_name,
      country,
      age,
      fk_team
    }).then(response => {
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
          fk_team: this.props.match.params.tid
        }
      });
    });
  }
  render() {
    return (
      <div className="App container">
        <Button className="my-3" color="primary" onClick={this.toggleEditPlayerModal.bind(this)}>
          Edit
        </Button>
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

        <div className="row">
          <div className="col-sm mw-50">
            <img src={require("../images/logo192.png")} className="float-right" alt="" />
          </div>
          <div className="col-sm">
            <h2>{this.state.player.username}</h2>
          </div>
        </div>
      </div>
    );
  }
}
