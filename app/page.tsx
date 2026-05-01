//@/app/page.tsx
"use client";
import { FaMagnifyingGlass, FaHeart, FaArrowUp } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { usePexels } from "./hooks/usePexels";
import { useFavorites } from "./hooks/useFavorites";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import ImageGrid from "./components/ImageGrid";
import ThemeToggle from "./components/ThemeToggle";
import ColorFilter from "./components/ColorFilter";
import FavoritesDrawer from "./components/FavoritesDrawer";

const CATEGORIES = [
  "Nature",
  "Building",
  "Technology",
  "Travel",
  "Fashion",
  "Food",
  "Architecture",
  "Animals",
  "Abstract",
  "Space",
];

export default function Home() {
  const { state, photos, error, hasMore, loadPhotos, setState, initialize } =
    usePexels();
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAll,
    count,
  } = useFavorites();
  const [searchInput, setSearchInput] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite scroll
  const handleLoadMore = () => {
    if (!hasMore || state.loading) return;
    setState(prev => ({ ...prev, page: prev.page + 1 }));
    setTimeout(() => loadPhotos(true), 100);
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    loading: state.loading,
  });

  const handleSearch = (query?: string) => {
    const searchQuery = query || searchInput.trim();
    if (!searchQuery) {
      setState(prev => ({ ...prev, error: "Please enter a search term" }));
      return;
    }
    setState(prev => ({
      ...prev,
      query: searchQuery,
      page: 1,
      color: prev.color,
    }));
    setTimeout(() => loadPhotos(false), 100);
  };

  const handleTagClick = (tag: string) => {
    setSearchInput(tag);
    handleSearch(tag);
  };

  const handleColorChange = (color: string) => {
    setState(prev => ({ ...prev, color, page: 1 }));
    setTimeout(() => loadPhotos(false), 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* ─── Header ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 glass border-b"
        style={{
          backgroundColor: "var(--header-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <nav className="container mx-auto px-6 py-3">
          {/* Top row: Logo + Search + Actions */}
          <div className="flex items-center gap-4 mb-3">
            {/* Logo */}
            <h1
              className="text-xl font-bold cursor-pointer transition-colors duration-200 whitespace-nowrap"
              style={{ color: "var(--foreground)" }}
              onClick={scrollToTop}
            >
              Anas Pixeler
            </h1>

            {/* Search bar — grows to fill space */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Search for beautiful photos..."
                  className="w-full px-4 py-2.5 pr-11 rounded-xl text-sm transition-all duration-300 border-2"
                  style={{
                    backgroundColor: "var(--search-bg)",
                    borderColor: "var(--search-border)",
                    color: "var(--foreground)",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor =
                      "var(--search-focus-border)";
                    e.currentTarget.style.backgroundColor = "var(--background)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "var(--search-border)";
                    e.currentTarget.style.backgroundColor = "var(--search-bg)";
                  }}
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={state.loading}
                  className="p-2 rounded-lg text-white transition-all duration-300 absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-label="Search"
                >
                  <FaMagnifyingGlass className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Favorites button */}
              <button
                onClick={() => setFavoritesOpen(true)}
                className="relative p-2.5 rounded-full transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: "var(--tag-hover-bg)" }}
                aria-label="Open favorites"
              >
                <FaHeart
                  className="w-4 h-4"
                  style={{ color: count > 0 ? "#ef4444" : "var(--muted)" }}
                />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {CATEGORIES.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                  state.query === tag ? "text-white shadow-md" : ""
                }`}
                style={
                  state.query === tag
                    ? { backgroundColor: "var(--accent)", color: "#ffffff" }
                    : { color: "var(--tag-text)" }
                }
                onMouseEnter={e => {
                  if (state.query !== tag) {
                    e.currentTarget.style.backgroundColor =
                      "var(--tag-hover-bg)";
                  }
                }}
                onMouseLeave={e => {
                  if (state.query !== tag) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Color filter */}
          <ColorFilter
            selectedColor={state.color}
            onColorSelect={handleColorChange}
          />
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-40" />

      {/* ─── Main Content ─── */}
      <main className="grow container mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div
            className="mb-8 border p-4 rounded-xl text-center animate-fade-in"
            style={{
              backgroundColor: "var(--error-bg)",
              borderColor: "var(--error-border)",
              color: "var(--error-text)",
            }}
          >
            {error}
          </div>
        )}

        {/* Search results count */}
        {state.query && photos.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Showing results for{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                &ldquo;{state.query}&rdquo;
              </span>
              {state.color && (
                <>
                  {" "}
                  in{" "}
                  <span
                    className="font-semibold capitalize"
                    style={{ color: "var(--foreground)" }}
                  >
                    {state.color}
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Image Gallery */}
        <ImageGrid
          photos={photos}
          loading={state.loading}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        {/* Infinite scroll sentinel */}
        {hasMore && photos.length > 0 && (
          <div ref={sentinelRef} className="h-4" />
        )}

        {/* No more results */}
        {!hasMore && photos.length > 0 && (
          <div
            className="text-center py-8 animate-fade-in"
            style={{ color: "var(--muted)" }}
          >
            ✨ You&apos;ve seen all the photos
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer
        className="mt-auto py-6 text-center text-sm border-t"
        style={{
          backgroundColor: "var(--footer-bg)",
          borderColor: "var(--footer-border)",
          color: "var(--muted)",
        }}
      >
        © {new Date().getFullYear()} Pixeler — Beautiful photos from{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium transition-all duration-200 hover:underline"
          style={{ color: "var(--foreground)" }}
        >
          Pexels
        </a>
      </footer>

      {/* ─── Scroll to top ─── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full text-white shadow-xl z-30 transition-all duration-300 hover:scale-110 animate-fade-in"
          style={{ backgroundColor: "var(--accent)" }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* ─── Favorites Drawer ─── */}
      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onRemove={removeFavorite}
        onClearAll={clearAll}
        onPhotoClick={photo => {
          setFavoritesOpen(false);
          // Find photo index in main grid (if it exists)
          const idx = photos.findIndex(p => p.id === photo.id);
          if (idx >= 0) {
            // Scroll to approximate position
            window.scrollTo({ top: idx * 100, behavior: "smooth" });
          }
        }}
      />
    </div>
  );
}
