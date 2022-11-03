const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const FILENAME = "text.txt";
const EXIT = "exit";

const wstream = fs.createWriteStream(path.join(__dirname, FILENAME), {
  flags: "a",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Good Day! Please, write:\n",
});

rl.prompt();

rl.on("line", (line) => {
  switch (line.trim()) {
    case EXIT:
      rl.emit("SIGINT");
      break;

    default:
      wstream.write(line);
      wstream.write("\n");
      break;
  }
});

rl.on("SIGINT", () => {
  rl.write("Have a great day! Bye!");
  process.exit(0);
});
