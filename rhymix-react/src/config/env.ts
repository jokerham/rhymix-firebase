import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────
const envSchema = z.object({
  // Firebase
  VITE_FIREBASE_API_KEY:             z.string().min(1, 'Firebase API key is required'),
  VITE_FIREBASE_AUTH_DOMAIN:         z.string().min(1, 'Firebase auth domain is required'),
  VITE_FIREBASE_PROJECT_ID:          z.string().min(1, 'Firebase project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET:      z.string().min(1, 'Firebase storage bucket is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  VITE_FIREBASE_APP_ID:              z.string().min(1, 'Firebase app ID is required'),
  VITE_FIREBASE_MEASUREMENT_ID:      z.string().optional(),

  // Feature flags
  VITE_USE_EMULATOR:      z.string().transform((v) => v === 'true').default('false'),
  VITE_ENABLE_ANALYTICS:  z.string().transform((v) => v === 'true').default('false'),

  // App settings
  VITE_APP_NAME: z.string().default('Rhymix React'),
  VITE_APP_URL:  z.string().url().default('http://localhost:3000'),
})

// ── Parse & validate on module load ──────────────────────
const _parsed = envSchema.safeParse(import.meta.env)

if (!_parsed.success) {
  const issues = _parsed.error.issues
    .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
    .join('\n')
  throw new Error(
    `[env] Missing or invalid environment variables:\n${issues}\n` +
    `Copy .env.local.example to .env.local and fill in the values.`
  )
}

// ── Type-safe export ──────────────────────────────────────
export const env = _parsed.data

// Convenience groupings
export const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
  measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const featureFlags = {
  useEmulator:     env.VITE_USE_EMULATOR,
  enableAnalytics: env.VITE_ENABLE_ANALYTICS,
}
