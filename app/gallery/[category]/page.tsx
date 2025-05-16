'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore'; // ←重複してたimportも統合
import { db } from '@/lib/firebase';
import Link from 'next/link';

const categoryMap: { [key: string]: string } = {
  italy: 'イタリア',
  england: 'イングランド',
  spain: 'スペイン',
  germany: 'ドイツ',
  france: 'フランス',
  other: 'その他',
};

type Travel = {
    id: string;
    matches?: { teamA: string; teamB: string; competition: string }[];
    images?: string[];
    imageUrl?: string;
    category?: string;
    season?: string;
    stayDuration?: string;
    cost?: { total?: number };
    createdAt?: { seconds: number };
    firstAdvice?: string;
};

export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState<Travel[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return;
  
      const q = query(
        collection(db, 'kansenki-posts'),
        where('category', '==', category.toString())
      );
  
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Travel[];
  
      setPosts(data);
    };
  
    fetchPosts();
  }, [category]);
  

  // フィルター処理
  const filteredPosts = posts.filter((post) => {
    const match = post.matches?.[0];

    const seasonOK = seasonFilter === '' || post.season === seasonFilter;
    const teamOK =
      teamFilter === '' ||
      (match &&
        (match.teamA?.includes(teamFilter) || match.teamB?.includes(teamFilter)));

    return seasonOK && teamOK;
  });

  // 並び替え処理
const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOption) {
      case 'lowCost':
        return (a.cost?.total ?? 0) - (b.cost?.total ?? 0);
      case 'highCost':
        return (b.cost?.total ?? 0) - (a.cost?.total ?? 0);
      case 'newest':
      default:
        return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
    }
  });
  
  console.log('取得された投稿:', sortedPosts); // ← ここで投稿データを確認！
  

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {categoryMap[category?.toString() || ''] || 'カテゴリ未設定'} の観戦記一覧
      </h1>
  
      {/* フィルター + 並び替え */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm items-center">
        <div>
          <label className="mr-2 font-medium text-blue-600">並び替え：</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="newest">新着順</option>
            <option value="highCost">費用が高い順</option>
            <option value="lowCost">費用が安い順</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium text-blue-600">シーズン：</label>
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">すべて</option>
            {Array.from({ length: 2025 - 1970 + 1 }, (_, i) => {
              const y = 2025 - i;
              return (
                <option key={y} value={`${y}/${(y + 1).toString().slice(-2)}`}>
                  {y}/{(y + 1).toString().slice(-2)}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium text-blue-600">チーム名：</label>
          <input
            type="text"
            placeholder="例：インテル"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
      </div>
  
      {/* 投稿一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {sortedPosts.map((post) => {
    const match = post.matches?.[0];
    const imageUrl = post.imageUrl || post.images?.[0];

    return (
      <Link href={`/posts/${post.id}`} key={post.id} className="block">
        <div className="bg-white shadow hover:shadow-md rounded overflow-hidden transition">
          <div className="w-full aspect-square bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="投稿画像"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
                  )}
                </div>
  
                <div className="text-sm text-gray-800 space-y-1">
                  <p><span className="font-semibold">カテゴリー：</span>{post.category}</p>
                  <p><span className="font-semibold">シーズン：</span>{match?.season ?? post.season ?? '未登録'}</p>
                  <p><span className="font-semibold">大会名：</span>{match?.competition ?? '未登録'}</p>
                  <p><span className="font-semibold"></span>{match?.teamA ?? '未登録'}</p>
                  <p><span className="font-semibold"></span>{match?.teamB ?? '未登録'}</p>
                  <p><span className="font-semibold">期間：</span>{post.stayDuration || post.duration || '未記入'}</p>
                  <p><span className="font-semibold">費用：</span>約{post.cost?.total ?? 0}万円</p>
                  {post.firstAdvice && (
                    <div>
                      <p className="font-semibold">これから初めて現地観戦する人へ一言：</p>
                      <p>{post.firstAdvice}</p>
                    </div>
                  )}
                 </div>
              </div>
            </Link>
          );
        })} {/* ← これを忘れてた！ */}
      </div>
    </div>
  );
}