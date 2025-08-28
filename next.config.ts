/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  /* config options here */
  images: {
    domains: ["images.unsplash.com",
      "www.istockphoto.com",
      "www.amazon.com",
      "www.poetryfashion.com",
      "www.portlandleathergoods.com",
      "www.quince.com",
      "www.thursdayboots.com",
      "www.vervetdenim.com",
      "www.bananarepublic.com",
      "www.bananarepublicfactory.com",
      "www.oldnavy.com",
      "www.vervetdenim.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "placeholder.svg"
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
