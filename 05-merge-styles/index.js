const path = require("node:path");
const fsp = require("node:fs/promises");
const fs = require("node:fs");

const SRC_DIR = "styles";
const DIST_DIR = "project-dist";
const OUTPUT_FILE = "bundle.css";

const mergeFiles = async (srcDir, output) => {
  const wstream = fs.createWriteStream(output);

  const entities = await fsp.readdir(srcDir, {
    withFileTypes: true,
  });

  const files = entities.filter(
    (e) => e.isFile() && path.extname(output) === path.extname(e.name)
  );

  for (const { name } of files) {
    fs.createReadStream(path.join(srcDir, name)).pipe(wstream);
  }
};

(async () => {
  await mergeFiles(
    path.join(__dirname, SRC_DIR),
    path.join(__dirname, DIST_DIR, OUTPUT_FILE)
  );
})();

module.exports = { mergeFiles };
