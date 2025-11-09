//@/app/components/Imagegrid.tsx
"use client";
import { PexelsPhoto } from "@/app/types";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  photos: PexelsPhoto[];
  loading: boolean;
}

export default function ImageGrid({ photos }: ImageGridProps) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <ImageCard key={`${photo.id}-${index}`} photo={photo} />
      ))}
    </div>
  );
}
