import { Metadata } from "next";
import PublicationsClient from "@/components/PublicationsClient";

export const metadata: Metadata = {
  title: "දහම් පුස්තකාලය & PDF බාගත කිරීම් | කපුගම සුමනවංශ නා හිමි සෙනසුන",
  description:
    "පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ සදහම් ග්‍රන්ථ, සූත්‍ර විවරණ, පිරිත් පොත් සහ භාවනා අත්පොත් Google Drive හරහා නොමිලේ බාගත කරගන්න.",
  keywords: [
    "දහම් පොත්",
    "පිරිත් පොත pdf",
    "භාවනා උපදෙස් pdf",
    "සතිපට්ඨාන සූත්‍රය pdf",
    "දික්කුඹුරේ සුභූති හිමි පොත්",
    "බෙලිඅත්ත ආරණ්‍ය සේනාසනය",
    "Buddhist books Sri Lanka pdf",
    "Google Drive Dhamma PDF",
  ],
};

export default function PublicationsPage() {
  return <PublicationsClient />;
}
