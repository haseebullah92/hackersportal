import React, { Component } from 'react';
import { Nav, NavItem } from 'reactstrap';

import LogoutButton from './Header/LogoutButton';

class HeadMenu extends Component {

  constructor(props){
    super(props);
    let auth = JSON.parse(localStorage.getItem('auth'));
    this.state = {
      name: auth.name,
      role: auth.role
    }
  }

  render() {
    return (
      <Nav navbar className="ml-auto">
        <NavItem>
          <a className="nav-link"><i className='fa fa-fw fa-user-circle' /> {this.state.name} ({this.state.role})</a>
        </NavItem>
        <NavItem>
          <LogoutButton />
        </NavItem>
      </Nav>
    );
  }
}

export default HeadMenu;