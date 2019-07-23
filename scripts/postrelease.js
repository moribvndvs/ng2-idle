const fs = require('fs');
const path = require('path');
const util = require('./util');

const lerna = JSON.parse(fs.readFileSync('./lerna.json', 'utf8'));

const projects = util.getFolders('./projects');

projects.map(function(project) {
  const dest = path.join('./dist', project, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(dest));
  let changed = false;

  if (project === 'keepalive') {
    pkg.peerDependencies['@ng-idle/core'] = '^' + lerna.version;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2), 'utf-8');
  }
});
