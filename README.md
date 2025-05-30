# 2Dバーコードリーダー

Webブラウザで動作する2Dバーコードリーダーアプリケーションです。QRコードやその他の2Dバーコードをカメラで読み取ることができます。

## 機能

- QRコード、DataMatrix、Aztec、PDF417などの2Dバーコードの読み取り
- リアルタイムカメラフィード
- モダンなUIデザイン
- レスポンシブ対応

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- @zxing/library

## 開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/yourusername/2d-barcode-reader.git
cd 2d-barcode-reader
```

2. 依存関係のインストール:
```bash
npm install
```

3. 開発サーバーの起動:
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開く

## 使用方法

1. アプリケーションを開く
2. カメラへのアクセスを許可する
3. バーコードをカメラに向ける
4. バーコードが読み取られると、結果が画面に表示される

## 注意事項

- HTTPS環境またはlocalhostでの実行が必要です（カメラアクセスの要件）
- カメラが搭載されているデバイスが必要です
- 最新のWebブラウザ（Chrome、Firefox、Safari、Edge）での使用を推奨します

## ライセンス

MITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。
