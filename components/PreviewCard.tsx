import React from 'react';

type Props = {
  nickname: string;
  team: string;
  player: string;
  month: string;
  job: string;
  league: string;
  firstMatch: string;
  travelPeriod: string;
  airline: string;
  region: string;
  spot: string;
  impression: string;
  message: string;
  profileImage?: string | null;
  bgImage?: string | null;
};

export default function PreviewCard({
  nickname,
  team,
  player,
  month,
  job,
  league,
  firstMatch,
  travelPeriod,
  airline,
  region,
  spot,
  impression,
  message,
  profileImage,
  bgImage
}: Props) {
  return (
    <div
      className="w-full h-full rounded-lg shadow-lg p-6 text-white relative"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '600px',
        backgroundColor: bgImage ? 'transparent' : '#333'
      }}
    >
      <div className="bg-black bg-opacity-80 p-4 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="プロフィール"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-500 border" />
          )}
          <div>
            <h2 className="text-xl font-bold">{nickname || '名無し'}</h2>
            <p className="text-sm">{month || '-'}・{job || '-'}</p>
          </div>
        </div>

        <p><strong>好きなチーム:</strong> {team}</p>
        <p><strong>好きな選手:</strong> {player}</p>
        <p><strong>普段見るリーグ:</strong> {league}</p>
        <p><strong>初めて見た試合:</strong> {firstMatch}</p>
        <p><strong>渡航期間:</strong> {travelPeriod}</p>
        <p><strong>航空会社:</strong> {airline}</p>
        <p><strong>訪れた地域:</strong> {region}</p>
        <p><strong>推しスポット:</strong> {spot}</p>
        <p><strong>印象に残ったこと:</strong> {impression}</p>
        <p><strong>初めて行く人への一言:</strong> {message}</p>
      </div>
    </div>
  );
}
