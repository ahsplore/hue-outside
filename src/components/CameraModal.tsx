import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RotateCcw, Check, AlertCircle, SwitchCamera } from 'lucide-react';
import type { PhotoType } from '../types';


interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PhotoType;
  colorName: string;
  colorHex: string;
  onPhotoCaptured: (dataUrl: string, caption?: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  type,
  colorName,
  colorHex,
  onPhotoCaptured
}) => {
  const [mode, setMode] = useState<'upload' | 'live_camera'>('upload');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async (facing: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Webcam/camera access is not supported in this browser.');
      setMode('upload');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: unknown) {
      console.error('Camera error:', err);
      setCameraError('Could not access camera. Please check permissions or upload an image file.');
      setMode('upload');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCaption('');
      setCameraError(null);
    } else if (mode === 'live_camera') {
      startCamera(facingMode);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, facingMode]);

  if (!isOpen) return null;

  // Snap photo from live video stream
  const snapLivePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Compress & handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize canvas if excessively huge to keep IndexedDB snappy
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(compressedDataUrl);
        } else {
          setCapturedImage(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage, caption.trim() || undefined);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (mode === 'live_camera') {
      startCamera(facingMode);
    }
  };

  const typeTitle = type === 'nature' ? 'Find it in Nature' : 'Find it in Everyday Life';
  const typeHint =
    type === 'nature'
      ? 'Look for leaves, petals, rocks, water reflections, moss, or the sky.'
      : 'Look for clothing, books, coffee cups, signs, vehicles, or home decor.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#E8E2D5] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-4 h-4 rounded-full ring-2 ring-white shadow-2xs"
              style={{ backgroundColor: colorHex }}
            />
            <div>
              <h3 className="font-serif-title font-bold text-lg text-[#193826]">
                {typeTitle}
              </h3>
              <p className="text-xs text-[#52796F]">
                Matching hue: <strong className="text-[#193826]">{colorName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#52796F] hover:bg-[#F3ECE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-[#4E6759] bg-[#F1EBE1] p-3 rounded-2xl border border-[#E2D9CA]">
            {typeHint}
          </p>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* If image is already captured or picked */}
          {capturedImage ? (
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black/5 border border-[#E8E2D5] shadow-inner">
                <img
                  src={capturedImage}
                  alt="Captured preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colorHex }}
                  />
                  <span>Target: {colorName}</span>
                </div>
              </div>

              {/* Caption field */}
              <div>
                <label className="block text-xs font-semibold text-[#193826] mb-1">
                  Field Notes / Where did you find it? (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={type === 'nature' ? 'e.g. Under the mossy birch tree in the park' : 'e.g. Ceramic tea mug on breakfast table'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C2] bg-white text-sm text-[#193826] placeholder-[#8C9E94] focus:outline-none focus:ring-2 focus:ring-[#2D5A40]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#D8D0C2] text-[#334E3F] hover:bg-[#F3ECE1] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Photo
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#193826] text-white hover:bg-[#234B34] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  Save Photo
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EBE4D5] rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('upload');
                    stopCamera();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'upload'
                      ? 'bg-white text-[#193826] shadow-xs'
                      : 'text-[#52796F] hover:text-[#193826]'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Device File / Photos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('live_camera');
                    startCamera(facingMode);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'live_camera'
                      ? 'bg-white text-[#193826] shadow-xs'
                      : 'text-[#52796F] hover:text-[#193826]'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Live Camera
                </button>
              </div>

              {/* Upload mode */}
              {mode === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#CFC5B4] hover:border-[#193826] bg-white hover:bg-[#FAF7F0] rounded-2xl p-8 text-center cursor-pointer transition-all group flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F3ECE1] group-hover:bg-[#E8E0D2] flex items-center justify-center text-[#193826] transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#193826]">
                      Click to choose a photo from your device
                    </p>
                    <p className="text-xs text-[#6C8578] mt-1">
                      Supports JPG, PNG, HEIC, WebP
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Live camera mode */}
              {mode === 'live_camera' && (
                <div className="space-y-3">
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Camera switch button (mobile) */}
                    <button
                      type="button"
                      onClick={() => {
                        const newFacing = facingMode === 'environment' ? 'user' : 'environment';
                        setFacingMode(newFacing);
                      }}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-xs"
                      title="Flip camera"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>

                    {/* Color Target badge */}
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span>Spotting {colorName}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={snapLivePhoto}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#193826] hover:bg-[#234B34] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <Camera className="w-5 h-5" />
                    Snap Photo Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
