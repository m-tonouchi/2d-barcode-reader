/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的エクスポートを有効化
  basePath: '/2d-barcode-reader',  // GitHub Pagesのベースパス
  images: {
    unoptimized: true,  // 静的エクスポート用に画像最適化を無効化
  },
};

module.exports = nextConfig; 