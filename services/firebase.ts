
import * as firebaseApp from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 在 Netlify UI 中设置这些环境变量
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 初始化Firebase
// FIX: Changed from named import to namespace import to address module resolution error.
const app = firebaseApp.initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };