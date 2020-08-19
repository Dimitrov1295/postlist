import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

class Contact extends React.Component {
  render() {
    return (
      <Modal
        onHide={this.props.onHide}
        show={this.props.modalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header onClick={this.props.toggleModal} closeButton>
          Contact form
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" placeholder="Email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control type="tel" placeholder="Phone number" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="Your message"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.toggleModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Contact;
