//@/app/hooks/usePexels.ts

"use client";
import { useState, useCallback, useRef } from "react";
import { PexelsPhoto, AppState } from "@/app/types";
import { PEXELS_API_KEY, PEXELS_API_URL } from "@/app/lib/constant";

export const usePexels = () => {
  const [state, setState] = useState<AppState>({
    page: 1,
    query: "nature",
    loading: false,
  });
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track initial load
  const initialLoadRef = useRef(false);

  const fetchPhotos = useCallback(async (query: string, page: number) => {
    console.log("🔍 Fetching photos:", query, page);

    try {
      const response = await fetch(
        `${PEXELS_API_URL}/search?query=${encodeURIComponent(
          query
        )}&per_page=12&page=${page}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "✅ API Response received:",
        data.photos?.length || 0,
        "photos"
      );
      return data;
    } catch (error) {
      console.error("❌ API Error:", error);
      throw error;
    }
  }, []);

  const loadPhotos = useCallback(
    async (isLoadMore = false) => {
      if (state.loading) {
        console.log("⏳ Already loading, skipping...");
        return;
      }

      console.log("🚀 Starting loadPhotos:", {
        isLoadMore,
        query: state.query,
        page: state.page,
      });

      setState(prev => ({ ...prev, loading: true }));
      setError("");

      try {
        const data = await fetchPhotos(state.query, state.page);

        if (data.photos && data.photos.length > 0) {
          console.log("🖼️ Setting photos:", data.photos.length);
          setPhotos(prev =>
            isLoadMore ? [...prev, ...data.photos] : data.photos
          );
          setHasMore(data.page * data.per_page < data.total_results);
        } else if (!isLoadMore) {
          console.log("❌ No photos found");
          setPhotos([]);
          setError("No photos found. Try a different search term.");
          setHasMore(false);
        }
      } catch (err) {
        console.error("💥 Error in loadPhotos:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load photos";
        setError(errorMessage);
        setHasMore(false);

        // Specific API key error
        if (errorMessage.includes("401")) {
          setError("Invalid API Key. Please check your Pexels API key.");
        }
      } finally {
        console.log("🏁 Finished loading");
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [state.query, state.page, state.loading, fetchPhotos]
  );

  // Initialize only once
  const initialize = useCallback(() => {
    if (!initialLoadRef.current) {
      console.log("🎯 Initializing app...");
      initialLoadRef.current = true;
      loadPhotos();
    }
  }, [loadPhotos]);

  return {
    state,
    photos,
    error,
    hasMore,
    loadPhotos,
    setState,
    initialize,
  };
};
