import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "st3cx6wo";
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryRes.ok) {
      const errText = await cloudinaryRes.text();
      console.warn("Cloudinary upload failed via server proxy:", errText);
      return NextResponse.json(
        { success: false, error: "Cloudinary upload service notice" },
        { status: 502 }
      );
    }

    const data = await cloudinaryRes.json();

    return NextResponse.json({
      success: true,
      secure_url: data.secure_url,
      public_id: data.public_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
