/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import React, {Component} from "react";
import {
  Container
} from "reactstrap";
import LoginForm from '../../../components/LoginForm';

class Login extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">

        <Container>
          <LoginForm />
        </Container>
      </div>
    );
  }
}

export default Login;
