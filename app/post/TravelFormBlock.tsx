'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function TravelFormBlock() {
  const [form, setForm] = useState({
    nickname: '',
    team: '',
    player: '',
    month: '',
    role: '社会人',
    match: '',
    competition: '',
    duration: '',
    airline: '',
    cities: '',
    hotel: { url: '', rating: '', comment: '' },
    spot: { url: '', rating: '', comment: '' },
    items: '',
    impression: '',
    message: '',
    cost: {
      total: '',
      flight: '',
      hotel: '',
      ticket: '',
      transport: '',
      food: '',
      other: ''
    }
  });

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('cost.')) {
      const key = field.split('.')[1];
      setForm((prev) => ({
        ...prev,
        cost: { ...prev.cost, [key]: value }
      }));
    } else if (field.startsWith('hotel.') || field.startsWith('spot.')) {
      const [section, key] = field.split('.');
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'travels'), form);
      alert('投稿が完了しました！');
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('エラーが発生しました: ', err);
      alert('投稿に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="ニックネーム"
        value={form.nickname}
        onChange={(e) => handleChange('nickname', e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="好きなチーム"
        value={form.team}
        onChange={(e) => handleChange('team', e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="好きな選手"
        value={form.player}
        onChange={(e) => handleChange('player', e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        投稿する
      </button>
    </form>
  );
}
