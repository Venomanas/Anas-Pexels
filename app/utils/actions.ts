//@/app/utils/action.ts

"use client";

export const asyncButton = async (
  setLoading: (loading: boolean) => void,
  func: () => Promise<string>
): Promise<void> => {
  setLoading(true);
  try {
    await func();
  } finally {
    setLoading(false);
  }
};

export const downloadImage = async (
  url: string,
  filename: string
): Promise<void> => {
  const blob = await (await fetch(url)).blob();
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: filename || "pexels-photo.jpg",
  });
  link.click();
  URL.revokeObjectURL(link.href);
};

export const shareImage = async (url: string): Promise<void> => {
  if (navigator.share) {
    await navigator.share({ title: "Check out this beautiful photo", url });
  } else {
    await navigator.clipboard.writeText(url);
  }
};
