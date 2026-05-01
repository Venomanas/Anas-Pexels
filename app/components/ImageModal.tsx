"use client";
import { PexelsPhoto } from "@/app/types";
import { downloadImage } from "@/app/utils/actions";
import { useEffect, useCallback, useState } from "react";
import {
  FaDownload,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaExpand,
  FaUser,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import Image from "next/image";

interface ImageModalProps {
  photo: PexelsPhoto;
  photos: PexelsPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

type DownloadSize = "original" | "large2x" | "large" | "medium" | "landscape";

const DOWNLOAD_OPTIONS: { key: DownloadSize; label: string; desc: string }[] = [
  { key: "original", label: "Original", desc: "Full resolution" },
  { key: "large2x", label: "Large 2x", desc: "Retina / 4K" },
  { key: "large", label: "Large", desc: "Desktop / Laptop" },
  { key: "landscape", label: "Landscape", desc: "Laptop screen (16:9)" },
  { key: "medium", label: "Medium", desc: "Tablet / Blog" },
];

export default function ImageModal({
  photo,
  photos,
  currentIndex,
  onClose,
  onNavigate,
  isFavorite,
  onToggleFavorite,
}: ImageModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    },
    [onClose, onNavigate, currentIndex, hasPrev, hasNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Reset image loaded when photo changes
  useEffect(() => {
    setImageLoaded(false);
    setShowSizes(false);
  }, [photo.id]);

  const handleDownload = async (size: DownloadSize) => {
    setDownloading(size);
    try {
      await downloadImage(photo.src[size], `pexels-${photo.id}-${size}.jpg`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "var(--overlay-bg)" }}
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
        aria-label="Close"
      >
        <FaXmark className="w-5 h-5" />
      </button>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous photo"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
          aria-label="Next photo"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row max-w-6xl max-h-[90vh] w-full mx-4 gap-4 animate-fade-in-up">
        {/* Image */}
        <div className="relative flex-1 flex items-center justify-center min-h-0">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={photo.src.large2x}
            alt={photo.alt || "Photo from Pexels"}
            width={photo.width}
            height={photo.height}
            className={`max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>

        {/* Info panel */}
        <div className="lg:w-80 bg-white/10 backdrop-blur-xl rounded-xl p-5 text-white flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          {/* Photographer */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: photo.avg_color || "#3b82f6" }}
            >
              <FaUser className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">{photo.photographer}</p>
              <a
                href={photo.photographer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
              >
                View profile{" "}
                <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Photo details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/50 mb-1">Dimensions</p>
              <p className="font-medium">
                {photo.width} × {photo.height}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/50 mb-1">Avg Color</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: photo.avg_color }}
                />
                <span className="font-medium">{photo.avg_color}</span>
              </div>
            </div>
          </div>

          {/* Alt text */}
          {photo.alt && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/50 text-xs mb-1">Description</p>
              <p className="text-sm leading-relaxed">{photo.alt}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onToggleFavorite}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isFavorite
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <FaHeart className={`w-4 h-4 ${isFavorite ? "scale-110" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </button>
            <a
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-all"
            >
              <FaExpand className="w-4 h-4" />
              Pexels
            </a>
          </div>

          {/* Download section */}
          <div>
            <button
              onClick={() => setShowSizes(!showSizes)}
              className="w-full py-3 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <FaDownload className="w-4 h-4" />
              Download
            </button>

            {showSizes && (
              <div className="mt-2 space-y-1 animate-fade-in-up">
                {DOWNLOAD_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleDownload(opt.key)}
                    disabled={downloading === opt.key}
                    className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-left text-sm flex items-center justify-between transition-all disabled:opacity-50"
                  >
                    <div>
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-white/50 ml-2 text-xs">
                        {opt.desc}
                      </span>
                    </div>
                    {downloading === opt.key ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaDownload className="w-3 h-3 text-white/50" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Photo counter */}
          <p className="text-center text-xs text-white/40">
            {currentIndex + 1} of {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
