'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダー */}
      <header className="border-b shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">初現地観戦記</h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="text-sm text-gray-700 hover:underline">ログイン</Link>
          <Link href="/form" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            投稿する
          </Link>
        </div>
      </header>

      {/* カテゴリーリンク */}
      <nav className="border-b text-sm text-center py-2 space-x-4">
        <Link href="/gallery/italy" className="hover:underline">イタリア</Link>
        <Link href="/gallery/england" className="hover:underline">イングランド</Link>
        <Link href="/gallery/spain" className="hover:underline">スペイン</Link>
        <Link href="/gallery/germany" className="hover:underline">ドイツ</Link>
        <Link href="/gallery/france" className="hover:underline">フランス</Link>
        <Link href="/gallery/other" className="hover:underline">その他</Link>
      </nav>

      {/* 検索バー */}
      <div className="border-b py-4 px-6 bg-gray-50 flex gap-2">
        <input
          type="text"
          placeholder="チーム・都市名で検索"
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-gray-800 text-white px-4 py-2 rounded">検索</button>
      </div>

      {/* 新着投稿 */}
      <div className="relative mt-6 px-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">新着投稿</h2>

        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id} className="block">
              <div className="relative aspect-square rounded overflow-hidden shadow-sm bg-gray-100">
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
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white px-2 py-1">
                  <p className="text-xs truncate opacity-80">#{post.category}</p>
                  <p className="text-sm font-semibold truncate">
                    {post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </main>
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
          <a href="https://x.com/footballtop_jp" target="_blank" rel="noopener noreferrer" className="hover:underline">X</a>
          <a href="https://note.com/football_top" target="_blank" rel="noopener noreferrer" className="hover:underline">Note</a>
        </div>
        <p className="text-xs text-gray-400">© 2025 FOOTBALLTOP. All rights reserved.</p>
      </footer>
    </div>
  );
}
