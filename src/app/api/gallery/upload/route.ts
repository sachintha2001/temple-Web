import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "ඡායාරූප ගොනුවක් තෝරා නොමැත." },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "st3cx6wo";
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "temple_uploads";

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
      console.warn("Cloudinary upload error:", errText);
      let errorMsg = "Cloudinary වෙත ඡායාරූපය උඩුගත කිරීම අසාර්ථක විය.";
      try {
        const parsed = JSON.parse(errText);
        if (parsed?.error?.message) {
          errorMsg = parsed.error.message;
        }
      } catch {}

      return NextResponse.json(
        { success: false, error: errorMsg },
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
