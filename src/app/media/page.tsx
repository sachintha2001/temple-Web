import { Metadata } from "next";
import { fetchChannelDetails, fetchLatestVideos } from "@/lib/youtube";
import MediaClient from "@/components/MediaClient";

export const revalidate = 3600; // 1 hour ISR cache

export const metadata: Metadata = {
  title: "ධර්ම දේශනා & මාධ්‍ය | කපුගම සුමනවංශ නා හිමි සෙනසුන",
  description:
    "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ සදහම් දේශනා, සූත්‍ර ධර්ම විවරණ, සතිපට්ඨාන භාවනා අනුශාසනා සහ සෙත් පිරිත් සජ්ඣායනා.",
};

export default async function MediaPage() {
  const [channel, videos] = await Promise.all([
    fetchChannelDetails(),
    fetchLatestVideos(30),
  ]);

  return <MediaClient channel={channel} videos={videos} />;
}
