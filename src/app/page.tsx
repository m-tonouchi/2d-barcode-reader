'use client';

import { useState } from 'react';
import { BarcodeReader } from '@/components/BarcodeReader';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (text: string) => {
    setResult(text);
    setError(null);
  };

  const handleError = (err: Error) => {
    setError(err.message);
    setResult(null);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          2Dバーコードリーダー
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <BarcodeReader
            onResult={handleResult}
            onError={handleError}
          />
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              スキャン結果:
            </h2>
            <p className="text-green-700 break-all">{result}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              エラー:
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
