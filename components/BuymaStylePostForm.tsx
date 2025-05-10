'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';



const seasons = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => {
  const year = 1970 + i;
  return {
    value: `${year}/${(year + 1).toString().slice(-2)}`,
    label: `${year}/${(year + 1).toString().slice(-2)}`,
  };
}).reverse();

const teamList = [
  'マンチェスター・シティ', 'アーセナル', 'リバプール', 'アストン・ビラ', 'トッテナム',
  'チェルシー', 'ニューカッスル', 'マンチェスター・ユナイテッド', 'ウエスト・ハム',
  'クリスタル・パレス', 'ブライトン', 'ボーンマス', 'フルハム', 'ウォルバーハンプトン',
  'エバートン', 'ブレントフォード', 'ノッティンガム・フォレスト', 'レスター・シティ',
  'イプスウィッチ', 'サウサンプトン', 'ルートン・タウン', 'バーンリー',
  'シェフィールド・ユナイテッド', 'リーズ', 'WBA', 'ノリッジ', 'ハル・シティ',
  'ミドルスブラ', 'コベントリー', 'プレストン', 'ブリストル・シティ', 'カーディフ',
  'ミルウォール', 'スウォンジー', 'ワトフォード', 'サンダーランド', 'ストーク・シティ',
  'QPR', 'ブラックバーン', 'シェフィールド・ウェンズデイ', 'プリマス', 'ポーツマス',
  'ダービー・カウンティ', 'オックスフォード', 'レアル・マドリー', 'バルセロナ',
  'ジローナ', 'アトレティコ・マドリー', 'アスレティック・ビルバオ', 'ソシエダ',
  'ベティス', 'ビジャレアル', 'バレンシア', 'アラベス', 'オサスナ', 'ヘタフェ',
  'セルタ', 'セビージャ', 'マジョルカ', 'ラス・パルマス', 'ラージョ', 'レガネス',
  'バジャドリー', 'エスパニョール', 'レバークーゼン', 'シュツットガルト', 'バイエルン',
  'ライプツィヒ', 'ドルトムント', 'フランクフルト', 'ホッフェンハイム', 'ハイデンハイム',
  'ブレーメン', 'フライブルク', 'アウクスブルク', 'ボルフスブルク', 'マインツ',
  'ボルシアMG', 'ウニオン・ベルリン', 'ボーフム', 'ザンクト・パウリ', 'ホルシュタイン・キール',
  'インテル', 'ミラン', 'ユベントス', 'アタランタ', 'ボローニャ', 'ローマ', 'ラツィオ',
  'フィオレンティーナ', 'トリノ', 'ナポリ', 'ジェノア', 'モンツァ', 'ベローナ', 'レッチェ',
  'ウディネーゼ', 'カリアリ', 'エンポリ', 'パルマ', 'コモ', 'ベネチア', 'パリSG', 'モナコ',
  'ブレスト', 'リール', 'ニース', 'リヨン', 'RCランス', 'マルセイユ', 'スタッド・ランス',
  'レンヌ', 'トゥールーズ', 'モンペリエ', 'ストラスブール', 'ナント', 'ル・アーブル',
  'オセール', 'アンジェ', 'サンテティエンヌ',
].map((team) => ({ value: team, label: team }));

export default function BuymaStylePostForm() {
  const [form, setForm] = useState({
    season: '',
    matches: [{ teamA: '', teamB: '', competition: '' }],
    duration: '',
    nickname: '',
    watchYear: '',
    watchMonth: '',
    airlines: [{ name: '', seat: '' }],
    hotels: [{ url: '', comment: '', rating: 0 }],
    spots: [{ url: '', comment: '', rating: 0, autoName: '', address: '' }],
    items: '',
    goods: '',
    episode: '',
    firstReflection: '',
    firstAdvice: '',
    images: [],
    allowComment: true,
    cost: {
      total: 0,
      flight: 0,
      hotel: 0,
      ticket: 0,
      transport: 0,
      food: 0,
      goods: 0,
      other: 0,
    },
    category: '',
  });
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'kansenki-posts'), form);
      alert('投稿が完了しました！');
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    }
  };
  useEffect(() => {
    const { flight, hotel, ticket, transport, food, goods, other } = form.cost;
    const total =
      Number(flight) +
      Number(hotel) +
      Number(ticket) +
      Number(transport) +
      Number(food) +
      Number(goods) +
      Number(other);

    setForm((prev) => ({
      ...prev,
      cost: { ...prev.cost, total },
    }));
  }, [
    form.cost.flight,
    form.cost.hotel,
    form.cost.ticket,
    form.cost.transport,
    form.cost.food,
    form.cost.goods,
    form.cost.other,
  ]);
  

  return (
    <div className="p-4 space-y-4">
      {/* 観戦シーズン */}
      <h2>観戦シーズン</h2>
      <Select
        options={seasons}
        value={seasons.find((s) => s.value === form.season)}
        onChange={(e) => setForm({ ...form, season: e?.value || '' })}
      />
  
      <h2 className="mt-6 font-bold text-lg">観戦した試合（最大5件）</h2>
  
      {form.matches.map((match, index) => (
        <div key={index} className="space-y-2 border p-3 rounded mb-4">
          <label className="block font-semibold">大会名</label>
          <Select
            options={[
              { label: 'プレミアリーグ', value: 'Premier League' },
              { label: 'EFLチャンピオンシップ', value: 'EFL Championship' },
              { label: 'FAコミュニティ・シールド', value: 'FA Community Shield' },
              { label: 'ラ・リーガ', value: 'La Liga' },
              { label: 'ラ・リーガ2', value: 'La Liga 2' },
              { label: 'コパ・デル・レイ', value: 'Copa del Rey' },
              { label: 'スーペルコパ・デ・エスパーニャ', value: 'Supercopa de España' },
              { label: 'ブンデスリーガ', value: 'Bundesliga' },
              { label: '2.ブンデスリーガ', value: '2. Bundesliga' },
              { label: 'DFBポカール', value: 'DFB-Pokal' },
              { label: 'DFLスーパーカップ', value: 'DFL-Supercup' },
              { label: 'セリエA', value: 'Serie A' },
              { label: 'セリエB', value: 'Serie B' },
              { label: 'コッパ・イタリア', value: 'Coppa Italia' },
              { label: 'スーペルコッパ・イタリアーナ', value: 'Supercoppa Italiana' },
              { label: 'リーグ・アン', value: 'Ligue 1' },
              { label: 'リーグ・ドゥ', value: 'Ligue 2' },
              { label: 'クープ・ドゥ・フランス', value: 'Coupe de France' },
              { label: 'トロフェ・デ・シャンピオン', value: 'Trophée des Champions' },
              { label: 'UEFAチャンピオンズリーグ', value: 'UEFA Champions League' },
              { label: 'UEFAヨーロッパリーグ', value: 'UEFA Europa League' },
              { label: 'UEFAヨーロッパカンファレンスリーグ', value: 'UEFA Europa Conference League' },
              { label: 'UEFAスーパーカップ', value: 'UEFA Super Cup' },
              { label: 'FIFAクラブワールドカップ', value: 'FIFA Club World Cup' },
              { label: 'その他', value: 'その他' },
            ]}
            value={match.competition ? { label: match.competition, value: match.competition } : null}
            onChange={(e) => {
              const newMatches = [...form.matches];
              newMatches[index].competition = e?.value || '';
              setForm({ ...form, matches: newMatches });
            }}
          />
  
          <label className="block font-semibold mt-2">対戦カード</label>
          <div className="flex gap-2 items-center">
            <Select
              options={teamList}
              isSearchable={true}
              placeholder="ホームチームを検索"
              value={teamList.find((t) => t.value === match.teamA)}
              onChange={(e) => {
                const newMatches = [...form.matches];
                newMatches[index].teamA = e?.value || '';
                setForm({ ...form, matches: newMatches });
              }}
              className="w-full"
            />
            <span className="font-semibold">vs</span>
            <Select
              options={teamList}
              isSearchable={true}
              placeholder="アウェイチームを検索"
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
      ))}
  
      {form.matches.length < 5 && (
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              matches: [...form.matches, { teamA: '', teamB: '', competition: '' }],
            })
          }
          className="text-blue-600 underline"
        >
          ＋ 試合を追加
        </button>
      )}
  
      <h2 className="font-bold text-lg">ユーザー情報</h2>
  
      <label className="block font-semibold">ニックネーム</label>
      <input
        type="text"
        placeholder="あなたのニックネーム"
        value={form.nickname}
        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        className="w-full border p-2 rounded"
      />
  
      <h2 className="font-bold text-lg mt-6">観戦時期</h2>
      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">年</label>
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
        </div>
  
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">月</label>
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
      </div>
  
      <h2 className="font-bold text-lg mt-6">利用した航空会社（最大2件）</h2>
      <div className="space-y-4">
        {form.airlines.map((airline, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">座席</option>
                {['エコノミー', 'ビジネス', 'ファースト'].map((seat) => (
                  <option key={seat} value={seat}>{seat}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
  
        {form.airlines.length < 2 && (
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, airlines: [...form.airlines, { name: '', seat: '' }] })
            }
            className="text-blue-600 underline"
          >
            ＋ 航空会社を追加
            </button>
      )}
    </div>
        
        <h2 className="font-bold text-lg mt-8">宿泊先（最大3件）</h2>
    {form.hotels.map((hotel, index) => (
      <div key={index} className="space-y-2 border p-3 rounded mb-4">
        <label className="block text-sm font-medium">宿泊先URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={hotel.url}
          onChange={(e) => {
            const newHotels = [...form.hotels];
            newHotels[index].url = e.target.value;
            setForm({ ...form, hotels: newHotels });
          }}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium">コメント（100文字以内）</label>
        <textarea
          placeholder="宿泊先の感想など"
          value={hotel.comment}
          maxLength={100}
          onChange={(e) => {
            const newHotels = [...form.hotels];
            newHotels[index].comment = e.target.value;
            setForm({ ...form, hotels: newHotels });
          }}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium">評価</label>
        <select
          value={hotel.rating}
          onChange={(e) => {
            const newHotels = [...form.hotels];
            newHotels[index].rating = Number(e.target.value);
            setForm({ ...form, hotels: newHotels });
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">評価を選択</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>★{n}</option>
          ))}
        </select>
      </div>
    ))}

    {form.hotels.length < 3 && (
      <div>
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              hotels: [...form.hotels, { url: '', comment: '', rating: 0 }]
            })
          }
          className="text-blue-600 underline"
        >
          ＋ 宿泊先を追加
        </button>
      </div>
    )}

<h2 className="font-bold text-lg mt-8">おすすめスポット（最大5件）</h2>
{form.spots.map((spot, index) => (
  <div key={index} className="space-y-2 border p-3 rounded mb-4">
    <label className="block text-sm font-medium">スポットURL</label>
    <input
      type="url"
      placeholder="https://example.com"
      value={spot.url}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].url = e.target.value;
        setForm({ ...form, spots: newSpots });
      }}
      className="w-full border p-2 rounded"
    />

    <label className="block text-sm font-medium">コメント（100文字以内）</label>
    <textarea
      placeholder="おすすめポイントなど"
      maxLength={100}
      value={spot.comment}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].comment = e.target.value;
        setForm({ ...form, spots: newSpots });
      }}
      className="w-full border p-2 rounded"
    />

    <label className="block text-sm font-medium">評価</label>
    <select
      value={spot.rating}
      onChange={(e) => {
        const newSpots = [...form.spots];
        newSpots[index].rating = Number(e.target.value);
        setForm({ ...form, spots: newSpots });
      }}
      className="w-full border p-2 rounded"
    >
      <option value="">評価を選択</option>
      {[1, 2, 3, 4, 5].map((n) => (
        <option key={n} value={n}>★{n}</option>
      ))}
    </select>
  </div>
))}

{form.spots.length < 5 && (
  <div>
    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          spots: [...form.spots, { url: '', comment: '', rating: 0, autoName: '', address: '' }]
        })
      }
      className="text-blue-600 underline"
    >
       ＋ スポットを追加
    </button>
  </div>
)}

       {/* おすすめ旅アイテム */}
    <h2 className="font-bold text-lg mt-8">おすすめ旅アイテム</h2>
    <textarea
      placeholder="これがあって助かった！というアイテムを紹介してください"
      value={form.items}
      onChange={(e) => setForm({ ...form, items: e.target.value })}
      className="w-full border p-2 rounded"
    />

    {/* 現地で買ったグッズ */}
    <h2 className="font-bold text-lg mt-6">現地で買ったグッズ</h2>
    <textarea
      placeholder="現地で購入したユニフォームやグッズについて記入"
      value={form.goods}
      onChange={(e) => setForm({ ...form, goods: e.target.value })}
      className="w-full border p-2 rounded"
    />

    {/* 現地エピソード/感想 */}
    <h2 className="font-bold text-lg mt-6">現地での印象的なエピソードや感想</h2>
    <textarea
      placeholder="観戦中に印象に残った出来事や感想などを自由に記入"
      value={form.episode}
      onChange={(e) => setForm({ ...form, episode: e.target.value })}
      className="w-full border p-2 rounded"
    />

    {/* これから初観戦する人へ */}
    <h2 className="font-bold text-lg mt-6">これから初めて現地観戦する人へ一言</h2>
    <textarea
      placeholder="初めて行く人へアドバイスやメッセージがあればぜひ！"
      value={form.firstAdvice}
      onChange={(e) => setForm({ ...form, firstAdvice: e.target.value })}
      className="w-full border p-2 rounded"
      />

<h2 className="font-bold text-lg mt-8">費用内訳</h2>

{/* 各費用項目 */}
{[
  { key: 'flight', label: '航空券代' },
  { key: 'hotel', label: '宿泊費' },
  { key: 'ticket', label: '観戦チケット' },
  { key: 'transport', label: '現地交通費' },
  { key: 'food', label: '食費' },
  { key: 'goods', label: 'グッズ購入費' },
  { key: 'other', label: 'その他' }
].map(({ key, label }) => (
  <div key={key} className="mb-2">
    <label className="block text-sm font-medium">{label}</label>
    <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="0"
  value={form.cost[key].toString()}
  onChange={(e) => {
    const sanitizedValue = e.target.value.replace(/^0+(?=\d)/, ''); // 先頭の0除去
    const updatedCost = { ...form.cost, [key]: Number(sanitizedValue) || 0 };
    const total = Object.entries(updatedCost)
      .filter(([k]) => k !== 'total')
      .reduce((sum, [, val]) => sum + Number(val), 0);
    setForm({ ...form, cost: { ...updatedCost, total } });
  }}
  className="w-full border p-2 rounded"
/>
  </div>
))}

{/* 合計金額 */}
<div className="mt-4">
  <label className="block text-sm font-medium">合計費用</label>
  <input
    type="number"
    value={form.cost.total}
    readOnly
    className="w-full border p-2 rounded bg-gray-100"
  />
  <p className="text-sm text-gray-600 mt-1">
    約 {Math.round(form.cost.total / 10000)} 万円
  </p>
  </div>

 {/* コメント許可 */}
 <div className="mt-6">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={form.allowComment}
          onChange={(e) => setForm({ ...form, allowComment: e.target.checked })}
          className="mr-2"
        />
        コメントを許可する(質問などのコメント含め)
      </label>
    </div>

    {/* SNSリンク */}
    <h2 className="font-bold text-lg mt-8">SNSリンク</h2>
    <div className="space-y-2">
      <input
        type="url"
        placeholder="X（旧Twitter）のURL"
        value={form.snsX || ''}
        onChange={(e) => setForm({ ...form, snsX: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="url"
        placeholder="InstagramのURL"
        value={form.snsInstagram || ''}
        onChange={(e) => setForm({ ...form, snsInstagram: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="url"
        placeholder="noteのURL"
        value={form.snsNote || ''}
        onChange={(e) => setForm({ ...form, snsNote: e.target.value })}
        className="w-full border p-2 rounded"
      />
    </div>
    {/* カテゴリー選択 */}
<h2 className="font-bold text-lg mt-6">カテゴリー</h2>
<select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="w-full border p-2 rounded"
>
  <option value="">選択してください</option>
  <option value="england">イングランド</option>
  <option value="italy">イタリア</option>
  <option value="spain">スペイン</option>
  <option value="france">フランス</option>
  <option value="other">その他</option>
</select>

<h2 className="font-bold text-lg mt-6"></h2>

{/* 画像アップロード（最大5枚） */}
<div className="mt-6">
  <p className="mb-2 font-semibold"></p>

  <div className="flex justify-center">
    <label
      htmlFor="image-upload"
      className="flex flex-col items-center justify-center w-28 h-28 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-blue-500 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h4l2-3h6l2 3h4v13H3V7z"
        />
      </svg>
      <span className="text-blue-500 text-sm">1〜5枚</span>
    </label>

    <input
      id="image-upload"
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
        if (e.target.files) {
          const selected = Array.from(e.target.files);
          const newImages = [...form.images, ...selected].slice(0, 5);
          setForm({ ...form, images: newImages });
        }
      }}
      className="hidden"
    />
  </div>

  {/* プレビュー＋削除ボタン */}
  {form.images.length > 0 && (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {form.images.map((img, i) => (
        <div key={i} className="relative">
          <img
            src={URL.createObjectURL(img)}
            alt={`preview-${i}`}
            className="w-full aspect-square object-cover rounded border"
          />
          <button
            type="button"
            onClick={() => {
              const updatedImages = form.images.filter((_, index) => index !== i);
              setForm({ ...form, images: updatedImages });
            }}
            className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-md"
            title="削除"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>



{/* 画像追加ボタン（ファイル選択） */}
{form.images.length < 5 && (
  <div className="mt-4">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          const newImages = [...form.images, e.target.files[0]];
          setForm({ ...form, images: newImages.slice(0, 5) });
        }
      }}
    />
    <p className="text-sm text-gray-600 mt-1">最大5枚までアップロードできます</p>
  </div>
)}
{/* 投稿ボタン */}
<div className="mt-10">
  <button
    type="button"
    onClick={handleSubmit}
    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
  >
    シェア
  </button>
</div>


</div> // ← JSX全体の閉じdiv
); 