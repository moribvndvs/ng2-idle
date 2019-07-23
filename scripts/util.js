const fs = require('fs');
const path = require('path');

module.exports.getFolders = dir => {
  return fs
    .readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isDirectory());
};
