"use client";

export default function SkeletonCard() {
  // Random height to mimic masonry layout variety
  const heights = ["h-48", "h-56", "h-64", "h-72", "h-80"];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <div className="masonry-item">
      <div
        className={`relative overflow-hidden rounded-xl ${randomHeight}`}
        style={{ backgroundColor: "var(--skeleton-base)" }}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer" />

        {/* Bottom bar skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div
            className="h-3 rounded-full w-3/4"
            style={{ backgroundColor: "var(--skeleton-shine)" }}
          />
          <div className="flex gap-2">
            <div
              className="h-8 rounded-lg flex-1"
              style={{ backgroundColor: "var(--skeleton-shine)" }}
            />
            <div
              className="h-8 w-8 rounded-lg"
              style={{ backgroundColor: "var(--skeleton-shine)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
