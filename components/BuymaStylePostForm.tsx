'use client';

import { useState } from 'react';
import Select from 'react-select';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation'; 

// 🔼 Firebase Storage に画像をアップロードする関数
const uploadImageToFirebase = async (file: File): Promise<string> => {
  const safeName = file.name.replace(/[^\w.-]/g, '_');
  const filename = `images/${Date.now()}_${safeName}`;
  const fileRef = ref(storage, filename);
  console.log('[uploading]', file);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

// 🔽 観戦シーズン：1960/61〜2025/26
const seasons = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => {
  const year = 1960 + i;
  return {
    value: `${year}/${(year + 1).toString().slice(-2)}`,
    label: `${year}/${(year + 1).toString().slice(-2)}`
  };
}).reverse();

const teamList = [
  'マンチェスター・シティ', 'アーセナル', 'リバプール', 'アストン・ビラ', 'トッテナム',
  'チェルシー', 'ニューカッスル', 'マンチェスター・ユナイテッド', 'ウエスト・ハム',
  'クリスタル・パレス', 'ブライトン', 'ボーンマス', 'フルハム', 'ウォルバーハンプトン',
  'エバートン', 'ブレントフォード', 'ノッティンガム・フォレスト', 'サウサンプトン','レスター・シティ',
  'レアル・マドリー', 'バルセロナ', 'アトレティコ・マドリー', 'ソシエダ', 'ビジャレアル',
  'バイエルン', 'ドルトムント', 'ライプツィヒ', 'フランクフルト',
  'ユベントス', 'インテル', 'ミラン', 'ローマ', 'ナポリ', 'アタランタ',
  'パリSG', 'マルセイユ', 'モナコ', 'リヨン'
].map((team) => ({ value: team, label: team }));

// ✅ 型定義追加
type Cost = {
  total: number;
  flight: number;
  hotel: number;
  ticket: number;
  transport: number;
  food: number;
  goods: number;
  other: number;
  [key: string]: number; // ← これで key アクセスOK
};

export default function BuymaStylePostForm() {
  const router = useRouter();

  const [form, setForm] = useState<{
    nickname: string;
    season: string;
    matches: {
      teamA: string;
      teamB: string;
      competition: string;
      season: string;
      nickname: string;
    }[];
    duration: string;
    watchYear: string;
    watchMonth: string;
    lifestyle: string;
    stayDuration: string;
    airlines: { name: string; seat: string }[];
    goTime: string;
    goType: string;
    goVia: string;
    returnTime: string;
    returnType: string;
    returnVia: string;
    hotels: { url: string; comment: string; rating: number }[];
    spots: { url: string; comment: string; rating: number; autoName: string; address: string }[];
    items: string;
    goods: string;
    episode: string;
    firstReflection: string;
    firstAdvice: string;
    images: File[];
    allowComment: boolean;
    snsX: string;
    snsInstagram: string;
    snsNote: string;
    category: string;
    cost: Cost;
  }>({
    nickname: '',
    season: '',
    matches: [
      { teamA: '', teamB: '', competition: '', season: '', nickname: '' }
    ],
    duration: '',
    watchYear: '',
    watchMonth: '',
    lifestyle: '',
    stayDuration: '',
    airlines: [{ name: '', seat: '' }],
    goTime: '',
    goType: '',
    goVia: '',
    returnTime: '',
    returnType: '',
    returnVia: '',
    hotels: [{ url: '', comment: '', rating: 0 }],
    spots: [{ url: '', comment: '', rating: 0, autoName: '', address: '' }],
    items: '',
    goods: '',
    episode: '',
    firstReflection: '',
    firstAdvice: '',
    images: [],
    allowComment: true,
    snsX: '',
    snsInstagram: '',
    snsNote: '',
    category: '',
    cost: {
      total: 0,
      flight: 0,
      hotel: 0,
      ticket: 0,
      transport: 0,
      food: 0,
      goods: 0,
      other: 0
    }
  });

  const handleSubmit = async () => {
    console.log("✅ handleSubmit 実行開始！");

  try {
    // matches 整形
    const cleanedMatches = form.matches.map((match) => ({
      teamA: match.teamA,
      teamB: match.teamB,
      competition: match.competition,
      season: form.season,
      nickname: form.nickname,
    }));

    // images を除外
    const { images, ...formWithoutImages } = form;

    // 画像アップロード
    const uploadedUrls = await Promise.all(
      images.map(async (file) => {
        const url = await uploadImageToFirebase(file);
        return url;
      })
    );

    // 🔧 カンマ除去して cost をクリーンな形で再構築
    const cleanNumber = (value: any) =>
      Number(String(value).replace(/,/g, '') || 0);

    const cleanedCost = {
      flight: cleanNumber(form.cost.flight),
      hotel: cleanNumber(form.cost.hotel),
      ticket: cleanNumber(form.cost.ticket),
      transport: cleanNumber(form.cost.transport),
      food: cleanNumber(form.cost.food),
      goods: cleanNumber(form.cost.goods),
      other: cleanNumber(form.cost.other),
    };

    const totalCost = Object.values(cleanedCost).reduce((sum, val) => sum + val, 0);

    const dataToSend = {
      ...formWithoutImages,
      matches: cleanedMatches,
      cost: {
        ...cleanedCost,
        total: totalCost,
      },
      imageUrls: uploadedUrls,
      createdAt: new Date(),
    };

    console.log("✅ handleSubmit 実行開始");
    console.log("cleanedCostの中身:", cleanedCost);
    console.log("計算された total:", totalCost);
    console.log("送信データ:", dataToSend);
    console.log("costの中身:", dataToSend.cost);


    const docRef = await addDoc(collection(db, 'kansenki-posts'), dataToSend);
    router.push(`/posts/${docRef.id}`);
  } catch (err) {
    console.error('投稿エラー詳細:', err);
    alert('投稿に失敗しました');
  }
};


  return (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold">観戦記投稿</h2>

    <div>
      <h2 className="font-bold text-lg mt-6 text-blue-600">ニックネーム</h2>
      <input
        type="text"
        value={form.nickname}
        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        className="border p-2 w-full rounded"
      />
    </div>

    <div>
  <h2 className="font-bold text-blue-600">観戦シーズン</h2>
  <select
    value={form.season}
    onChange={(e) => setForm({ ...form, season: e.target.value })}
    className="border p-2 w-full rounded"
  >
    <option value="">選択してください</option>
    {Array.from({ length: 2025 - 1960 + 1 }, (_, i) => {
      const year = 1960 + i;
      const label = `${year}/${(year + 1).toString().slice(-2)}`;
      return (
        <option key={label} value={label}>
          {label}
        </option>
      );
    }).reverse()}
  </select>
</div>


    {/* 観戦した試合（最大5件） */}
    <h2 className="text-xl font-bold mt-8 mb-4">観戦した試合（最大5件）</h2>

    {form.matches.map((match, index) => (
      <div key={index} className="space-y-4 border border-gray-300 p-4 rounded-xl mb-6 bg-white shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">大会名</label>
          <Select
            options={[
              { label: 'プレミアリーグ', value: 'Premier League' },
              { label: 'ラ・リーガ', value: 'La Liga' },
              { label: 'セリエA', value: 'Serie A' },
              { label: 'ブンデスリーガ', value: 'Bundesliga' },
              { label: 'リーグ・アン', value: 'Ligue 1' },
              { label: 'UEFAチャンピオンズリーグ', value: 'UEFA Champions League' },
              { label: 'その他', value: 'その他' },
            ]}
            value={match.competition ? { label: match.competition, value: match.competition } : null}
            onChange={(e) => {
              const newMatches = [...form.matches];
              newMatches[index].competition = e?.value || '';
              setForm({ ...form, matches: newMatches });
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">対戦カード</label>
          <div className="flex items-center gap-2">
            <Select
              options={teamList}
              isSearchable
              placeholder="ホームチーム"
              value={teamList.find((t) => t.value === match.teamA)}
              onChange={(e) => {
                const newMatches = [...form.matches];
                newMatches[index].teamA = e?.value || '';
                setForm({ ...form, matches: newMatches });
              }}
              className="w-full"
            />
            <span className="text-gray-600 font-semibold">vs</span>
            <Select
              options={teamList}
              isSearchable
              placeholder="アウェイチーム"
              value={teamList.find((t) => t.value === match.teamB)}
              onChange={(e) => {
                const newMatches = [...form.matches];
                newMatches[index].teamB = e?.value || '';
                setForm({ ...form, matches: newMatches });
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    ))}

      {/* 試合追加ボタン */}
    {form.matches.length < 5 && (
      <button
        type="button"
        onClick={() =>
          setForm({
            ...form,
           matches: [
  ...form.matches,
  {
    teamA: '',
    teamB: '',
    competition: '',
    season: '',
    nickname: ''
  }
],

          })
        }
        className="text-blue-600 font-medium hover:underline"
      >
        ＋ 試合を追加
      </button>
    )}

    <h2 className="font-bold text-lg mt-6">当時のライフスタイル</h2>
<select
  value={form.lifestyle}
  onChange={(e) => setForm({ ...form, lifestyle: e.target.value })}
  className="w-full border p-2 rounded"
>
  <option value="">選択してください</option>
  <option value="社会人">社会人</option>
  <option value="学生">学生</option>
  <option value="留学">留学</option>
  <option value="ワーキングホリデー">ワーキングホリデー</option>
</select>

<h2 className="font-bold text-lg mt-6">観戦時期</h2>
<div className="flex gap-2">
  <select
    value={form.watchYear}
    onChange={(e) => setForm({ ...form, watchYear: e.target.value })}
    className="w-full border p-2 rounded"
  >
    <option value="">年を選択</option>
    {Array.from({ length: 10 }, (_, i) => 2025 - i).map((year) => (
      <option key={year} value={year}>{year}年</option>
    ))}
  </select>

  <select
    value={form.watchMonth}
    onChange={(e) => setForm({ ...form, watchMonth: e.target.value })}
    className="w-full border p-2 rounded"
  >
    <option value="">月を選択</option>
    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
      <option key={month} value={month}>{month}月</option>
    ))}
  </select>
  </div>

  <h2>滞在期間</h2>
<select
value={form.stayDuration}
onChange={(e) => setForm({ ...form, stayDuration: e.target.value })}
className="w-full border p-2 rounded"

>

<option value="">選択してください</option>
  <option value="2日">2日</option>
  <option value="3日">3日</option>
  <option value="4日">4日</option>
  <option value="5日">5日</option>
  <option value="1週間">1週間</option>
  <option value="2週間">2週間</option>
  <option value="3週間">3週間</option>
  <option value="1か月">1か月</option>
  <option value="1か月半">1か月半</option>
  <option value="2か月">2か月</option>
  <option value="3か月">3か月</option>
  <option value="長期滞在">長期滞在</option>
  <option value="留学">留学</option>
  <option value="ワーホリ">ワーホリ</option>
</select>

<h2 className="font-bold text-lg mt-6">利用した航空会社（最大2件）</h2>

<div className="space-y-4">
  {form.airlines.map((airline, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3 rounded">
      {/* 航空会社 */}
      <div>
        <label className="block text-sm font-medium mb-1">航空会社</label>
        <select
          className="w-full border p-2 rounded"
          value={airline.name}
          onChange={(e) => {
            const newAirlines = [...form.airlines];
            newAirlines[index].name = e.target.value;
            setForm({ ...form, airlines: newAirlines });
          }}
        >
          <option value="">航空会社を選択</option>
          {[
            '日本航空（JAL）', '全日本空輸（ANA）', 'エミレーツ航空', 'カタール航空',
            'シンガポール航空', 'ブリティッシュ・エアウェイズ', 'ルフトハンザ航空',
            'KLMオランダ航空', 'エールフランス航空', 'ターキッシュエアラインズ',
            'スイスインターナショナル航空', 'ユナイテッド航空', 'デルタ航空',
            'アメリカン航空', 'その他',
          ].map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* 座席タイプ */}
      <div>
        <label className="block text-sm font-medium mb-1">座席タイプ</label>
        <select
          className="w-full border p-2 rounded"
          value={airline.seat}
          onChange={(e) => {
            const newAirlines = [...form.airlines];
            newAirlines[index].seat = e.target.value;
            setForm({ ...form, airlines: newAirlines });
          }}
        >
          <option value="">座席を選択</option>
          <option value="エコノミー">エコノミー</option>
          <option value="ビジネス">ビジネス</option>
          <option value="ファースト">ファースト</option>
        </select>
      </div>
    </div>
  ))}

  {/* 追加ボタン（最大2件まで） */}
  {form.airlines.length < 2 && (
    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          airlines: [...form.airlines, { name: '', seat: '' }],
        })
      }
      className="text-blue-600 underline"
    >
      ＋ 航空会社を追加
    </button>
  )}
</div>

<h2 className="font-bold text-lg mt-6">目的地までの移動情報</h2>

{/* 行きの情報 */}
<div className="border p-4 rounded mb-4">
  <h3 className="font-semibold text-blue-600 mb-2">【行き】</h3>

  <label className="block text-sm font-medium mb-1">総移動時間</label>
  <input
    type="text"
    placeholder="例: 16時間"
    value={form.goTime}
    onChange={(e) => setForm({ ...form, goTime: e.target.value })}
    className="w-full border p-2 rounded mb-3"
  />

  <label className="block text-sm font-medium mb-1">直行便 or 乗継便</label>
  <select
    value={form.goType}
    onChange={(e) => setForm({ ...form, goType: e.target.value })}
    className="w-full border p-2 rounded mb-3"
  >
    <option value="">選択してください</option>
    <option value="直行便">直行便</option>
    <option value="乗継便">乗継便</option>
  </select>

  <label className="block text-sm font-medium mb-1">経由地</label>
  <input
    type="text"
    placeholder="例: ドバイ、ヘルシンキ"
    value={form.goVia}
    onChange={(e) => setForm({ ...form, goVia: e.target.value })}
    className="w-full border p-2 rounded"
  />
</div>

{/* 帰りの情報 */}
<div className="border p-4 rounded mb-4">
  <h3 className="font-semibold text-blue-600 mb-2">【帰り】</h3>

  <label className="block text-sm font-medium mb-1">総移動時間</label>
  <input
    type="text"
    placeholder="例: 14時間"
    value={form.returnTime}
    onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
    className="w-full border p-2 rounded mb-3"
  />

  <label className="block text-sm font-medium mb-1">直行便 or 乗継便</label>
  <select
    value={form.returnType}
    onChange={(e) => setForm({ ...form, returnType: e.target.value })}
    className="w-full border p-2 rounded mb-3"
  >
    <option value="">選択してください</option>
    <option value="直行便">直行便</option>
    <option value="乗継便">乗継便</option>
  </select>

  <label className="block text-sm font-medium mb-1">経由地</label>
  <input
    type="text"
    placeholder="例: ドーハ、アムステルダム"
    value={form.returnVia}
    onChange={(e) => setForm({ ...form, returnVia: e.target.value })}
    className="w-full border p-2 rounded"
  />
</div>

<h2 className="font-bold text-lg mt-6">宿泊先（最大3件）</h2>

{form.hotels.map((hotel, index) => (
  <div key={index} className="space-y-2 border p-4 rounded mb-4">
    <input
      type="url"
      placeholder="宿泊先のURL"
      value={hotel.url}
      onChange={(e) => {
        const newHotels = [...form.hotels];
        newHotels[index].url = e.target.value;
        setForm({ ...form, hotels: newHotels });
      }}
      className="w-full border p-2 rounded"
    />

    <input
      type="text"
      placeholder="コメント（100文字以内）"
      value={hotel.comment}
      onChange={(e) => {
        const newHotels = [...form.hotels];
        newHotels[index].comment = e.target.value;
        setForm({ ...form, hotels: newHotels });
      }}
      className="w-full border p-2 rounded"
    />

    <label className="block">評価（★1〜5）</label>
    <input
      type="number"
      min={1}
      max={5}
      value={hotel.rating}
      onChange={(e) => {
        const newHotels = [...form.hotels];
        newHotels[index].rating = Number(e.target.value);
        setForm({ ...form, hotels: newHotels });
      }}
      className="border p-2 rounded w-24"
    />
  </div>
))}

{form.hotels.length < 3 && (
  <button
    type="button"
    onClick={() =>
      setForm({
        ...form,
        hotels: [...form.hotels, { url: '', comment: '', rating: 0 }],
      })
    }
    className="text-blue-600 underline"
  >
    ＋ 宿泊先を追加
  </button>
)}
<h2 className="font-bold text-lg mt-6">おすすめスポット（最大5件）</h2>

{form.spots.map((spot, index) => (
  <div key={index} className="space-y-2 border p-4 rounded mb-4">
    <input
      type="url"
      placeholder="スポットのURL"
      value={spot.url}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].url = e.target.value;
        setForm({ ...form, spots: newSpots });
      }}
      className="w-full border p-2 rounded"
    />

    <input
      type="text"
      placeholder="コメント（100文字以内）"
      value={spot.comment}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].comment = e.target.value;
        setForm({ ...form, spots: newSpots });
      }}
      className="w-full border p-2 rounded"
    />

    <label className="block">評価（★1〜5）</label>
    <input
      type="number"
      min={1}
      max={5}
      value={spot.rating}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].rating = Number(e.target.value);
        setForm({ ...form, spots: newSpots });
      }}
      className="border p-2 rounded w-24"
    />
  </div>
))}

{form.spots.length < 5 && (
  <button
    type="button"
    onClick={() =>
      setForm({
        ...form,
        spots: [...form.spots, { url: '', comment: '', rating: 0, autoName: '', address: '' }],
      })
    }
    className="text-blue-600 underline"
  >
    ＋ おすすめスポットを追加
  </button>
)}
<h2 className="font-bold text-lg mt-6">費用内訳（円単位）</h2>

{[
  { key: 'flight', label: '航空券' },
  { key: 'hotel', label: '宿泊費' },
  { key: 'ticket', label: 'チケット代' },
  { key: 'transport', label: '交通費' },
  { key: 'food', label: '食費' },
  { key: 'goods', label: 'グッズ' },
  { key: 'other', label: 'その他' },
].map(({ key, label }) => (
  <div key={key} className="mb-2">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="number"
      min={0}
      value={form.cost[key] === 0 ? '' : form.cost[key]}
      onChange={(e) =>
        setForm({
          ...form,
          cost: {
            ...form.cost,
            [key]: Number(e.target.value),
          },
        })
      }
      className="w-full border p-2 rounded"
      placeholder="円単位で入力"
    />
  </div>
))}

{/* 合計費用の表示（約○万円） */}
<div className="mt-4 font-semibold">
  合計費用（万円）：約{' '}
  {
    Math.round(
      Object.values(form.cost).reduce((sum, v) => sum + Number(v), 0) / 10000
    )
  }
  万円
</div>
<h2 className="font-bold text-lg mt-6">その他の情報</h2>

{/* おススメ旅アイテム */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">おススメ旅アイテム</label>
  <input
    type="text"
    value={form.items}
    onChange={(e) => setForm({ ...form, items: e.target.value })}
    placeholder="例：モバイルバッテリー、耳栓など"
    className="w-full border p-2 rounded"
  />
</div>

{/* 現地で買ったグッズ */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">現地で買ったグッズ</label>
  <textarea
    value={form.goods}
    onChange={(e) => setForm({ ...form, goods: e.target.value })}
    placeholder="例：ユニフォーム、マフラー、マグカップなど"
    className="w-full border p-2 rounded h-24"
  />
</div>

{/* 印象的なエピソードや感想 */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">印象的なエピソードや感想</label>
  <textarea
    value={form.episode}
    onChange={(e) => setForm({ ...form, episode: e.target.value })}
    placeholder="例：現地のサポーターとの交流など"
    className="w-full border p-2 rounded h-24"
  />
</div>

{/* 初めて行く人への一言 */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">これから初めて現地観戦する人へ一言</label>
  <textarea
    value={form.firstAdvice}
    onChange={(e) => setForm({ ...form, firstAdvice: e.target.value })}
    placeholder="例：入場時に荷物制限あるので注意！"
    className="w-full border p-2 rounded h-24"
  />
</div>
<h2 className="font-bold text-lg mt-6">画像アップロード（最大5枚）</h2>

<div className="flex flex-wrap gap-3 mb-4">
  {form.images.map((img, idx) => (
    <div key={idx} className="w-24 h-24 bg-gray-100 rounded relative overflow-hidden">
      <img
        src={URL.createObjectURL(img)}
        alt={`preview-${idx}`}
        className="object-cover w-full h-full"
      />
      <button
        type="button"
        onClick={() => {
          const newImages = [...form.images];
          newImages.splice(idx, 1);
          setForm({ ...form, images: newImages });
        }}
        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-bl"
      >
        ✕
      </button>
    </div>
  ))}

  {/* アップロード追加ボタン */}
  {form.images.length < 5 && (
    <label className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
      <span className="text-sm text-gray-600 text-center">＋<br />追加</span>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const newImages = [...form.images, e.target.files[0]];
            setForm({ ...form, images: newImages.slice(0, 5) });
          }
        }}
        className="hidden"
      />
    </label>
  )}
</div>

<h2 className="font-bold text-lg mt-6">SNSリンク（任意）</h2>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1">X（旧Twitter）</label>
  <input
    type="url"
    placeholder="https://x.com/username"
    value={form.snsX}
    onChange={(e) => setForm({ ...form, snsX: e.target.value })}
    className="w-full border p-2 rounded"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Note</label>
  <input
    type="url"
    placeholder="https://note.com/username"
    value={form.snsNote}
    onChange={(e) => setForm({ ...form, snsNote: e.target.value })}
    className="w-full border p-2 rounded"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Instagram</label>
  <input
    type="url"
    placeholder="https://instagram.com/username"
    value={form.snsInstagram}
    onChange={(e) => setForm({ ...form, snsInstagram: e.target.value })}
    className="w-full border p-2 rounded"
  />
</div>

<h2 className="font-bold text-lg mt-6">カテゴリー</h2>

<select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="w-full border p-2 rounded"
>
  <option value="">選択してください</option>
  <option value="england">イングランド</option>
  <option value="spain">スペイン</option>
  <option value="italy">イタリア</option>
  <option value="germany">ドイツ</option>
  <option value="france">フランス</option>
  <option value="other">その他</option>
</select>

<h2 className="font-bold text-lg mt-6">コメントの受け付け</h2>

<div className="flex items-center space-x-2 mb-4">
  <input
    type="checkbox"
    id="allowComment"
    checked={form.allowComment}
    onChange={(e) => setForm({ ...form, allowComment: e.target.checked })}
    className="w-4 h-4"
  />
  <label htmlFor="allowComment" className="text-sm">
    この投稿へのコメントを受け付ける
  </label>
</div>


    {/* 投稿ボタン */}
   <button
  type="button"
  onClick={handleSubmit} // ← これがないと関数動かない
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  投稿する
</button>

  </div> // ← 最後の return に対応する唯一の div
);
} // ← BuymaStylePostForm 関数の閉じ
