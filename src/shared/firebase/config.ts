import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth as firebaseGetAuth, type Auth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// Create a project at https://console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:000000000000:web:0000000000000000000000'
};

// Lazy, memoized. initializeApp() must NOT run at module load: that would
// construct a Firebase app from placeholder credentials even in offline
// mode. These getters are only ever reached behind an isFirebaseConfigured()
// guard (the dynamically-imported firestore module + the firebase auth
// gateway), so the SDK is touched only when Firebase is genuinely used.
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getApp(): FirebaseApp {
  if (!_app) _app = initializeApp(firebaseConfig);
  return _app;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = firebaseGetAuth(getApp());
  return _auth;
}
