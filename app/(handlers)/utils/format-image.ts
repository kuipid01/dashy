// utils/formattedImage.ts
export function formattedImage(images: string): string[] {
    if (!images) {
      return [];
    }
    return images.split(",").map((url) => url.trim());
  }