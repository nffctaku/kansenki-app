import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQTD4CHS3QfLHG04wJ36CWRgKfqP9F-WY",
  authDomain: "localhost:3010", // ← 👈 HTTPSではなくHTTPで通るように固定！
  projectId: "kansenki-app",
  storageBucket: "kansenki-app.appspot.com",
  messagingSenderId: "33484980781",
  appId: "1:33484980781:web:a8344a50bd1694d8b5aea4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider };

