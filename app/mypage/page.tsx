'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  imageUrls?: string[];
  matches?: {
    teamA: string;
    teamB: string;
  }[];
};

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const q = query(collection(db, 'kansenki-posts'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(data);
      } else {
        setUser(null);
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('この投稿を削除しますか？')) {
      await deleteDoc(doc(db, 'kansenki-posts', id));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/posts/edit/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">マイページ</h1>

      {user && (
        <div className="mb-6">
          <p>こんにちは、{user.displayName} さん</p>
          <Image
            src={user.photoURL}
            alt="ユーザーアイコン"
            width={60}
            height={60}
            className="rounded-full mt-2"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-100 rounded shadow p-2 relative">
            <div className="aspect-square bg-white overflow-hidden relative">
              {post.imageUrls?.[0] ? (
                <Image
                  src={post.imageUrls[0]}
                  alt="投稿画像"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-700 font-semibold">
              {post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <button
                onClick={() => handleEdit(post.id)}
                className="text-blue-600 hover:underline"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 hover:underline"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}