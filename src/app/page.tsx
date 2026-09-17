import { fetchChannelDetails, fetchLatestVideos } from "@/lib/youtube";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600; // Cache on server for 1 hour to protect quota

export default async function HomePage() {
  const [channel, videos] = await Promise.all([
    fetchChannelDetails(),
    fetchLatestVideos(8),
  ]);

  return <HomeClient channel={channel} videos={videos} />;
}
