'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

type HotelSpot = {
  url: string;
  rating: string;
  comment: string;
};

type Cost = {
  total: string;
  flight: string;
  hotel: string;
  ticket: string;
  transport: string;
  food: string;
  other: string;
};

type FormType = {
  nickname: string;
  team: string;
  player: string;
  month: string;
  role: string;
  match: string;
  competition: string;
  duration: string;
  airline: string;
  cities: string;
  hotel: HotelSpot;
  spot: HotelSpot;
  items: string;
  impression: string;
  message: string;
  cost: Cost;
};

type SectionKey = keyof Pick<FormType, 'hotel' | 'spot' | 'cost'>;

export default function TravelFormBlock() {
  const [form, setForm] = useState<FormType>({
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

  const handleChange = (
    field: keyof FormType,
    value: string,
    section?: SectionKey,
    key?: string
  ) => {
    if (section && key) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
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
