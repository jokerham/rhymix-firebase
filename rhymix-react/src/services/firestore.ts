import {
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@config/firebase'
import type {
  MemberDoc,
  GroupDoc,
  BoardDoc,
  DocumentDoc,
  CommentDoc,
  NotificationDoc,
  MenuDoc,
  SiteSettingsDoc,
} from '@types/firestore'

// ── Typed collection references ───────────────────────────────
function col<T>(path: string) {
  return collection(db, path) as CollectionReference<T>
}

export const Collections = {
  members:       col<MemberDoc>('members'),
  groups:        col<GroupDoc>('groups'),
  boards:        col<BoardDoc>('boards'),
  documents:     col<DocumentDoc>('documents'),
  comments:      col<CommentDoc>('comments'),
  notifications: col<NotificationDoc>('notifications'),
  menus:         col<MenuDoc>('menus'),
  settings:      col<SiteSettingsDoc>('settings'),
} as const

// ── Typed document references ─────────────────────────────────
export const Refs = {
  member:   (uid: string)       => doc(Collections.members,       uid) as DocumentReference<MemberDoc>,
  group:    (groupId: string)   => doc(Collections.groups,        groupId) as DocumentReference<GroupDoc>,
  board:    (mid: string)       => doc(Collections.boards,        mid) as DocumentReference<BoardDoc>,
  document: (docSrl: string)    => doc(Collections.documents,     docSrl) as DocumentReference<DocumentDoc>,
  comment:  (commentSrl: string)=> doc(Collections.comments,      commentSrl) as DocumentReference<CommentDoc>,
  settings: ()                  => doc(db, 'settings', 'site') as DocumentReference<SiteSettingsDoc>,
  categories: (mid: string)     => collection(db, 'boards', mid, 'categories'),
  votes:    (docSrl: string)    => collection(db, 'documents', docSrl, 'votes'),
  scraps:   (uid: string)       => collection(db, 'members', uid, 'scraps'),
} as const

// ── Pagination helper ─────────────────────────────────────────
export interface Page<T> {
  items:   T[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

export async function getDocumentPage(
  boardMid: string,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot<DocumentData>,
): Promise<Page<DocumentDoc>> {
  let q = query(
    Collections.documents,
    where('boardMid', '==', boardMid),
    where('status',   '==', 'public'),
    orderBy('isNotice', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(pageSize + 1),
  )
  if (cursor) q = query(q, startAfter(cursor))

  const snap  = await getDocs(q)
  const items = snap.docs.slice(0, pageSize).map((d) => d.data())
  return {
    items,
    lastDoc: snap.docs[pageSize - 1] ?? null,
    hasMore: snap.docs.length > pageSize,
  }
}

export async function getBoard(mid: string): Promise<BoardDoc | null> {
  const snap = await getDoc(Refs.board(mid))
  return snap.exists() ? snap.data() : null
}

export async function getDocument(docSrl: string): Promise<DocumentDoc | null> {
  const snap = await getDoc(Refs.document(docSrl))
  return snap.exists() ? snap.data() : null
}

export async function getMember(uid: string): Promise<MemberDoc | null> {
  const snap = await getDoc(Refs.member(uid))
  return snap.exists() ? snap.data() : null
}
