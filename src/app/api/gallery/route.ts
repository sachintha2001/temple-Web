import { NextResponse } from "next/server";
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
} from "@/lib/firestoreService";
import { GalleryItem } from "@/lib/gallery";

// GET - fetch all gallery items from Firestore
export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST - add new gallery item to Firestore
export async function POST(request: Request) {
  try {
    const newItem: GalleryItem = await request.json();

    if (!newItem || !newItem.id || !newItem.imageUrl) {
      return NextResponse.json(
        { success: false, error: "වලංගු ඡායාරූප තොරතුරු ලබා දී නොමැත." },
        { status: 400 }
      );
    }

    const updated = await saveGalleryItem(newItem);

    return NextResponse.json({
      success: true,
      item: newItem,
      items: updated,
      message: "ඡායාරූපය සාර්ථකව Firestore දත්ත ගබඩාවෙහි සුරැකිණි.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "ඡායාරූපය සුරැකීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}

// PUT - update existing gallery item
export async function PUT(request: Request) {
  try {
    const updatedItem: GalleryItem = await request.json();

    if (!updatedItem || !updatedItem.id) {
      return NextResponse.json(
        { success: false, error: "වලංගු ඡායාරූප ID එකක් නොමැත." },
        { status: 400 }
      );
    }

    const updated = await saveGalleryItem(updatedItem);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      items: updated,
      message: "ඡායාරූප තොරතුරු සාර්ථකව යාවත්කාලීන කෙරිණි.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "යාවත්කාලීන කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}

// DELETE - remove gallery item
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

    const updated = await deleteGalleryItem(id);

    return NextResponse.json({
      success: true,
      items: updated,
      message: "ඡායාරූපය සාර්ථකව ඉවත් කරන ලදී.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "ඉවත් කිරීම අසාර්ථක විය." },
      { status: 500 }
    );
  }
}
