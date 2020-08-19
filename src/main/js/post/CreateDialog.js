import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";

class CreateDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      inputs: [
        { type: "text", placeholder: "Title", ref: "title", as: "input" },
        { type: "text", placeholder: "Comment", ref: "comment", as: "input" },
        { type: "number", placeholder: "Price", ref: "price", as: "input" },
        {
          type: "text",
          placeholder: "Description",
          ref: "description",
          as: "textarea",
        },
      ],
      data: new FormData(),
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { images: this.state.images };
    this.state.inputs.forEach((i) => (newPost[i.ref] = this.refs[i.ref].value));
    $.ajax({
      type: "POST",
      url: "/storage/upload",
      data: this.state.data,
      processData: false,
      contentType: false,
      success: (response) => console.log(response),
      error: (e) => console.log(e),
    });
    this.props.onCreate(newPost);

    this.props.onHide();
  };

  onDrop = (pictures) => {
    alert(
      'Functionality not enabled for this demo, but can be enabled by uncommenting the function and "FileUploadController.java".'
    );
    // let path = uuidv4();
    // let imagePaths = [];
    // for (let picture of pictures) {
    //   this.state.data.append("files", picture);
    //   imagePaths.push(`images/${path}/${picture.name}`);
    // }
    // this.setState({ images: imagePaths });
    // this.state.data.append("path", path);
    // pictures.length = 0;
  };

  render() {
    let inputs = this.state.inputs;

    return (
      <Modal
        onHide={this.props.onHide}
        show={this.props.modalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add a property
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <ImageUploader
              withIcon={false}
              buttonText="Choose images"
              onChange={this.onDrop}
              imgExtension={[".jpg", ".gif", ".png", ".gif", ".jpeg"]}
              maxFileSize={5242880}
            />
            {inputs.map((i) => (
              <Form.Row key={i.placeholder} style={{ margin: "10px" }}>
                <Form.Control
                  type={i.type}
                  as={i.as}
                  placeholder={i.placeholder}
                  ref={i.ref}
                />
              </Form.Row>
            ))}
            <Row>
              <Col>
                <Button variant="primary" onClick={(e) => this.handleSubmit(e)}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateDialog;
