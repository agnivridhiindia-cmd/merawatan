import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string | null;
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || "Ground Activity Photo";
    const category = (formData.get("category") as string) || "Army Training";
    const location = (formData.get("location") as string) || "RDA Training Ground, Betul";
    const batchDate = (formData.get("batchDate") as string) || `BATCH ${new Date().getFullYear()} // GROUND DRILL`;
    const tag = (formData.get("tag") as string) || category.toUpperCase();

    // Verify token validity
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing authentication token." }, { status: 401 });
    }

    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      if (!decoded.includes("raghuwanshiashok34@gmail.com") || !decoded.includes("AUTHORIZED_ASHOK")) {
        return NextResponse.json({ success: false, error: "Unauthorized: Invalid or expired token." }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ success: false, error: "Unauthorized: Malformed token." }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ success: false, error: "No photo file provided." }, { status: 400 });
    }

    // Generate safe clean filename
    const ext = path.extname(file.name) || ".jpg";
    const sanitizedBase = file.name
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFilename = `gallery_${Date.now()}_${sanitizedBase}${ext}`;

    let publicUrl = "";

    // 1. Check if Vercel Blob is configured (production deployment)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`gallery/${uniqueFilename}`, file, {
          access: "public",
        });
        publicUrl = blob.url;
      } catch (blobErr) {
        console.warn("Vercel Blob upload failed, falling back to local file storage:", blobErr);
      }
    }

    // 2. Local fallback if Blob wasn't used or not configured
    if (!publicUrl) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFilename);
      await fs.promises.writeFile(filePath, buffer);
      publicUrl = `/uploads/${uniqueFilename}`;
    }

    // 3. Persist record to data store
    const record = db.addGalleryItem({
      caption,
      category,
      src: publicUrl,
      location,
      batchDate,
      tag,
    });

    return NextResponse.json({
      success: true,
      message: "Photo uploaded and published successfully to gallery archive!",
      item: record,
    });
  } catch (error) {
    console.error("Gallery photo upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload photo. Please check file format and try again." },
      { status: 500 }
    );
  }
}
