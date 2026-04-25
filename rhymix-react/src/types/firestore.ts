import type { Timestamp } from 'firebase/firestore'

// ── Member ───────────────────────────────────────────────────
export interface MemberDoc {
  uid:        string
  email:      string
  nickname:   string
  avatarUrl?: string
  bio?:       string
  groupIds:   string[]
  points:     number
  status:     'active' | 'pending' | 'banned'
  isAdmin:    boolean
  extraFields: Record<string, string>
  createdAt:  Timestamp
  updatedAt:  Timestamp
  lastLoginAt?: Timestamp
}

// ── Group ────────────────────────────────────────────────────
export interface GroupDoc {
  groupId:     string
  name:        string
  level:       number
  permissions: {
    canLogin:        boolean
    canWrite:        boolean
    canComment:      boolean
    canUpload:       boolean
    canDownload:     boolean
    canDeleteOwn:    boolean
    isManager:       boolean
  }
  createdAt: Timestamp
}

// ── Board ────────────────────────────────────────────────────
export interface BoardDoc {
  mid:           string           // URL slug e.g. 'free-board'
  name:          string
  description?:  string
  layout:        'list' | 'gallery' | 'album' | 'webzine' | 'card'
  readGroupId:   string           // 'guest' | 'member' | groupId
  writeGroupId:  string           // 'member' | groupId
  commentGroupId: string
  uploadGroupId:  string
  listCount:     number           // posts per page
  allowVote:     boolean
  allowSecret:   boolean
  allowAttach:   boolean
  sortOrder:     'latest' | 'popular' | 'comment'
  isActive:      boolean
  order:         number           // menu display order
  createdAt:     Timestamp
}

// ── Category (subcollection: boards/{mid}/categories) ────────
export interface CategoryDoc {
  catId:    string
  name:     string
  order:    number
  parentId?: string
}

// ── Document (Post) ──────────────────────────────────────────
export interface DocumentDoc {
  docSrl:      string
  boardMid:    string
  title:       string
  content:     string             // HTML from rich-text editor
  contentText: string             // Plain text for search indexing
  authorId:    string
  authorNick:  string             // Denormalised for list display
  categoryId?: string
  tags:        string[]
  status:      'public' | 'secret' | 'trash'
  isNotice:    boolean
  isPinned:    boolean
  views:       number
  votes:       number
  commentCount: number
  attachments: AttachmentMeta[]
  thumbnailUrl?: string
  createdAt:   Timestamp
  updatedAt:   Timestamp
}

export interface AttachmentMeta {
  name:      string
  storagePath: string
  size:      number
  mimeType:  string
  downloads: number
}

// ── Comment ──────────────────────────────────────────────────
export interface CommentDoc {
  commentSrl:  string
  docSrl:      string
  boardMid:    string
  authorId:    string
  authorNick:  string
  content:     string
  parentId?:   string             // for threaded replies
  isSecret:    boolean
  isDeleted:   boolean
  votes:       number
  createdAt:   Timestamp
  updatedAt:   Timestamp
}

// ── Notification ─────────────────────────────────────────────
export interface NotificationDoc {
  notifId:    string
  uid:        string              // recipient
  type:       'reply' | 'mention' | 'vote' | 'admin' | 'system'
  title:      string
  body:       string
  refId?:     string              // docSrl or commentSrl
  refUrl?:    string
  read:       boolean
  createdAt:  Timestamp
}

// ── Menu ─────────────────────────────────────────────────────
export interface MenuDoc {
  menuId:    string
  items:     MenuItem[]
  updatedAt: Timestamp
}

export interface MenuItem {
  itemId:      string
  label:       string
  type:        'board' | 'url' | 'folder'
  target:      '_self' | '_blank'
  boardMid?:   string
  url?:        string
  icon?:       string
  groupId?:    string             // hide from groups below this
  order:       number
  children:    MenuItem[]
}

// ── Site Settings ────────────────────────────────────────────
export interface SiteSettingsDoc {
  siteName:       string
  siteUrl:        string
  logoUrl?:       string
  faviconUrl?:    string
  description?:   string
  timezone:       string
  language:       string
  maintenanceMode: boolean
  updatedAt:      Timestamp
}
