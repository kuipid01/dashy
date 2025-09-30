import { Order } from "@/constants/types";

export const imageToRenderOrder = (order: Order) =>
  order?.orderItems[0]?.Product.Image.includes(",")
    ? order?.orderItems[0]?.Product.Image.split(",")
    : order?.orderItems[0]?.Product.Image;
export const imageToRenderImage = (imageString: string): string => {
  if (!imageString) return "";

  return imageString.split(",")[0].trim();
};
