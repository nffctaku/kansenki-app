'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log('👀 getRedirectResult:', result?.user);

        // ✅ パターン1：リダイレクト後にユーザーが取得できたらOK
        if (result?.user) {
          console.log('✅ getRedirectResult でログイン成功');
          router.push('/form');
          return;
        }

        // ✅ パターン2：auth.currentUser に直接値がある場合（稀にある）
        if (auth.currentUser) {
          console.log('✅ currentUser ですでにログイン中');
          router.push('/form');
          return;
        }

        // ❌ どちらでもない → ログインしてない
        console.log('🌀 未ログイン状態（ボタン表示へ）');
        setLoading(false);
      } catch (err) {
        console.error('❌ getRedirectResult エラー:', err);
        setLoading(false);
      }
    };

    checkLogin();
  }, [router]);

  const handleLogin = async () => {
    const isMobile =
      typeof window !== 'undefined' && /iPhone|Android/.test(navigator.userAgent);

    try {
      if (isMobile) {
        console.log('📱 モバイル: redirect');
        await signInWithRedirect(auth, provider);
      } else {
        console.log('💻 PC: popup');
        const result = await signInWithPopup(auth, provider);
        console.log('✅ ポップアップログイン成功:', result.user);
        router.push('/form');
      }
    } catch (err) {
      console.error('❌ ログインエラー:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <p>ログイン確認中...</p>
      </div>
    );
  }

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
