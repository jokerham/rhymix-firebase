// _gen.cjs
// WBS 1.1.1 – File generator for Vite + React + TypeScript skeleton
// Called by setup.bat after npm installs are complete.
// Runs inside the newly created project folder (rhymix-react/).

'use strict';

const fs   = require('fs');
const path = require('path');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('  wrote:', filePath);
}

// ── vite.config.ts ────────────────────────────────────────────
write('vite.config.ts', `\
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages':      resolve(__dirname, 'src/pages'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
      '@store':      resolve(__dirname, 'src/store'),
      '@services':   resolve(__dirname, 'src/services'),
      '@types':      resolve(__dirname, 'src/types'),
      '@utils':      resolve(__dirname, 'src/utils'),
      '@assets':     resolve(__dirname, 'src/assets'),
      '@config':     resolve(__dirname, 'src/config'),
    },
  },
  server: { port: 3000, open: true },
  build:  { outDir: 'dist', sourcemap: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
})
`);

// ── tsconfig.json ─────────────────────────────────────────────
write('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    skipLibCheck: true,
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: 'react-jsx',
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    baseUrl: '.',
    paths: {
      '@/*':           ['src/*'],
      '@components/*': ['src/components/*'],
      '@pages/*':      ['src/pages/*'],
      '@hooks/*':      ['src/hooks/*'],
      '@store/*':      ['src/store/*'],
      '@services/*':   ['src/services/*'],
      '@types/*':      ['src/types/*'],
      '@utils/*':      ['src/utils/*'],
      '@assets/*':     ['src/assets/*'],
      '@config/*':     ['src/config/*'],
    },
  },
  include: ['src'],
  references: [{ path: './tsconfig.node.json' }],
}, null, 2));

// ── tsconfig.node.json ────────────────────────────────────────
write('tsconfig.node.json', JSON.stringify({
  compilerOptions: {
    composite: true,
    skipLibCheck: true,
    module: 'ESNext',
    moduleResolution: 'bundler',
    allowSyntheticDefaultImports: true,
  },
  include: ['vite.config.ts'],
}, null, 2));

// ── src/test/setup.ts ─────────────────────────────────────────
write('src/test/setup.ts', `\
import '@testing-library/jest-dom'
`);

// ── src/types/index.ts ────────────────────────────────────────
write('src/types/index.ts', `\
// Shared domain types – expanded in later WBS activities

export interface Member {
  uid: string
  email: string
  nickname: string
  avatarUrl?: string
  groupIds: string[]
  points: number
  status: 'active' | 'banned' | 'pending'
  createdAt: string
}

export interface Board {
  mid: string
  name: string
  layout: 'list' | 'gallery' | 'album' | 'webzine' | 'card'
  description?: string
  categoryIds: string[]
  createdAt: string
}

export interface Document {
  docSrl: string
  boardMid: string
  title: string
  content: string
  authorId: string
  categoryId?: string
  tags: string[]
  status: 'public' | 'secret' | 'trash'
  isNotice: boolean
  views: number
  votes: number
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  commentSrl: string
  docSrl: string
  authorId: string
  content: string
  parentId?: string
  isSecret: boolean
  votes: number
  createdAt: string
}

export interface Group {
  groupId: string
  name: string
  level: number
  permissions: Record<string, boolean>
}
`);

// ── src/config/constants.ts ───────────────────────────────────
write('src/config/constants.ts', `\
export const APP_NAME    = 'Rhymix React'
export const APP_VERSION = '0.1.0'

export const ROUTES = {
  HOME:           '/',
  LOGIN:          '/login',
  REGISTER:       '/register',
  PROFILE:        '/member/:uid',
  BOARD:          '/:mid',
  DOCUMENT:       '/:mid/:docSrl',
  ADMIN:          '/admin',
  ADMIN_BOARDS:   '/admin/boards',
  ADMIN_MEMBERS:  '/admin/members',
  ADMIN_MENUS:    '/admin/menus',
  ADMIN_SETTINGS: '/admin/settings',
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE:     100,
} as const

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 50,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOC_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const
`);

// ── src/utils/cn.ts ───────────────────────────────────────────
write('src/utils/cn.ts', `\
import { clsx, type ClassValue } from 'clsx'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
`);

// ── src/utils/format.ts ───────────────────────────────────────
write('src/utils/format.ts', `\
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

/** "2025-04-22" */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd')
}

/** "3분 전" */
export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko })
}

/** 1234567 → "1,234,567" */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('ko-KR').format(n)
}
`);

// ── src/main.tsx ──────────────────────────────────────────────
write('src/main.tsx', `\
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
`);

// ── src/App.tsx ───────────────────────────────────────────────
write('src/App.tsx', `\
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '@config/constants'

const Placeholder = ({ name }: { name: string }) => (
  <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>Rhymix React CMS</h1>
    <p>Page: <strong>{name}</strong></p>
    <p style={{ color: '#888' }}>Will be implemented in a later WBS activity.</p>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME}           element={<Placeholder name="Home" />} />
      <Route path={ROUTES.LOGIN}          element={<Placeholder name="Login" />} />
      <Route path={ROUTES.REGISTER}       element={<Placeholder name="Register" />} />
      <Route path={ROUTES.ADMIN}          element={<Placeholder name="Admin Dashboard" />} />
      <Route path={ROUTES.BOARD}          element={<Placeholder name="Board" />} />
      <Route path={ROUTES.DOCUMENT}       element={<Placeholder name="Document" />} />
      <Route path="*"                     element={<Placeholder name="404 - Not Found" />} />
    </Routes>
  )
}
`);

// ── .gitignore ────────────────────────────────────────────────
write('.gitignore', `\
node_modules/
dist/
dist-ssr/
*.local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vscode/settings.json
.idea/
coverage/
.firebase/
firebase-debug.log
firestore-debug.log
`);

// ── Update package.json scripts ───────────────────────────────
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'dev':        'vite',
  'build':      'tsc && vite build',
  'preview':    'vite preview',
  'test':       'vitest run',
  'test:watch': 'vitest',
  'test:ui':    'vitest --ui',
  'test:cov':   'vitest run --coverage',
  'type-check': 'tsc --noEmit',
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('  updated: package.json scripts');

// ── Create remaining folder structure ─────────────────────────
const dirs = [
  'src/components/ui',
  'src/components/layout',
  'src/components/board',
  'src/components/document',
  'src/components/comment',
  'src/components/member',
  'src/components/admin',
  'src/pages/auth',
  'src/pages/board',
  'src/pages/admin',
  'src/hooks',
  'src/store',
  'src/services',
  'src/assets',
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.gitkeep'), '');
});
console.log('  created: src/ folder structure');

console.log('');
console.log('All files generated successfully.');
