const express = require("express");
const cli = require("./cli/cli");
const app = express();

const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const cli = new CLI();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  cli.run();
});