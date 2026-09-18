import { NextResponse } from "next/server";
import { getAdminPin, updateAdminPin } from "@/lib/firestoreService";

// GET - check if PIN service is alive
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Admin PIN security service is active",
  });
}

// POST - verify PIN against Firestore database
export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "PIN අංකය ඇතුළත් කර නොමැත." },
        { status: 400 }
      );
    }

    // Retrieve active PIN dynamically from Google Firestore database
    const expectedPin = await getAdminPin();

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "සත්‍යාපනය කිරීමේදී දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}

// PUT - change PIN from admin panel (requires existing PIN)
export async function PUT(request: Request) {
  try {
    const { currentPin, newPin } = await request.json();

    if (!currentPin || typeof currentPin !== "string") {
      return NextResponse.json(
        { success: false, error: "වත්මන් PIN අංකය අවශ්‍ය වේ." },
        { status: 400 }
      );
    }

    const expectedPin = await getAdminPin();

    if (currentPin.trim() !== expectedPin.trim()) {
      return NextResponse.json(
        { success: false, error: "වත්මන් PIN අංකය වැරදියි." },
        { status: 401 }
      );
    }

    if (!newPin || typeof newPin !== "string" || newPin.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "නව PIN අංකය අවම වශයෙන් අංක/අකුරු 4ක් විය යුතුය." },
        { status: 400 }
      );
    }

    await updateAdminPin(newPin.trim());

    return NextResponse.json({
      success: true,
      message: "නව PIN අංකය Firestore දත්ත ගබඩාවෙහි සාර්ථකව සුරැකිණි.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "PIN අංකය වෙනස් කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}
