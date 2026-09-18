import { NextResponse } from "next/server";
import {
  getPoyaEvents,
  updatePoyaEventDana,
  PoyaCalendarEvent,
} from "@/lib/firestoreService";

export type { PoyaCalendarEvent };

export async function GET() {
  try {
    const events = await getPoyaEvents();
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch poya calendar" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, sponsor } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "පෝහෝ දින හැඳුනුම් අංකය (ID) අවශ්‍ය වේ." },
        { status: 400 }
      );
    }

    if (status !== "reserved" && status !== "available") {
      return NextResponse.json(
        { success: false, error: "වලංගු තත්ත්වයක් (Status) තෝරන්න." },
        { status: 400 }
      );
    }

    const updated = await updatePoyaEventDana(id, status, sponsor || "");

    return NextResponse.json({
      success: true,
      message: "පෝදා දායකත්ව තොරතුරු සාර්ථකව යාවත්කාලීන කෙරිණි.",
      events: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "යාවත්කාලීන කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}
