import React from "react";
import { Col, Row } from "react-bootstrap";
import { Route } from "react-router-dom";
import Description from "./Description";
import PostList from "./PostList";

class PostContainer extends React.Component {
  render() {
    const routes = this.props.posts.map((post) => {
      return (
        <Route
          key={post._links.self.href}
          exact
          path={`/${post.id}`}
          render={() => <Description post={post} />}
        />
      );
    });

    let descStyle = {
      position: "sticky",
      top: "2vh",
    };
    return (
      <div>
        <Row>
          <Col xs={5}>
            <PostList
              loggedInUser={this.props.loggedInUser}
              attributes={this.props.attributes}
              posts={this.props.posts}
              onDelete={this.props.onDelete}
              onUpdate={this.props.onUpdate}
            />
          </Col>
          <Col>
            <div style={descStyle}>{routes}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default PostContainer;
