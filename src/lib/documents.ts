export interface DocumentItem {
  id: string;
  title: string;
  englishTitle?: string;
  category: string;
  author: string;
  description: string;
  fileSize?: string;
  pageCount?: number;
  publishedDate: string;
  googleDriveUrl?: string;
  googleDriveFileId?: string;
  downloadUrl: string;
  previewUrl?: string;
  sourceType: "google_drive" | "direct_upload";
  downloadsCount?: number;
}

export const MONASTERY_DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/11to9KJRCN-2Xkl3Y22WHtaPTbwriY7jB?usp=sharing";

export const DOCUMENT_CATEGORIES = [
  "සියලු ලේඛන (All)",
  "සූත්‍ර ධර්ම & අටුවා",
  "පිරිත් & ගාථා පොත්",
  "භාවනා අත්පොත්",
  "පොහෝ දින පත්‍රිකා",
  "සේනාසන වාරික සඟරා",
];

/**
 * Extracts Google Drive File ID from various shareable URL formats
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/<id>/
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  // Pattern 2: id=<id>
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // Pattern 3: /folders/<id>
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];

  // Pattern 4: direct ID if 25+ alphanumeric chars
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Builds direct download URL for Google Drive file
 */
export function buildGoogleDriveDownloadUrl(fileIdOrUrl: string): string {
  const fileId = extractGoogleDriveId(fileIdOrUrl) || fileIdOrUrl;
  if (!fileId || fileId.startsWith("http") || fileId.startsWith("/")) {
    return fileIdOrUrl;
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Builds embedded preview URL for Google Drive file
 */
export function buildGoogleDrivePreviewUrl(fileIdOrUrl: string): string {
  const fileId = extractGoogleDriveId(fileIdOrUrl) || fileIdOrUrl;
  if (!fileId || fileId.startsWith("http") || fileId.startsWith("/")) {
    return fileIdOrUrl;
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Clean initial state: No mock or fake PDFs. Ready for real user uploads.
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
