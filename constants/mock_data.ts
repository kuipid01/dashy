import { Product } from "@/stores/product-store";
import { Order } from "./types";

export const mockProducts: Product[] = [
  {
    name: "Lace and Velvet Midi Dress",
    category: "Women's Clothing",
    image: ["https://patbo.com/products/preorder-lace-and-velvet-midi-dress"],
    videos: [],
    description:
      "A bustier-style midi dress featuring soft lace fabric with stretch velvet accents, inset boning, and underwire for a flattering fit.",
    stock: 15,
    price: 89.99,
    discountedPrice: 79.99,
    rating: 4.7,
  },
  {
    name: "Leather Ankle Boots",
    category: "Footwear",
    image: [
      "https://www.poetryfashion.com/product-RG51/leather-ankleboots.htm",
    ],
    videos: [],
    description:
      "Elegant leather ankle boots designed with a rounded block heel and a gold-tone zip at the back for a sophisticated touch.",
    stock: 20,
    price: 129.5,
    discountedPrice: 115.0,
    rating: 4.5,
  },
  {
    name: "Silk Scarf",
    category: "Accessories",
    image: ["https://www.istockphoto.com/photos/silk-scarf"],
    videos: [],
    description:
      "Luxurious silk scarf available in various colors and patterns, perfect for adding a touch of elegance to any outfit.",
    stock: 50,
    price: 45.0,
    discountedPrice: 40.0,
    rating: 4.8,
  },
  {
    name: "Denim Jacket",
    category: "Men's Clothing",
    image: ["https://www.istockphoto.com/photos/denim-jacket"],
    videos: [],
    description:
      "Classic denim jacket featuring a button-front closure and multiple pockets, ideal for layering in any season.",
    stock: 30,
    price: 79.95,
    discountedPrice: 70.0,
    rating: 4.6,
  },
  {
    name: "Water-Repellant Italian Wool Trench Coat",
    category: "Women's Outerwear",
    image: ["https://bananarepublic.gap.com/browse/product.do?pid=604586002"],
    videos: [],
    description:
      "Modern trench coat crafted from beautiful Italian wool, featuring a point collar, button front closure, and a removable belt.",
    stock: 10,
    price: 199.99,
    discountedPrice: 180.0,
    rating: 4.9,
  },
  {
    name: "Floral Maxi Skirt",
    category: "Women's Clothing",
    image: ["https://www.amazon.com/Maxi-Floral-Skirt/s?k=Maxi+Floral+Skirt"],
    videos: [],
    description:
      "High-waisted boho floral maxi skirt with a flowy, pleated design, perfect for beach outings and casual wear.",
    stock: 25,
    price: 65.0,
    discountedPrice: 55.0,
    rating: 4.4,
  },
  {
    name: "Suede Loafers",
    category: "Footwear",
    image: [
      "https://bananarepublicfactory.gapfactory.com/browse/product.do?pid=593662001",
    ],
    videos: [],
    description:
      "Timeless slip-on loafers crafted from genuine suede, featuring a breathable fabric lining and Ortholite footbed for all-day comfort.",
    stock: 40,
    price: 95.0,
    discountedPrice: 85.0,
    rating: 4.6,
  },
  {
    name: "Cashmere Sweater",
    category: "Women's Clothing",
    image: [
      "https://www.poetryfashion.com/category-POACA/cashmere-collection.htm",
    ],
    videos: [],
    description:
      "Soft and luxurious cashmere sweater available in various colors, offering a generous silhouette for supreme comfort.",
    stock: 35,
    price: 149.99,
    discountedPrice: 135.0,
    rating: 4.8,
  },
  {
    name: "High-Waisted Jeans",
    category: "Women's Clothing",
    image: ["https://vervetdenim.com/collections/high-rise"],
    videos: [],
    description:
      "Stylish high-rise jeans with a wide-leg design, offering a flattering fit and versatile styling options.",
    stock: 45,
    price: 69.95,
    discountedPrice: 60.0,
    rating: 4.5,
  },
  {
    name: "Leather Crossbody Bag",
    category: "Accessories",
    image: ["https://www.portlandleathergoods.com/collections/crossbody-bags"],
    videos: [],
    description:
      "Handmade full-grain leather crossbody bag featuring an interior pocket and adjustable strap for functionality and style.",
    stock: 20,
    price: 110.0,
    discountedPrice: 100.0,
    rating: 4.7,
  },
  {
    name: "Linen Blazer",
    category: "Women's Clothing",
    image: ["https://oldnavy.gap.com/browse/product.do?pid=663788002"],
    videos: [],
    description:
      "Fitted linen-blend suit blazer with a notched lapel, single-button front, and front pockets, perfect for professional and casual wear.",
    stock: 15,
    price: 120.0,
    discountedPrice: 105.0,
    rating: 4.6,
  },
  {
    name: "Chunky Knit Scarf",
    category: "Accessories",
    image: ["https://www.amazon.com/chunky-knit-scarf/s?k=chunky+knit+scarf"],
    videos: [],
    description:
      "Warm and cozy chunky knit scarf, available in various colors and patterns, ideal for cold weather.",
    stock: 50,
    price: 35.99,
    discountedPrice: 30.0,
    rating: 4.8,
  },
  {
    name: "Silk Blouse",
    category: "Women's Clothing",
    image: ["https://www.quince.com/women/silk/blouses"],
    videos: [],
    description:
      "Elegant washable silk blouse with a classic button-up design, suitable for both professional and casual settings.",
    stock: 25,
    price: 85.0,
    discountedPrice: 75.0,
    rating: 4.7,
  },
  {
    name: "Chelsea Boots",
    category: "Footwear",
    image: ["https://thursdayboots.com/collections/mens-boots-chelsea"],
    videos: [],
    description:
      "Handcrafted Chelsea boots available in leather and suede styles, offering a sleek silhouette and comfortable fit.",
    stock: 30,
    price: 135.0,
    discountedPrice: 120.0,
    rating: 4.6,
  },
];
export const MockOrders: Order[] = [
  {
    orderId: "ORD001",
    arrivalDate: "2025-03-28",
    status: "DELIVERED",
    from: "FashionHub NYC",
    to: "123 Maple St, Boston, MA",
    items: [
      {
        name: "Velvet Midi Dress",
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1571513800374-df1bb2b92135?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Leather Ankle Boots",
        price: 129.5,
        image:
          "https://images.unsplash.com/photo-1605733160314-4ca0b47b8803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD002",
    arrivalDate: "2025-04-02",
    status: "on the way",
    from: "StyleCo LA",
    to: "456 Oak Ave, Chicago, IL",
    items: [
      {
        name: "Silk Scarf",
        price: 45.0,
        image:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD003",
    arrivalDate: "2025-03-25",
    status: "DELIVERED",
    from: "TrendSetters SF",
    to: "789 Pine Rd, Seattle, WA",
    items: [
      {
        name: "Denim Jacket",
        price: 79.95,
        image:
          "https://images.unsplash.com/photo-1599550940733-3c729e60f3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Gold Hoop Earrings",
        price: 25.0,
        image:
          "https://images.unsplash.com/photo-1606761568499-6d24536b9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD004",
    arrivalDate: "2025-04-05",
    status: "DELIVER",
    from: "ChicWear Miami",
    to: "101 Cedar Ln, Austin, TX",
    items: [
      {
        name: "Wool Trench Coat",
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1519748771451-a94c596fad67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD005",
    arrivalDate: "2025-03-30",
    status: "DELIVERED",
    from: "FashionHub NYC",
    to: "234 Birch St, Denver, CO",
    items: [
      {
        name: "Floral Maxi Skirt",
        price: 65.0,
        image:
          "https://images.unsplash.com/photo-1594631252845-62fc055897ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Suede Loafers",
        price: 95.0,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD006",
    arrivalDate: "2025-04-03",
    status: "on the way",
    from: "StyleCo LA",
    to: "567 Elm Dr, Portland, OR",
    items: [
      {
        name: "Cashmere Sweater",
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1576871337622-98d48e1f3678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD007",
    arrivalDate: "2025-03-27",
    status: "DELIVERED",
    from: "TrendSetters SF",
    to: "890 Spruce Way, Phoenix, AZ",
    items: [
      {
        name: "High-Waisted Jeans",
        price: 69.95,
        image:
          "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Leather Crossbody Bag",
        price: 110.0,
        image:
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD008",
    arrivalDate: "2025-04-07",
    status: "DELIVER",
    from: "ChicWear Miami",
    to: "321 Willow Ct, Atlanta, GA",
    items: [
      {
        name: "Linen Blazer",
        price: 120.0,
        image:
          "https://images.unsplash.com/photo-1596701062351-16b3e23fd33e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD009",
    arrivalDate: "2025-03-29",
    status: "DELIVERED",
    from: "FashionHub NYC",
    to: "654 Ash St, San Diego, CA",
    items: [
      {
        name: "Chunky Knit Scarf",
        price: 35.99,
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd3d5129?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Silk Blouse",
        price: 85.0,
        image:
          "https://images.unsplash.com/photo-1568254183919-07808836bf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD010",
    arrivalDate: "2025-04-04",
    status: "on the way",
    from: "StyleCo LA",
    to: "987 Poplar Ave, Houston, TX",
    items: [
      {
        name: "Chelsea Boots",
        price: 135.0,
        image:
          "https://images.unsplash.com/photo-1604264849633-233e8d2f2e06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD011",
    arrivalDate: "2025-03-26",
    status: "DELIVERED",
    from: "TrendSetters SF",
    to: "147 Magnolia Ln, Raleigh, NC",
    items: [
      {
        name: "Pleated Midi Skirt",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1594223274512-ad145f6b2399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD012",
    arrivalDate: "2025-04-06",
    status: "DELIVER",
    from: "ChicWear Miami",
    to: "258 Laurel Rd, Nashville, TN",
    items: [
      {
        name: "Faux Fur Coat",
        price: 180.0,
        image:
          "https://images.unsplash.com/photo-1544027993-37c2a970788f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Canvas Sneakers",
        price: 55.0,
        image:
          "https://images.unsplash.com/photo-1525966222134-fdfa99b89b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD013",
    arrivalDate: "2025-04-01",
    status: "on the way",
    from: "FashionHub NYC",
    to: "369 Birch Pl, Minneapolis, MN",
    items: [
      {
        name: "Oversized Sunglasses",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1511497580568-2c49d77a1d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD014",
    arrivalDate: "2025-03-31",
    status: "DELIVERED",
    from: "StyleCo LA",
    to: "741 Cedar St, Orlando, FL",
    items: [
      {
        name: "Cotton T-Shirt",
        price: 25.0,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Wool Beret",
        price: 30.0,
        image:
          "https://images.unsplash.com/photo-1578632292335-df3ab5fb0fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD015",
    arrivalDate: "2025-04-08",
    status: "DELIVER",
    from: "TrendSetters SF",
    to: "852 Oakwood Dr, Salt Lake City, UT",
    items: [
      {
        name: "Leather Belt",
        price: 40.0,
        image:
          "https://images.unsplash.com/photo-1591567072886-4e7f6c47e1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD016",
    arrivalDate: "2025-03-24",
    status: "DELIVERED",
    from: "ChicWear Miami",
    to: "963 Pine Ln, Charlotte, NC",
    items: [
      {
        name: "Chiffon Dress",
        price: 95.0,
        image:
          "https://images.unsplash.com/photo-1568252542512-61a7cfac8a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Knit Cardigan",
        price: 60.0,
        image:
          "https://images.unsplash.com/photo-1578932750297-7e7d81ae785d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD017",
    arrivalDate: "2025-04-09",
    status: "on the way",
    from: "FashionHub NYC",
    to: "159 Spruce Ct, Las Vegas, NV",
    items: [
      {
        name: "Platform Sandals",
        price: 85.0,
        image:
          "https://images.unsplash.com/photo-1603808033192-0c5e92663573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Tweed Jacket",
        price: 150.0,
        image:
          "https://images.unsplash.com/photo-1603052875302-dba0d85755e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD018",
    arrivalDate: "2025-03-29",
    status: "DELIVERED",
    from: "StyleCo LA",
    to: "357 Elm St, Philadelphia, PA",
    items: [
      {
        name: "Ruffle Blouse",
        price: 55.0,
        image:
          "https://images.unsplash.com/photo-1595777457586-2ed66d094e15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD019",
    arrivalDate: "2025-04-10",
    status: "DELIVER",
    from: "TrendSetters SF",
    to: "468 Maple Dr, Columbus, OH",
    items: [
      {
        name: "Wide-Leg Pants",
        price: 70.0,
        image:
          "https://images.unsplash.com/photo-1598556434650-d4d7fd6d8df5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Statement Necklace",
        price: 50.0,
        image:
          "https://images.unsplash.com/photo-1606768666853-27c1c4e1e708?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    orderId: "ORD020",
    arrivalDate: "2025-04-01",
    status: "DELIVERED",
    from: "ChicWear Miami",
    to: "579 Oak Ln, Kansas City, MO",
    items: [
      {
        name: "Puffer Jacket",
        price: 130.0,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];
