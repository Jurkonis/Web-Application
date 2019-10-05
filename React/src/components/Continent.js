import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Button } from "reactstrap";
import Axios from "axios";

class Continent extends Component {
  state = {
    continents: [],
    newContinentData: {
      name: ""
    },
    editContinentData: {
      id: "",
      name: ""
    },
    newContinentModal: false,
    editContinentModal: false,
    config: {
      headers: { Authorization: "bearer " + sessionStorage.getItem("token") }
    }
  };

  componentDidMount() {
    this._refreshContinents();
  }

  toggleNewContinentModal() {
    this.setState({
      newContinentModal: !this.state.newContinentModal
    });
  }

  addContinent() {
    Axios.post("http://localhost:56625/api/Continents", this.state.newContinentData, this.state.config).then(response => {
      let { continents } = this.state;
      continents.push(response.data);
      this.setState({
        continents,
        newContinentModal: false,
        newContinentData: {
          name: ""
        }
      });
    });
  }

  editContinent(id, name) {
    this.setState({
      editContinentData: { id, name },
      editContinentModal: !this.state.editContinentModal
    });
  }

  toggleEditContinentModal() {
    this.setState({
      editContinentModal: !this.state.editContinentModal
    });
  }

  updateContinent() {
    let { id, name } = this.state.editContinentData;
    Axios.put("http://localhost:56625/api/Continents/" + this.state.editContinentData.id, { id, name }, this.state.config).then(response => {
      this._refreshContinents();
      this.setState({
        editContinentModal: false,
        editContinentData: {
          id: "",
          name: ""
        }
      });
    });
  }

  deleteContinent(id) {
    Axios.delete("http://localhost:56625/api/Continents/" + id, this.state.config).then(response => {
      this._refreshContinents();
    });
  }

  _refreshContinents() {
    Axios.get("http://localhost:56625/api/continents").then(response => {
      this.setState({
        continents: response.data
      });
    });
  }
  render() {
    let continents = this.state.continents.map(continent => {
      return (
        <tr key={continent.id}>
          <td>
            <Link to={`/continent/${continent.id}`} style={{ textDecoration: "none" }}>
              {continent.name.replace("_", " ")}
            </Link>
          </td>
          {sessionStorage.getItem("userLevel") == 3 ? (
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.editContinent.bind(this, continent.id, continent.name)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={this.deleteContinent.bind(this, continent.id)}>
                Delete
              </Button>
            </td>
          ) : null}
        </tr>
      );
    });
    return (
      <div className="App container">
        {sessionStorage.getItem("userLevel") == 3 ? (
          <Button className="my-3" color="primary" onClick={this.toggleNewContinentModal.bind(this)}>
            Add Continent
          </Button>
        ) : null}

        <Modal isOpen={this.state.newContinentModal} toggle={this.toggleNewContinentModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewContinentModal.bind(this)}>Add a new continent</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.newContinentData.name}
                onChange={e => {
                  let { newContinentData } = this.state;
                  newContinentData.name = e.target.value;
                  this.setState({ newContinentData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addContinent.bind(this)}>
              Add Continent
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleNewContinentModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editContinentModal} toggle={this.toggleEditContinentModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditContinentModal.bind(this)}>Edit a continent</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.editContinentData.name}
                onChange={e => {
                  let { editContinentData } = this.state;
                  editContinentData.name = e.target.value;
                  this.setState({ editContinentData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateContinent.bind(this)}>
              Update Continent
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleEditContinentModal.bind(this)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              {sessionStorage.getItem("userLevel") == 3 ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>{continents}</tbody>
        </Table>
      </div>
    );
  }
}

export default Continent;
