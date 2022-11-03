const path = require("node:path");
const fs = require("node:fs/promises");

const FOLDER_NAME = "secret-folder";

(async () => {
  const folder = await fs.readdir(path.join(__dirname, FOLDER_NAME), {
    withFileTypes: true,
  });

  const files = folder.filter((entity) => entity.isFile());

  const info = await Promise.all(
    files.map(async ({ name }) => {
      const { size } = await fs.stat(path.join(__dirname, FOLDER_NAME, name));

      const ext = path.extname(name);

      return {
        name: name.replace(ext, ""),
        ext: ext.slice(1),
        size,
      };
    })
  );

  info.forEach(({ name, ext, size }) => {
    console.log(`${name} - ${ext} - ${size}`);
  });
})();
