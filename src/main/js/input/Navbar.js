import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import CreateDialog from "../post/CreateDialog";
import Login from "../security/Login";

class InputFields extends React.Component {
  constructor() {
    super();
    this.state = {
      showLogin: false,
      showCreateDialog: false,
      loggedInAgent: undefined,
    };
  }

  onShowLoginDialog = () => {
    this.setState({ showLogin: true });
  };

  onHideLoginDialog = () => {
    this.setState({ showLogin: false });
  };

  onShowCreateDialog = () => {
    this.setState({ showCreateDialog: true });
  };

  onHideCreateDialog = () => {
    this.setState({ showCreateDialog: false });
  };

  logout = () => {
    $.ajax({
      type: "POST",
      url: "/logout",
      success: (res) => {
        location.href = "/";
      },
      error: (e) => {
        toastr.error("Error logging out");
      },
    });
  };

  componentDidMount() {
    this.setState({ loggedInAgent: username }, () => {
      if (this.state.loggedInAgent !== "anonymousUser") $("#login").remove();
      else $("#logout").remove();
    });
  }

  render() {
    let createPostDialog = (
      <Row id="create">
        <Col>
          <Button
            onClick={(e) => {
              this.onShowCreateDialog();
            }}
          >
            Create post
          </Button>
          <CreateDialog
            modalShow={this.state.showCreateDialog}
            onHide={this.onHideCreateDialog}
            attributes={this.props.attributes}
            onCreate={this.props.onCreate}
          />
        </Col>
      </Row>
    );

    let logInOut = (
      <InputGroup style={{ width: "100%" }} className="mb-3">
        <Form.Group
          style={{ width: "100%" }}
          as={Col}
          controlId="formGridState"
        >
          <div id="logout">
            <Row>
              <Col>
                <p>Welcome, {this.state.loggedInAgent}</p>
              </Col>
              <Col>{createPostDialog}</Col>
              <Col>
                <Button onClick={this.logout}>Log out</Button>
              </Col>
            </Row>
          </div>
          <div id="login">
            <Button
              id="login"
              style={{ right: "15px" }}
              onClick={() => this.onShowLoginDialog()}
            >
              Log in
            </Button>
          </div>
        </Form.Group>
      </InputGroup>
    );

    return (
      <div style={{ borderBottom: "1px solid grey" }}>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>Sample navbar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>Home</Nav.Link>
              <Nav.Link>Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item>Action</NavDropdown.Item>
                <NavDropdown.Item>Another action</NavDropdown.Item>
                <NavDropdown.Item>Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>{logInOut}</Form>
          </Navbar.Collapse>
        </Navbar>
        <Login
          loadFromServer={this.props.loadFromServer}
          modalShow={this.state.showLogin}
          onHide={this.onHideLoginDialog}
        />
      </div>
    );
  }
}

export default InputFields;
