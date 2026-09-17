import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    const expectedPin = process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "7490";

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "PIN අංකය ඇතුළත් කර නොමැත." },
        { status: 400 }
      );
    }

    if (pin.trim() === expectedPin.trim()) {
      return NextResponse.json({
        success: true,
        message: "පරිපාලක පිවිසුම සාර්ථකයි.",
      });
    }

    return NextResponse.json(
      { success: false, error: "ඇතුළත් කළ PIN අංකය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "සත්‍යාපනය කිරීමේදී දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}
