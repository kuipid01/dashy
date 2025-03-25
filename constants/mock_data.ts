import { Product, Order } from "./types";

export const mockProducts: Product[] = [
  {
    name: "Velvet Midi Dress",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1571513800374-df1bb2b92135?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 89.99,
  },
  {
    name: "Leather Ankle Boots",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1605733160314-4ca0b47b8803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 129.5,
  },
  {
    name: "Silk Scarf",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 45.0,
  },
  {
    name: "Denim Jacket",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1599550940733-3c729e60f3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 79.95,
  },
  {
    name: "Wool Trench Coat",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1519748771451-a94c596fad67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 199.99,
  },
  {
    name: "Floral Maxi Skirt",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1594631252845-62fc055897ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 65.0,
  },
  {
    name: "Suede Loafers",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 95.0,
  },
  {
    name: "Cashmere Sweater",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48e1f3678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 149.99,
  },
  {
    name: "High-Waisted Jeans",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 69.95,
  },
  {
    name: "Leather Crossbody Bag",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 110.0,
  },
  {
    name: "Linen Blazer",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1596701062351-16b3e23fd33e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 120.0,
  },
  {
    name: "Chunky Knit Scarf",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd3d5129?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 35.99,
  },
  {
    name: "Silk Blouse",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1568254183919-07808836bf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 85.0,
  },
  {
    name: "Chelsea Boots",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1604264849633-233e8d2f2e06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 135.0,
  },
  {
    name: "Pleated Midi Skirt",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1594223274512-ad145f6b2399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 59.99,
  },
  {
    name: "Gold Hoop Earrings",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1606761568499-6d24536b9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 25.0,
  },
  {
    name: "Tailored Trousers",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1596701089374-0088e82b72c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75.0,
  },
  {
    name: "Faux Fur Coat",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1544027993-37c2a970788f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 180.0,
  },
  {
    name: "Canvas Sneakers",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1525966222134-fdfa99b89b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 55.0,
  },
  {
    name: "Oversized Sunglasses",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1511497580568-2c49d77a1d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 39.99,
  },
  {
    name: "Cotton T-Shirt",
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 25.0,
  },
  {
    name: "Wool Beret",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1578632292335-df3ab5fb0fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 30.0,
  },
  {
    name: "Leather Belt",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1591567072886-4e7f6c47e1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 40.0,
  },
  {
    name: "Chiffon Dress",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1568252542512-61a7cfac8a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 95.0,
  },
  {
    name: "Knit Cardigan",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1578932750297-7e7d81ae785d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 60.0,
  },
  {
    name: "Platform Sandals",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1603808033192-0c5e92663573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 85.0,
  },
  {
    name: "Tweed Jacket",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603052875302-dba0d85755e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 150.0,
  },
  {
    name: "Ruffle Blouse",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1595777457586-2ed66d094e15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 55.0,
  },
  {
    name: "Wide-Leg Pants",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1598556434650-d4d7fd6d8df5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 70.0,
  },
  {
    name: "Statement Necklace",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1606768666853-27c1c4e1e708?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50.0,
  },
  {
    name: "Puffer Jacket",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 130.0,
  },
  {
    name: "Ballet Flats",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1608233965407-244e803f6e5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 65.0,
  },
  {
    name: "Striped Shirt",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1525171254930-643fc90b9c2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 45.0,
  },
  {
    name: "Velvet Headband",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1608043152257-723e8e088c91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 20.0,
  },
  {
    name: "Corduroy Skirt",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b95a9d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50.0,
  },
  {
    name: "Leather Gloves",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1605405748313-a416a1b50491?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 55.0,
  },
  {
    name: "Slip Dress",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1568252542596-701e3c96d7e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75.0,
  },
  {
    name: "Chunky Sneakers",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1600185365926-090b66d075e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 90.0,
  },
  {
    name: "Plaid Scarf",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd3d5129?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 30.0,
  },
  {
    name: "Oversized Blazer",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603052874945-0daf222c33f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 140.0,
  },
  {
    name: "Embroidered Tote Bag",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1602293589930-45aad5ba9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 60.0,
  },
  {
    name: "Satin Pajama Set",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1599551051350-616ba2a2e087?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 70.0,
  },
  {
    name: "Ankle Strap Heels",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1603808033172-7a798df747e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 100.0,
  },
  {
    name: "Denim Shorts",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1591195857866-2b563ebfa5e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 40.0,
  },
  {
    name: "Pearl Earrings",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1606761568499-6d24536b9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 35.0,
  },
  {
    name: "Hooded Raincoat",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1596398055358-0f8a49f7f664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 110.0,
  },
  {
    name: "Ribbed Turtleneck",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1571513721760-4c1a76b80e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50.0,
  },
  {
    name: "Leather Wallet",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1605733513597-a8f834b16713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 45.0,
  },
  {
    name: "A-Line Dress",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1568252542512-61a7cfac8a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 80.0,
  },
  {
    name: "Quilted Handbag",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1602293589930-45aad5ba9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 95.0,
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
