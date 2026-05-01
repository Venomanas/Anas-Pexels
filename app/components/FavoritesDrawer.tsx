"use client";
import { PexelsPhoto } from "@/app/types";
import { downloadImage } from "@/app/utils/actions";
import { FaXmark, FaTrash, FaDownload, FaHeart } from "react-icons/fa6";
import Image from "next/image";
import { useState } from "react";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PexelsPhoto[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
  onPhotoClick: (photo: PexelsPhoto) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onRemove,
  onClearAll,
  onPhotoClick,
}: FavoritesDrawerProps) {
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (const photo of favorites) {
        await downloadImage(photo.src.large2x, `pexels-${photo.id}.jpg`);
        // Small delay to avoid browser throttling
        await new Promise(r => setTimeout(r, 300));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md animate-slide-in-right flex flex-col"
        style={{ backgroundColor: "var(--drawer-bg)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div className="flex items-center gap-3">
            <FaHeart className="w-5 h-5 text-red-500" />
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Favorites
            </h2>
            <span
              className="text-sm px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--tag-hover-bg)",
                color: "var(--muted)",
              }}
            >
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: "var(--tag-hover-bg)" }}
            aria-label="Close favorites"
          >
            <FaXmark
              className="w-4 h-4"
              style={{ color: "var(--foreground)" }}
            />
          </button>
        </div>

        {/* Actions */}
        {favorites.length > 0 && (
          <div
            className="flex gap-2 p-4 border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <FaDownload className="w-3.5 h-3.5" />
              {downloadingAll ? "Downloading..." : "Download All"}
            </button>
            <button
              onClick={onClearAll}
              className="py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--error-bg)",
                color: "var(--error-text)",
              }}
            >
              <FaTrash className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <FaHeart
                className="w-12 h-12 mb-4"
                style={{ color: "var(--muted)" }}
              />
              <p
                className="text-lg font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                No favorites yet
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Click the heart icon on any photo to save it here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favorites.map(photo => (
                <div
                  key={photo.id}
                  className="group relative rounded-lg overflow-hidden cursor-pointer"
                  style={{ backgroundColor: "var(--card-bg)" }}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.src.medium}
                      alt={photo.alt || "Favorite photo"}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => onPhotoClick(photo)}
                    />
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRemove(photo.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Remove from favorites"
                  >
                    <FaXmark className="w-3 h-3" />
                  </button>
                  {/* Photographer */}
                  <p
                    className="text-xs p-2 truncate"
                    style={{ color: "var(--muted)" }}
                  >
                    {photo.photographer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
