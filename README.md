# 🖼️ Pixeler — Free Stock Photo Browser

> Discover, explore, and save stunning free stock photos — powered by the [Pexels API](https://www.pexels.com/api/).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer&logoColor=white)
![Pexels API](https://img.shields.io/badge/Pexels-API-05a081?logo=pexels&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Purpose

**Pixeler** is a free, open-source web application that gives everyday internet users a clean, fast, and enjoyable way to browse and collect high-quality stock photos — without signing up, paying, or sitting through ads.

Built on top of the **Pexels API**, Pixeler acts as a polished front-end interface for Pexels' massive library of royalty-free images. Whether you are a blogger looking for a header image, a student building a presentation, a designer seeking inspiration, or just someone who appreciates beautiful photography, Pixeler puts millions of professional photos right at your fingertips.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Keyword Search** | Search millions of high-quality photos instantly by typing any keyword |
| 🏷️ **Category Quick-Tags** | One-click category buttons: Nature, Space, Travel, Food, Architecture, and more |
| 🎨 **Color Filter** | Narrow results by dominant color — red, orange, blue, green, and more |
| 🖼️ **Masonry Image Grid** | Responsive, Pinterest-style layout that adapts to any screen size |
| ♾️ **Infinite Scroll** | Automatically loads the next page of photos as you scroll down |
| ❤️ **Favorites Drawer** | Save photos to a local favorites list and view them in a slide-out panel |
| 🌗 **Dark / Light Mode** | Theme toggle with OS preference detection and flash-free initialization |
| 🔎 **Photo Detail Modal** | Click any photo to view full metadata, photographer credit, and download links |
| ⬆️ **Scroll-to-Top Button** | Appears automatically after scrolling past 600 px for quick navigation |
| 📱 **Fully Responsive** | Works seamlessly on desktop, tablet, and mobile devices |

---

## 🛠️ Tech Stack

### Core Framework

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16 | App Router, SSR/CSR hybrid, file-based routing |
| **React** | 19 | UI component model, hooks, state management |
| **TypeScript** | 5 | Static typing across all components, hooks, and API types |

### Styling & UI

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | 4 | Utility-first responsive layout and spacing |
| **tw-animate-css** | 1.4 | CSS keyframe animations (fade-in, slide-up, etc.) |
| **Framer Motion** | 12 | Smooth component enter/exit animations |
| **Geist Font** | — | Clean, modern sans-serif and mono typefaces from Vercel |
| **Lucide React** | 0.563 | Crisp, consistent icon set |
| **React Icons** | 5.5 | Additional icon packs (Font Awesome 6 subset) |

### Component Infrastructure

| Technology | Version | Role |
|---|---|---|
| **Radix UI** | 1.4 | Accessible, headless UI primitives (dialog, toggle, etc.) |
| **shadcn/ui** | 3.8 | Pre-built, theme-aware component recipes on top of Radix |
| **class-variance-authority** | 0.7 | Variant-safe component class composition |
| **clsx + tailwind-merge** | 2.1 / 3.4 | Conditional class merging without conflicts |

### Data & API

| Technology | Role |
|---|---|
| **Pexels REST API** | Primary image data source — search, curated, and per-photo endpoints |
| **Environment Variables** | API key stored securely in `.env` (`NEXT_PUBLIC_PEXELS_API_KEY`) |

### Custom Hooks

| Hook | Purpose |
|---|---|
| `usePexels` | Fetches photos from Pexels, manages query / page / color state |
| `useFavorites` | Persists favorited photos to `localStorage` |
| `useInfiniteScroll` | `IntersectionObserver`-based sentinel for auto-loading more photos |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A free **Pexels API key** → [Get one here](https://www.pexels.com/api/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pixeler.git
cd pixeler

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file in the project root:
echo "NEXT_PUBLIC_PEXELS_API_KEY=your_api_key_here" > .env

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
pixeler/
├── app/
│   ├── components/          # UI components
│   │   ├── ImageGrid.tsx    # Masonry photo grid
│   │   ├── ImageCard.tsx    # Individual photo card with hover actions
│   │   ├── ImageModal.tsx   # Full-screen photo detail modal
│   │   ├── FavoritesDrawer.tsx  # Slide-out saved photos panel
│   │   ├── ColorFilter.tsx  # Color palette filter bar
│   │   ├── ThemeToggle.tsx  # Dark/light mode switch
│   │   ├── SkeletonCard.tsx # Loading placeholder cards
│   │   └── theme-provider.tsx
│   ├── hooks/
│   │   ├── usePexels.ts         # Pexels API data fetching
│   │   ├── useFavorites.ts      # localStorage favorites management
│   │   └── useInfiniteScroll.ts # Intersection Observer scroll trigger
│   ├── types/               # Shared TypeScript interfaces
│   ├── utils/               # Helper functions
│   ├── lib/                 # Shared utilities (cn, etc.)
│   ├── globals.css          # CSS variables, theme tokens, animations
│   ├── layout.tsx           # Root layout with metadata + theme init
│   └── page.tsx             # Main application page
├── components/
│   └── ui/                  # shadcn/ui component primitives
├── public/                  # Static assets
├── .env                     # Environment variables (not committed)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🧑‍💻 Usage Guide (For Free Image Users)

Pixeler is designed to be zero-friction for anyone looking for free images online.

### 1. Search for Photos
Type any keyword into the search bar and press **Enter** or click the 🔍 button. Results appear instantly from Pexels' library of millions of royalty-free photos.

### 2. Browse by Category
Click any of the category tags below the search bar (Nature, Travel, Space, Food, etc.) to instantly browse curated photos in that theme.

### 3. Filter by Color
Use the color swatches under the category tags to refine results by dominant color — useful when you need a photo that matches a specific brand palette.

### 4. Scroll for More
Pixeler loads photos automatically as you scroll — no need to click "Next Page." Just keep scrolling and new photos appear seamlessly.

### 5. Save Your Favorites
Hover over any photo and click the ❤️ heart icon to add it to your favorites. Open the **Favorites Drawer** (heart button in the header) to review and manage your saved photos.

### 6. View Full Details
Click any photo to open a detail modal with:
- Full-resolution preview
- Photographer name and Pexels profile link
- Photo dimensions
- Download options in multiple sizes

### 7. Switch Themes
Click the 🌙 / ☀️ icon in the top-right to switch between dark and light mode. Your preference is saved automatically.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_PEXELS_API_KEY` | ✅ Yes | Your Pexels API key for fetching photos |

> **Note:** The Pexels API is **free to use** with generous rate limits (200 requests/hour on the free tier). Photos are provided by Pexels contributors under the [Pexels License](https://www.pexels.com/license/) — free for personal and commercial use, no attribution required.

---

## 📜 Pexels License & Attribution

All photos served through Pixeler come directly from [Pexels](https://www.pexels.com). Under the **Pexels License**:

- ✅ Free to use for personal and commercial purposes
- ✅ No attribution required (though appreciated)
- ❌ Cannot sell unmodified copies of photos
- ❌ Cannot imply endorsement by the photographer

Please review the full [Pexels License](https://www.pexels.com/license/) before using images.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <strong>Anas</strong> · Powered by <a href="https://www.pexels.com">Pexels</a>
</p>
