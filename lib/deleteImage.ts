// lib/deleteImage.ts
import { db } from './firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export const deleteImage = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'kansenkiImages', id));
    console.log('削除成功:', id);
  } catch (error) {
    console.error('Firestore 削除エラー:', error);
  }
};
