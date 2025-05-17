'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();

  const isMobile = typeof window !== 'undefined' && /iPhone|Android/.test(navigator.userAgent);

  // 🔁 スマホでリダイレクト後の結果を処理
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('スマホログイン成功:', result.user);
        router.push('/form'); // ✅ 成功後に投稿フォームなどへリダイレクト
      }
    });
  }, [router]);

  const handleLogin = async () => {
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider); // ✅ スマホ用
      } else {
        const result = await signInWithPopup(auth, provider); // ✅ PC用
        console.log('PCログイン成功:', result.user);
        router.push('/form');
      }
    } catch (error) {
      console.error('ログイン失敗:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Googleログイン</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Googleでログイン
      </button>
    </div>
  );
}
