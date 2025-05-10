import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { placeId } = await req.json();
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json({ error: 'placeId または APIキーが不足しています' }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ja`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Google API エラー', detail: data.status }, { status: 500 });
    }

    const result = data.result;
    return NextResponse.json({
      name: result.name,
      address: result.formatted_address,
      rating: result.rating,
      url: result.url,
    });
  } catch (e) {
    return NextResponse.json({ error: 'API通信失敗' }, { status: 500 });
  }
}
