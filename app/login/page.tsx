'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithRedirect, getRedirectResult, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 認証後の結果取得
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('✅ ログイン成功:', result.user);
          router.push('/mypage'); // ログイン成功後のリダイレクト
        }
      })
      .catch((err) => {
        console.error('❌ リダイレクト失敗:', err);
        alert('ログインに失敗しました');
      });
  }, []);

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error('❌ signInWithRedirect 失敗:', err);
      alert('ログインエラーが発生しました');
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

