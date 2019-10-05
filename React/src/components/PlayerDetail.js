import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from "reactstrap";
import Axios from "axios";
import "../App.css";

export default class TeamDetail extends Component {
  state = {
    player: {},
    rating: {
      id: "",
      total: "",
      times_rated: ""
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
    editPlayerModal: false,
    config: {
      headers: { Authorization: "bearer " + sessionStorage.getItem("token") }
    }
  };

  componentDidMount() {
    this._refreshPlayer();
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
    Axios.put(
      "http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/players/" + this.state.editPlayerData.id,
      {
        id,
        username,
        first_name,
        last_name,
        country,
        age,
        fk_team
      },
      this.state.config
    ).then(response => {
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
  _refreshPlayer() {
    Axios.get("http://localhost:56625/api/continents/" + this.props.match.params.cid + "/teams/" + this.props.match.params.tid + "/players/" + this.props.match.params.pid).then(
      response => {
        this.setState({
          player: response.data,
          editPlayerData: response.data,
          rating: { id: response.data.id, total: "10", times_rated: "1" }
        });
      }
    );
  }
  addRate() {
    Axios.post("http://localhost:56625/api/ratings", this.state.rating, this.state.config).then(response => {
      this._refreshPlayer();
    });
  }
  ratePlayer() {
    Axios.put("http://localhost:56625/api/ratings/" + this.state.rating.id, this.state.rating, this.state.config).then(response => {
      this._refreshPlayer();
    });
  }
  render() {
    return (
      <div className="App container">
        {sessionStorage.getItem("userLevel") == 3 || sessionStorage.getItem("userLevel") == 2 ? (
          <Button className="my-3" color="primary" onClick={this.toggleEditPlayerModal.bind(this)}>
            Edit
          </Button>
        ) : (
          <div className="my-3" />
        )}
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
          <div className="col-sm mw-25">
            <img src={require("../images/logo192.png")} className="float-right image" alt="" />
          </div>
          <div className="col-sm">
            <div className="row">
              <div className="col-sm">
                <b>Username</b>
              </div>
              <div className="col-sm">{this.state.player.username}</div>
            </div>
            <div className="row">
              <div className="col-sm">
                <b>First name</b>
              </div>
              <div className="col-sm">{this.state.player.first_name}</div>
            </div>
            <div className="row">
              <div className="col-sm">
                <b>Last name</b>
              </div>
              <div className="col-sm">{this.state.player.last_name}</div>
            </div>
            <div className="row">
              <div className="col-sm">
                <b>Age</b>
              </div>
              <div className="col-sm">{this.state.player.age}</div>
            </div>
            <div className="row">
              <div className="col-sm">
                <b>Country</b>
              </div>
              <div className="col-sm">{this.state.player.country}</div>
            </div>
            <div className="row">
              <div className="col-sm">
                <b>Rating</b>
              </div>
              {this.state.player.rating ? (
                <div className="col-sm">{Number((this.state.player.rating.total / this.state.player.rating.times_rated).toFixed(2))}</div>
              ) : (
                <div className="col-sm">0</div>
              )}
            </div>
            {sessionStorage.getItem("userLevel") == 1 ? (
              <div className="row">
                <div className="col-xs-2 my-2">
                  <Input
                    type="select"
                    id="rate"
                    onChange={e => {
                      let { rating } = this.state;
                      rating.total = e.target.value;
                      this.setState({ rating });
                    }}
                  >
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </Input>
                </div>
                <div className="col-xs-2 my-2 px-2">
                  {this.state.player.rating ? (
                    <Button color="primary" onClick={this.ratePlayer.bind(this)}>
                      Rate
                    </Button>
                  ) : (
                    <Button color="primary" onClick={this.addRate.bind(this)}>
                      Rate
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
