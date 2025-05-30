'use client';

import { useRef, useState, useEffect } from 'react';
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
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleScanError = (message: string) => {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 2000); // 2秒で消す
  };

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videos = devices.filter(device => device.kind === 'videoinput');
    setVideoDevices(videos);
    setSelectedDeviceId(videos[0]?.deviceId ?? null);
  };

  useEffect(() => {
    getDevices();
  }, []);

  const startScanning = async () => {
    const codeReader = new BrowserMultiFormatReader();
    const mounted = true;
    try {
      if (!videoRef.current) return;

      // 選択されたカメラでストリーム取得
      let stream: MediaStream | null = null;
      let gotCamera = false;
      if (selectedDeviceId) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDeviceId } }
          });
          gotCamera = true;
        } catch {
          gotCamera = false;
        }
      }
      // deviceId指定で失敗した場合や未選択の場合はfacingModeでトライ
      if (!gotCamera) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          gotCamera = true;
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            gotCamera = true;
          } catch {
            gotCamera = false;
          }
        }
      }

      if (!gotCamera || !stream) {
        throw new Error('カメラが見つかりませんでした。');
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsScanning(true);
      setError(null);

      // カメラ許可後に再度デバイス一覧を取得
      await getDevices();

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId ?? null,
        videoRef.current,
        (result: Result | null, err?: Error) => {
          if (result && mounted) {
            setError(null); // スキャン成功時にエラーを消す
            onResult?.(result.getText());
          }
          if (err && mounted) {
            if (err.message === 'No MultiFormat Readers were able to detect the code.') {
              handleScanError('バーコードが検出できませんでした。カメラにバーコードを映してください。');
            } else {
              setError(err.message);
              onError?.(err);
            }
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-square">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          playsInline
        />
        {isScanning && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse" />
        )}
      </div>
      {!isScanning && (
        <>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={startScanning}
          >
            カメラを起動
          </button>
          <select
            className="mt-2 px-2 py-1 border rounded"
            value={selectedDeviceId ?? ''}
            onChange={e => setSelectedDeviceId(e.target.value || null)}
          >
            {videoDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `カメラ${device.deviceId}`}
              </option>
            ))}
          </select>
        </>
      )}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}; 