import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";

class UpdateDialog extends React.Component {
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
      data: undefined,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newPost = this.props.post;
    this.state.inputs.forEach((i) => {
      newPost[i.ref] = this.refs[i.ref].value;
    });
    if (this.state.data !== undefined)
      $.ajax({
        type: "POST",
        url: "/storage/upload",
        data: this.state.data,
        processData: false,
        contentType: false,
        success: (response) => console.log(response),
        error: (e) => console.log(e),
      });
    if (this.state.images.length > 0) {
      newPost.images = this.state.images;
    }
    this.props.onUpdate(this.props.post, newPost);

    //cleanup
    this.state.images.length = 0;
    this.state.data = undefined;
    this.props.onHide();
  };

  onDrop = (pictures) => {
    alert(
      "Functionality not enabled for this demo, but can be enabled by uncommenting the function and \"FileUploadController.java\"."
    );
    // this.state.data = new FormData();
    // let path = "";
    // let oldImages = this.props.post.images;
    // if (oldImages.length > 0 && oldImages[0].includes("images/")) {
    //   path = oldImages[0].split("/")[1];
    // } else path = uuidv4();
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
                  defaultValue={this.props.post[i.ref]}
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              this.onHide();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UpdateDialog;
