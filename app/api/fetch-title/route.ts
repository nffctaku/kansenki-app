import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      '名称不明';

    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: '取得失敗' });
  }
}

