// _gen.cjs
// WBS 1.1.6 - Generates env files, Zod env validator, and check script.
// Run from inside the rhymix-react/ project folder.

'use strict';

const fs   = require('fs');
const path = require('path');

function write(filePath, lines) {
  const content = Array.isArray(lines) ? lines.join('\n') + '\n' : lines + '\n';
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('  wrote:', filePath);
}

function writeIfMissing(filePath, lines) {
  if (fs.existsSync(filePath)) {
    console.log('  skipped (exists):', filePath);
    return;
  }
  write(filePath, lines);
}

// ── .env.example (committed to git – documents all variables) ─
write('.env.example', [
  '# ============================================================',
  '# Environment Variables Reference',
  '# Copy this file to .env.local and fill in real values.',
  '# This file is committed to git – never put secrets here.',
  '# ============================================================',
  '',
  '# ── Firebase ────────────────────────────────────────────────',
  '# Get these from: Firebase Console > Project Settings',
  '#                 > Your apps > Web app > Config',
  'VITE_FIREBASE_API_KEY=',
  'VITE_FIREBASE_AUTH_DOMAIN=',
  'VITE_FIREBASE_PROJECT_ID=',
  'VITE_FIREBASE_STORAGE_BUCKET=',
  'VITE_FIREBASE_MESSAGING_SENDER_ID=',
  'VITE_FIREBASE_APP_ID=',
  'VITE_FIREBASE_MEASUREMENT_ID=',
  '',
  '# ── Feature flags ───────────────────────────────────────────',
  '# Set to "true" to use the local Firebase Emulator Suite',
  'VITE_USE_EMULATOR=false',
  '',
  '# ── App settings ────────────────────────────────────────────',
  'VITE_APP_NAME=Rhymix React',
  'VITE_APP_URL=http://localhost:3000',
  'VITE_ENABLE_ANALYTICS=false',
]);

// ── .env.development (Vite loads this automatically in dev) ───
write('.env.development', [
  '# Development environment – loaded by Vite automatically with npm run dev',
  '# Do NOT put secrets here. Use .env.local for secrets.',
  '',
  'VITE_USE_EMULATOR=false',
  'VITE_APP_NAME=Rhymix React [DEV]',
  'VITE_APP_URL=http://localhost:3000',
  'VITE_ENABLE_ANALYTICS=false',
]);

// ── .env.staging ──────────────────────────────────────────────
write('.env.staging', [
  '# Staging environment',
  '# Used by CI when building for the staging Firebase channel.',
  '',
  'VITE_USE_EMULATOR=false',
  'VITE_APP_NAME=Rhymix React [STAGING]',
  'VITE_APP_URL=https://your-project--staging.web.app',
  'VITE_ENABLE_ANALYTICS=false',
]);

// ── .env.production ───────────────────────────────────────────
write('.env.production', [
  '# Production environment – loaded by Vite automatically with npm run build',
  '# Secret values come from GitHub Secrets injected by CI, not this file.',
  '',
  'VITE_USE_EMULATOR=false',
  'VITE_APP_NAME=Rhymix React',
  'VITE_APP_URL=https://your-project.web.app',
  'VITE_ENABLE_ANALYTICS=true',
]);

// ── .env.local.example ────────────────────────────────────────
writeIfMissing('.env.local.example', [
  '# Copy this file to .env.local and fill in your Firebase values.',
  '# .env.local is gitignored and overrides all other .env files.',
  '',
  'VITE_FIREBASE_API_KEY=AIza...',
  'VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com',
  'VITE_FIREBASE_PROJECT_ID=your-project-id',
  'VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com',
  'VITE_FIREBASE_MESSAGING_SENDER_ID=123456789',
  'VITE_FIREBASE_APP_ID=1:123456789:web:abc123',
  'VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX',
  '',
  'VITE_USE_EMULATOR=false',
  'VITE_APP_NAME=Rhymix React',
  'VITE_APP_URL=http://localhost:3000',
  'VITE_ENABLE_ANALYTICS=false',
]);

// ── src/config/env.ts (Zod-validated env access) ──────────────
write('src/config/env.ts', [
  "import { z } from 'zod'",
  "",
  "// ── Schema ────────────────────────────────────────────────",
  "const envSchema = z.object({",
  "  // Firebase",
  "  VITE_FIREBASE_API_KEY:             z.string().min(1, 'Firebase API key is required'),",
  "  VITE_FIREBASE_AUTH_DOMAIN:         z.string().min(1, 'Firebase auth domain is required'),",
  "  VITE_FIREBASE_PROJECT_ID:          z.string().min(1, 'Firebase project ID is required'),",
  "  VITE_FIREBASE_STORAGE_BUCKET:      z.string().min(1, 'Firebase storage bucket is required'),",
  "  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),",
  "  VITE_FIREBASE_APP_ID:              z.string().min(1, 'Firebase app ID is required'),",
  "  VITE_FIREBASE_MEASUREMENT_ID:      z.string().optional(),",
  "",
  "  // Feature flags",
  "  VITE_USE_EMULATOR:      z.string().transform((v) => v === 'true').default('false'),",
  "  VITE_ENABLE_ANALYTICS:  z.string().transform((v) => v === 'true').default('false'),",
  "",
  "  // App settings",
  "  VITE_APP_NAME: z.string().default('Rhymix React'),",
  "  VITE_APP_URL:  z.string().url().default('http://localhost:3000'),",
  "})",
  "",
  "// ── Parse & validate on module load ──────────────────────",
  "const _parsed = envSchema.safeParse(import.meta.env)",
  "",
  "if (!_parsed.success) {",
  "  const issues = _parsed.error.issues",
  "    .map((i) => `  • ${i.path.join('.')}: ${i.message}`)",
  "    .join('\\n')",
  "  throw new Error(",
  "    `[env] Missing or invalid environment variables:\\n${issues}\\n` +",
  "    `Copy .env.local.example to .env.local and fill in the values.`",
  "  )",
  "}",
  "",
  "// ── Type-safe export ──────────────────────────────────────",
  "export const env = _parsed.data",
  "",
  "// Convenience groupings",
  "export const firebaseConfig = {",
  "  apiKey:            env.VITE_FIREBASE_API_KEY,",
  "  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,",
  "  projectId:         env.VITE_FIREBASE_PROJECT_ID,",
  "  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,",
  "  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,",
  "  appId:             env.VITE_FIREBASE_APP_ID,",
  "  measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID,",
  "}",
  "",
  "export const featureFlags = {",
  "  useEmulator:     env.VITE_USE_EMULATOR,",
  "  enableAnalytics: env.VITE_ENABLE_ANALYTICS,",
  "}",
]);

// ── src/config/firebase.ts (updated to use env.ts) ────────────
write('src/config/firebase.ts', [
  "import { initializeApp }                       from 'firebase/app'",
  "import { getAuth, connectAuthEmulator }         from 'firebase/auth'",
  "import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'",
  "import { getStorage, connectStorageEmulator }   from 'firebase/storage'",
  "import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'",
  "import { getAnalytics, isSupported }            from 'firebase/analytics'",
  "import { firebaseConfig, featureFlags }         from '@config/env'",
  "",
  "export const app       = initializeApp(firebaseConfig)",
  "export const auth      = getAuth(app)",
  "export const db        = getFirestore(app)",
  "export const storage   = getStorage(app)",
  "export const functions = getFunctions(app, 'asia-northeast3')",
  "",
  "// Analytics only in browser when enabled",
  "export const analytics = featureFlags.enableAnalytics",
  "  ? isSupported().then((yes) => yes ? getAnalytics(app) : null)",
  "  : Promise.resolve(null)",
  "",
  "// Connect to emulators when VITE_USE_EMULATOR=true",
  "if (featureFlags.useEmulator) {",
  "  connectAuthEmulator(auth,          'http://localhost:9099', { disableWarnings: true })",
  "  connectFirestoreEmulator(db,        'localhost', 8080)",
  "  connectStorageEmulator(storage,     'localhost', 9199)",
  "  connectFunctionsEmulator(functions, 'localhost', 5001)",
  "  console.warn('[DEV] Connected to Firebase Emulator Suite')",
  "}",
]);

// ── scripts/check-env.cjs (pre-flight validator) ──────────────
write('scripts/check-env.cjs', [
  "#!/usr/bin/env node",
  "// Pre-flight check: validates all required env variables are set.",
  "// Run before deploying: node scripts/check-env.cjs",
  "",
  "'use strict';",
  "",
  "const fs   = require('fs');",
  "const path = require('path');",
  "",
  "// Load .env.local if it exists",
  "function loadEnvFile(filePath) {",
  "  if (!fs.existsSync(filePath)) return {};",
  "  return fs.readFileSync(filePath, 'utf8')",
  "    .split('\\n')",
  "    .filter((l) => l.trim() && !l.startsWith('#'))",
  "    .reduce((acc, line) => {",
  "      const [key, ...rest] = line.split('=');",
  "      acc[key.trim()] = rest.join('=').trim();",
  "      return acc;",
  "    }, {});",
  "}",
  "",
  "const envLocal = loadEnvFile('.env.local');",
  "const envDev   = loadEnvFile('.env.development');",
  "const merged   = { ...envDev, ...envLocal, ...process.env };",
  "",
  "const REQUIRED = [",
  "  'VITE_FIREBASE_API_KEY',",
  "  'VITE_FIREBASE_AUTH_DOMAIN',",
  "  'VITE_FIREBASE_PROJECT_ID',",
  "  'VITE_FIREBASE_STORAGE_BUCKET',",
  "  'VITE_FIREBASE_MESSAGING_SENDER_ID',",
  "  'VITE_FIREBASE_APP_ID',",
  "];",
  "",
  "const OPTIONAL = [",
  "  'VITE_FIREBASE_MEASUREMENT_ID',",
  "  'VITE_USE_EMULATOR',",
  "  'VITE_ENABLE_ANALYTICS',",
  "  'VITE_APP_NAME',",
  "  'VITE_APP_URL',",
  "];",
  "",
  "let hasError = false;",
  "",
  "console.log('\\n Checking environment variables...\\n');",
  "",
  "REQUIRED.forEach((key) => {",
  "  const val = merged[key];",
  "  if (!val || val.trim() === '') {",
  "    console.error('  MISSING:', key);",
  "    hasError = true;",
  "  } else {",
  "    const preview = val.length > 8 ? val.slice(0, 4) + '...' + val.slice(-4) : '***';",
  "    console.log('  OK     ', key, '=', preview);",
  "  }",
  "});",
  "",
  "console.log('');",
  "OPTIONAL.forEach((key) => {",
  "  const val = merged[key];",
  "  console.log('  OPTIONAL', key, '=', val || '(not set)');",
  "});",
  "",
  "console.log('');",
  "if (hasError) {",
  "  console.error(' Some required variables are missing.');",
  "  console.error(' Copy .env.local.example to .env.local and fill in the values.\\n');",
  "  process.exit(1);",
  "} else {",
  "  console.log(' All required environment variables are set.\\n');",
  "}",
]);

// ── Update package.json with check-env script ─────────────────
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'check-env': 'node scripts/check-env.cjs',
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('  updated: package.json (check-env script)');

// ── Ensure env files are gitignored correctly ─────────────────
const giPath = '.gitignore';
let gi = fs.existsSync(giPath) ? fs.readFileSync(giPath, 'utf8') : '';
const toAdd = ['.env.local', '.env.*.local']
  .filter((entry) => !gi.includes(entry));
if (toAdd.length > 0) {
  gi += '\n# Local env files\n' + toAdd.join('\n') + '\n';
  fs.writeFileSync(giPath, gi, 'utf8');
  console.log('  updated: .gitignore');
}

console.log('');
console.log('Env config generated successfully.');
