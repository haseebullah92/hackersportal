import React, { Component } from 'react';
import { NavItem, NavLink, Collapse } from 'reactstrap';

class ExamplePageMenu extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return(
      <NavItem>
        <NavLink href="#" onClick={this.toggle}>
          <i className="fa fa-fw fa-file"></i>&nbsp;
          <span className="nav-link-text">Example Pages</span>
        </NavLink>
          <Collapse tag="ul" className="sidenav-second-level" isOpen={this.state.collapse}>
            <li>
              <a href="login.html">Login Page</a>
            </li>
            <li>
              <a href="register.html">Registration Page</a>
            </li>
            <li>
              <a href="forgot-password.html">Forgot Password Page</a>
            </li>
            <li>
              <a href="blank.html">Blank Page</a>
            </li>
        </Collapse>
      </NavItem>
    );
  }
}

export default ExamplePageMenu;