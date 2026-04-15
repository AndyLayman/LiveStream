import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function GET() {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json(
      { live: false, error: "YouTube API not configured" },
      { status: 200 }
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
  url.searchParams.set("eventType", "live");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });

  if (!res.ok) {
    return NextResponse.json(
      { live: false, error: "YouTube API request failed" },
      { status: 200 }
    );
  }

  const data = await res.json();
  const items = data.items ?? [];

  if (items.length > 0) {
    return NextResponse.json({
      live: true,
      videoId: items[0].id.videoId,
      title: items[0].snippet.title,
    });
  }

  return NextResponse.json({ live: false });
}
