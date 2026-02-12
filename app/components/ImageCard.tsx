"use client";
import { PexelsPhoto } from "@/app/types";
import { downloadImage, shareImage } from "@/app/utils/actions";
import { useState } from "react";
import { FaDownload, FaShare, FaHeart } from "react-icons/fa6";
import Image from "next/image";

interface ImageCardProps {
  photo: PexelsPhoto;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ImageCard({
  photo,
  onClick,
  isFavorite,
  onToggleFavorite,
}: ImageCardProps) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadLoading(true);
    try {
      await downloadImage(photo.src.large2x, `pexels-${photo.id}.jpg`);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareLoading(true);
    try {
      await shareImage(photo.src.large2x);
    } finally {
      setShareLoading(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      className="masonry-item"
      style={{ animationDelay: `${Math.random() * 0.3}s` }}
    >
      <div
        className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
        style={{ backgroundColor: "var(--card-bg)" }}
        onClick={onClick}
      >
        {/* Image Container — natural aspect ratio */}
        <div
          className="relative w-full"
          style={{ backgroundColor: photo.avg_color || "#e2e8f0" }}
        >
          {!imageError ? (
            <Image
              src={photo.src.large}
              alt={photo.alt || "Beautiful photo from Pexels"}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center py-20"
              style={{ color: "var(--muted)" }}
            >
              <p className="text-sm mb-1">Failed to load</p>
              <p className="text-xs opacity-60">ID: {photo.id}</p>
            </div>
          )}
        </div>

        {/* Favorite button — always visible on mobile, hover on desktop */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
            isFavorite
              ? "bg-red-500 text-white scale-100 opacity-100"
              : "bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 backdrop-blur-sm"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isFavorite ? "scale-110" : ""
            }`}
          />
        </button>

        {/* Hover overlay with buttons */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* Photographer credit */}
          <p className="text-white text-sm font-medium mb-3 drop-shadow-lg">
            📸 {photo.photographer}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={downloadLoading}
              className="flex-1 bg-white/90 hover:bg-white text-gray-900 py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-sm"
              aria-label="Download image"
            >
              <FaDownload className="w-3.5 h-3.5" />
              {downloadLoading ? "..." : "Download"}
            </button>
            <button
              onClick={handleShare}
              disabled={shareLoading}
              className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Share image"
            >
              <FaShare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
