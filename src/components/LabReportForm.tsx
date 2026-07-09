/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, RefreshCw, FileQuestion, Layers, AlertCircle } from "lucide-react";

interface LabReportFormProps {
  onAnalyze: (payload: { image?: string; manualValues?: any }) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "Acidic Vineyard (pH 5.4, Low P)",
    values: { ph: 5.4, nitrogen: "Medium", phosphorus: "Low", potassium: "High", organicMatter: "1.8%" }
  },
  {
    name: "Alkaline Clay Loam (pH 7.8, High K)",
    values: { ph: 7.8, nitrogen: "Low", phosphorus: "Medium", potassium: "High", organicMatter: "3.2%" }
  },
  {
    name: "Balanced Organic Vegetable Bed",
    values: { ph: 6.5, nitrogen: "High", phosphorus: "High", potassium: "Medium", organicMatter: "5.5%" }
  }
];

export default function LabReportForm({ onAnalyze, isLoading }: LabReportFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [ph, setPh] = useState<string>("");
  const [nitrogen, setNitrogen] = useState<string>("Medium");
  const [phosphorus, setPhosphorus] = useState<string>("Medium");
  const [potassium, setPotassium] = useState<string>("Medium");
  const [organicMatter, setOrganicMatter] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      alert("Please upload a valid image (JPEG/PNG) or a PDF report format.");
      return;
    }
    setImageName(file.name);

    // Convert to Base64 for the API
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const loadPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setPh(String(preset.values.ph));
    setNitrogen(preset.values.nitrogen);
    setPhosphorus(preset.values.phosphorus);
    setPotassium(preset.values.potassium);
    setOrganicMatter(preset.values.organicMatter);
    setActivePreset(presetIndex);
  };

  const handleReset = () => {
    setImage(null);
    setImageName(null);
    setPh("");
    setNitrogen("Medium");
    setPhosphorus("Medium");
    setPotassium("Medium");
    setOrganicMatter("");
    setActivePreset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have at least SOME info to run the report analysis
    if (!image && !ph && !organicMatter) {
      alert("Please upload an report document, fill out some manual test metrics, or load a preset sample.");
      return;
    }

    const payload: any = {};
    if (image) payload.image = image;

    // Build manualValues if any manual input fields are specified
    if (ph || organicMatter || nitrogen || phosphorus || potassium) {
      payload.manualValues = {
        ph: ph ? parseFloat(ph) : undefined,
        nitrogen,
        phosphorus,
        potassium,
        organicMatter: organicMatter || undefined
      };
    }

    onAnalyze(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Segment: presets */}
      <div className="bg-stone-50 border border-stone-200/40 p-4 rounded-xl">
        <h3 className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-2.5">
          <Layers className="w-3.5 h-3.5 text-stone-500" />
          Quick Preset Lab Reports
        </h3>
        <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
          Don't have a report ready? Click a sample preset below to populate standard diagnostic soil values instantly.
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => loadPreset(index)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                activePreset === index
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-stone-700 border-stone-200/80 hover:border-emerald-600 hover:text-emerald-700"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2 columns (Left: Document Upload, Right: Manual Entry Form) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Box 1: File Uploader */}
        <div className="flex flex-col space-y-3">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Upload Report Document (Image / PDF)
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
              isDragOver
                ? "border-emerald-500 bg-emerald-50/40"
                : image
                ? "border-emerald-200 bg-emerald-50/10"
                : "border-stone-200 hover:border-stone-300 bg-stone-50/30"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            
            {image ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mx-auto border border-emerald-200">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800 line-clamp-1 max-w-[200px] mx-auto">
                    {imageName}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                    Ready for OCR analysis
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="text-[10px] text-red-600 font-bold hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400 mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-700">
                    Drag & drop or <span className="text-emerald-700 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Supports JPG, PNG, or PDF report files
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Box 2: Manual Metrics */}
        <div className="space-y-4 border border-stone-100 p-5 rounded-xl bg-white shadow-sm/50">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 pb-1 border-b border-stone-50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Soil Chemical Metrics (Manual Entry)
          </label>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Soil pH level
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="10.0"
                placeholder="e.g. 6.5"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Organic Matter (%)
              </label>
              <input
                type="text"
                placeholder="e.g. 3.5%"
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Nitrogen (N)
              </label>
              <select
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full text-xs px-2.5 py-2 bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-stone-700"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Phosphorus (P)
              </label>
              <select
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full text-xs px-2.5 py-2 bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-stone-700"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Potassium (K)
              </label>
              <select
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full text-xs px-2.5 py-2 bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-stone-700"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Help Note */}
      <div className="p-3.5 bg-amber-50/50 border border-amber-100 text-[11px] text-amber-800 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Agronomist Recommendation:</span> For maximum accuracy, upload an image of the physical soil report. The Gemini model reads laboratory chemical figures and prints an instantly actionable agricultural schedule.
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/60"
        >
          Reset form
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Processing Lab Metrics...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate Soil Analysis Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}
