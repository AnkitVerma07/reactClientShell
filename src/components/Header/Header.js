import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  NavbarBrand,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Badge,
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout, getUserLoggedIn } from '../../actions';

class Header extends Component {

  constructor() {
    super();

    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  async returnToLogin() {
    const confirmLogout = await this.props.logout();
    return this.props.history.replace('/login');
  }

  async toProfile() {
    let userId = this.props.user.id;
    return this.props.history.replace('/account/details/'+userId);
  }

  async toSetting() {
    return this.props.history.replace('/settings');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarMinimize}>&#9776;</NavbarToggler>
        <Nav className="ml-auto" navbar>
          <NavItem className="pr-2 pr-sm-2">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()}>
              <DropdownToggle className="nav-link dropdown-toggle">
                {/*<img src={'img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>*/}
                <span>{this.props.user.email}</span>
              </DropdownToggle>
              <DropdownMenu right className={this.state.dropdownOpen ? 'show' : ''}>
                <DropdownItem header tag="div" className="text-center"><strong  >Settings</strong></DropdownItem>
                <DropdownItem onClick={() => this.toProfile()}><i className="fa fa-user"/> Profile</DropdownItem>
                <DropdownItem onClick={() => this.toSetting()}><i className="fa fa-wrench"/> Settings</DropdownItem>
                <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
                <DropdownItem onClick={() => this.returnToLogin()}><i className="fa fa-lock"/> Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
          <NavbarToggler className="d-sm-down-none" type="button" onClick={this.asideToggle}>&#9776;</NavbarToggler>
        </Nav>
      </header>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

const dispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    getUserLoggedIn: () => dispatch(getUserLoggedIn()),
  }
};

export default connect(mapStateToProps, dispatchToProps)(withRouter(Header));
