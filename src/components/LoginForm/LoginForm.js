/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import React, {Component} from "react";
import {
  Row,
  Col,
  CardGroup,
  Card,
  CardBlock,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  CardHeader,
  Label,
} from "reactstrap";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { login, logout, getUserLoggedIn, hideMessage, signup } from '../../actions';

class Login extends Component {
  constructor() {
    super();
    this.state={
      login: 1
    }
    this.renderSignup = this.renderSignup.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }

  changeLoginLoadingState(isLoading) {
    const loginButton = document.getElementById('login-btn');
    loginButton.disabled = isLoading;
    loginButton.innerHTML = isLoading ? '<i class="fa fa-circle-o-notch fa-spin fa-lg"></i> Logging In' : 'Login';
  }

  // Start of API integration
  async handleLogin() {
    // Hide the message on each attempt to let the user know that an action is being performed and if an error returns again
    // the user will see the message return.
    this.props.hideMessage();

    const username = this.usernameRef.value;
    const pass = this.passwordRef.value;
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');


    // Check the value of the input and if missing, mark as invalid to outline with red
    !username
      ? usernameInput.classList.add('is-invalid')
      : usernameInput.classList.remove('is-invalid');
    !pass
      ? passwordInput.classList.add('is-invalid')
      : passwordInput.classList.remove('is-invalid');

    // Prevent calling the api if we know we don't have valid input values
    if (!username || !pass) {
      return;
    }

    this.changeLoginLoadingState(true);
    try {
      const success = await this.props.login(username, pass);
      if (!success) {
        this.changeLoginLoadingState(false);
        return;
      }

      return this.props.history.replace('/dashboard');
    } catch(err) {
      console.error('Error occurred on login?', err);
      this.props.hideMessage();
      this.changeLoginLoadingState(false);
    }
  }

  async handleSignup() {
    // Hide the message on each attempt to let the user know that an action is being performed and if an error returns again
    // the user will see the message return.
    this.props.hideMessage();

    const username = this.usernameRef.value;
    const pass = this.passwordRef.value;
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');


    // Check the value of the input and if missing, mark as invalid to outline with red
    !username
      ? usernameInput.classList.add('is-invalid')
      : usernameInput.classList.remove('is-invalid');
    !pass
      ? passwordInput.classList.add('is-invalid')
      : passwordInput.classList.remove('is-invalid');

    // Prevent calling the api if we know we don't have valid input values
    if (!username || !pass) {
      return;
    }

    this.changeLoginLoadingState(true);
    try {
      let signUpObj = {
        email: username,
        password: pass,
        phoneNumber: this.phoneRef.value,
        firstName: this.firstNameRef.value,
        lastName: this.lastNameRef.value,
      };
      const success = await this.props.signup(signUpObj);
      if (success.type === 'SIGN_UP_FAILURE') {
        this.changeLoginLoadingState(false);
        return;
      }
      if (success.type === 'SIGN_UP_SUCCESS') {
        const loginAfterSignUp = await this.props.login(signUpObj.email, signUpObj.password);
        if(!loginAfterSignUp){
          this.changeLoginLoadingState(false);
          return;
        }
        return this.props.history.replace('/dashboard');
      }
    } catch(err) {
      console.error('Error occurred on login?', err);
      this.props.hideMessage();
      this.changeLoginLoadingState(false);
    }
  }

  // TODO: Implement a method that will "dismiss" the login error card

  handleOnKeyPress(e, nextElement) {
    const event = e || window.event;
    const charCode = event.which || event.keyCode;

    if ( charCode === 13 ) {
      if (!nextElement) {
        // Enter pressed
        this.handleLogin();
        return false;
      }

      nextElement.focus();
    }
  }

  resetMessage() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    usernameInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');

    this.props.hideMessage();
  }

  renderErrorCard() {
    if (!this.props.error.isVisible) {
      return null;
    }

    return (
      <Row className="justify-content-center">
        <Col xs="12" sm="6" md="4">
          <Card className="text-white bg-danger">
            <CardHeader>
              { this.props.error.title }
              {/*<Label className="switch switch-sm switch-text switch-info float-right mb-0">*/}
              <button className="close" aria-label="Close" onClick={() => {this.resetMessage()}}>
                <span>x</span>
              </button>
                {/*<span className="switch-label" data-on="On" data-off="Off"></span>*/}
                {/*<span className="switch-handle"></span>*/}
              {/*</Label>*/}
            </CardHeader>
            <CardBlock className="card-body">
              { this.props.error.message }
            </CardBlock>
          </Card>
        </Col>
      </Row>
    );
  }

  renderLogin() {
    this.setState({
      login: 1
    });
  }

  renderSignup() {
    this.setState({
      login: 2
    });
  }

  renderContainer(){
    if(this.state.login === 1){
      return(
        <Row className="justify-content-center">
          <Col xl="4" lg="5" md="6">
            <CardGroup className="mb-0">
              <Card className="p-4">
                <CardBlock className="card-body">
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                    <Input
                      autoFocus
                      id="username-input"
                      type="text"
                      placeholder="Username"
                      name="usernameRef"
                      ref="usernameRef"
                      getRef={(input) => { this.usernameRef = input; }}
                      onKeyPress={ (e) => this.handleOnKeyPress(e, this.passwordRef) }/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                    <Input
                      id="password-input"
                      type="password"
                      placeholder="Password"
                      name="passwordRef"
                      ref="passwordRef"
                      getRef={(element) => { this.passwordRef = element; }}
                      onKeyPress={ (e) => this.handleOnKeyPress(e) }/>
                  </InputGroup>
                  <Row>
                    <Col xs="6">
                      <Button
                        id="login-btn"
                        color="primary"
                        className="px-2 btn-sm"
                        onClick={() => { this.handleLogin() }}>Login</Button>
                    </Col>
                  </Row>
                </CardBlock>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      );
    }else {
      return(
        <Row className="justify-content-center">
          <Col xl="4" lg="5" md="6">
            <CardGroup className="mb-0">
              <Card className="p-4">
                <CardBlock className="card-body">
                  <h1>Sign up</h1>
                  <p className="text-muted">Sign Up for a new account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                    <Input
                      autoFocus
                      id="username-input"
                      type="text"
                      placeholder="Email"
                      name="usernameRef"
                      ref="usernameRef"
                      getRef={(input) => { this.usernameRef = input; }}
                      onKeyPress={ (e) => this.handleOnKeyPress(e, this.passwordRef) }/>
                  </InputGroup>
                  <Row>
                    <Col>
                      <InputGroup className="mb-3">
                        <Input
                          autoFocus
                          id="username-input"
                          type="text"
                          placeholder="First Name"
                          name="firstName"
                          ref="firstNameRef"
                          getRef={(input) => { this.firstNameRef = input; }}/>
                      </InputGroup>
                    </Col>
                    <Col>
                      <InputGroup className="mb-3">
                        <Input
                          autoFocus
                          id="username-input"
                          type="text"
                          placeholder="Last Name"
                          name="lastName"
                          ref="lastNameRef"
                          getRef={(input) => { this.lastNameRef = input; }}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <InputGroup className="mb-4">
                    <InputGroupAddon><i className="fa fa-phone"></i></InputGroupAddon>
                    <Input type="tel"
                           id="phone"
                           name="phoneNumber"
                           ref="phoneRef"
                           getRef={(input) => { this.phoneRef = input; }}
                           placeholder="Phone #"/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                    <Input
                      id="password-input"
                      type="password"
                      placeholder="Password"
                      name="passwordRef"
                      ref="passwordRef"
                      getRef={(element) => { this.passwordRef = element; }}
                      onKeyPress={ (e) => this.handleOnKeyPress(e) }/>
                  </InputGroup>
                  <Row>
                    <Col xs="6">
                      <Button
                        id="login-btn"
                        color="primary"
                        className="px-2 btn-sm"
                        onClick={() => { this.handleSignup() }}>Submit</Button>
                    </Col>
                  </Row>
                </CardBlock>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      );
    }
  }

  render() {
    return (
      <div>
        { this.renderErrorCard() }
        <Row className="justify-content-center">
          <Col xl="4" lg="5" md="6">
            <Button onClick={this.renderSignup}>
              Sign up
            </Button>{' '}
            <Button onClick={this.renderLogin}>
              Login
            </Button>
          </Col>
        </Row>
        { this.renderContainer() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    error: state.error,
  }
};

const dispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username, password)),
    signup: (obj) => dispatch(signup(obj)),
    logout: () => dispatch(logout()),
    getUserLoggedIn: () => dispatch(getUserLoggedIn()),
    hideMessage: () => dispatch(hideMessage()),
  }
};

export default connect(mapStateToProps, dispatchToProps)(withRouter(Login));
