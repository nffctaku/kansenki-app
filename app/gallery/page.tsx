'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

type ImageData = {
  id: string;
  url: string;
  createdAt: any;
};

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const q = query(collection(db, 'kansenkiImages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          url: d.url,
          createdAt: d.createdAt?.toDate?.() ?? null,
        };
      }) as ImageData[];

      console.log('取得画像', data); // ← デバッグ用ログ
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">観戦記ギャラリー</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={image.url}
              alt="観戦記"
              className="w-full h-[400px] object-contain bg-gray-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
