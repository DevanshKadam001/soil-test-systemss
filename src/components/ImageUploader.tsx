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
        "Could not access camera. Please verify camera permissions in your browser."
      );
      setUseCamera(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
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
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
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
    <div className="bg-[#e6f3eb] rounded-2xl border border-[#b0d6be] p-6 shadow-sm flex flex-col items-stretch space-y-4 text-[#082212]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#082212] flex items-center gap-2 font-heading">
          <Upload className="w-4 h-4 text-emerald-700" />
          Upload or Snapshot Soil Sample
        </h3>
        {previewUrl && (
          <button
            onClick={resetUploader}
            className="text-xs font-semibold text-[#082212] hover:bg-[#cbe2cd] flex items-center gap-1 transition-colors bg-[#d8ebd9] px-2.5 py-1 rounded-lg border border-[#a2d3b2] cursor-pointer"
            id="clear-photo-btn"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-800" />
            Clear
          </button>
        )}
      </div>

      {cameraError && (
        <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-700" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Upload / Camera Area */}
      <div className="relative min-h-[290px] flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-[#d8ebd9] border-2 border-dashed border-[#a2d3b2] hover:border-emerald-600 transition-all duration-200 shadow-inner">
        {useCamera ? (
          // Camera Mode
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
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                id="capture-shutter-btn"
              >
                <Camera className="w-4 h-4" />
                Capture Soil Frame
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setUseCamera(false);
                }}
                className="px-4 py-2.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer"
                id="cancel-camera-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          // Preview State
          <div className="absolute inset-0 bg-[#0a2013] flex items-center justify-center group">
            <img
              src={previewUrl}
              alt="Soil sample preview"
              className="w-full h-full object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-[#0a2013]/90 backdrop-blur-md flex flex-col items-center justify-center text-white px-6 text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 text-emerald-300">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  AI Diagnostic In Progress
                </p>
                <p className="text-[11px] text-emerald-100/90 mt-1.5 max-w-xs font-sans leading-relaxed">
                  Analyzing soil color profiles, aggregate size, moisture texture & predicting mineral balances...
                </p>
              </div>
            )}
          </div>
        ) : (
          // Drag & Drop Default Area
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "bg-[#cbe2cd] border-emerald-600" : ""
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

            <div className="p-4 bg-[#c3e2cd] text-emerald-900 rounded-2xl mb-3 border border-[#9ed0b0] shadow-2xs group-hover:scale-105 transition-transform">
              <ImageIcon className="w-8 h-8 text-emerald-800" />
            </div>

            <p className="text-sm font-bold text-[#082212] font-heading">
              Drag & drop soil photo here
            </p>
            <p className="text-xs text-[#18482a] mt-1 font-medium">
              Supports JPG, PNG, WEBP up to 10MB
            </p>

            <div className="flex items-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileSelect();
                }}
                className="px-4 py-2 bg-[#0a2e1a] hover:bg-[#123e25] text-white rounded-xl text-xs font-bold transition-all shadow-md border border-[#164d2d] cursor-pointer"
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
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                id="camera-mode-btn"
              >
                <Camera className="w-3.5 h-3.5" />
                Use Camera
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

