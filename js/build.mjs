import { build } from "esbuild";

const options = {
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "esm",
  outfile: "../src/Yanoch.Ui/wwwroot/js/yanoch-editor.js",
  minify: true,
  sourcemap: true,
  target: ["es2022"],
  logLevel: "info",
};

await build(options);
