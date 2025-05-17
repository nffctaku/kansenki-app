'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import {
  auth,
  db,
  provider, // ✅ firebase.ts で export している GoogleAuthProvider を使う
} from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';


type Travel = {
  id: string;
  nickname: string;
  imageUrls?: string[];
  category?: string;
  matches?: {
    teamA: string;
    teamB: string;
    competition: string;
    season: string;
    nickname: string;
  }[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Travel[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, 'kansenki-posts'));
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        nickname: d.nickname || '',
        imageUrls: d.imageUrls || [],
        category: d.category || '',
        matches: d.matches || [],
      };
    });
    setPosts(data.reverse());
  };

  fetchPosts();

  // スマホでログイン後のリダイレクト処理
  getRedirectResult(auth).then((result) => {
    if (result?.user) {
      setIsLoggedIn(true);
      console.log('スマホログイン完了:', result.user);
    }
  });
}, []);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setIsLoggedIn(!!user);
  });
  return () => unsubscribe();
}, []);

const handlePostClick = () => {
  if (isLoggedIn) {
    router.push('/form'); // ✅ ログイン済み → 投稿フォームへ
  } else {
    router.push('/login'); // ✅ 未ログイン → ログインページへ
  }
};


const groupedByCategory = posts.reduce((acc, post) => {
  const category = post.category || 'other';
  if (!acc[category]) acc[category] = [];
  acc[category].push(post);
  return acc;
}, {} as Record<string, Travel[]>);


  return (
  <div className="bg-white min-h-screen">
    {/* ヘッダー */}
    <header className="border-b shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">初現地観戦記</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePostClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center"
        >
          投稿する
        </button>
      </div>
    </header>

    {/* 検索バー */}
    <div className="border-b py-4 px-6 bg-gray-50 flex gap-2">
      <input
        type="text"
        placeholder="チーム・都市名で検索"
        className="flex-1 border p-2 rounded"
      />
      <button className="bg-gray-800 text-white px-4 py-2 rounded">検索</button>
    </div>

    {/* カテゴリ別投稿一覧 */}
    <div className="w-screen px-4 mt-6">
      {Object.entries(groupedByCategory).map(([category, posts]) => {
        const categoryLabelMap: Record<string, string> = {
          england: 'イングランド',
          italy: 'イタリア',
          spain: 'スペイン',
          germany: 'ドイツ',
          france: 'フランス',
          other: 'その他',
        };
        const japaneseCategory = categoryLabelMap[category] || category;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-base font-bold mt-6 mb-2 px-1 text-gray-800">{japaneseCategory}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {posts.slice(0, 6).map((post) => (
                <div key={post.id} className="bg-gray-100 rounded p-2">
                  <div className="aspect-square bg-white overflow-hidden">
                    {post.imageUrls?.[0] ? (
                      <img
                        src={post.imageUrls[0]}
                        alt="投稿画像"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-700 font-semibold">
                    {post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>

    {/* Tailwind確認用 */}
    <div className="text-red-500 md:text-green-500 text-center mt-10">
      Tailwind テスト：スマホなら赤、PCなら緑
    </div>

    {/* フッター */}
    <footer className="mt-12 py-8 text-center space-y-4 text-sm text-gray-600">
      <Image
        src="/footballtop-logo-12.png"
        alt="FOOTBALLTOP ロゴ"
        width={180}
        height={60}
        className="mx-auto"
      />
      <div className="flex justify-center space-x-6">
        <a href="https://x.com/footballtop_jp" target="_blank" rel="noopener noreferrer" className="hover:underline">
          X
        </a>
        <a href="https://note.com/football_top" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Note
        </a>
      </div>
      <p className="text-xs text-gray-400">© 2025 FOOTBALLTOP. All rights reserved.</p>
    </footer>
  </div>
);
}