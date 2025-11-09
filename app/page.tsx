//@/app/page.tsx
"use client";
import { FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { usePexels } from "./hooks/usePexels";
import ImageGrid from "./components/ImageGrid";

export default function Home() {
  const { state, photos, error, hasMore, loadPhotos, setState, initialize } =
    usePexels();
  const [searchInput, setSearchInput] = useState("");

  // Load initial photos ONLY once on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSearch = (query?: string) => {
    const searchQuery = query || searchInput.trim();
    if (!searchQuery) {
      setState(prev => ({ ...prev, error: "Please enter a search term" }));
      return;
    }

    // Reset and search
    setState(prev => ({ ...prev, query: searchQuery, page: 1 }));
    // Clearing previous photos is handled inside the usePexels hook when query/page changes

    // Small delay to ensure state is updated
    setTimeout(() => {
      loadPhotos(false);
    }, 100);
  };

  const handleLoadMore = () => {
    if (!hasMore || state.loading) return;

    setState(prev => ({ ...prev, page: prev.page + 1 }));
    setTimeout(() => {
      loadPhotos(true);
    }, 100);
  };

  const handleTagClick = (tag: string) => {
    setSearchInput(tag);
    handleSearch(tag);
  };

  return (
    <>
      <header className="border-b border-slate-50 flex flex-col bg-zinc-50 font-sans text-white">
        <nav className="container mx-auto bg-zinc-50 text-black px-6 py-4">
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-black cursor-pointer hover:text-slate-400 transition-colors duration-200">
                Anas Pexels
              </h1>
              <span className="text-sm text-slate-400 hidden lg:block">
                Free Stock Photos
              </span>
            </div>

            {/* Categories buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                "Nature",
                "Building",
                "Technology",
                "Travel",
                "Fashion",
                "Food",
                "Architecture",
              ].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-black hover:bg-slate-200 rounded-lg transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm py-4 w-full">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                  <div className="relative text-slate-900">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyPress={e => e.key === "Enter" && handleSearch()}
                      placeholder="Search for beautiful photos..."
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:bg-zinc-50 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-slate-900 placeholder-slate-500 text-base hover:border-gray-400"
                    />
                    <button
                      onClick={() => handleSearch()}
                      disabled={state.loading}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-600 text-white transition-all duration-300 absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-gray-400"
                      aria-label="Search"
                    >
                      <FaMagnifyingGlass className="w-5 h-5 p-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main section */}
      <main className="grow container mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 border border-red-300 bg-red-50 text-red-900 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Loading Indicator for initial load */}
        {state.loading && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-900">
            <FaSpinner className="w-12 h-12 animate-spin text-slate-700 mb-3" />
            <p className="text-lg font-medium text-slate-600">
              Discovering beautiful photos...
            </p>
          </div>
        )}

        {/* Image Gallery */}
        {photos.length > 0 && (
          <ImageGrid photos={photos} loading={state.loading} />
        )}

        {/* Load More Button - Only show if we have photos and more to load */}
        {hasMore && photos.length > 0 && !state.loading && (
          <div className="text-center mt-12 mb-6">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-300 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading indicator for load more */}
        {state.loading && photos.length > 0 && (
          <div className="text-center py-8">
            <FaSpinner className="w-8 h-8 animate-spin text-slate-700 mx-auto mb-2" />
            <p className="text-slate-600">Loading more photos...</p>
          </div>
        )}

        {/* No more results */}
        {!hasMore && photos.length > 0 && (
          <div className="text-center py-8 text-slate-500">
            No more photos to load
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-slate-500 bg-zinc-100 border-t border-slate-200">
        © {new Date().getFullYear()} Anas Pexels — capture the moment, from{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:underline transition-all duration-300"
        >
          Pexels
        </a>
      </footer>
    </>
  );
}
