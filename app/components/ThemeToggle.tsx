"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("pixeler-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pixeler-theme", next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          dark
            ? "bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            : "bg-gray-900/10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        }`}
      />

      {/* Eye SVG */}
      <svg
        viewBox="0 0 32 32"
        className={`w-7 h-7 relative z-10 transition-all duration-500 ${
          dark ? "drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" : ""
        }`}
      >
        {/* Outer eye shape */}
        <path
          d="M2 16 C2 16, 8 6, 16 6 C24 6, 30 16, 30 16 C30 16, 24 26, 16 26 C8 26, 2 16, 2 16 Z"
          fill="none"
          stroke={dark ? "#3b82f6" : "#1e293b"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 animate-eye-blink origin-center"
          style={{ transformBox: "fill-box" }}
        />
        {/* Iris */}
        <circle
          cx="16"
          cy="16"
          r={dark ? "6" : "5"}
          fill={dark ? "#3b82f6" : "#1e293b"}
          className="transition-all duration-500"
        />
        {/* Pupil */}
        <circle
          cx="16"
          cy="16"
          r="2.5"
          fill={dark ? "#0a0a0f" : "#ffffff"}
          className="transition-all duration-500 animate-pupil-shift"
        />
        {/* Light reflection */}
        <circle
          cx={dark ? "18.5" : "18"}
          cy="14"
          r="1.2"
          fill={dark ? "rgba(147,197,253,0.8)" : "rgba(255,255,255,0.9)"}
          className="transition-all duration-500"
        />
        {/* Blue glow ring (dark mode only) */}
        {dark && (
          <circle
            cx="16"
            cy="16"
            r="7.5"
            fill="none"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1"
            className="animate-pulse-glow"
          />
        )}
      </svg>

      {/* Ripple effect on hover */}
      <div
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          dark
            ? "bg-linear-to-r from-blue-500/10 to-blue-400/10"
            : "bg-linear-to-r from-gray-400/10 to-gray-300/10"
        }`}
      />
    </button>
  );
}
