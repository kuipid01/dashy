export type Product = {
  name: string;
  rating: number;
  image: string;
  price: number;
};



export type Order = {
  orderId: string;
  arrivalDate: string;
  status: string;
  from: string;
  to: string;
  items: {
      name: string;
      price: number;
      image: string;
  }[];
}