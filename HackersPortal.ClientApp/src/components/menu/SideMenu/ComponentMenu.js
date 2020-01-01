import React, { Component } from 'react';
import { NavItem, NavLink, Collapse } from 'reactstrap';

class ComponentMenu extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <NavItem>
        <NavLink href="#" onClick={this.toggle}>
          <i className="fa fa-fw fa-wrench"></i>&nbsp;
          <span className="nav-link-text">Components</span>
        </NavLink>
        <Collapse tag="ul" 
          isOpen={this.state.collapse}
          className="sidenav-second-level">
            <li>
              <a href="navbar.html">Navbar</a>
            </li>
            <li>
              <a href="cards.html">Cards</a>
            </li>
        </Collapse>
      </NavItem>
    );
  }
}

export default ComponentMenu;