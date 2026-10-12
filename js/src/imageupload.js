import { getEntry } from "./registry.js";

// The slash menu's Image item calls this. The host has already converted the block into an image
// node, so the block is showing its entry form; this opens the picker and, on success, writes the
// stored name into the node's src attr. That saves the user a second click on the form's own
// Upload button, while leaving that button in place for the typed `![alt](url)` path.
//
// This lives in its own module rather than in index.js because index.js is at its size budget and
// this is a self-contained piece of behaviour with a single caller.
export async function startImageUpload(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }

  const result = await window.yanochFiles.pickAndUploadImage();
  if (result.cancelled || result.error) {
    return;
  }

  // The node view has to exist before there is anything to write the source into: converting the
  // block to an image replaces the editor's document, and the view is rebuilt from that.
  const position = entry.view.state.doc.firstChild;
  if (!position || position.type.name !== "image") {
    return;
  }

  const transaction = entry.view.state.tr.setNodeMarkup(0, undefined, {
    ...position.attrs,
    src: result.storedName,
  });
  entry.view.dispatch(transaction);
}
