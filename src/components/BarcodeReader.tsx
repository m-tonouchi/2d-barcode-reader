'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface BarcodeReaderProps {
  onResult?: (result: string) => void;
  onError?: (error: Error) => void;
}

export const BarcodeReader: React.FC<BarcodeReaderProps> = ({
  onResult,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        if (!videoRef.current) return;

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const selectedDeviceId = videoDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          throw new Error('カメラが見つかりませんでした。');
        }

        setIsScanning(true);
        setError(null);

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result: Result | null, err?: Error) => {
            if (result && mounted) {
              onResult?.(result.getText());
            }
            if (err && mounted) {
              setError(err.message);
              onError?.(err);
            }
          }
        );
      } catch (err) {
        if (mounted) {
          const error = err instanceof Error ? err : new Error('スキャン中にエラーが発生しました。');
          setError(error.message);
          onError?.(error);
        }
      }
    };

    startScanning();

    return () => {
      mounted = false;
      codeReader.reset();
    };
  }, [onResult, onError]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-square">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
        />
        {isScanning && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse" />
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}; 