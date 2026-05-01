"use client";

interface ColorFilterProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const COLORS = [
  { name: "red", hex: "#ef4444" },
  { name: "orange", hex: "#f97316" },
  { name: "yellow", hex: "#eab308" },
  { name: "green", hex: "#22c55e" },
  { name: "turquoise", hex: "#14b8a6" },
  { name: "blue", hex: "#3b82f6" },
  { name: "violet", hex: "#8b5cf6" },
  { name: "pink", hex: "#ec4899" },
  { name: "brown", hex: "#a16207" },
  { name: "black", hex: "#171717" },
  { name: "white", hex: "#f5f5f5" },
];

export default function ColorFilter({
  selectedColor,
  onColorSelect,
}: ColorFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="text-xs font-medium mr-1"
        style={{ color: "var(--muted)" }}
      >
        Color:
      </span>
      {COLORS.map(color => (
        <button
          key={color.name}
          onClick={() =>
            onColorSelect(selectedColor === color.name ? "" : color.name)
          }
          className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-125 border-2 ${
            selectedColor === color.name
              ? "scale-125 ring-2 ring-offset-2 border-transparent"
              : "border-transparent hover:border-white/50"
          }`}
          style={
            {
              backgroundColor: color.hex,
              "--tw-ring-color": color.hex,
              ...(color.name === "white"
                ? { border: "1px solid #d1d5db" }
                : {}),
            } as React.CSSProperties
          }
          aria-label={`Filter by ${color.name}`}
          title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
        />
      ))}
      {selectedColor && (
        <button
          onClick={() => onColorSelect("")}
          className="text-xs px-2 py-1 rounded-md transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: "var(--tag-hover-bg)",
            color: "var(--tag-text)",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
