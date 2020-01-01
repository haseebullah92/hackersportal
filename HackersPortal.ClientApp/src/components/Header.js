import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';

import Sidebar from './menu/Sidebar';
import HeadMenu from './menu/HeadMenu';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true,
    };
  }

  toggle() {
    if (this.state.isOpen) {
      document.body.classList.remove('sidenav-toggled');
    } else {
      document.body.classList.add('sidenav-toggled');
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Navbar color='dark' dark expand='lg' fixed='top' id='mainNav'>
          <NavbarBrand href='/'>Hacker's Portal</NavbarBrand>
          <Collapse navbar>
            <Sidebar />
            <ul className='navbar-nav sidenav-toggler'>
              <li className='nav-item'>
                <a
                  onClick={this.toggle}
                  className='nav-link text-center'
                  id='sidenavToggler'
                >
                  <i className='fa fa-fw fa-angle-left' />
                </a>
              </li>
            </ul>
            <HeadMenu />
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
