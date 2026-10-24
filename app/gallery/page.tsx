"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UploadPhotoModal from "@/components/UploadPhotoModal";

interface ArchivePhoto {
  id: string;
  caption: string;
  category: string;
  src: string;
  batchDate: string;
  location: string;
  tag: string;
}

const ALL_PHOTOS: ArchivePhoto[] = [
  {
    id: "p-new-1",
    caption: "1600m Running Drill Competition: Medal & Certificate Distribution to Meritorious Cadets",
    category: "Army Training",
    src: "/images/gallery-1600m-race-medals.jpg",
    batchDate: "HONORS 2026 // 1600M RUNNING DRILLS",
    location: "RDA Police Stadium Ground, Betul",
    tag: "1600M ATHLETIC DRILLS",
  },
  {
    id: "p-new-2",
    caption: "Army Recruitment Rally Special Guidance & Ex-Servicemen Leadership Conclave",
    category: "Army Training",
    src: "/images/gallery-army-rally-guidance.jpg",
    batchDate: "RALLY GUIDANCE // EX-SERVICEMEN LEADERSHIP",
    location: "Police Ground, District Betul",
    tag: "ARMY RALLY CONCLAVE",
  },
  {
    id: "p1",
    caption: "Youth Defence Uniform Cadets Certificate & Medal Honor Ceremony (Matru Bhumi Seva Samman)",
    category: "Army Training",
    src: "/images/real-army-certificates.jpg",
    batchDate: "HONORS 2026 // MATRU BHUMI SEVA SAMMAN",
    location: "RDA Betul Training & Honor Center",
    tag: "AWARDS & SELECTIONS",
  },
  {
    id: "p2",
    caption: "Women Cadets & Athletes National Flag Tricolor Honor Ceremony",
    category: "Women Empowerment",
    src: "/images/real-women-tricolor.jpg",
    batchDate: "HONORS 2026 // EMPOWERMENT",
    location: "Chhatrapati Shivaji Maharaj Jayanti Grounds, Betul",
    tag: "WOMEN EMPOWERMENT",
  },
  {
    id: "p3",
    caption: "Athletic Sports Cadets Group Conditioning & Pavilion Honors Event",
    category: "Sports & Fitness",
    src: "/images/real-sports-pavilion.jpg",
    batchDate: "TRIALS 2026 // ATHLETIC CONDITIONING",
    location: "RDA Outdoor Stadium & Pavilion Grounds, Betul",
    tag: "SPORTS ATHLETICS",
  },
  {
    id: "p4",
    caption: "Army Cadets Track Briefing & Physical Obstacle Drill Training",
    category: "Army Training",
    src: "/images/real-army-obstacle.jpg",
    batchDate: "BATCH 2026 // DRILL 01 BRIEFING",
    location: "RDA Track & Field Drill Ground, Betul",
    tag: "PHYSICAL DRILLS",
  },
  {
    id: "p5",
    caption: "Youth Tree Plantation Drive & Environmental Awareness Activity",
    category: "Environment & Plantation",
    src: "/images/real-plantation.jpg",
    batchDate: "DRIVE 2026 // TREE PLANTATION",
    location: "District Sweep Complex Grounds, Betul",
    tag: "ENVIRONMENT DRIVE",
  },
  {
    id: "p6",
    caption: "Fauji Cup BPL Cricket Tournament Man of the Match & Trophy Presentation",
    category: "Sports & Fitness",
    src: "/images/real-fauji-cup.jpg",
    batchDate: "TOURNAMENT 2026 // FAUJI CUP BPL",
    location: "Betul Premier League Sports Arena",
    tag: "TOURNAMENT AWARDS",
  },
  {
    id: "p7",
    caption: "Annual Foundation Celebration & Cultural Turbans Honor Event",
    category: "Honor & Ceremonies",
    src: "/images/real-turban-event.jpg",
    batchDate: "EVENT 2026 // CELEBRATION",
    location: "Betul Academy Ground",
    tag: "CULTURAL CELEBRATION",
  },
  {
    id: "p8",
    caption: "NGO President Keynote Address at Youth Sports & Physical Fitness Conclave",
    category: "Honor & Ceremonies",
    src: "/images/real-keynote-address.jpg",
    batchDate: "CONCLAVE 2026 // KEYNOTE",
    location: "R.A. Sports Stadium",
    tag: "LEADERSHIP ADDRESS",
  },
  {
    id: "p9",
    caption: "Betul Mirror Press Coverage: Free Nutritious Diet Initiative for 160 Cadets (Mera Watan Welfare Foundation & RDA)",
    category: "Media Coverage",
    src: "/images/news-betul-mirror.jpg",
    batchDate: "PRESS COVERAGE • BETUL MIRROR",
    location: "Police Ground, Betul (M.P.)",
    tag: "MEDIA COVERAGE",
  },
  {
    id: "p10",
    caption: "Dainik Khabarwani Newspaper Feature: Cadet Nutritional Support & Physical Training Campaign",
    category: "Media Coverage",
    src: "/images/news-dainik-khabarwani.jpg",
    batchDate: "PRESS COVERAGE • DAINIK KHABARWANI",
    location: "Betul City, Madhya Pradesh",
    tag: "MEDIA COVERAGE",
  },
];

export default function GalleryArchivePage() {
  const [activeItem, setActiveItem] = useState<ArchivePhoto | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<ArchivePhoto[]>([]);

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

  const allPhotos = [...uploadedPhotos, ...ALL_PHOTOS];

  return (
    <main className="min-h-screen bg-[#F4F6F9] text-[#0F172A] selection:bg-[#D97706] selection:text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Navigation Breadcrumb & Upload Button Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white hover:bg-[#163B66] border border-slate-200 hover:border-[#163B66] shadow-sm hover:shadow-md text-[#1E293B] hover:text-white transition-all duration-300 text-xs font-bold tracking-wider uppercase hover:-translate-y-0.5"
          >
            <span className="w-6 h-6 rounded-full bg-[#163B66]/10 text-[#163B66] group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span>Back to Home Page</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md border-b-2 border-[#10B981] transition-all cursor-pointer hover:scale-105"
          >
            <span>📸 UPLOAD PHOTO</span>
            <span className="text-[#10B981] text-[10px] bg-black/35 px-2 py-0.5 rounded-full font-mono font-bold">
              [OFFICIAL DESK]
            </span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="bg-[#163B66] text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden mb-12 border-b-8 border-[#D97706]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D97706]/20 border border-[#D97706]/50 text-[#FF9933] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping" />
            Complete Photographic Archive
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white mb-3 uppercase">
            Mera Watan Photo & Activity Archive
          </h1>
          <p className="text-gray-200 max-w-3xl text-sm md:text-base leading-relaxed font-sans">
            Explore the complete photographic record of our ground drills, athletic tournaments, tree plantation drives, women empowerment honors, and leadership conclaves.
          </p>

          {/* Quick Counter Badges */}
          <div className="mt-8 flex flex-wrap gap-4 text-xs font-mono">
            <div className="bg-[#0D223A] border border-[#205493] px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-[#FF9933]">📸</span>
              <span className="text-gray-300">Total Ground Photos:</span>
              <span className="text-white font-bold">{allPhotos.length} Records</span>
            </div>
            <div className="bg-[#0D223A] border border-[#205493] px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-[#10B981]">✔</span>
              <span className="text-gray-300">Verification:</span>
              <span className="text-white font-bold">100% Real Ground Events</span>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActiveItem(photo)}
              className="bg-white rounded-3xl overflow-hidden border border-[#163B66]/15 shadow-md group cursor-pointer hover:border-[#D97706] hover:shadow-2xl transition-all relative flex flex-col justify-between card-hover-3d shimmer-card"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-[#071526] img-zoom-wrapper">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  className="object-cover object-center filter contrast-105"
                  unoptimized={photo.src.startsWith("/uploads/") || photo.src.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071526]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Details */}
              <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#D97706] font-bold mb-1.5 flex items-center justify-between">
                    <span>{photo.batchDate}</span>
                    <span className="text-[#10B981] text-[9px] font-bold uppercase bg-[#10B981]/15 px-2 py-0.5 rounded-full">GROUND RECORD</span>
                  </div>
                  <h3 className="text-sm font-bold uppercase font-mono text-[#0F172A] group-hover:text-[#163B66] transition-colors leading-snug">
                    {photo.caption}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-[#64748B] pt-3 border-t border-gray-100">
                  <span>📍 {photo.location}</span>
                  <span className="text-[#D97706] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>[ PREVIEW ]</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-[#071526]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0D223A] max-w-4xl w-full border-2 border-[#D97706] rounded-2xl shadow-2xl overflow-hidden relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#D97706] text-white flex items-center justify-center font-mono font-bold text-lg hover:bg-[#B45309] transition-colors rounded-xl shadow-lg"
            >
              ✕
            </button>

            {/* Expanded Photo */}
            <div className="relative h-[65vh] min-h-[350px] w-full bg-[#071526]">
              <Image
                src={activeItem.src}
                alt={activeItem.caption}
                fill
                className="object-contain object-center"
                unoptimized={activeItem.src.startsWith("/uploads/") || activeItem.src.startsWith("http")}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#163B66] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-[#D97706]">
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
                className="px-6 py-2.5 bg-[#D97706] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#B45309] transition-colors rounded-xl shrink-0 shadow-md"
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
    </main>
  );
}
