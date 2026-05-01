"use client";
import { useState, useCallback, useRef } from "react";
import { PexelsPhoto, AppState } from "@/app/types";
import { PEXELS_API_KEY, PEXELS_API_URL } from "@/app/lib/constant";

export const usePexels = () => {
  const [state, setState] = useState<AppState>({
    page: 1,
    query: "",
    color: "",
    loading: false,
  });
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);

  const initialLoadRef = useRef(false);

  const fetchPhotos = useCallback(
    async (query: string, page: number, color: string) => {
      try {
        let url: string;
        if (query) {
          url = `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=30&page=${page}`;
          if (color) url += `&color=${encodeURIComponent(color)}`;
        } else {
          url = `${PEXELS_API_URL}/curated?per_page=30&page=${page}`;
        }

        const response = await fetch(url, {
          headers: { Authorization: PEXELS_API_KEY },
          cache: "no-store",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`,
          );
        }

        return await response.json();
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const loadPhotos = useCallback(
    async (isLoadMore = false) => {
      if (state.loading) return;

      setState(prev => ({ ...prev, loading: true }));
      setError("");

      try {
        const data = await fetchPhotos(state.query, state.page, state.color);

        if (data.photos && data.photos.length > 0) {
          setPhotos(prev =>
            isLoadMore ? [...prev, ...data.photos] : data.photos,
          );
          setHasMore(data.page * data.per_page < data.total_results);
        } else if (!isLoadMore) {
          setPhotos([]);
          setError("No photos found. Try a different search term.");
          setHasMore(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load photos";
        setError(errorMessage);
        setHasMore(false);

        if (errorMessage.includes("401")) {
          setError("Invalid API Key. Please check your Pexels API key.");
        } else if (errorMessage.includes("429")) {
          setError("Rate limit exceeded. Please wait a moment and try again.");
        } else if (errorMessage.includes("Failed to fetch")) {
          setError("Network error. Please check your internet connection.");
        }
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [state.query, state.page, state.color, state.loading, fetchPhotos],
  );

  const initialize = useCallback(() => {
    if (!initialLoadRef.current) {
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
