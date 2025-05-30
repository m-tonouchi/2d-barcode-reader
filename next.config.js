/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的エクスポートを有効化
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,  // 静的エクスポート用に画像最適化を無効化
  },
  trailingSlash: true,
};

module.exports = nextConfig; 