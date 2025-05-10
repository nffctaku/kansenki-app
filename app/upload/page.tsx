// app/post/page.tsx
import TravelPostForm from '@/components/TravelPostForm';

export default function PostPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">観戦記を投稿する</h1>
      <TravelPostForm />
    </div>
  );
}
