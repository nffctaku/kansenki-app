'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ImageSlider from '@/components/ImageSlider';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [user] = useAuthState(auth);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const ref = doc(db, 'kansenki-posts', id.toString());
      console.log('[debug] 取得しようとしているID:', id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        console.log('[debug] 投稿取得成功！');
        setPost(snapshot.data());
      } else {
        console.log('[debug] 投稿が見つかりません');
      }
    };

    fetchPost();

    const commentsRef = collection(db, 'kansenki-posts', id.toString(), 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(data);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    await addDoc(collection(db, 'kansenki-posts', id.toString(), 'comments'), {
      text: newComment,
      userId: user.uid,
      nickname: user.displayName || '匿名',
      createdAt: serverTimestamp(),
    });

    setNewComment('');
  };

  // ✅ 投稿がまだ読み込まれてなければ
  if (!post) {
    return <div className="p-4">読み込み中...</div>;
  }

return (
  <div className="p-4 max-w-4xl mx-auto space-y-4">
    {/* パンくずリンク：トップページ ＞ カテゴリー */}
    <div className="text-sm text-blue-600 mb-2 space-x-1">
      <a href="/" className="underline">トップページ</a>
      <span>&gt;</span>
      <a
        href={`/gallery/${post.category}`}
        className="underline"
      >
        {
          {
            england: 'イングランド',
            spain: 'スペイン',
            italy: 'イタリア',
            germany: 'ドイツ',
            france: 'フランス',
            other: 'その他'
          }[post.category] || 'カテゴリー未設定'
        }
      </a>
    </div>

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

        {post.allowComment && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-lg font-bold mb-2">コメント</h2>

            {user ? (
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="コメントを書く..."
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  投稿する
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">コメントするにはログインしてください。</p>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-2">
                  <p className="font-semibold">{comment.nickname}</p>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
