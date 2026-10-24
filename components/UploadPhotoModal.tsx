"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoUploaded?: (newPhoto: any) => void;
}

export default function UploadPhotoModal({
  isOpen,
  onClose,
  onPhotoUploaded,
}: UploadPhotoModalProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Army Training");
  const [location, setLocation] = useState("RDA Training Grounds, Betul");
  const [batchDate, setBatchDate] = useState(`BATCH ${new Date().getFullYear()} // GROUND DRILL`);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Auth Verification
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/gallery/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect credentials. Access denied.");
        setIsVerifying(false);
        return;
      }

      setAuthToken(data.token);
      setIsAuthenticated(true);
      setAuthError("");
    } catch {
      setAuthError("Network error while verifying credentials. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  // Handle File Selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError("File size exceeds 12MB limit. Please choose a smaller image.");
      return;
    }

    setUploadError("");
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  // Handle Photo Upload Submit
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select an image file from your device first.");
      return;
    }
    if (!caption.trim()) {
      setUploadError("Please enter a photo caption / title.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("token", authToken);
      formData.append("file", selectedFile);
      formData.append("caption", caption.trim());
      formData.append("category", category);
      formData.append("location", location.trim());
      formData.append("batchDate", batchDate.trim());
      formData.append("tag", category.toUpperCase());

      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadError(data.error || "Failed to upload photo. Please try again.");
        setIsUploading(false);
        return;
      }

      setUploadSuccess(data.item);
      if (onPhotoUploaded) {
        onPhotoUploaded(data.item);
      }
    } catch {
      setUploadError("Network error during photo upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleResetUpload() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setUploadError("");
    setUploadSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAuthToken("");
    setEmail("");
    setPassword("");
    handleResetUpload();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#071526]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0D223A] border-2 border-[#D97706] rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative my-auto animate-fadeInSlideUp"
      >
        {/* Top Header Bar */}
        <div className="bg-[#071526] px-5 sm:px-8 py-4 sm:py-5 border-b border-[#1E3A5F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#FF9933] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                  OFFICIAL EXECUTIVE DESK
                </span>
                <span className="bg-[#10B981]/20 text-[#10B981] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                  PORTAL 2026
                </span>
              </div>
              <h2 className="text-white font-mono text-base sm:text-lg font-bold tracking-wide">
                {isAuthenticated ? "Upload Photo from Device" : "Administrator Security Verification"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8">
          {!isAuthenticated ? (
            /* ============================================================ */
            /* STAGE 1: AUTHENTICATION CHECK                                */
            /* ============================================================ */
            <div>
              <div className="bg-[#163B66]/40 border border-[#1E3A5F] rounded-2xl p-4 sm:p-5 mb-6 text-center">
                <div className="w-14 h-14 bg-[#D97706]/20 border border-[#D97706]/50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                  🔒
                </div>
                <h3 className="text-white font-mono font-bold text-sm sm:text-base uppercase tracking-wider mb-1">
                  NGO President & Head Coach Access
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm font-sans leading-relaxed max-w-md mx-auto">
                  Only authorized leadership of <b>Mera Watan Welfare Foundation Betul</b> may publish official cadet
                  drills, awards, and activity photos.
                </p>
              </div>

              {authError && (
                <div className="mb-5 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs sm:text-sm font-mono flex items-start gap-3 animate-shake">
                  <span className="text-red-400 font-bold text-base">⚠️</span>
                  <div>
                    <p className="font-bold uppercase text-red-300">Access Denied</p>
                    <p className="mt-0.5 text-xs text-red-200/90">{authError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                    Authorized Email Address <span className="text-[#FF9933]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter authorized administrator email"
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-sm placeholder:text-gray-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                    Authorized Password <span className="text-[#FF9933]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter authorized password"
                      className="w-full px-4 py-3 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-sm placeholder:text-gray-600 outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono uppercase px-2 py-1 rounded"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>VERIFYING CREDENTIALS...</span>
                      </>
                    ) : (
                      <>
                        <span>VERIFY & UNLOCK UPLOAD DESK</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs uppercase font-semibold rounded-xl border border-white/10 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          ) : uploadSuccess ? (
            /* ============================================================ */
            /* UPLOAD SUCCESS STATE                                         */
            /* ============================================================ */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#10B981]/20 border border-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                ✅
              </div>
              <span className="text-[#10B981] font-mono text-xs font-bold uppercase tracking-widest bg-[#10B981]/15 px-3 py-1 rounded-full">
                PHOTO PUBLISHED SUCCESSFULLY
              </span>
              <h3 className="text-white font-mono text-lg sm:text-xl font-bold mt-3 mb-2">
                Added to Mera Watan Photo Archive!
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
                Your photograph has been published directly into the official archive and is now visible on both the
                Home page and Full Gallery page.
              </p>

              {/* Uploaded Card Preview */}
              <div className="max-w-md mx-auto bg-[#071526] border border-[#1E3A5F] rounded-2xl p-3 text-left mb-6 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden relative bg-black shrink-0 border border-[#D97706]/40">
                  <Image
                    src={uploadSuccess.src}
                    alt={uploadSuccess.caption}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[#FF9933] font-mono text-[10px] font-bold uppercase">
                    {uploadSuccess.category}
                  </span>
                  <p className="text-white font-mono font-bold text-xs truncate mt-0.5">
                    {uploadSuccess.caption}
                  </p>
                  <p className="text-gray-400 font-mono text-[10px] mt-1">📍 {uploadSuccess.location}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleResetUpload}
                  className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  UPLOAD ANOTHER PHOTO
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-[#163B66] hover:bg-[#0D223A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-[#1E3A5F]"
                >
                  VIEW GALLERY NOW
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* STAGE 2: AUTHORIZED PHOTO UPLOAD WORKSPACE                   */
            /* ============================================================ */
            <div>
              {/* Authorized Header Pill */}
              <div className="bg-[#10B981]/10 border border-[#10B981]/40 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-white font-mono text-xs font-bold">
                    LOGGED IN: <span className="text-[#10B981]">DFR Ashok Raghuvanshi (Retd.)</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-mono text-gray-400 hover:text-red-300 underline cursor-pointer uppercase"
                >
                  [ LOCK / LOGOUT ]
                </button>
              </div>

              {uploadError && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                {/* File Picker & Preview Box */}
                <div>
                  <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                    Select Photo from Device <span className="text-[#FF9933]">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    id="device-photo-picker"
                  />

                  {!previewUrl ? (
                    <label
                      htmlFor="device-photo-picker"
                      className="border-2 border-dashed border-[#1E3A5F] hover:border-[#D97706] bg-[#071526]/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#071526] group"
                    >
                      <div className="w-14 h-14 bg-[#163B66]/50 rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                        📸
                      </div>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all">
                        CHOOSE PHOTO FROM DEVICE
                      </span>
                      <p className="text-gray-400 font-mono text-[11px] mt-2.5">
                        Supports JPG, PNG, WebP up to 12MB
                      </p>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-[#D97706] bg-black">
                      <div className="relative w-full h-56 sm:h-64">
                        <Image
                          src={previewUrl}
                          alt="Device preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="bg-[#071526]/90 backdrop-blur-sm p-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-300 truncate max-w-[220px]">
                          📁 {selectedFile?.name}
                        </span>
                        <label
                          htmlFor="device-photo-picker"
                          className="text-[#FF9933] hover:underline cursor-pointer font-bold uppercase"
                        >
                          [ CHANGE PHOTO ]
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Caption */}
                <div>
                  <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                    Photo Title / Caption <span className="text-[#FF9933]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Cadets Morning 1600m Physical Drill & Sprint Trials"
                    className="w-full px-4 py-2.5 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-xs sm:text-sm placeholder:text-gray-600 outline-none transition-colors"
                  />
                </div>

                {/* Category & Location Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-xs sm:text-sm outline-none transition-colors"
                    >
                      <option value="Army Training">Army Training</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                      <option value="Community Welfare">Community Welfare</option>
                      <option value="Media Coverage">Media Coverage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                      Ground Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. RDA Grounds, Betul"
                      className="w-full px-4 py-2.5 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Batch Tag */}
                <div>
                  <label className="block text-gray-300 font-mono text-xs uppercase tracking-wider font-semibold mb-1.5">
                    Batch / Event Tag
                  </label>
                  <input
                    type="text"
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    placeholder="BATCH 2026 // DRILL"
                    className="w-full px-4 py-2.5 bg-[#071526] border border-[#1E3A5F] focus:border-[#D97706] rounded-xl text-white font-mono text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                {/* Publish Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>PUBLISHING TO ARCHIVE...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀 PUBLISH PHOTO TO GALLERY</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs uppercase font-semibold rounded-xl border border-white/10 transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
