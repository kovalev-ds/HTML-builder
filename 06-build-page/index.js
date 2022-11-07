const path = require("node:path");
const fsp = require("node:fs/promises");
const fs = require("node:fs");
const { Transform } = require("node:stream");

const { makeCopy } = require("../04-copy-directory");
const { mergeFiles } = require("../05-merge-styles");

const DIST_DIR = "project-dist";
const OUTPUT_HTML = "index.html";
const OUTPUT_CSS = "style.css";

const INPUT_HTML = "template.html";

const interpolateHTML = (componentsFolder) => {
  return new Transform({
    async transform(chunk, enc, next) {
      const bindings = chunk.toString().match(/\{{(.*?)\}}/gi);

      let html = chunk.toString();

      for await (const binding of bindings) {
        html = html.replace(
          binding,
          (await fsp.readFile(
            path.join(
              componentsFolder,
              `${binding.slice(2, binding.length - 2)}.html`
            )
          )) ?? ""
        );
      }
      this.push(html);
      next();
    },
  });
};

(async () => {
  // create dist folder
  await fsp.mkdir(path.join(__dirname, DIST_DIR), {
    recursive: true,
  });

  // interpolate html
  const htmlWStream = fs.createWriteStream(
    path.join(__dirname, DIST_DIR, OUTPUT_HTML)
  );

  fs.createReadStream(path.join(__dirname, INPUT_HTML))
    .pipe(interpolateHTML(path.join(__dirname, "components")))
    .pipe(htmlWStream);

  await Promise.all([
    // merge styles
    mergeFiles(
      path.join(__dirname, "styles"),
      path.join(__dirname, DIST_DIR, OUTPUT_CSS)
    ),
    // copy assets
    makeCopy(
      path.join(__dirname, "assets"),
      path.join(__dirname, DIST_DIR, "assets")
    ),
  ]);
})();
