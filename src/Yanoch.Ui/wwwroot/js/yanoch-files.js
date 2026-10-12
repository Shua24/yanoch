// Browser helpers for importing and exporting Markdown without a server round trip, plus the
// image upload call.
//
// The upload posts to the app's own /media endpoint. Two details are load bearing:
//
//   1. The antiforgery token is read from the page rather than passed in. UseAntiforgery validates
//      every POST, and the layout renders the hidden field on every signed-in page, so the DOM is
//      the one place that always has a current token.
//   2. The cookies ride along because this is a same-origin request. Nothing here sets credentials
//      explicitly; the default "same-origin" behaviour is what carries the session, and on the
//      desktop host it also carries the launch-gate cookie the window earned at startup.

window.yanochFiles = {
  downloadText(fileName, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  },

  pickTextFile(accept) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept || ".md,.markdown,.txt";
      input.style.display = "none";
      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, text: String(reader.result) });
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      });
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  },

  // The formats the server accepts. Kept in step with ImageContentType on the server side, which
  // is the authority: this list only shapes the picker dialog, and the server re-checks the bytes.
  acceptedImageTypes: "image/png,image/jpeg,image/gif,image/webp",

  // Opens the picker and resolves with the chosen File, or null when the user cancelled.
  pickImageFile() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = window.yanochFiles.acceptedImageTypes;
      input.style.display = "none";
      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        resolve(file || null);
      });
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  },

  // Reads the antiforgery token the layout rendered. Returns an empty string when there is none,
  // which is what an unauthenticated page looks like: the upload will then be refused, correctly.
  readAntiforgeryToken() {
    const field = document.querySelector('input[name="__RequestVerificationToken"]');
    return field ? field.value : "";
  },

  // Posts one image and resolves with { storedName } on success or { error } on failure. Never
  // rejects: every failure path resolves so the caller has one shape to handle.
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    let response;
    try {
      response = await fetch("/media/", {
        method: "POST",
        body: formData,
        headers: { RequestVerificationToken: window.yanochFiles.readAntiforgeryToken() },
      });
    } catch (error) {
      return { error: "The upload could not reach the server." };
    }

    if (response.ok) {
      const result = await response.json();
      return { storedName: result.storedName };
    }

    // The endpoint answers a refusal with { message }. A 413 comes from Kestrel itself when a body
    // exceeds the server limit, which has no JSON body, so that case gets its own wording.
    if (response.status === 413) {
      return { error: "That image is larger than the server accepts." };
    }
    try {
      const problem = await response.json();
      return { error: problem.message || "The upload was refused." };
    } catch (error) {
      return { error: "The upload failed." };
    }
  },

  // The whole gesture: pick a file, then upload it. Resolves with { storedName } or { error },
  // and with { cancelled: true } when the user closed the picker.
  async pickAndUploadImage() {
    const file = await window.yanochFiles.pickImageFile();
    if (!file) {
      return { cancelled: true };
    }
    return await window.yanochFiles.uploadImage(file);
  },
};
