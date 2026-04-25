// _gen.cjs
// WBS 1.1.5 - Updates firebase.json for full hosting config,
//             creates .firebaserc aliases and public/ assets.
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

// ── firebase.json (full hosting config) ──────────────────────
// Read existing firebase.json if present and merge hosting section
let existing = {};
if (fs.existsSync('firebase.json')) {
  existing = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
}

const firebaseJson = {
  ...existing,
  hosting: {
    public: 'dist',
    ignore: [
      'firebase.json',
      '**/.*',
      '**/node_modules/**',
    ],

    // SPA rewrite: all routes → index.html (React Router handles routing)
    rewrites: [
      { source: '**', destination: '/index.html' },
    ],

    // Custom 404 (Firebase serves this for truly missing assets)
    cleanUrls: true,
    trailingSlash: false,

    headers: [
      // ── Long-term cache for hashed assets ──────────────────
      {
        source: '/assets/**',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ── No cache for index.html (always fetch latest) ──────
      {
        source: '/index.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      // ── Security headers on all responses ──────────────────
      {
        source: '**',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://firebasestorage.googleapis.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
              "frame-src 'none'",
            ].join('; '),
          },
        ],
      },
    ],

    // Preview channel config
    predeploy: [
      'npm run build',
    ],
  },
};

write('firebase.json', JSON.stringify(firebaseJson, null, 2));

// ── .firebaserc (project aliases) ────────────────────────────
// Read existing .firebaserc if present
let rc = { projects: {}, targets: {} };
if (fs.existsSync('.firebaserc')) {
  rc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
}

// Ensure staging and production aliases exist
// The actual project IDs are placeholders — user fills in real ones
if (!rc.projects.default && !rc.projects.production) {
  rc.projects = {
    ...rc.projects,
    production: 'your-firebase-project-id',
    staging:    'your-firebase-project-id-staging',
  };
  console.log('  note: update .firebaserc with your real project IDs');
}

write('.firebaserc', JSON.stringify(rc, null, 2));

// ── public/404.html ───────────────────────────────────────────
write('public/404.html', [
  '<!DOCTYPE html>',
  '<html lang="ko">',
  '<head>',
  '  <meta charset="UTF-8" />',
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  '  <title>404 - 페이지를 찾을 수 없습니다</title>',
  '  <style>',
  '    * { margin: 0; padding: 0; box-sizing: border-box; }',
  '    body {',
  '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
  '      display: flex;',
  '      align-items: center;',
  '      justify-content: center;',
  '      min-height: 100vh;',
  '      background: #f8fafc;',
  '      color: #1e293b;',
  '    }',
  '    .container { text-align: center; padding: 2rem; }',
  '    h1 { font-size: 6rem; font-weight: 800; color: #2E75B6; line-height: 1; }',
  '    h2 { font-size: 1.5rem; margin: 1rem 0 0.5rem; }',
  '    p  { color: #64748b; margin-bottom: 2rem; }',
  '    a  {',
  '      display: inline-block;',
  '      padding: 0.75rem 2rem;',
  '      background: #2E75B6;',
  '      color: #fff;',
  '      text-decoration: none;',
  '      border-radius: 0.5rem;',
  '      font-weight: 600;',
  '    }',
  '    a:hover { background: #1F5FA6; }',
  '  </style>',
  '  <script>',
  '    // Redirect to home after 5 seconds',
  '    setTimeout(() => window.location.href = "/", 5000)',
  '  </script>',
  '</head>',
  '<body>',
  '  <div class="container">',
  '    <h1>404</h1>',
  '    <h2>페이지를 찾을 수 없습니다</h2>',
  '    <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.<br/>5초 후 홈으로 이동합니다.</p>',
  '    <a href="/">홈으로 돌아가기</a>',
  '  </div>',
  '</body>',
  '</html>',
]);

// ── public/_headers (Netlify-style fallback, ignored by Firebase) ─
// Good to have for documentation purposes
write('public/_headers', [
  '# These headers are for documentation only.',
  '# Firebase Hosting headers are configured in firebase.json.',
  '',
  '/*',
  '  X-Frame-Options: SAMEORIGIN',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
]);

// ── Update package.json with hosting scripts ──────────────────
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'firebase:serve':   'firebase serve --only hosting',
  'firebase:deploy':  'firebase deploy --only hosting',
  'firebase:staging': 'firebase hosting:channel:deploy staging --expires 7d',
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('  updated: package.json (firebase scripts)');

console.log('');
console.log('Firebase Hosting config generated successfully.');
