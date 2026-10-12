import { schema } from "./schema.js";

// A node view for the image block. The plain `toDOM` is enough to RENDER an image, but it cannot
// react to a load failure: a source that 404s or is blocked leaves the browser's own broken-image
// glyph, which is indistinguishable from a layout bug and tells the user nothing. This view owns
// the failure state, replacing the picture with a bordered note naming the URL, and reports the
// image's natural size once it loads (which is what a future resize feature needs).

function buildFailureNotice(source) {
  const notice = document.createElement("div");
  notice.className = "yanoch-image-error";
  notice.setAttribute("contenteditable", "false");
  notice.textContent = source
    ? "Image could not be loaded: " + source
    : "Image has no source URL";
  return notice;
}

export function createImageView(node, view, getPos) {
  const figure = document.createElement("figure");
  figure.className = "yanoch-image-block";
  figure.setAttribute("data-image", "true");
  figure.setAttribute("draggable", "true");
  figure.setAttribute("contenteditable", "false");

  const image = document.createElement("img");
  image.className = "yanoch-image";
  image.alt = node.attrs.alt || "";

  const caption = document.createElement("figcaption");
  caption.className = "yanoch-image-caption";
  // Set on CREATION as well as in update(): a node view is built once when the block mounts, and
  // an update() only runs on a later change, so a caption present at mount would otherwise never
  // be written into the DOM.
  caption.textContent = node.attrs.caption || "";

  let failureNotice = null;

  function showFailure() {
    if (failureNotice) {
      return;
    }
    figure.classList.add("yanoch-image-failed");
    failureNotice = buildFailureNotice(node.attrs.src);
    figure.appendChild(failureNotice);
  }

  function clearFailure() {
    figure.classList.remove("yanoch-image-failed");
    if (failureNotice) {
      failureNotice.remove();
      failureNotice = null;
    }
  }

  image.addEventListener("load", () => {
    clearFailure();
  });
  image.addEventListener("error", () => {
    showFailure();
  });

  function applySource() {
    const source = node.attrs.src || "";
    clearFailure();
    if (!source) {
      image.removeAttribute("src");
      showFailure();
      return;
    }
    image.src = source;
  }

  figure.appendChild(image);
  figure.appendChild(caption);
  applySource();

  return {
    dom: figure,
    // The image is a leaf with no text content, so nothing inside it is editable.
    contentDOM: null,
    update(updatedNode) {
      if (updatedNode.type !== node.type) {
        return false;
      }
      node = updatedNode;
      image.alt = node.attrs.alt || "";
      caption.textContent = node.attrs.caption || "";
      if (image.getAttribute("src") !== node.attrs.src) {
        applySource();
      }
      return true;
    },
    ignoreMutation() {
      return true;
    },
  };
}
