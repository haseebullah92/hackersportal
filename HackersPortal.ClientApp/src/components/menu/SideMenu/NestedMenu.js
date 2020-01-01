import React, { Component } from 'react';
import { NavItem, NavLink } from 'reactstrap';

class NestedMenu extends Component {
  render() {
    return (
      <NavItem>
        <NavLink href="#">
          <i className="fa fa-fw fa-sitemap"></i>&nbsp;
          <span className="nav-link-text">Menu Levels</span>
        </NavLink>
      </NavItem>
    );
  }
}

export default NestedMenu;