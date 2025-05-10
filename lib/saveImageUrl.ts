// lib/saveImageUrl.ts
import { db, auth } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveImageUrl = async (url: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('未ログイン状態での保存はできません');
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, 'kansenkiImages'), {
      url,
      uid: user.uid, // 👈 投稿者のUIDを保存
      createdAt: Timestamp.now(),
    });
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e);
    return null;
  }
};
