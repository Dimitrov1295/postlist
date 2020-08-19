import React from "react";
import { Button, Carousel, Col, Image, Jumbotron, Row } from "react-bootstrap";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Contact from "./Contact";

class Description extends React.Component {
  constructor() {
    super();
    this.state = {
      modalShow: false,
    };
  }
  toggleModal = () => {
    this.setState({ modalShow: !this.state.modalShow });
  };
  onHide = () => {
    this.setState({ modalShow: false });
  };
  render() {
    return (
      <Jumbotron
        style={{
          height: "96vh",
          display: "flex",
          flexFlow: "column",
          border: "1px solid grey",
          margin: "5px",
        }}
      >
        <MyLightbox images={this.props.post.images} />
        <Row>
          <Col>
            <h3
              className="text-primary"
              style={{ maxWidth: "100%", wordWrap: "break-word" }}
            >
              {this.props.post.title}
            </h3>
            <h6 className="text-secondary">{this.props.post.comment}</h6>
          </Col>
          <Col xs={2}>
            <h5 style={{ float: "right" }} className="text-info">
              &#163;{this.props.post.price}
            </h5>
          </Col>
        </Row>

        <div
          className="text-primary"
          style={{
            overflowY: "scroll",
            flex: "1 1 auto",
            overflowX: "hidden",
          }}
        >
          <br />
          <Row>
            <Col>
              <pre
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                {this.props.post.description}
              </pre>
            </Col>
          </Row>
        </div>
        <div className="text-info">
          <Row>
            <Col>
              <h5>Contact</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <p>{this.props.post.user.name}</p>
            </Col>
            <Col xs={3}>
              <p>{this.props.post.user.phoneNumber}</p>
            </Col>
            <Col xs={3}>
              <a href={`mailto:${this.props.post.user.name}@example.com`}>
                {this.props.post.user.name}@example.com
              </a>
            </Col>
          </Row>
        </div>
        <Button variant="primary" onClick={this.toggleModal}>
          Contact us
        </Button>
        <Contact
          onHide={this.onHide}
          modalShow={this.state.modalShow}
          toggleModal={this.toggleModal}
        />
      </Jumbotron>
    );
  }
}

class MyLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  render() {
    const { photoIndex, isOpen } = this.state;
    const images = this.props.images;
    let imgStyle = {
      objectFit: "cover",
      maxWidth: "100%",
      display: "block",
      margin: "auto",
      height: "30vh",
    };
    let pics = images.map((img, index) => {
      return (
        <Carousel.Item style={{ backgroundColor: "grey" }} key={index}>
          <Image
            style={imgStyle}
            src={img}
            onClick={() => {
              this.setState({ photoIndex: index, isOpen: true });
            }}
          ></Image>
        </Carousel.Item>
      );
    });
    return (
      <div>
        <Carousel style={{ border: "1px solid grey" }}>{pics}</Carousel>

        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default Description;
