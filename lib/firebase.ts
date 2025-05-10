import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // 👈 追加

const firebaseConfig = {
  apiKey: "AIzaSyC9TDHC4S30fLHG04wJ36cWRgKqfP9F-WY",
  authDomain: "kansenki-app.firebaseapp.com",
  projectId: "kansenki-app",
  storageBucket: "kansenki-app.appspot.com",
  messagingSenderId: "334844980781",
  appId: "1:334844980781:web:a8344a50bd1694d8b5aea4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

// 👇 追加部分（Googleログインに必要）
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider };
