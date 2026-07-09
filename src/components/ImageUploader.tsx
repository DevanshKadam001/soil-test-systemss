/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Upload, Camera, RefreshCw, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageSelected, isLoading }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setUseCamera(true);
    setPreviewUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "Could not access your camera. Please ensure permissions are granted and you are on an HTTPS connection or localhost."
      );
      setUseCamera(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Match canvas dimensions to the video stream resolution
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame on the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setPreviewUrl(dataUrl);
        onImageSelected(dataUrl);
        stopCamera();
        setUseCamera(false);
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUploader = () => {
    stopCamera();
    setUseCamera(false);
    setPreviewUrl(null);
    setCameraError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm flex flex-col items-stretch">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-600" />
          Upload or Capture Soil Photo
        </h3>
        {previewUrl && (
          <button
            onClick={resetUploader}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
            id="clear-photo-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {cameraError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Upload / Camera View Area */}
      <div className="relative min-h-[280px] flex flex-col items-center justify-center rounded-xl overflow-hidden bg-stone-50/70 border-2 border-dashed border-stone-200 hover:border-emerald-500/50 transition-colors">
        {useCamera ? (
          // Camera view mode
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
              <button
                onClick={handleCapture}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all"
                id="capture-shutter-btn"
              >
                <Camera className="w-4 h-4" />
                Capture Soil Snapshot
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setUseCamera(false);
                }}
                className="px-4 py-2.5 bg-stone-800/80 hover:bg-stone-900/90 text-white rounded-xl text-xs font-medium backdrop-blur-sm transition-all"
                id="cancel-camera-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          // Preview of selected / captured image
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Soil sample preview"
              className="w-full h-full object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <div className="w-10 h-10 border-4 border-white/30 border-t-emerald-400 rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold tracking-wider uppercase animate-pulse flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Gemini Analyzing Soil...
                </p>
                <p className="text-[10px] text-stone-200 mt-1 max-w-[200px] text-center">
                  Decoding density, texture, moisture, and minerals
                </p>
              </div>
            )}
          </div>
        ) : (
          // Standard Drag-and-Drop Area
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "bg-emerald-50/20 border-emerald-500" : ""
            }`}
            onClick={triggerFileSelect}
            id="drag-drop-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-full mb-3 border border-emerald-100/50 shadow-inner group-hover:scale-105 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>

            <p className="text-sm font-semibold text-stone-800">
              Drag & drop soil photo here
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Supports JPEG, PNG, WEBP up to 10MB
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileSelect();
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
                id="browse-btn"
              >
                Browse Files
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                id="camera-mode-btn"
              >
                <Camera className="w-3.5 h-3.5" />
                Use Camera
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <span>IMAGE SCANNER</span>
        <span>RESOLUTION: AUTO</span>
      </div>
    </div>
  );
}
