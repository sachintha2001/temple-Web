export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  month: string;
  date: string;
  description?: string;
}

export const CLOUDINARY_CLOUD_NAME = "st3cx6wo";

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "ආරණ්‍ය සේනාසන පරිශ්‍රය හා ශාන්ත වටපිටාව",
    imageUrl: "/images/temple/01.jpg",
    category: "සේනාසන පරිසරය",
    month: "2026 සැප්තැම්බර්",
    date: "2026-09-15",
    description: "සිත සන්සුන් කරවන බෙලිඅත්ත මල්ගහ කොරටුව ආරණ්‍ය සේනාසන පුණ්‍ය භූමිය.",
  },
  {
    id: "g-2",
    title: "පින්බර සෑරදුන් සහ මහා සංඝරත්නය",
    imageUrl: "/images/temple/IMG_1509.jpg",
    category: "පිංකම්",
    month: "2026 අගෝස්තු",
    date: "2026-08-28",
    description: "සැදැහැවතුන්ගේ සහභාගීත්වයෙන් පැවැත්වුණු විශේෂ කඨින පූර්ව පුණ්‍ය මහෝත්සවය.",
  },
  {
    id: "g-3",
    title: "පොහෝ දින උතුම් ශීල සමාදාන පිංකම",
    imageUrl: "/images/temple/IMG_2745.JPG",
    category: "පොහෝ දින",
    month: "2026 අගෝස්තු",
    date: "2026-08-19",
    description: "නිකිණි පුර පසළොස්වක පොහෝ දින උපාසක උපාසිකාවන් සිල් සමාදන් වූ අවස්ථාව.",
  },
  {
    id: "g-4",
    title: "වනගත භාවනා කුටි සහ සක්මන් මංපෙත",
    imageUrl: "/images/temple/209.jpg",
    category: "සේනාසන පරිසරය",
    month: "2026 ජූලි",
    date: "2026-07-21",
    description: "ආරණ්‍යවාසී ස්වාමීන් වහන්සේලා චිත්ත විවේකය හා සමාධිය වඩන වනගත සෙනසුන.",
  },
  {
    id: "g-5",
    title: "දානමය පුණ්‍ය කටයුතු හා සංඝෝපස්ථානය",
    imageUrl: "/images/temple/1.png",
    category: "දානමය පිංකම්",
    month: "2026 ජූලි",
    date: "2026-07-10",
    description: "සැදැහැති දායක දායිකාවන් විසින් පිරිනමන ලද සඟසතු මහා දානමය පින්කම.",
  },
  {
    id: "g-6",
    title: "සේනාසන සංවර්ධන සහ ශ්‍රමදාන කටයුතු",
    imageUrl: "/images/temple/2.png",
    category: "සේනාසන සංවර්ධන",
    month: "2026 ජූනි",
    date: "2026-06-25",
    description: "සෙනසුනේ නව භාවනා කුටි ඉදිකිරීම් කටයුතු සහ පරිසර පවිත්‍රතා පිංකම.",
  },
  {
    id: "g-7",
    title: "පැවිදි බිමට පත්කිරීමේ ශාසනික මහෝත්සවය",
    imageUrl: "/images/temple/3.png",
    category: "පිංකම්",
    month: "2026 මැයි",
    date: "2026-05-18",
    description: "සම්බුදු සසුන බැබළවීම උදෙසා කුලදරුවන් සසුන්ගත කිරීමේ පින්බර මොහොත.",
  },
];
