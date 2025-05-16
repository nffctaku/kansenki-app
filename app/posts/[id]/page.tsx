'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';


export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const ref = doc(db, 'kansenki-posts', id.toString());
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('取得データ：', data);
        console.log('画像の数:', data.imageUrls?.length);
        console.log('画像の中身:', data.imageUrls);
        setPost(data);
      } else {
        console.log('投稿が見つかりません');
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div className="p-4">読み込み中...</div>;

 return (
  <div className="p-4 max-w-4xl mx-auto space-y-4">
    <h1 className="text-xl font-bold">
      {post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}
    </h1>
    <p className="text-sm text-gray-500">
      / {post.category || '未設定'}
    </p>

    {/* ✅ Swiper処理はImageSliderに任せて一括表示 */}
    {Array.isArray(post.imageUrls) && post.imageUrls.length > 0 && (
      <div className="w-full max-w-lg mx-auto mb-6">
        <ImageSlider images={post.imageUrls} />
      </div>
    )}

      <div className="space-y-2 text-sm">
        <p><strong>観戦シーズン：</strong>{post.season || '未入力'}</p>
        <p><strong>大会名：</strong>{post.competition || '未入力'}</p>
        <p><strong>対戦カード：</strong>{post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}</p>
        <p><strong>ニックネーム：</strong>{post.nickname || '未入力'}</p>
        <p><strong>当時のライフスタイル：</strong>{post.role || '未入力'}</p>
        <p><strong>観戦時期：</strong>{post.watchYear}年 {post.watchMonth}月</p>
        <p><strong>滞在期間：</strong>{post.stayDuration || post.duration || '未入力'}</p>

        <div>
          <strong>利用航空会社：</strong>
          <ul className="list-disc list-inside">
            {post.airlines?.map((air: any, idx: number) => (
              <li key={idx}>{air.name}（{air.seat}）</li>
            )) || '未入力'}
          </ul>
        </div>

        <div>
          <strong>宿泊先：</strong>
          <ul className="list-disc list-inside">
            {post.hotels?.map((hotel: any, idx: number) => (
              <li key={idx}>
                <a href={hotel.url} target="_blank" className="text-blue-600 underline">{hotel.url}</a>（★{hotel.rating}） - {hotel.comment}
              </li>
            )) || '未入力'}
          </ul>
        </div>

        <div>
          <strong>おすすめスポット：</strong>
          <ul className="list-disc list-inside">
            {post.spots?.map((spot: any, idx: number) => (
              <li key={idx}>
                <a href={spot.url} target="_blank" className="text-blue-600 underline">{spot.url}</a>（★{spot.rating}） - {spot.comment}
              </li>
            )) || '未入力'}
          </ul>
        </div>

        <div>
          <strong>費用内訳：</strong>
          <ul className="list-disc list-inside">
            <li>航空券：{post.cost?.flight}円</li>
            <li>宿泊費：{post.cost?.hotel}円</li>
            <li>チケット代：{post.cost?.ticket}円</li>
            <li>交通費：{post.cost?.transport}円</li>
            <li>食費：{post.cost?.food}円</li>
            <li>グッズ：{post.cost?.goods}円</li>
            <li>その他：{post.cost?.other}円</li>
          </ul>
          <p>合計費用：約{post.cost?.total ? `${post.cost.total}万円` : '未入力'}</p>
        </div>

        <p><strong>持参アイテム：</strong>{post.items || '未入力'}</p>
        <p><strong>買ったグッズ：</strong>{post.goods || '未入力'}</p>
        <p><strong>印象的なエピソード：</strong>{post.episode || '未入力'}</p>
        <p><strong>これから初めて現地観戦する人へ：</strong>{post.firstAdvice || '未入力'}</p>

        <div>
          <strong>SNSリンク：</strong>
          <ul className="list-disc list-inside">
            {post.snsX && <li><a href={post.snsX} className="text-blue-600 underline">X（旧Twitter）</a></li>}
            {post.snsInstagram && <li><a href={post.snsInstagram} className="text-blue-600 underline">Instagram</a></li>}
            {post.snsNote && <li><a href={post.snsNote} className="text-blue-600 underline">Note</a></li>}
          </ul>
        </div>

        <p><strong>コメント受付：</strong>{post.allowComment ? '受け付ける' : '受け付けない'}</p>
      </div>
    </div>
  );
}
