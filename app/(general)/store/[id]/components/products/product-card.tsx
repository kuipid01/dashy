// /* eslint-disable @next/next/no-img-element */
// import React from "react";
// import { Star, ShoppingCart, Heart } from "lucide-react";
// import { Product } from "@/constants/types";

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard = ({ product }: ProductCardProps) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group">
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
//         <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100">
//           <Heart size={16} className="text-gray-600" />
//         </button>
//       </div>

//       <div className="p-4">
//         <div className="flex items-center text-xs mb-1">
//           <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
//             {product.category}
//           </span>
//         </div>

//         <h3 className="font-medium text-gray-900 mb-1 truncate">
//           {product.name}
//         </h3>

//         <div className="flex items-center text-sm text-gray-500 mb-3">
//           <div className="flex items-center">
//             <Star size={14} className="text-amber-400" fill="#FFC107" />
//             <span className="ml-1">{product.rating}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <p className="font-bold text-lg text-gray-900">
//             ${product.price.toFixed(2)}
//           </p>
//           <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors duration-200">
//             <ShoppingCart size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
