const fs = require("fs");

// If dir doesn't exist we create it
exports.setDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  return dir;
};
