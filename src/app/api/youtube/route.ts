import { NextResponse } from "next/server";
import { fetchChannelDetails, fetchLatestVideos } from "@/lib/youtube";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 24;

    const [channel, videos] = await Promise.all([
      fetchChannelDetails(),
      fetchLatestVideos(limit),
    ]);

    return NextResponse.json({
      channel,
      videos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
