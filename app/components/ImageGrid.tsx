//@/app/components/ImageGrid.tsx
"use client";
import { PexelsPhoto } from "@/app/types";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";
import SkeletonCard from "./SkeletonCard";
import { useState, useCallback } from "react";

interface ImageGridProps {
  photos: PexelsPhoto[];
  loading: boolean;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (photo: PexelsPhoto) => void;
}

export default function ImageGrid({
  photos,
  loading,
  isFavorite,
  onToggleFavorite,
}: ImageGridProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const openModal = useCallback((index: number) => {
    setModalIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setModalIndex(null);
  }, []);

  // Show skeleton cards during initial loading
  if (loading && photos.length === 0) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          No photos to display
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <ImageCard
            key={`${photo.id}-${index}`}
            photo={photo}
            onClick={() => openModal(index)}
            isFavorite={isFavorite(photo.id)}
            onToggleFavorite={() => onToggleFavorite(photo)}
          />
        ))}

        {/* Loading more skeleton cards */}
        {loading &&
          photos.length > 0 &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`loading-${i}`} />
          ))}
      </div>

      {/* Modal */}
      {modalIndex !== null && photos[modalIndex] && (
        <ImageModal
          photo={photos[modalIndex]}
          photos={photos}
          currentIndex={modalIndex}
          onClose={closeModal}
          onNavigate={setModalIndex}
          isFavorite={isFavorite(photos[modalIndex].id)}
          onToggleFavorite={() => onToggleFavorite(photos[modalIndex])}
        />
      )}
    </>
  );
}
