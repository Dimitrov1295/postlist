import React from "react";
import { Pagination } from "react-bootstrap";

class NavLinks extends React.Component {
  createPaginationItem = (i) => {
    return (
      <Pagination.Item
        key={i}
        onClick={(e) => {
          this.props.handleNavNumber(e, i);
        }}
        active={this.props.page.number === i}
      >
        {i + 1}
      </Pagination.Item>
    );
  };

  render() {
    let navLinks = [];

    if ("first" in this.props.links) {
      navLinks.push(
        <Pagination.First
          key="first"
          onClick={(e) => {
            this.props.handleNavFirst(e);
          }}
        />
      );
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <Pagination.Prev
          key="prev"
          onClick={(e) => {
            this.props.handleNavPrev(e);
          }}
        />
      );
    }

    let totalPages = this.props.page.totalPages;
    let pageNumber = this.props.page.number;
    for (let i = 0; i < totalPages; i++) {
      if (!(i > pageNumber + 3 || i < pageNumber - 3)) {
        navLinks.push(this.createPaginationItem(i));
      } else if (i === pageNumber + 4 || i === pageNumber - 4) {
        navLinks.push(<Pagination.Ellipsis key={i} />);
      }
    }

    if ("next" in this.props.links) {
      navLinks.push(
        <Pagination.Next
          key="next"
          onClick={(e) => {
            this.props.handleNavNext(e);
          }}
        />
      );
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <Pagination.Last
          key="last"
          onClick={(e) => {
            this.props.handleNavLast(e);
          }}
        />
      );
    }

    let style = { marginTop: "5vh", marginBottom: "6vh" };
    return <Pagination style={style}>{navLinks}</Pagination>;
  }
}
export default NavLinks;
