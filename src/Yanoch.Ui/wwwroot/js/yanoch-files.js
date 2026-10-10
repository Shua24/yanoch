// Browser helpers for importing and exporting Markdown without a server round trip.

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
};
