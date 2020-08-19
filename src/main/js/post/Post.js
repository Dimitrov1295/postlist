import $ from "jquery";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

class Post extends React.Component {
  componentDidMount() {
    if (this.props.loggedInUser !== this.props.post.user.name) {
      $(`#${this.props.post.id}`).remove();
    }
  }

  render() {
    let descStyle = {
      maxHeight: "200px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
    let imgStyle = {
      objectFit: "cover",
      height: "25vh",
      width: "100%",
    };
    let buttonStyle = { width: "100%" };

    return (
      <Card
        style={{
          border: "1px solid grey",
          margin: "5px",
        }}
      >
        <Card.Img
          style={imgStyle}
          variant="top"
          src={`${this.props.post.images[0]}?sig=${Math.random() * 100}`}
          onError={() => {
            setTimeout(() => {
              this.forceUpdate();
            }, 500);
          }}
        />
        <Card.Body>
          <Card.Title>
            <Row>
              <Col>{this.props.post.title}</Col>
              <Col xs={4}>&#163;{this.props.post.price}</Col>
            </Row>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.post.comment}
          </Card.Subtitle>
          <Card.Text style={descStyle}>{this.props.post.description}</Card.Text>
          <Row id={this.props.post.id}>
            <Col>
              <Button
                style={buttonStyle}
                variant="success"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.toggleModal(this.props.post);
                }}
              >
                Edit
              </Button>
            </Col>
            <Col>
              <Button
                style={buttonStyle}
                variant="danger"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.onDelete(this.props.post);
                }}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default Post;
