// _hook.cjs
// WBS 1.1.2 - Writes the Husky pre-commit hook.
// Must run AFTER `npx husky init` has created the .husky/ folder.

'use strict';

const fs   = require('fs');
const path = require('path');

const hookPath = path.join('.husky', 'pre-commit');

const hookContent = [
  '#!/usr/bin/env sh',
  '. "$(dirname -- "$0")/_/husky.sh"',
  '',
  'echo "Running pre-commit checks..."',
  'npx lint-staged',
  '',
].join('\n');

fs.writeFileSync(hookPath, hookContent, 'utf8');
console.log('  wrote:', hookPath);

try { fs.chmodSync(hookPath, 0o755); } catch (_) {}

console.log('');
console.log('Husky pre-commit hook written successfully.');
