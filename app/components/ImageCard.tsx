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
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-100">
      <div className="relative w-full h-64">
        {!imageError ? (
          <Image
            src={photo.src.medium}
            alt={photo.alt || "Beautiful photo"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              console.error("Image load error:", photo.src.medium);
              setImageError(true);
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", photo.id);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm">Failed to load image</p>
          </div>
        )}
      </div>

      {/* Hover overlay with buttons */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end z-10">
        <div className="p-4 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <button
              onClick={handleDownload}
              disabled={downloadLoading}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-md"
              aria-label="Download image"
            >
              <FaDownload className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              disabled={shareLoading}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-md"
              aria-label="Share image"
            >
              <FaShare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Photographer credit */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <p className="text-white text-xs truncate">
          Photo by {photo.photographer}
        </p>
      </div>
    </div>
  );
}
