// Small theme helper loaded by App.razor. Keeping it as plain browser JavaScript means the theme
// is applied before Blazor renders, so there is no flash of the wrong theme on reload.

window.yanochTheme = {
  storageKey: "yanoch-theme",

  read() {
    try {
      return window.localStorage.getItem(this.storageKey) || "dark";
    } catch (error) {
      return "dark";
    }
  },

  apply(themeName) {
    const root = document.documentElement;
    if (themeName === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
    }
  },

  persist(themeName) {
    try {
      window.localStorage.setItem(this.storageKey, themeName);
    } catch (error) {
      // Storage may be unavailable in private modes; the in-memory state still works.
    }
  },

  initialise() {
    this.apply(this.read());
  },
};

window.yanochTheme.initialise();
