// import { addDays, subDays } from "date-fns";
// import { Order } from "@/constants/types";
// import { Product } from "@/app/(handlers)/types/product";

// // Generate sample orders for the last 6 weeks
// export const generateSampleOrders = (): Order[] => {
//   const orders: Order[] = [];
//   const today = new Date();
  
//   // Generate random orders over the last 6 weeks
//   for (let i = 0; i < 42; i++) {
//     const date = subDays(today, i);
//     const orderCount = Math.floor(Math.random() * 8); // 0-7 orders per day
    
//     for (let j = 0; j < orderCount; j++) {
//       orders.push({
//         id: orders.length + 1,
//         total: Math.floor(Math.random() * 1000) + 100,
//         status: "delivered",
//         userId: 1,
//         user: { id: 1, name: "Customer" },
//         orderItems: [],
//         deliveryMode: "store",
//         orderStatus: "delivered",
//         sales_means: "ONLINE",
//         placedAt: date.toISOString(),
//         placed_at: date.toISOString(),
//         updatedAt: date.toISOString(),
//       } as Order);
//     }
//   }
  
//   return orders;
// };

// // Generate sample products for the last 6 weeks
// export const generateSampleProducts = (): Product[] => {
//   const products: Product[] = [];
//   const today = new Date();
  
//   // Generate random products over the last 6 weeks
//   for (let i = 0; i < 42; i++) {
//     const date = subDays(today, i);
//     const productCount = Math.floor(Math.random() * 4); // 0-3 products per day
    
//     for (let j = 0; j < productCount; j++) {
//       products.push({
//         id: products.length + 1,
//         name: `Product ${products.length + 1}`,
//         category: "Electronics",
//         image: ["https://via.placeholder.com/150"],
//         description: "Sample product description",
//         stock: Math.floor(Math.random() * 100) + 10,
//         price: Math.floor(Math.random() * 500) + 50,
//         rating: Math.floor(Math.random() * 5) + 1,
//         storeId: 1,
//         store_id: 1,
//         live: true,
//         createdAt: date.toISOString(),
//       } as Product);
//     }
//   }
  
//   return products;
// };

// // Get date range for the last 6 weeks
// export const getDateRange = () => {
//   const today = new Date();
//   const startDate = subDays(today, 6 * 7 - 1); // 6 weeks ago
//   const endDate = today;
  
//   return { startDate, endDate };
// };
