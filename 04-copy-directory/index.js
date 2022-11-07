const fs = require("node:fs/promises");
const path = require("node:path");

const SRC = "files";
const DIST = "files-copy";

const makeCopy = async (from, to) => {
  await fs.rm(to, { recursive: true, force: true });
  await fs.mkdir(to, { recursive: true });

  const entities = await fs.readdir(from, { withFileTypes: true });

  for await (const e of entities) {
    e.isFile()
      ? fs.copyFile(path.join(from, e.name), path.join(to, e.name))
      : makeCopy(path.join(from, e.name), path.join(to, e.name));
  }
};

(async function main() {
  await makeCopy(path.join(__dirname, SRC), path.join(__dirname, DIST));
})();

module.exports = { makeCopy };
