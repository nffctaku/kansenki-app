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

  const isMobile =
    typeof window !== 'undefined' && /iPhone|Android/.test(navigator.userAgent);

  useEffect(() => {
    console.log('✅ useEffect起動');

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('✅ スマホログイン成功:', result.user);
          router.push('/form');
        } else {
          console.log('ℹ️ スマホログイン未完了 or 初期ロード');
        }
      })
      .catch((err) => {
        console.error('❌ リダイレクト結果エラー:', err);
      });
  }, [router]);

  const handleLogin = async () => {
    try {
      console.log('🚀 ログインボタン押された');
      console.log('📱 isMobile:', isMobile);

      // ↓ 強制的に redirect を使ってみる（スマホ・PC問わず）
      await signInWithRedirect(auth, provider);

      // ↓ 本来の判定式（コメントアウト）
      // if (isMobile) {
      //   await signInWithRedirect(auth, provider);
      // } else {
      //   const result = await signInWithPopup(auth, provider);
      //   console.log('✅ PCログイン成功:', result.user);
      //   router.push('/form');
      // }
    } catch (error) {
      console.error('❌ ログイン失敗:', error);
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
