import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class Login extends React.Component {
  login = () => {
    let username = this.refs.username.value.toLowerCase();
    let password = this.refs.password.value;
    $.ajax({
      type: "POST",
      url: "/login",
      data: { username: username, password: password },
      success: (res) => {
        location.href = "/";
      },
      error: (e) => {
        if (e.status === 500) toastr.error("Wrong username or password");
        else toastr.error("Error logging in");
      },
    });
  };
  render() {
    return (
      <Modal
        onHide={this.props.onHide}
        show={this.props.modalShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Please log in
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              this.login();
            }
          }}
        >
          <p>User1 username:password = user1:password</p>
          <p>User2 username:password = user2:password</p>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control ref="username" type="text" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                ref="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                this.login();
              }}
            >
              Log in
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Login;
