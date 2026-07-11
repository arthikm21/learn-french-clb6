const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const files = ['app.js', 'sw.js'];
for (const dir of ['data', 'modules', 'scripts', 'tests']) {
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith('.js') && name !== 'check-syntax.js') files.push(path.join(dir, name));
  }
}

const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) failures.push(`${file}\n${result.stderr}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`JavaScript syntax: ${files.length} files OK`);
