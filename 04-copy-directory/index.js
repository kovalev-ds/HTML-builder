const fs = require("node:fs/promises");
const path = require("node:path");

const FOLDER_NAME = "files";
const FOLDER_COPY = "files-copy";

// TODO: create recursive copuing of folder

(async function main() {
  await fs.mkdir(path.join(__dirname, FOLDER_COPY), {
    recursive: true,
  });

  const entities = await fs.readdir(path.join(__dirname, FOLDER_NAME));

  for await (const name of entities) {
    fs.copyFile(
      path.join(__dirname, FOLDER_NAME, name),
      path.join(__dirname, FOLDER_COPY, name)
    );
  }
})();
