import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 560],
  },
};

const withMDX = createMDX();

export default withMDX(config);
