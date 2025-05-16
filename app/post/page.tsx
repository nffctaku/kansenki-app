'use client';

import BuymaStylePostForm from '@/components/BuymaStylePostForm';

export default function PostPage() {
  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">観戦記投稿フォーム</h1>
      <BuymaStylePostForm />
    </main>
  );
}