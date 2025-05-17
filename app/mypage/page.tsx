'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Mypage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  if (loading) return <div className="p-4">読み込み中...</div>;

  if (!user) {
    return <div className="p-4 text-red-500">ログインしていません。</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p>👤 ユーザー名: {user.displayName}</p>
      <p>📧 メール: {user.email}</p>
      <img
        src={user.photoURL}
        alt="プロフィール画像"
        className="mt-4 w-20 h-20 rounded-full"
      />
    </div>
  );
}
