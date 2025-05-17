'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p>ユーザー名：{user.displayName}</p>
      <p>メール：{user.email}</p>
      <img
        src={user.photoURL || ''}
        alt="プロフィール画像"
        className="w-24 h-24 rounded-full mt-4"
      />
    </div>
  );
}
