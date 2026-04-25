import { initializeApp }                       from 'firebase/app'
import { getAuth, connectAuthEmulator }         from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator }   from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, isSupported }            from 'firebase/analytics'
import { firebaseConfig, featureFlags }         from '@config/env'

export const app       = initializeApp(firebaseConfig)
export const auth      = getAuth(app)
export const db        = getFirestore(app)
export const storage   = getStorage(app)
export const functions = getFunctions(app, 'asia-northeast3')

// Analytics only in browser when enabled
export const analytics = featureFlags.enableAnalytics
  ? isSupported().then((yes) => yes ? getAnalytics(app) : null)
  : Promise.resolve(null)

// Connect to emulators when VITE_USE_EMULATOR=true
if (featureFlags.useEmulator) {
  connectAuthEmulator(auth,          'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db,        'localhost', 8080)
  connectStorageEmulator(storage,     'localhost', 9199)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.warn('[DEV] Connected to Firebase Emulator Suite')
}
