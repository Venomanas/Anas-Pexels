//@/app/types/index.ts
export interface PexelsPhoto {
  id: number;
  src: {
    large2x: string;
    medium: string;
  };
  alt: string;
  photographer: string;
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
