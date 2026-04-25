#!/usr/bin/env node
// Pre-flight check: validates all required env variables are set.
// Run before deploying: node scripts/check-env.cjs

'use strict';

const fs   = require('fs');
const path = require('path');

// Load .env.local if it exists
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split('=');
      acc[key.trim()] = rest.join('=').trim();
      return acc;
    }, {});
}

const envLocal = loadEnvFile('.env.local');
const envDev   = loadEnvFile('.env.development');
const merged   = { ...envDev, ...envLocal, ...process.env };

const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const OPTIONAL = [
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_USE_EMULATOR',
  'VITE_ENABLE_ANALYTICS',
  'VITE_APP_NAME',
  'VITE_APP_URL',
];

let hasError = false;

console.log('\n Checking environment variables...\n');

REQUIRED.forEach((key) => {
  const val = merged[key];
  if (!val || val.trim() === '') {
    console.error('  MISSING:', key);
    hasError = true;
  } else {
    const preview = val.length > 8 ? val.slice(0, 4) + '...' + val.slice(-4) : '***';
    console.log('  OK     ', key, '=', preview);
  }
});

console.log('');
OPTIONAL.forEach((key) => {
  const val = merged[key];
  console.log('  OPTIONAL', key, '=', val || '(not set)');
});

console.log('');
if (hasError) {
  console.error(' Some required variables are missing.');
  console.error(' Copy .env.local.example to .env.local and fill in the values.\n');
  process.exit(1);
} else {
  console.log(' All required environment variables are set.\n');
}
