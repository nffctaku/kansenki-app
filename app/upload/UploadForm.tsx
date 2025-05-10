'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const uploadImageToCloudinary = async (
  file: File,
  publicId?: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'zrd47ahk'); // ← Cloudinary の unsigned preset

  if (publicId) {
    formData.append('public_id', publicId);
  }

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dkjcpkfi1/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary upload error:', data);
      return null;
    }

    return data.secure_url || null;
  } catch (err) {
    console.error('Cloudinary upload exception:', err);
    return null;
  }
};

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    const uniqueId = `uploadform_${Date.now()}`;
    const imageUrl = await uploadImageToCloudinary(file, uniqueId);

    if (!imageUrl) {
      alert('アップロードに失敗しました');
      return;
    }

    try {
      await addDoc(collection(db, 'kansenkiImages'), {
        url: imageUrl,
        createdAt: serverTimestamp()
      });

      alert('アップロード完了！');
      location.reload(); // ← ギャラリーを即座に反映
    } catch (err) {
      console.error('Firestore保存エラー:', err);
      alert('Firestoreへの保存に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            setFile(selectedFile);
          }
        }}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        アップロード
      </button>
    </form>
  );
}
