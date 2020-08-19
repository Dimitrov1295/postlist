import React from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import UpdateDialog from "./UpdateDialog";

class PostList extends React.Component {
  constructor() {
    super();
    this.state = { modalShow: false, post: {} };
  }

  onHide = () => {
    this.setState({ modalShow: false });
  };

  toggleModal = (post) => {
    this.setState({ modalShow: !this.state.modalShow, post: post });
  };

  render() {
    let posts = this.props.posts.map((post) => {
      return (
        <Link key={post._links.self.href} to={`/${post.id}`}>
          <Post
            loggedInUser={this.props.loggedInUser}
            attributes={this.props.attributes}
            onDelete={this.props.onDelete}
            post={post}
            toggleModal={this.toggleModal}
          />
        </Link>
      );
    });
    return (
      <div>
        {posts}
        <UpdateDialog
          attributes={this.props.attributes}
          post={this.state.post}
          onHide={this.onHide}
          modalShow={this.state.modalShow}
          onUpdate={this.props.onUpdate}
        />
      </div>
    );
  }
}
export default PostList;
