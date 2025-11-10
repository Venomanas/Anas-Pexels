"use client";
import { useState, useCallback, useRef } from "react";
import { PexelsPhoto, AppState } from "@/app/types";
import { PEXELS_API_KEY, PEXELS_API_URL } from "@/app/lib/constant";

export const usePexels = () => {
  const [state, setState] = useState<AppState>({
    page: 1,
    query: "", // Changed from "nature" to empty - will load curated first
    loading: false,
  });
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track initial load
  const initialLoadRef = useRef(false);

  const fetchPhotos = useCallback(async (query: string, page: number) => {
    console.log("🔍 Fetching photos:", {
      query,
      page,
      apiKey: PEXELS_API_KEY.substring(0, 10) + "...",
    });

    try {
      // Use curated endpoint if no query, search endpoint if query exists
      const url = query
        ? `${PEXELS_API_URL}/search?query=${encodeURIComponent(
            query
          )}&per_page=30&page=${page}`
        : `${PEXELS_API_URL}/curated?per_page=30&page=${page}`;

      console.log("📡 Request URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        cache: "no-store", // Prevent caching issues
      });

      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("✅ API Response received:", {
        photosCount: data.photos?.length || 0,
        page: data.page,
        perPage: data.per_page,
        totalResults: data.total_results,
      });

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
        currentPhotosCount: photos.length,
      });

      setState(prev => ({ ...prev, loading: true }));
      setError("");

      try {
        const data = await fetchPhotos(state.query, state.page);

        if (data.photos && data.photos.length > 0) {
          console.log("🖼️ Setting photos:", {
            newPhotos: data.photos.length,
            isLoadMore,
            totalAfter: isLoadMore
              ? photos.length + data.photos.length
              : data.photos.length,
          });

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

        // Specific error messages
        if (errorMessage.includes("401")) {
          setError(
            "Invalid API Key. Please check your Pexels API key in .env.local"
          );
        } else if (errorMessage.includes("429")) {
          setError("Rate limit exceeded. Please wait a moment and try again.");
        } else if (errorMessage.includes("Failed to fetch")) {
          setError("Network error. Please check your internet connection.");
        }
      } finally {
        console.log("🏁 Finished loading");
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [state.query, state.page, state.loading, fetchPhotos, photos.length]
  );

  // Initialize only once
  const initialize = useCallback(() => {
    if (!initialLoadRef.current) {
      console.log("🎯 Initializing app - loading curated photos...");
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
