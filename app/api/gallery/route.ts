import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const data = db.read();
    // Return photos that have an image source
    const items = (data.gallery || []).filter((item) => item.src);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
