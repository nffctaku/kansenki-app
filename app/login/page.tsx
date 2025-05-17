'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);

      if (result?.user) {
        console.log('✅ ログイン成功:', result.user);
        window.location.href = '/mypage'; // ← router.push でなく直接遷移してみる
      } else {
        console.warn('⚠ ログイン成功したが user が取れない');
      }
    } catch (err) {
      console.error('❌ signInWithPopup 失敗:', err);
      alert('ログイン中にエラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">Googleでログイン</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Googleでログイン
      </button>
    </div>
  );
}
