'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import BuymaStylePostForm from '../../components/BuymaStylePostForm';

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">観戦記を投稿する</h1>
      <BuymaStylePostForm />
    </div>
  );
}
