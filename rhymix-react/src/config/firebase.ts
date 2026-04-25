import { initializeApp }              from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator }    from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, isSupported }             from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialise Firebase app
export const app = initializeApp(firebaseConfig)

// Service exports
export const auth      = getAuth(app)
export const db        = getFirestore(app)
export const storage   = getStorage(app)
export const functions = getFunctions(app, 'asia-northeast3') // Seoul region

// Analytics (only in browser, not SSR/emulator)
export const analytics = isSupported().then((yes) => yes ? getAnalytics(app) : null)

// ── Connect to local emulators in development ─────────────
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth,           'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db,         'localhost', 8080)
  connectStorageEmulator(storage,      'localhost', 9199)
  connectFunctionsEmulator(functions,  'localhost', 5001)
  console.warn('[DEV] Connected to Firebase Emulator Suite')
}
