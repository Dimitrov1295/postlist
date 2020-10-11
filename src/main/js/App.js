import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import { Container } from "react-bootstrap";
import ReactDOM from "react-dom";
import { MemoryRouter as Router } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Navbar from "./input/Navbar";
import NavLinks from "./input/NavLinks";
import PostContainer from "./post/PostContainer";
import follow from "./util/follow";
import stompClient from "./util/websocket-listener";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      attributes: {},
      links: {},
      page: {},
      pageSize: 10,
      loggedInUser: "",
    };
  }

  componentDidMount() {
    this.setState({ loggedInUser: username }); // username can be found in index.html file
    this.loadFromServer(this.state.pageSize);
    this.register();
  }

  register = () => {
    stompClient([
      { route: "/topic/newPost", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updatePost", callback: this.refreshCurrentPage },
      { route: "/topic/deletePost", callback: this.refreshCurrentPage },
    ]);
  };

  refreshAndGoToLastPage = (message) => {
    let user = JSON.parse(message.body).user;
    follow(root, [
      {
        rel: "posts",
        params: { size: this.state.pageSize },
      },
    ]).done((response) => {
      if (
        response._links.last !== undefined &&
        this.state.loggedInUser === user
      ) {
        this.onNavigate(response._links.last.href);
      } else {
        this.onNavigate(response._links.self.href);
      }
    });
  };

  refreshCurrentPage = (message) => {
    follow(root, [
      {
        rel: "posts",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((postCollection) => {
        this.links = postCollection._links;
        this.page = postCollection.page;
        return postCollection._embedded.posts.map((post) => {
          return $.ajax({
            type: "GET",
            url: post._links.self.href,
          });
        });
      })
      .then((postPromises) => {
        return Promise.all(postPromises);
      })
      .then((posts) => {
        this.setState({
          page: this.page,
          posts: posts,
          attributes: this.schema.properties,
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  };

  loadFromServer = (pageSize) => {
    follow(root, [{ rel: "posts", params: { size: pageSize, page: 0 } }])
      .then((postCollection) => {
        this.setState({ page: postCollection.page });
        return $.ajax({
          type: "GET",
          url: postCollection._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema;
          this._links = postCollection._links;
          return postCollection;
        });
      })
      .then((postCollection) => {
        return postCollection._embedded.posts.map((post) => {
          return $.ajax({ type: "GET", url: post._links.self.href });
        });
      })
      .then((postPromises) => {
        for (let promise of postPromises) {
          promise.then((response, status, headers) => {
            Object.defineProperty(response, "etag", {
              value: headers.getResponseHeader("etag"),
              writable: false,
            });
          });
        }
        return Promise.all(postPromises);
      })
      .then((posts) => {
        delete this.schema.properties.user;
        this.setState({
          posts: posts,
          attributes: this.schema.properties,
          pageSize: pageSize,
          links: this._links,
        });
      });
  };

  onNavigate = (navUri) => {
    $.ajax({ type: "GET", url: navUri })
      .then((postCollection) => {
        this.page = postCollection.page;
        this._links = postCollection._links;
        return postCollection._embedded.posts.map((post) =>
          $.ajax({ type: "GET", url: post._links.self.href })
        );
      })
      .then((postPromises) => {
        return Promise.all(postPromises);
      })
      .done((posts) => {
        this.setState({
          page: this.page,
          posts: posts,
          attributes: this.state.attributes,
          pageSize: this.state.pageSize,
          links: this._links,
        });
      });
  };
  handleNavFirst = (e) => {
    e.preventDefault();
    this.onNavigate(this.state.links.first.href);
  };

  handleNavPrev = (e) => {
    e.preventDefault();
    this.onNavigate(this.state.links.prev.href);
  };

  handleNavNumber = (e, num) => {
    e.preventDefault();
    let regex = /page=\d*/gi;
    let newPage = `page=${num}`;
    this.onNavigate(this.state.links.self.href.replace(regex, newPage));
  };

  handleNavNext = (e) => {
    e.preventDefault();
    this.onNavigate(this.state.links.next.href);
  };

  handleNavLast = (e) => {
    e.preventDefault();
    this.onNavigate(this.state.links.last.href);
  };

  onCreate = (newPost) => {
    follow(root, [{ rel: "posts" }]).done((response) => {
      $.ajax({
        url: response._links.self.href,
        type: "POST",
        data: JSON.stringify(newPost),
        contentType: "application/json",
        success: (res) => {
          toastr.success("Successfully created!");
        },
        error: (e) => {
          toastr.error("Failed to create post");
        },
      });
    });
  };

  onDelete = (post) => {
    $.ajax({
      type: "DELETE",
      url: post._links.self.href,
      success: (response) => {
        toastr.success("Successfully deleted");
      },
      error: (e) => {
        if (e.status === 403) {
          toastr.error(
            "ACCESS DENIED: " + post._links.self.href + " cannot be deleted."
          );
        }
      },
    });
  };

  onUpdate = (post, updatedPost) => {
    if (post.user.name === this.state.loggedInUser) {
      updatedPost.user = post.user;
      $.ajax({
        type: "PUT",
        url: post._links.self.href,
        data: JSON.stringify(updatedPost),
        headers: {
          "Content-Type": "application/json",
          "If-Match": post.etag,
        },
        success: (response) => {
          toastr.success("Successfully updated!");
        },
        error: (e) => {
          if (e.status === 412) {
            toastr.error(
              "DENIED: Unable to update " +
                post._links.self.href +
                ". Your copy is stale."
            );
          }
          if (e.status === 403) {
            toastr.error(
              "ACCESS DENIED: " + post._links.self.href + " cannot be updated."
            );
          }
        },
      });
    } else {
      alert("You are not authorized to update");
    }
  };

  handlePageSize = (pageSize) => {
    this.loadFromServer(pageSize);
  };

  render() {
    return (
      <Container>
        <Navbar
          loadFromServer={this.loadFromServer}
          attributes={this.state.attributes}
          handlePageSize={this.handlePageSize}
          onCreate={this.onCreate}
        />
        <PostContainer
          posts={this.state.posts}
          loggedInUser={this.state.loggedInUser}
          attributes={this.state.attributes}
          onCreate={this.onCreate}
          onDelete={this.onDelete}
          onUpdate={this.onUpdate}
        />
        <NavLinks
          handleNavNext={this.handleNavNext}
          handleNavPrev={this.handleNavPrev}
          handleNavNumber={this.handleNavNumber}
          handleNavLast={this.handleNavLast}
          handleNavFirst={this.handleNavFirst}
          links={this.state.links}
          page={this.state.page}
        />
      </Container>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("react")
);
