import React, { Component } from "react";
import "./App.css";

export default class Footer extends Component {
  render() {
    return (
      <footer className="page-footer font-small bg-dark fixed-bottom">
        <div className="container">
          <div className="row">
            <div className="col-sm py-4">
              <div className="d-flex justify-content-center">
                <a className="cursor-pointer mr-3" href="https://www.facebook.com/dovydas.jurkonis.12">
                  <img src={require("../src/images/social-icons/facebook-512.png")} class="social-icon" />
                </a>
                <a className="cursor-pointer mr-3" href="https://www.linkedin.com/in/dovydas-jurkonis/">
                  <img src={require("../src/images/social-icons/linkedin-512.png")} class="social-icon" />
                </a>
                <a className="cursor-pointer" href="https://github.com/Jurkonis">
                  <img src={require("../src/images/social-icons/github-512.png")} class="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright text-center text-white pb-2">© 2019 Copyright: Dovydas Jurkonis</div>
      </footer>
    );
  }
}
