// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC9TDHC4S30fLHG04wJ36cWRgKqfP9F-WY",
  authDomain: "kansenki-app.firebaseapp.com",
  projectId: "kansenki-app",
  storageBucket: "kansenki-app.appspot.com",
  messagingSenderId: "334844980781",
  appId: "1:334844980781:web:a8344a50bd1694d8b5aea4"
};

// Firebaseアプリを初期化（すでに初期化済みか確認）
const app = initializeApp(firebaseConfig);

// Firestoreを取得
const db = getFirestore(app);

// Storageを取得
const storage = getStorage(app);

export { db, storage };
