const fs = require("fs");
const path = require("path");

const FILENAME = "text.txt";

const rstream = fs.createReadStream(path.join(__dirname, FILENAME));

rstream.pipe(process.stdout);
