// _gen.cjs
// WBS 1.1.4 - Generates Firebase config files.
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

// ── firebase.json ─────────────────────────────────────────────
write('firebase.json', JSON.stringify({
  hosting: {
    public: 'dist',
    ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
    rewrites: [{ source: '**', destination: '/index.html' }],
    headers: [
      {
        source: '**/*.@(js|css)',
        headers: [{ key: 'Cache-Control', value: 'max-age=31536000' }],
      },
      {
        source: '**',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
    ],
  },
  firestore: {
    rules: 'firestore.rules',
    indexes: 'firestore.indexes.json',
  },
  storage: {
    rules: 'storage.rules',
  },
  functions: {
    source: 'functions',
    codebase: 'default',
    ignore: ['node_modules', '.git', 'firebase-debug.log', 'firebase-debug.*.log'],
  },
  emulators: {
    auth:      { port: 9099 },
    firestore: { port: 8080 },
    functions: { port: 5001 },
    storage:   { port: 9199 },
    hosting:   { port: 5000 },
    ui:        { enabled: true, port: 4000 },
  },
}, null, 2));

// ── firestore.rules ───────────────────────────────────────────
write('firestore.rules', [
  "rules_version = '2';",
  "service cloud.firestore {",
  "  match /databases/{database}/documents {",
  "",
  "    // ── Helper functions ──────────────────────────────────",
  "    function isSignedIn() {",
  "      return request.auth != null;",
  "    }",
  "",
  "    function isOwner(uid) {",
  "      return isSignedIn() && request.auth.uid == uid;",
  "    }",
  "",
  "    function isAdmin() {",
  "      return isSignedIn() &&",
  "        exists(/databases/$(database)/documents/members/$(request.auth.uid)) &&",
  "        get(/databases/$(database)/documents/members/$(request.auth.uid)).data.isAdmin == true;",
  "    }",
  "",
  "    // ── Placeholder rules (expanded in WBS 1.2.1) ────────",
  "    // All reads/writes locked down by default.",
  "    // Individual collection rules will be added per module.",
  "",
  "    match /{document=**} {",
  "      allow read, write: if isAdmin();",
  "    }",
  "  }",
  "}",
]);

// ── storage.rules ─────────────────────────────────────────────
write('storage.rules', [
  "rules_version = '2';",
  "service firebase.storage {",
  "  match /b/{bucket}/o {",
  "",
  "    // ── Profile images ────────────────────────────────────",
  "    match /members/{uid}/avatar/{filename} {",
  "      allow read:  if true;",
  "      allow write: if request.auth != null",
  "                   && request.auth.uid == uid",
  "                   && request.resource.size < 2 * 1024 * 1024",
  "                   && request.resource.contentType.matches('image/.*');",
  "    }",
  "",
  "    // ── Document attachments ──────────────────────────────",
  "    match /attachments/{boardMid}/{docSrl}/{filename} {",
  "      allow read:  if request.auth != null;",
  "      allow write: if request.auth != null",
  "                   && request.resource.size < 50 * 1024 * 1024;",
  "    }",
  "",
  "    // ── Default deny ──────────────────────────────────────",
  "    match /{allPaths=**} {",
  "      allow read, write: if false;",
  "    }",
  "  }",
  "}",
]);

// ── firestore.indexes.json ────────────────────────────────────
write('firestore.indexes.json', JSON.stringify({
  indexes: [
    {
      collectionGroup: 'documents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'boardMid', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'documents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'boardMid',   order: 'ASCENDING' },
        { fieldPath: 'categoryId', order: 'ASCENDING' },
        { fieldPath: 'createdAt',  order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'documents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'boardMid', order: 'ASCENDING' },
        { fieldPath: 'views',    order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'comments',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'docSrl',    order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'ASCENDING' },
      ],
    },
    {
      collectionGroup: 'notifications',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'uid',       order: 'ASCENDING' },
        { fieldPath: 'read',      order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
  ],
  fieldOverrides: [],
}, null, 2));

// ── src/config/firebase.ts ────────────────────────────────────
write('src/config/firebase.ts', [
  "import { initializeApp }              from 'firebase/app'",
  "import { getAuth, connectAuthEmulator } from 'firebase/auth'",
  "import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'",
  "import { getStorage, connectStorageEmulator }    from 'firebase/storage'",
  "import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'",
  "import { getAnalytics, isSupported }             from 'firebase/analytics'",
  "",
  "const firebaseConfig = {",
  "  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,",
  "  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,",
  "  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,",
  "  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,",
  "  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,",
  "  appId:             import.meta.env.VITE_FIREBASE_APP_ID,",
  "  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,",
  "}",
  "",
  "// Initialise Firebase app",
  "export const app = initializeApp(firebaseConfig)",
  "",
  "// Service exports",
  "export const auth      = getAuth(app)",
  "export const db        = getFirestore(app)",
  "export const storage   = getStorage(app)",
  "export const functions = getFunctions(app, 'asia-northeast3') // Seoul region",
  "",
  "// Analytics (only in browser, not SSR/emulator)",
  "export const analytics = isSupported().then((yes) => yes ? getAnalytics(app) : null)",
  "",
  "// ── Connect to local emulators in development ─────────────",
  "if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {",
  "  connectAuthEmulator(auth,           'http://localhost:9099', { disableWarnings: true })",
  "  connectFirestoreEmulator(db,         'localhost', 8080)",
  "  connectStorageEmulator(storage,      'localhost', 9199)",
  "  connectFunctionsEmulator(functions,  'localhost', 5001)",
  "  console.warn('[DEV] Connected to Firebase Emulator Suite')",
  "}",
]);

// ── src/config/firebase.env.d.ts  (Vite env type declarations) ─
write('src/vite-env.d.ts', [
  "/// <reference types=\"vite/client\" />",
  "",
  "interface ImportMetaEnv {",
  "  readonly VITE_FIREBASE_API_KEY:             string",
  "  readonly VITE_FIREBASE_AUTH_DOMAIN:         string",
  "  readonly VITE_FIREBASE_PROJECT_ID:          string",
  "  readonly VITE_FIREBASE_STORAGE_BUCKET:      string",
  "  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string",
  "  readonly VITE_FIREBASE_APP_ID:              string",
  "  readonly VITE_FIREBASE_MEASUREMENT_ID:      string",
  "  readonly VITE_USE_EMULATOR:                 string",
  "}",
  "",
  "interface ImportMeta {",
  "  readonly env: ImportMetaEnv",
  "}",
]);

// ── .env.local template (user must fill in values) ────────────
// Only write if it doesn't already exist (never overwrite real secrets)
if (!fs.existsSync('.env.local')) {
  write('.env.local', [
    "# Firebase config – fill in from Firebase Console",
    "# Project Settings > Your apps > Web app > Config",
    "# DO NOT commit this file to git.",
    "",
    "VITE_FIREBASE_API_KEY=",
    "VITE_FIREBASE_AUTH_DOMAIN=",
    "VITE_FIREBASE_PROJECT_ID=",
    "VITE_FIREBASE_STORAGE_BUCKET=",
    "VITE_FIREBASE_MESSAGING_SENDER_ID=",
    "VITE_FIREBASE_APP_ID=",
    "VITE_FIREBASE_MEASUREMENT_ID=",
    "",
    "# Set to 'true' to use local Firebase Emulator Suite",
    "VITE_USE_EMULATOR=false",
  ]);
} else {
  console.log('  skipped: .env.local (already exists)');
}

// ── Ensure .env.local is in .gitignore ───────────────────────
const giPath = '.gitignore';
if (fs.existsSync(giPath)) {
  const gi = fs.readFileSync(giPath, 'utf8');
  if (!gi.includes('.env.local')) {
    fs.appendFileSync(giPath, '\n.env.local\n');
    console.log('  updated: .gitignore (added .env.local)');
  }
}

console.log('');
console.log('All Firebase config files generated successfully.');
