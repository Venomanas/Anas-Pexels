//@/app/types/index.ts
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}
export interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
}

export interface AppState {
  page: number;
  query: string;
  loading: boolean;
}
