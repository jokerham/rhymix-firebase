#!/usr/bin/env node
// Seed script – populates Firestore with sample data for development.
// Run: GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node firestore-seed/seed.cjs
// Or against emulator: FIRESTORE_EMULATOR_HOST=localhost:8080 node firestore-seed/seed.cjs

'use strict';

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp }       = require('firebase-admin/firestore');

if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId: 'rhymix-react-dev' });
  } else {
    initializeApp({ credential: cert(require('../service-account.json')) });
  }
}

const db  = getFirestore();
const now = Timestamp.now();

async function seed() {
  console.log('Seeding Firestore...');

  // ── Site settings ────────────────────────────────────────
  await db.doc('settings/site').set({
    siteName:        'Rhymix React',
    siteUrl:         'http://localhost:3000',
    description:     'A modern CMS built with React and Firebase',
    timezone:        'Asia/Seoul',
    language:        'ko',
    maintenanceMode: false,
    updatedAt:       now,
  });
  console.log('  created: settings/site');

  // ── Default groups ───────────────────────────────────────
  const groups = [
    { groupId: 'admin',   name: '관리자', level: 10, permissions: { canLogin: true,  canWrite: true,  canComment: true,  canUpload: true,  canDownload: true,  canDeleteOwn: true,  isManager: true  } },
    { groupId: 'manager', name: '매니저', level: 5,  permissions: { canLogin: true,  canWrite: true,  canComment: true,  canUpload: true,  canDownload: true,  canDeleteOwn: true,  isManager: true  } },
    { groupId: 'member',  name: '회원',   level: 2,  permissions: { canLogin: true,  canWrite: true,  canComment: true,  canUpload: true,  canDownload: true,  canDeleteOwn: true,  isManager: false } },
    { groupId: 'guest',   name: '손님',   level: 1,  permissions: { canLogin: false, canWrite: false, canComment: false, canUpload: false, canDownload: false, canDeleteOwn: false, isManager: false } },
  ];
  for (const g of groups) {
    await db.doc('groups/' + g.groupId).set({ ...g, createdAt: now });
    console.log('  created: groups/' + g.groupId);
  }

  // ── Sample boards ────────────────────────────────────────
  const boards = [
    { mid: 'notice',    name: '공지사항', layout: 'list',    readGroupId: 'guest',  writeGroupId: 'admin',  commentGroupId: 'member', uploadGroupId: 'admin',  listCount: 20, allowVote: false, allowSecret: false, allowAttach: true,  sortOrder: 'latest', isActive: true, order: 1 },
    { mid: 'free',      name: '자유게시판', layout: 'list',  readGroupId: 'guest',  writeGroupId: 'member', commentGroupId: 'member', uploadGroupId: 'member', listCount: 20, allowVote: true,  allowSecret: true,  allowAttach: true,  sortOrder: 'latest', isActive: true, order: 2 },
    { mid: 'gallery',   name: '갤러리',   layout: 'gallery', readGroupId: 'guest',  writeGroupId: 'member', commentGroupId: 'member', uploadGroupId: 'member', listCount: 24, allowVote: true,  allowSecret: false, allowAttach: true,  sortOrder: 'latest', isActive: true, order: 3 },
    { mid: 'qna',       name: 'Q&A',      layout: 'list',    readGroupId: 'member', writeGroupId: 'member', commentGroupId: 'member', uploadGroupId: 'member', listCount: 20, allowVote: true,  allowSecret: true,  allowAttach: true,  sortOrder: 'latest', isActive: true, order: 4 },
  ];
  for (const b of boards) {
    await db.doc('boards/' + b.mid).set({ ...b, createdAt: now });
    console.log('  created: boards/' + b.mid);
  }

  // ── Default menu ─────────────────────────────────────────
  await db.doc('menus/main').set({
    menuId: 'main',
    items: [
      { itemId: '1', label: '공지사항', type: 'board', boardMid: 'notice',  target: '_self', order: 1, children: [] },
      { itemId: '2', label: '자유게시판', type: 'board', boardMid: 'free',  target: '_self', order: 2, children: [] },
      { itemId: '3', label: '갤러리',   type: 'board', boardMid: 'gallery', target: '_self', order: 3, children: [] },
      { itemId: '4', label: 'Q&A',      type: 'board', boardMid: 'qna',     target: '_self', order: 4, children: [] },
    ],
    updatedAt: now,
  });
  console.log('  created: menus/main');

  console.log('');
  console.log('Seed complete.');
}

seed().catch((err) => { console.error(err); process.exit(1); });
