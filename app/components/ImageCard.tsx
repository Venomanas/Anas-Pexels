"use client";
import { PexelsPhoto } from "@/app/types";
import { downloadImage, shareImage } from "@/app/utils/actions";
import { useState } from "react";
import { FaDownload, FaShare } from "react-icons/fa6";
import Image from "next/image";

interface ImageCardProps {
  photo: PexelsPhoto;
}

export default function ImageCard({ photo }: ImageCardProps) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      await downloadImage(photo.src.large2x, `pexels-${photo.id}.jpg`);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleShare = async () => {
    setShareLoading(true);
    try {
      await shareImage(photo.src.large2x);
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
      {/* Image Container */}
      <div className="relative w-full aspect-3/4 bg-gray-100">
        {!imageError ? (
          <Image
            src={photo.src.large}
            alt={photo.alt || "Beautiful photo from Pexels"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              console.error("Image load error:", photo.src.large);
              setImageError(true);
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", photo.id);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm mb-2">Failed to load image</p>
            <p className="text-gray-400 text-xs">ID: {photo.id}</p>
          </div>
        )}
      </div>

      {/* Hover overlay with buttons */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {/* Photographer credit */}
        <p className="text-white text-sm font-medium mb-3 drop-shadow-lg">
          Photo by {photo.photographer}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={downloadLoading}
            className="flex-1 bg-white/90 hover:bg-white text-gray-900 py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            aria-label="Download image"
          >
            <FaDownload className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            aria-label="Share image"
          >
            <FaShare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
