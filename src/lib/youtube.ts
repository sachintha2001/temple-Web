export interface YouTubeChannelStats {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  avatarUrl: string;
  bannerUrl: string;
}

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyAg22cSu1JwMEwSX17JVpa_trwyMaiYABc";
export const MONASTERY_CHANNEL_ID = "UCz94jIRNAGatR6Q1OlU7Gqg";
export const MONASTERY_UPLOADS_PLAYLIST_ID = "UUz94jIRNAGatR6Q1OlU7Gqg";

// High-fidelity fallback data matching Ven. Dikkumbure Subhuthi Thero's official channel
export const FALLBACK_CHANNEL: YouTubeChannelStats = {
  id: MONASTERY_CHANNEL_ID,
  title: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  description: "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ සදහම් දේශනා, සූත්‍ර ධර්ම විවරණ සහ සතිපට්ඨාන විදර්ශනා භාවනා අනුශාසනා එකතුව.",
  customUrl: "@nirmalabududahama",
  subscriberCount: "7.84K+",
  videoCount: "365",
  viewCount: "1,792,100+",
  avatarUrl: "https://yt3.ggpht.com/sybZbIB3cMOjj8P-FoEw0WSkpVfxuYkBgUItqC1IpViSmA91i6oHn9ZCwRbVVr6kIha5olo0Sg=s800-c-k-c0x00ffffff-no-rj",
  bannerUrl: "https://yt3.googleusercontent.com/f1bpZqDoW99R0qbtnm-TnaEqfSfMtNqXnwqd0Z_KlToLt5xB0mueG3UrmpCx_0li_d8dUM_jdeQ",
};

export const FALLBACK_VIDEOS: YouTubeVideoItem[] = [
  {
    id: "fb_1",
    videoId: "IlVUnoUSb8E",
    title: "ආයතන අපේ ලඟ තියෙන එකක් නෙවෙයි | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description: "සම්බුද්ධ දේශනාවට අනුව ආයතන පිළිබඳ ගැඹුරු ධර්ම විවරණය සහ විදර්ශනා නුවණින් දකින අයුරු.",
    publishedAt: "2026-09-12T00:00:12Z",
    thumbnailUrl: "https://i.ytimg.com/vi/IlVUnoUSb8E/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
  {
    id: "fb_2",
    videoId: "xzqJpY-0ltw",
    title: "ඇහැ හටගන්නේ නාමරූප නිසා | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description: "පටිච්චසමුප්පාද ධර්මතාවය හා නාමරූප ප්‍රත්‍යයෙන් ඇස ප්‍රමුඛ ආයතන ක්‍රියාකාරීත්වය පිළිබඳ විවරණය.",
    publishedAt: "2026-09-12T00:00:06Z",
    thumbnailUrl: "https://i.ytimg.com/vi/xzqJpY-0ltw/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
  {
    id: "fb_3",
    videoId: "nY_3-vBkn6Q",
    title: "ආනාපාන සතිය ආයතන හයට හමු නොවන නියා ය | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description: "ආනාපානසති භාවනා පුහුණුව නිවැරදිව ප්‍රගුණ කිරීම සහ චිත්ත ඒකාග්‍රතාවය ගොඩනැගීම.",
    publishedAt: "2026-09-04T23:30:38Z",
    thumbnailUrl: "https://i.ytimg.com/vi/nY_3-vBkn6Q/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
  {
    id: "fb_4",
    videoId: "G5NHQFJYECI",
    title: "අභිනිෂ්ක්රමණය හා නයිස්ක්‍රම්‍ය | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description: "සසර දුකින් මිදීම උදෙසා නෙක්ඛම්ම චිත්තය හා ආරණ්‍යක ජීවිතයේ අගය පිළිබඳ දේශනාව.",
    publishedAt: "2026-08-27T08:30:06Z",
    thumbnailUrl: "https://i.ytimg.com/vi/G5NHQFJYECI/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
  {
    id: "fb_5",
    videoId: "n5_Pj434OWA",
    title: "තුන් කාලයට අයිතිනැති සංකාර | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description: "අනිත්‍ය, දුක්ඛ, අනත්ත ත්‍රිලක්ෂණය ප්‍රත්‍යක්ෂ කරගැනීමේ මඟ පෙන්වීම.",
    publishedAt: "2026-08-27T03:30:06Z",
    thumbnailUrl: "https://i.ytimg.com/vi/n5_Pj434OWA/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
  {
    id: "fb_6",
    videoId: "UY8xPDlm0_A",
    title: "සතිපට්ඨාන සූත්‍රය ඇසුරින් සිත දමනය කරගන්නා අයුරු | සදහම් දේශනා",
    description: "කායානුපස්සනා, වේදනානුපස්සනා, චිත්තානුපස්සනා සහ ධම්මානුපස්සනා ප්‍රායෝගික පුහුණුව.",
    publishedAt: "2026-08-15T12:00:00Z",
    thumbnailUrl: "https://i.ytimg.com/vi/UY8xPDlm0_A/hqdefault.jpg",
    channelTitle: "Nirmala Budu Dahama - නිර්මල බුදු දහම",
  },
];

export async function fetchChannelDetails(): Promise<YouTubeChannelStats> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${MONASTERY_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return FALLBACK_CHANNEL;
    }

    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return FALLBACK_CHANNEL;

    const subCount = Number(item.statistics?.subscriberCount || 0);
    const formattedSubs = subCount > 1000 ? `${(subCount / 1000).toFixed(1)}K` : `${subCount}`;

    return {
      id: item.id,
      title: item.snippet?.title || FALLBACK_CHANNEL.title,
      description: item.snippet?.description || FALLBACK_CHANNEL.description,
      customUrl: item.snippet?.customUrl || FALLBACK_CHANNEL.customUrl,
      subscriberCount: formattedSubs,
      videoCount: item.statistics?.videoCount || FALLBACK_CHANNEL.videoCount,
      viewCount: Number(item.statistics?.viewCount || 0).toLocaleString(),
      avatarUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || FALLBACK_CHANNEL.avatarUrl,
      bannerUrl: item.brandingSettings?.image?.bannerExternalUrl || FALLBACK_CHANNEL.bannerUrl,
    };
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return FALLBACK_CHANNEL;
  }
}

export async function fetchLatestVideos(limit = 24): Promise<YouTubeVideoItem[]> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${MONASTERY_UPLOADS_PLAYLIST_ID}&maxResults=${limit}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return FALLBACK_VIDEOS;
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return FALLBACK_VIDEOS;
    }

    return data.items.map((item: any) => ({
      id: item.id,
      videoId: item.snippet?.resourceId?.videoId || item.contentDetails?.videoId,
      title: item.snippet?.title || "ධර්ම දේශනාව",
      description: item.snippet?.description || "",
      publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
      thumbnailUrl:
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        `https://i.ytimg.com/vi/${item.snippet?.resourceId?.videoId}/hqdefault.jpg`,
      channelTitle: item.snippet?.channelTitle || "Nirmala Budu Dahama",
    }));
  } catch (error) {
    console.error("Error fetching latest videos:", error);
    return FALLBACK_VIDEOS;
  }
}
