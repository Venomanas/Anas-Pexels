import { PEXELS_API_KEY, PEXELS_API_URL } from "./constant";

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
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
}

export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<PexelsResponse> {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        cache: "no-store", // Disable caching for fresh results
      }
    );

    if (!response.ok) {
      throw new Error(
        `Pexels API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Pexels API Response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching from Pexels:", error);
    throw error;
  }
}

export async function getCuratedPhotos(
  page: number = 1,
  perPage: number = 30
): Promise<PexelsResponse> {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/curated?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Pexels API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Pexels Curated Response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching curated photos:", error);
    throw error;
  }
}
