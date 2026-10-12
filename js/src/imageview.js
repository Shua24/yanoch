import { schema } from "./schema.js";

// A node view for the image block. The plain `toDOM` is enough to RENDER an image, but it cannot
// react to a load failure: a source that 404s or is blocked leaves the browser's own broken-image
// glyph, which is indistinguishable from a layout bug and tells the user nothing. This view owns
// the failure state, replacing the picture with a bordered note naming the URL, and reports the
// image's natural size once it loads (which is what a future resize feature needs).
//
// When the block has NO source yet, the notice is replaced by an entry form: a URL field and an
// upload button. That state used to be a dead end — the slash menu created an image block with an
// empty src and nothing in the editor could fill it, so the only way to get an image in was
// importing markdown. The form writes into the node's attrs, which is where the src lives.

// Uploaded files are addressed by their stored name under the app's own media route. A stored name
// is a bare filename with no scheme; anything carrying a scheme, a leading slash or a data: prefix
// is a source the user typed, and is used as-is.
function resolveImageSource(source) {
  if (!source) {
    return "";
  }
  const isAbsolute = /^(https?:)?\/\//i.test(source) || source.startsWith("data:") || source.startsWith("/");
  return isAbsolute ? source : "/media/" + source;
}

function buildFailureNotice(source) {
  const notice = document.createElement("div");
  notice.className = "yanoch-image-error";
  notice.setAttribute("contenteditable", "false");
  notice.textContent = source
    ? "Image could not be loaded: " + source
    : "Image has no source URL";
  return notice;
}

// The entry form for an image block that has no source yet: type or paste a URL, or pick a file.
function buildSourceForm(onUrlSubmitted, onUploadRequested) {
  const form = document.createElement("div");
  form.className = "yanoch-image-source-form";
  form.setAttribute("contenteditable", "false");

  const urlField = document.createElement("input");
  urlField.type = "text";
  urlField.className = "yanoch-image-source-input";
  urlField.placeholder = "Paste an image link, or upload a file";
  urlField.setAttribute("contenteditable", "false");

  const uploadButton = document.createElement("button");
  uploadButton.type = "button";
  uploadButton.className = "yanoch-image-upload-button";
  uploadButton.textContent = "Upload";

  const status = document.createElement("span");
  status.className = "yanoch-image-source-status";

  urlField.addEventListener("keydown", (event) => {
    // Enter commits the URL. Stopping propagation keeps the editor's own Enter handling (which
    // splits the block) from firing while the user is filling this field in.
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      const value = urlField.value.trim();
      if (value) {
        onUrlSubmitted(value);
      }
    }
  });

  uploadButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onUploadRequested(status, urlField);
  });

  form.appendChild(urlField);
  form.appendChild(uploadButton);
  form.appendChild(status);
  return form;
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
  let sourceForm = null;

  // Writing the attr goes through the view's own transaction, so the change is undoable and the
  // host learns about it through the usual debounced content notification.
  function setSource(source) {
    const position = typeof getPos === "function" ? getPos() : null;
    if (position === null || position === undefined) {
      return;
    }
    const transaction = view.state.tr.setNodeMarkup(position, undefined, {
      ...node.attrs,
      src: source,
    });
    view.dispatch(transaction);
  }

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

  function showSourceForm() {
    if (sourceForm) {
      return;
    }
    sourceForm = buildSourceForm(setSource, async (status, urlField) => {
      status.textContent = "Uploading...";
      const result = await window.yanochFiles.pickAndUploadImage();
      if (result.cancelled) {
        status.textContent = "";
        return;
      }
      if (result.error) {
        status.textContent = result.error;
        return;
      }
      status.textContent = "";
      urlField.value = "";
      // The stored name is what the block holds; resolveImageSource turns it into a fetchable URL.
      setSource(result.storedName);
    });
    figure.appendChild(sourceForm);
  }

  function clearSourceForm() {
    if (sourceForm) {
      sourceForm.remove();
      sourceForm = null;
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
      // No source yet: the block is waiting for one. Show the entry form ONLY — the failure notice
      // would just repeat what the form already makes obvious.
      image.removeAttribute("src");
      figure.classList.add("yanoch-image-failed");
      showSourceForm();
      return;
    }
    clearSourceForm();
    image.src = resolveImageSource(source);
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
    // Let the entry form receive its own keystrokes instead of the editor consuming them.
    stopEvent(event) {
      const isInsideForm = sourceForm && sourceForm.contains(event.target);
      return Boolean(isInsideForm);
    },
  };
}
