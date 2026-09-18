import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "PDF ගොනුවක් තෝරා නොමැත." },
        { status: 400 }
      );
    }

    // Validate mime type and extension
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: "කරුණාකර වලංගු PDF ගොනුවක් පමණක් තෝරන්න." },
        { status: 400 }
      );
    }

    // Size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "ගොනුවේ ප්‍රමාණය 50MB ට වඩා අඩු විය යුතුය." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save a local copy as backup
    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
    await mkdir(uploadDir, { recursive: true });

    const sanitizedBase = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .toLowerCase();
    const uniqueFilename = `${Date.now()}-${sanitizedBase}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = `${sizeInMb} MB`;
    const localUrl = `/uploads/documents/${uniqueFilename}`;

    // Check if Google Drive Auto-Upload Endpoint is configured
    const driveUploadUrl = process.env.GOOGLE_DRIVE_UPLOAD_URL;

    if (driveUploadUrl) {
      try {
        const driveRes = await fetch(driveUploadUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: "application/pdf",
            base64: buffer.toString("base64"),
          }),
        });

        const driveData = await driveRes.json();

        if (driveData.success && driveData.fileId) {
          const fileId = driveData.fileId;
          const downloadUrl =
            driveData.downloadUrl ||
            `https://drive.google.com/uc?export=download&id=${fileId}`;
          const previewUrl =
            driveData.previewUrl ||
            `https://drive.google.com/file/d/${fileId}/preview`;
          const driveViewUrl =
            driveData.url || `https://drive.google.com/file/d/${fileId}/view`;

          return NextResponse.json({
            success: true,
            isGoogleDrive: true,
            googleDriveFileId: fileId,
            googleDriveUrl: driveViewUrl,
            downloadUrl: downloadUrl,
            previewUrl: previewUrl,
            url: downloadUrl,
            fileName: file.name,
            fileSize: formattedSize,
            message: "PDF ගොනුව Google Drive වෙත සාර්ථකව උඩුගත කෙරිණි.",
          });
        } else {
          console.warn(
            "Google Drive script upload warning:",
            driveData.error || "Unknown response"
          );
        }
      } catch (driveErr) {
        console.warn("Failed to upload to Google Drive script, using local backup:", driveErr);
      }
    }

    // Default fallback to local storage
    return NextResponse.json({
      success: true,
      isGoogleDrive: false,
      url: localUrl,
      downloadUrl: localUrl,
      previewUrl: localUrl,
      fileName: file.name,
      fileSize: formattedSize,
      message: "PDF ගොනුව සාර්ථකව උඩුගත කෙරිණි.",
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "ගොනුව උඩුගත කිරීමේදී දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}
