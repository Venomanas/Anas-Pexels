"use client";
import { useState, useEffect, useCallback } from "react";
import { PexelsPhoto } from "@/app/types";

const STORAGE_KEY = "pixeler-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<PexelsPhoto[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Invalid JSON, reset
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const isFavorite = useCallback(
    (photoId: number) => favorites.some(f => f.id === photoId),
    [favorites],
  );

  const toggleFavorite = useCallback((photo: PexelsPhoto) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === photo.id);
      if (exists) {
        return prev.filter(f => f.id !== photo.id);
      } else {
        return [photo, ...prev];
      }
    });
  }, []);

  const removeFavorite = useCallback((photoId: number) => {
    setFavorites(prev => prev.filter(f => f.id !== photoId));
  }, []);

  const clearAll = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAll,
    count: favorites.length,
  };
}
