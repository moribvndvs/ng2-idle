const fs = require('fs');
const path = require('path');
const util = require('./util');

const basePkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

var modules = util.getFolders('./modules');

modules.map(function(module) {
  var src = path.join('./modules', module, 'package.json');
  var dest = path.join('./dist', module, 'package.json');

  var pkg = JSON.parse(fs.readFileSync(src))
  pkg.version = basePkg.version;
  pkg.peerDependencies = Object.assign({}, basePkg.dependencies);

  if (module === 'keepalive') {
    pkg.peerDependencies['@ng-idle/core'] = '^' + basePkg.version;
  }

  fs.writeFileSync(dest, JSON.stringify(pkg, null, 2), 'utf-8');
});
