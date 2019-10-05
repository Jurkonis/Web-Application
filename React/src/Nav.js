import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import $ from "jquery";
import "./App.css";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      user: [],
      newUserData: {
        username: "",
        password: "",
        userlevel: "1"
      },
      loginData: {
        username: "",
        password: "",
        grant_type: "password"
      },
      newUserModal: false,
      loginModal: false,
      Authorization: ""
    };
  }
  toggleNewUserModal() {
    this.setState({
      newUserModal: !this.state.newUserModal
    });
  }
  toggleLoginModal() {
    this.setState({
      loginModal: !this.state.loginModal
    });
  }
  login() {
    Axios.request({
      method: "post",
      url: "http://localhost:56625/token",
      withCredentials: true,
      crossdomain: true,
      data: $.param(this.state.loginData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
        "Postman-Token": "42e6c291-9a09-c29f-f28f-11872e2490a5"
      }
    }).then(response => {
      sessionStorage.clear();
      sessionStorage.setItem("token", response.data.access_token);
      this.setState({
        loginModal: false
      });
      Axios.get("http://localhost:56625/api/users", { headers: { Authorization: "bearer " + response.data.access_token } }).then(response => {
        sessionStorage.setItem("id", response.data.id);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("userLevel", response.data.userlevel);
        window.location.href = "/";
      });
    });
  }
  logout() {
    sessionStorage.clear();
    window.location.href = "/";
  }
  register() {
    Axios.post("http://localhost:56625/api/users", this.state.newUserData).then(response => {
      this.setState({
        newUserModal: false,
        newUserData: {
          username: "",
          password: "",
          userlevel: "1"
        }
      });
    });
  }
  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    const collapsed = this.state.collapsed;
    const classOne = collapsed ? "collapse navbar-collapse" : "collapse navbar-collapse show";
    const classTwo = collapsed ? "navbar-toggler navbar-toggler-right collapsed" : "navbar-toggler navbar-toggler-right";

    let button;
    if (sessionStorage.getItem("token")) {
      button = (
        <li className="nav-link cursor-pointer" onClick={this.logout.bind(this)}>
          Logout
        </li>
      );
    } else {
      button = (
        <li className="nav-link cursor-pointer" size="sm" onClick={this.toggleLoginModal.bind(this)}>
          Login
        </li>
      );
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark transparent-nav">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Home
          </Link>

          <Modal isOpen={this.state.newUserModal} toggle={this.toggleNewUserModal.bind(this)}>
            <ModalHeader toggle={this.toggleNewUserModal.bind(this)}>Register</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="username"
                  value={this.state.newUserData.username}
                  onChange={e => {
                    let { newUserData } = this.state;
                    newUserData.username = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={this.state.newUserData.password}
                  onChange={e => {
                    let { newUserData } = this.state;
                    newUserData.password = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.register.bind(this)}>
                Register
              </Button>{" "}
              <Button color="secondary" onClick={this.toggleNewUserModal.bind(this)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.loginModal} toggle={this.toggleLoginModal.bind(this)}>
            <ModalHeader toggle={this.toggleLoginModal.bind(this)}>Login</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="username"
                  value={this.state.loginData.username}
                  onChange={e => {
                    let { loginData } = this.state;
                    loginData.username = e.target.value;
                    this.setState({ loginData });
                  }}
                />
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={this.state.loginData.password}
                  onChange={e => {
                    let { loginData } = this.state;
                    loginData.password = e.target.value;
                    this.setState({ loginData });
                  }}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.login.bind(this)}>
                Login
              </Button>{" "}
              <Button color="secondary" onClick={this.toggleLoginModal.bind(this)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <button
            onClick={this.toggleNavbar}
            className={`${classTwo}`}
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`${classOne}`} id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/continents">
                  Continents
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">
                  Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/players">
                  Players
                </Link>
              </li>
              {button}
              {!sessionStorage.getItem("token") ? (
                <li className="nav-link cursor-pointer" size="sm" onClick={this.toggleLoginModal.bind(this)}>
                  Register
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
