import { getDb, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { DocumentItem } from "./documents";
import { GalleryItem, INITIAL_GALLERY_ITEMS } from "./gallery";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface PoyaCalendarEvent {
  id: string;
  name: string;
  date: string;
  poyaName: string;
  status: "reserved" | "available";
  sponsor?: string;
  description: string;
}

// Local file paths for fallback when Firestore is not configured
const DOCUMENTS_JSON_FILE = path.join(process.cwd(), "src", "data", "documents.json");
const POYA_JSON_FILE = path.join(process.cwd(), "src", "data", "annualPoyaCalendar.json");
const SETTINGS_JSON_FILE = path.join(process.cwd(), "src", "data", "settings.json");
const GALLERY_JSON_FILE = path.join(process.cwd(), "src", "data", "gallery.json");



// Helper to read local JSON
async function readLocalJson<T>(filePath: string): Promise<T[]> {
  try {
    const data = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper to write local JSON
async function writeLocalJson<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to local JSON:", err);
  }
}

/* =========================================================
   1. DOCUMENTS (PDF LIBRARY) FIRESTORE OPERATIONS
   ========================================================= */

export async function getDocuments(): Promise<DocumentItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, "documents");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: DocumentItem[] = [];
        snap.forEach((d) => {
          list.push(d.data() as DocumentItem);
        });
        // Sort latest published first
        return list.sort((a, b) => (b.publishedDate || "").localeCompare(a.publishedDate || ""));
      }
    } catch (err) {
      console.warn("Firestore getDocuments error, falling back to local JSON:", err);
    }
  }

  // Fallback to local JSON
  return readLocalJson<DocumentItem>(DOCUMENTS_JSON_FILE);
}

export async function saveDocument(newDoc: DocumentItem): Promise<DocumentItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "documents", newDoc.id);
      await setDoc(docRef, newDoc, { merge: true });
    } catch (err) {
      console.warn("Firestore saveDocument error, saving to local JSON:", err);
    }
  }

  // Keep local JSON in sync
  const current = await readLocalJson<DocumentItem>(DOCUMENTS_JSON_FILE);
  const exists = current.some((d) => d.id === newDoc.id);
  const updated = exists
    ? current.map((d) => (d.id === newDoc.id ? newDoc : d))
    : [newDoc, ...current];
  await writeLocalJson(DOCUMENTS_JSON_FILE, updated);
  return updated;
}

export async function deleteDocument(id: string): Promise<DocumentItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "documents", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore deleteDocument error:", err);
    }
  }

  // Keep local JSON in sync
  const current = await readLocalJson<DocumentItem>(DOCUMENTS_JSON_FILE);
  const updated = current.filter((d) => d.id !== id);
  await writeLocalJson(DOCUMENTS_JSON_FILE, updated);
  return updated;
}

/* =========================================================
   2. ANNUAL POYA CALENDAR FIRESTORE OPERATIONS
   ========================================================= */

export async function getPoyaEvents(): Promise<PoyaCalendarEvent[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, "annual_poya_calendar");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: PoyaCalendarEvent[] = [];
        snap.forEach((d) => {
          list.push(d.data() as PoyaCalendarEvent);
        });
        // Order by ID (p-1 to p-12)
        return list.sort((a, b) => {
          const numA = parseInt(a.id.replace("p-", ""), 10) || 0;
          const numB = parseInt(b.id.replace("p-", ""), 10) || 0;
          return numA - numB;
        });
      } else {
        // First-time seed into Firestore from local JSON
        const seed = await readLocalJson<PoyaCalendarEvent>(POYA_JSON_FILE);
        for (const item of seed) {
          await setDoc(doc(db, "annual_poya_calendar", item.id), item);
        }
        return seed;
      }
    } catch (err) {
      console.warn("Firestore getPoyaEvents error, falling back to local JSON:", err);
    }
  }

  // Fallback to local JSON
  return readLocalJson<PoyaCalendarEvent>(POYA_JSON_FILE);
}

export async function updatePoyaEventDana(
  id: string,
  status: "reserved" | "available",
  sponsor: string
): Promise<PoyaCalendarEvent[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "annual_poya_calendar", id);
      await setDoc(
        docRef,
        {
          status,
          sponsor: status === "reserved" ? sponsor.trim() : "",
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore updatePoyaEventDana error:", err);
    }
  }

  // Keep local JSON in sync
  const current = await readLocalJson<PoyaCalendarEvent>(POYA_JSON_FILE);
  const updated = current.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        status,
        sponsor: status === "reserved" ? sponsor.trim() : "",
      };
    }
    return p;
  });
  await writeLocalJson(POYA_JSON_FILE, updated);
  return updated;
}

/* =========================================================
   3. ADMIN SECURITY PIN FIRESTORE OPERATIONS
   ========================================================= */

export async function getAdminPin(): Promise<string> {
  const defaultPin = process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "7490";
  const db = getDb();

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "settings", "security");
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()?.pin) {
        return String(snap.data().pin).trim();
      } else {
        // Seed default PIN into Firestore so it can be viewed and edited in Firebase Console
        await setDoc(docRef, {
          pin: defaultPin,
          description: "Monastery Website Admin PIN",
          updatedAt: new Date().toISOString(),
        });
        return defaultPin;
      }
    } catch (err) {
      console.warn("Firestore getAdminPin error, falling back to local:", err);
    }
  }

  // Fallback to local settings.json
  try {
    const data = await readFile(SETTINGS_JSON_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (parsed && parsed.pin) return String(parsed.pin).trim();
  } catch {
    // Local settings.json doesn't exist yet
  }

  return defaultPin;
}

export async function updateAdminPin(newPin: string): Promise<boolean> {
  const trimmed = newPin.trim();
  const db = getDb();

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "settings", "security");
      await setDoc(
        docRef,
        {
          pin: trimmed,
          description: "Monastery Website Admin PIN",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore updateAdminPin error:", err);
    }
  }

  // Keep local settings in sync
  try {
    await writeFile(
      SETTINGS_JSON_FILE,
      JSON.stringify({ pin: trimmed, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Could not write to local settings.json:", err);
  }

  return true;
}

/* =========================================================
   4. GALLERY FIRESTORE OPERATIONS
   ========================================================= */

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, "gallery");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: GalleryItem[] = [];
        snap.forEach((d) => {
          list.push(d.data() as GalleryItem);
        });
        // Sort latest date first
        return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      } else {
        // Seed initial gallery items into Firestore
        const seed = await readLocalJson<GalleryItem>(GALLERY_JSON_FILE);
        const toSeed = seed.length > 0 ? seed : INITIAL_GALLERY_ITEMS;
        for (const item of toSeed) {
          await setDoc(doc(db, "gallery", item.id), item);
        }
        return toSeed;
      }
    } catch (err) {
      console.warn("Firestore getGalleryItems error, using fallback:", err);
    }
  }

  // Fallback to local gallery.json or initial constants
  const local = await readLocalJson<GalleryItem>(GALLERY_JSON_FILE);
  return local.length > 0 ? local : INITIAL_GALLERY_ITEMS;
}

export async function saveGalleryItem(item: GalleryItem): Promise<GalleryItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "gallery", item.id);
      await setDoc(docRef, item, { merge: true });
    } catch (err) {
      console.warn("Firestore saveGalleryItem error:", err);
    }
  }

  // Keep local JSON in sync
  const current = await getGalleryItems();
  const exists = current.some((g) => g.id === item.id);
  const updated = exists
    ? current.map((g) => (g.id === item.id ? item : g))
    : [item, ...current];
  await writeLocalJson(GALLERY_JSON_FILE, updated);
  return updated;
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem[]> {
  const db = getDb();
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "gallery", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore deleteGalleryItem error:", err);
    }
  }

  // Keep local JSON in sync
  const current = await getGalleryItems();
  const updated = current.filter((g) => g.id !== id);
  await writeLocalJson(GALLERY_JSON_FILE, updated);
  return updated;
}


