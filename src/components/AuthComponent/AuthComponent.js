/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import React, {Component} from "react";
import { connect } from 'react-redux';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBlock} from "reactstrap";
import { withRouter } from 'react-router-dom';
import { isLoggedIn, logout } from '../../actions';

class AuthComponent extends Component {
  constructor() {
    super();

    this.state = {
      modal: false,
    }
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  redirectToLogin() {
    return this.props.history.replace('/login');
  }

  componentWillMount() {
    if (!this.props.user.isLoggedIn) {
      return this.redirectToLogin();
    }

    this.props.isLoggedIn();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.user.isLoggedIn && !nextProps.user.isLoggedIn) {
      return this.toggleModal();
    }

    if (nextState.modal) {
      return;
    }

    if (!this.props.user.isLoggedIn || !nextProps.user.isLoggedIn) {
      return this.redirectToLogin();
    }
  }

  acceptLogout() {
    this.props.logout();
    this.toggleModal();
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.toggleModal()}>Opps, appears you have been logged out</ModalHeader>
          <ModalBody>
            Please login to your account again to continue.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.acceptLogout()}>Do Something</Button>
            {/*<Button color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>*/}
          </ModalFooter>
        </Modal>
      </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

const dispatchToProps = (dispatch) => {
  return {
    isLoggedIn: () => dispatch(isLoggedIn()),
    logout: () => dispatch(logout()),
  }
};

export default connect(mapStateToProps, dispatchToProps)(withRouter(AuthComponent));
