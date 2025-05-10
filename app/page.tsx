'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 仮のユーザー（後でGoogleログインと連携予定なら差し替え）
const user = { email: 'dummy@example.com' };

type Travel = {
  id: string;
  uid?: string;
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
        ...doc.data(),
      })) as Travel[];
      setTravels(data);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('この観戦記を削除しますか？');
    if (!confirmDelete) return;

    alert('※ 削除機能は未実装です。後で実装予定。');
    // setTravels((prev) => prev.filter((item) => item.id !== id));
  };

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
          <div key={travel.id} className="relative border rounded-xl shadow p-4 bg-white">
            {user?.email && user?.email === travel.uid && (
              <button
                onClick={() => handleDelete(travel.id)}
                className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                削除
              </button>
            )}
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
