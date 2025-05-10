'use client';

import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function LoginButton() {
  const [user, setUser] = useState<null | { name: string; email: string }>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('ログインに失敗しました');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('ログアウトに失敗しました');
      console.error(error);
    }
  };

  return (
    <div className="mb-4">
      {user ? (
        <div className="flex items-center gap-4">
          <p>こんにちは、{user.name}さん</p>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            ログアウト
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Googleでログイン
        </button>
      )}
    </div>
  );
}
