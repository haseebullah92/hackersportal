import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    let auth = JSON.parse(localStorage.getItem('auth'));
    this.state = {
      role: auth.role
    }
  }

  render() {
    return (
      <Nav vertical navbar className='navbar-sidenav'>
        <NavItem>
          <NavLink tag={Link} to='/app/mydocuments'>
            <i className='fa fa-fw fa-file-text-o' />&nbsp;
        <span className='nav-link-text'>My Documents</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to='/app/documents'>
            <i className='fa fa-fw fa-file-text-o' />&nbsp;
        <span className='nav-link-text'>Manage Documents</span>
          </NavLink>
        </NavItem>
        {
          this.state.role != 'User' ? <NavItem>
            <NavLink tag={Link} to='/app/Users'>
              <i className='fa fa-fw fa-users' />&nbsp;
        <span className='nav-link-text'>Users</span>
            </NavLink>
          </NavItem> : null
        }
      </Nav>
    );
  }
}

export default Sidebar;
