// app/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Travel = {
  id: string;
  nickname: string;
  month: string;
  match: string;
  team: string;
  player: string;
  cost: { total: string };
};

export default function PostsPage() {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'kansenki-posts'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Travel[];
      setTravels(data);
    };

    fetchData();
  }, []);

  const filteredTravels = travels.filter((t) =>
    [t.team, t.match].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">観戦記一覧</h1>

      {/* 🔍 検索バー */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="#チーム名 または 対戦カードで検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTravels.map((travel) => (
          <div key={travel.id} className="border rounded-xl shadow p-4 bg-white">
            <p className="text-sm text-gray-500">
              {travel.month.replace('-', '年')}月｜{travel.team}
            </p>
            <h2 className="text-lg font-bold">{travel.match}</h2>
            <p>好きな選手：{travel.player}</p>
            <p>ニックネーム：{travel.nickname}</p>
            <p>総費用：{travel.cost.total} 千円</p>
          </div>
        ))}
      </div>
    </div>
  );
}
