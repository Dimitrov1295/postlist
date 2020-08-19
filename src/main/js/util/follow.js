import $ from "jquery";

function follow(rootPath, relArray) {
  const root = $.ajax({
    url: rootPath,
    type: "GET",
    contentType: "application/schema+json",
  });
  function intercept(url) {
    if (url.indexOf("{") === -1) {
      return url;
    } else {
      url = url.split("{")[0];
      return url;
    }
  }
  return relArray.reduce(function (root, arrayItem) {
    const rel = typeof arrayItem === "string" ? arrayItem : arrayItem.rel;
    return traverseNext(root, rel, arrayItem);
  }, root);

  function traverseNext(root, rel, arrayItem) {
    return root.then(function (response) {
      if (hasEmbeddedRel(response, rel)) {
        return response._embedded[rel];
      }

      if (!response._links) {
        return [];
      }

      if (typeof arrayItem === "string") {
        return $.ajax({
          type: "GET",
          url: intercept(response._links[rel].href),
        });
      } else {
        return $.ajax({
          type: "GET",
          url: intercept(response._links[rel].href),
          data: $.param(arrayItem.params),
        });
      }
    });
  }

  function hasEmbeddedRel(entity, rel) {
    return entity._embedded && entity._embedded.hasOwnProperty(rel);
  }
}
export default follow;
