import { NextResponse } from "next/server";
import { DocumentItem } from "@/lib/documents";
import {
  getDocuments,
  saveDocument,
  deleteDocument,
} from "@/lib/firestoreService";

export async function GET() {
  try {
    const docs = await getDocuments();
    return NextResponse.json({ success: true, documents: docs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newDoc: DocumentItem = await request.json();
    if (!newDoc || !newDoc.id || !newDoc.title) {
      return NextResponse.json(
        { success: false, error: "වලංගු ලේඛන තොරතුරු ලබා දී නොමැත." },
        { status: 400 }
      );
    }

    const updated = await saveDocument(newDoc);

    return NextResponse.json({ success: true, document: newDoc, documents: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "ලේඛනය සුරැකීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedDoc: DocumentItem = await request.json();
    if (!updatedDoc || !updatedDoc.id) {
      return NextResponse.json(
        { success: false, error: "වලංගු ලේඛන හැඳුනුම් අංකයක් (ID) නොමැත." },
        { status: 400 }
      );
    }

    const updated = await saveDocument(updatedDoc);

    return NextResponse.json({ success: true, document: updatedDoc, documents: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "යාවත්කාලීන කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID එක ලබා දී නොමැත." },
        { status: 400 }
      );
    }

    const updated = await deleteDocument(id);

    return NextResponse.json({ success: true, documents: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "ඉවත් කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}
