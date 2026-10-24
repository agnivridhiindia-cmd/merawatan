"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UploadPhotoModal from "@/components/UploadPhotoModal";

interface GalleryItem {
  id: string;
  caption: string;
  category: string;
  src: string;
  batchDate: string;
  location: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    caption: "Youth Defence Uniform Cadets Certificate & Medal Honor Ceremony (Matru Bhumi Seva Samman)",
    category: "Army Training",
    src: "/images/real-army-certificates.jpg",
    batchDate: "HONORS 2026 // MATRU BHUMI SEVA SAMMAN",
    location: "RDA Betul Training & Honor Center",
  },
  {
    id: "g2",
    caption: "Women Cadets & Athletes National Flag Tricolor Honor Ceremony",
    category: "Women Empowerment",
    src: "/images/real-women-tricolor.jpg",
    batchDate: "HONORS 2026 // EMPOWERMENT",
    location: "Chhatrapati Shivaji Maharaj Jayanti Grounds, Betul",
  },
  {
    id: "g3",
    caption: "Athletic Sports Cadets Group Conditioning & Pavilion Honors Event",
    category: "Sports & Fitness",
    src: "/images/real-sports-pavilion.jpg",
    batchDate: "TRIALS 2026 // ATHLETIC CONDITIONING",
    location: "RDA Outdoor Stadium & Pavilion Grounds, Betul",
  },
  {
    id: "g4",
    caption: "Army Cadets Track Briefing & Physical Obstacle Drill Training",
    category: "Army Training",
    src: "/images/real-army-obstacle.jpg",
    batchDate: "BATCH 2026 // DRILL 01 BRIEFING",
    location: "RDA Track & Field Drill Ground, Betul",
  },
  {
    id: "g5",
    caption: "Youth Tree Plantation Drive & Environmental Awareness Activity",
    category: "Women Empowerment",
    src: "/images/real-plantation.jpg",
    batchDate: "DRIVE 2026 // TREE PLANTATION",
    location: "District Sweep Complex Grounds, Betul",
  },
  {
    id: "g6",
    caption: "Fauji Cup BPL Cricket Tournament Man of the Match & Trophy Presentation",
    category: "Sports & Fitness",
    src: "/images/real-fauji-cup.jpg",
    batchDate: "TOURNAMENT 2026 // FAUJI CUP BPL",
    location: "Betul Premier League Sports Arena",
  },
];

export default function GallerySection() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryItem[]>([]);

  // Fetch newly uploaded photos from API
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && Array.isArray(data.items)) {
          setUploadedPhotos(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const allItems = [...uploadedPhotos, ...GALLERY_ITEMS];

  return (
    <section id="gallery" className="py-20 bg-transparent border-b-2 border-[#163B66]/15 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#163B66] font-display">
              MOMENTS FROM THE GROUND
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#64748B] max-w-md mt-3 md:mt-0 uppercase font-semibold">
            Visual records of morning drills, vocational workshops, and athletic selection camps.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-white rounded-3xl overflow-hidden border border-[#163B66]/15 shadow-md group cursor-pointer hover:border-[#D97706] hover:shadow-2xl transition-all relative flex flex-col justify-between card-hover-3d shimmer-card"
            >
              {/* Image Thumbnail with Overlay */}
              <div className="relative h-60 w-full overflow-hidden bg-[#071526] img-zoom-wrapper">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover object-center filter contrast-105"
                  unoptimized={item.src.startsWith("/uploads/") || item.src.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071526]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Card Footer Details */}
              <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#D97706] font-bold mb-1.5 flex items-center justify-between">
                    <span>{item.batchDate || "GROUND DRILL"}</span>
                    <span className="text-[#10B981] text-[9px] font-bold uppercase bg-[#10B981]/15 px-2 py-0.5 rounded-full">GROUND PHOTO</span>
                  </div>
                  <h3 className="text-sm font-bold uppercase font-mono text-[#0F172A] group-hover:text-[#163B66] transition-colors leading-snug">
                    {item.caption}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-[#64748B] pt-3 border-t border-gray-100">
                  <span>📍 {item.location || "Betul Ground"}</span>
                  <span className="text-[#D97706] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>[ PREVIEW ]</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Archive & Upload Photo Buttons */}
        <div className="mt-12 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#163B66] text-white font-mono text-xs font-bold tracking-widest uppercase hover:bg-[#0D223A] transition-all rounded-xl shadow-lg border-b-4 border-[#D97706] group card-hover-3d w-full sm:w-auto"
            >
              <span>EXPLORE FULL NGO PHOTO ARCHIVE</span>
              <span className="text-[#FF9933] group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-mono text-xs font-bold tracking-widest uppercase hover:from-[#B45309] hover:to-[#92400E] transition-all rounded-xl shadow-lg border-b-4 border-[#10B981] group card-hover-3d cursor-pointer w-full sm:w-auto"
            >
              <span>📸 UPLOAD PHOTO</span>
              <span className="text-[#10B981] text-[10px] bg-black/35 px-2 py-0.5 rounded-full font-mono font-bold">
                [OFFICIAL DESK]
              </span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-[#64748B] mt-2.5 uppercase font-semibold">
            • View all ground drill photos, tree plantation drives & trophy award presentations
          </p>
        </div>

      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-[#071526]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0D223A] max-w-4xl w-full border-2 border-[#D97706] rounded-3xl shadow-2xl overflow-hidden relative animate-fadeInSlideUp"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#D97706] text-white flex items-center justify-center font-mono font-bold text-lg hover:bg-[#B45309] hover:scale-110 transition-all rounded-xl shadow-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Expanded Photo */}
            <div className="relative h-[60vh] min-h-[320px] w-full bg-[#071526] img-zoom-wrapper">
              <Image
                src={activeItem.src}
                alt={activeItem.caption}
                fill
                className="object-contain object-center"
                unoptimized={activeItem.src.startsWith("/uploads/") || activeItem.src.startsWith("http")}
              />
            </div>

            {/* Modal Photo Details */}
            <div className="p-6 bg-[#163B66] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-4 border-[#D97706]">
              <div>
                <div className="font-mono text-xs text-[#FF9933] font-bold uppercase tracking-wider mb-1">
                  • {activeItem.batchDate}
                </div>
                <h3 className="text-xl font-bold uppercase font-display text-white">
                  {activeItem.caption}
                </h3>
                <p className="text-xs font-mono text-[#E2E8F0] mt-1">📍 {activeItem.location}</p>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="px-6 py-3 bg-[#D97706] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#B45309] hover:scale-105 transition-all rounded-xl border-b-4 border-[#B45309] shrink-0 shadow-md cursor-pointer"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPhotoUploaded={(newPhoto) => {
          setUploadedPhotos((prev) => [newPhoto, ...prev]);
        }}
      />
    </section>
  );
}
