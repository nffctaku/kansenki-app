'use client';

import { useState } from 'react';
import PreviewCard from '@/components/PreviewCard';
import html2canvas from 'html2canvas';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function KansenkiPage() {
  const [nickname, setNickname] = useState('');
  const [team, setTeam] = useState('');
  const [player, setPlayer] = useState('');
  const [month, setMonth] = useState('');
  const [job, setJob] = useState('');
  const [league, setLeague] = useState('');
  const [firstMatch, setFirstMatch] = useState('');
  const [travelPeriod, setTravelPeriod] = useState('');
  const [airline, setAirline] = useState('');
  const [region, setRegion] = useState('');
  const [spot, setSpot] = useState('');
  const [impression, setImpression] = useState('');
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (img: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadToFirebase = async () => {
    const target = document.getElementById('capture-target');
    if (!target) {
      alert('画像が見つかりませんでした');
      return;
    }

    try {
      const canvas = await html2canvas(target);
      const dataUrl = canvas.toDataURL('image/png');
      const fileName = `kansenki_${Date.now()}.png`;
      const imageRef = ref(storage, `kansenki-images/${fileName}`);

      await uploadString(imageRef, dataUrl, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);

      alert('アップロード完了！URL: ' + downloadURL);
    } catch (error) {
      console.error('アップロード失敗:', error);
      alert('アップロードに失敗しました');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* 入力フォーム */}
      <div className="w-full md:w-1/2 space-y-2">
        <label>ニックネーム<input className="w-full" value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
        <label>好きなチーム<input className="w-full" value={team} onChange={(e) => setTeam(e.target.value)} /></label>
        <label>好きな選手<input className="w-full" value={player} onChange={(e) => setPlayer(e.target.value)} /></label>
        <label>初観戦時期<input className="w-full" value={month} onChange={(e) => setMonth(e.target.value)} /></label>
        <label>当時（学生/社会人）<input className="w-full" value={job} onChange={(e) => setJob(e.target.value)} /></label>
        <label>普段見るリーグ<input className="w-full" value={league} onChange={(e) => setLeague(e.target.value)} /></label>
        <label>初めて見た試合<input className="w-full" value={firstMatch} onChange={(e) => setFirstMatch(e.target.value)} /></label>
        <label>渡航期間<input className="w-full" value={travelPeriod} onChange={(e) => setTravelPeriod(e.target.value)} /></label>
        <label>航空会社<input className="w-full" value={airline} onChange={(e) => setAirline(e.target.value)} /></label>
        <label>訪れた地域<textarea className="w-full" value={region} onChange={(e) => setRegion(e.target.value)} /></label>
        <label>推しスポット<input className="w-full" value={spot} onChange={(e) => setSpot(e.target.value)} /></label>
        <label>印象に残ったこと<textarea className="w-full" value={impression} onChange={(e) => setImpression(e.target.value)} /></label>
        <label>初めて行く人への一言<textarea className="w-full" value={message} onChange={(e) => setMessage(e.target.value)} /></label>
        <label>プロフィール画像<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileImage)} /></label>
        <label>背景画像<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBgImage)} /></label>
      </div>

      {/* プレビューカード */}
      <div id="capture-target" className="w-full md:w-1/2">
        <PreviewCard
          nickname={nickname}
          team={team}
          player={player}
          month={month}
          job={job}
          league={league}
          firstMatch={firstMatch}
          travelPeriod={travelPeriod}
          airline={airline}
          region={region}
          spot={spot}
          impression={impression}
          message={message}
          profileImage={profileImage}
          bgImage={bgImage}
        />
        <button
          onClick={handleUploadToFirebase}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Firebaseにアップロード
        </button>
      </div>
    </div>
  );
}

