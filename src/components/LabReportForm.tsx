/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  AlertCircle, 
  Check, 
  FileCheck, 
  Search, 
  X, 
  Eye,
  Sliders,
  CheckCircle2
} from "lucide-react";

interface LabReportFormProps {
  onAnalyze: (payload: { image?: string; manualValues?: any }) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "ICAR Certified Soil Health Card (Punjab - Wheat Belt)",
    description: "Slightly Alkaline pH 7.6, High K, Med N, OC 0.45%, EC 0.8 dS/m",
    values: { 
      ph: "7.6", 
      nitrogen: "Medium", 
      phosphorus: "Medium", 
      potassium: "High", 
      organicMatter: "0.45%",
      ec: "0.8 dS/m",
      zinc: "Deficient",
      iron: "Sufficient",
      boron: "Deficient",
      sulfur: "Medium"
    }
  },
  {
    name: "KVK Red Soil Certificate (Karnataka - Cotton / Maize)",
    description: "Acidic pH 5.6, Deficient P, Low OC 0.35%, EC 0.2 dS/m",
    values: { 
      ph: "5.6", 
      nitrogen: "Low", 
      phosphorus: "Low", 
      potassium: "Medium", 
      organicMatter: "0.35%",
      ec: "0.2 dS/m",
      zinc: "Sufficient",
      iron: "Deficient",
      boron: "Deficient",
      sulfur: "Low"
    }
  },
  {
    name: "State Agri Dept Report (Maharashtra - Black Clay Loam)",
    description: "Alkaline pH 8.1, High K, Moderate P, Saline EC 1.6 dS/m",
    values: { 
      ph: "8.1", 
      nitrogen: "Medium", 
      phosphorus: "High", 
      potassium: "High", 
      organicMatter: "0.65%",
      ec: "1.6 dS/m",
      zinc: "Deficient",
      iron: "Deficient",
      boron: "Sufficient",
      sulfur: "High"
    }
  },
  {
    name: "Organic Horticulture Bed (Himachal - Apple / Orchard)",
    description: "Optimal pH 6.5, High Organic Matter 2.8%, Rich NPK",
    values: { 
      ph: "6.5", 
      nitrogen: "High", 
      phosphorus: "High", 
      potassium: "High", 
      organicMatter: "2.80%",
      ec: "0.4 dS/m",
      zinc: "Sufficient",
      iron: "Sufficient",
      boron: "Sufficient",
      sulfur: "High"
    }
  }
];

export default function LabReportForm({ onAnalyze, isLoading }: LabReportFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [ph, setPh] = useState<string>("");
  const [nitrogen, setNitrogen] = useState<string>("Medium");
  const [phosphorus, setPhosphorus] = useState<string>("Medium");
  const [potassium, setPotassium] = useState<string>("Medium");
  const [organicMatter, setOrganicMatter] = useState<string>("");
  const [ec, setEc] = useState<string>("");
  const [zinc, setZinc] = useState<string>("Sufficient");
  const [iron, setIron] = useState<string>("Sufficient");
  const [boron, setBoron] = useState<string>("Sufficient");
  const [sulfur, setSulfur] = useState<string>("Medium");
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      alert("Please upload a valid soil lab report scan image (JPEG/PNG/WebP) or PDF file.");
      return;
    }
    setImageName(file.name);
    
    // Format file size
    const kb = (file.size / 1024).toFixed(1);
    const mb = (file.size / (1024 * 1024)).toFixed(2);
    setImageSize(file.size > 1024 * 1024 ? `${mb} MB` : `${kb} KB`);

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
    setPh(preset.values.ph);
    setNitrogen(preset.values.nitrogen);
    setPhosphorus(preset.values.phosphorus);
    setPotassium(preset.values.potassium);
    setOrganicMatter(preset.values.organicMatter);
    setEc(preset.values.ec);
    setZinc(preset.values.zinc);
    setIron(preset.values.iron);
    setBoron(preset.values.boron);
    setSulfur(preset.values.sulfur);
    setActivePreset(presetIndex);
    setShowAdvanced(true);
  };

  const handleReset = () => {
    setImage(null);
    setImageName(null);
    setImageSize(null);
    setPh("");
    setNitrogen("Medium");
    setPhosphorus("Medium");
    setPotassium("Medium");
    setOrganicMatter("");
    setEc("");
    setZinc("Sufficient");
    setIron("Sufficient");
    setBoron("Sufficient");
    setSulfur("Medium");
    setActivePreset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image && !ph && !organicMatter && !ec) {
      alert("Please upload a soil lab test document or fill in at least one measured chemical metric (pH, NPK, or EC).");
      return;
    }

    const payload: any = {};
    if (image) payload.image = image;

    if (ph || organicMatter || nitrogen || phosphorus || potassium || ec || zinc) {
      payload.manualValues = {
        ph: ph ? parseFloat(ph) : undefined,
        nitrogen,
        phosphorus,
        potassium,
        organicMatter: organicMatter || undefined,
        ec: ec || undefined,
        zinc,
        iron,
        boron,
        sulfur
      };
    }

    onAnalyze(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Benchmark Sample Lab Cards */}
      <div className="bg-[#d8ebd9] border border-[#a2d3b2] p-4 rounded-2xl space-y-2.5 text-[#082212] shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#082212] flex items-center gap-1.5 font-heading">
            <FileCheck className="w-4 h-4 text-emerald-800" />
            Certified Soil Health Card Benchmarks
          </h4>
          <span className="text-[10px] font-bold text-emerald-900 bg-white border border-[#9ed0b0] px-2 py-0.5 rounded-full font-mono shadow-2xs">
            1-Click Auto Fill
          </span>
        </div>
        <p className="text-[11px] text-[#1b4e2e] leading-relaxed font-sans font-medium">
          Load standard agricultural soil test lab cards directly into the analysis form:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((preset, index) => {
            const isSelected = activePreset === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => loadPreset(index)}
                className={`p-2.5 text-left rounded-xl border transition-all font-sans relative cursor-pointer ${
                  isSelected
                    ? "bg-[#0a2e1a] text-white border-[#164d2d] shadow-sm ring-2 ring-emerald-600/30"
                    : "bg-white text-[#082212] border-[#a2d3b2] hover:border-emerald-600 hover:bg-[#eef7f1]"
                }`}
                id={`lab-preset-${index}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs font-heading leading-snug">
                    {preset.name}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                  )}
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? "text-emerald-200" : "text-[#1b4e2e] font-medium"}`}>
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Workspace: Document Scan vs. Chemical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        
        {/* Document Scanner / Image Upload Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#082212] flex items-center gap-1.5 font-heading">
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              Soil Lab Sheet / Scan (PDF/Image)
            </label>
            {imageName && (
              <span className="text-[10px] text-emerald-800 font-bold font-mono">
                {imageSize}
              </span>
            )}
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[210px] relative overflow-hidden ${
              isDragOver
                ? "border-emerald-600 bg-[#cbe2cd]"
                : image
                ? "border-emerald-600 bg-[#d8ebd9]"
                : "border-[#a2d3b2] hover:border-emerald-600 bg-[#d8ebd9]"
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
              <div className="w-full space-y-3 py-1">
                {/* Thumbnail if image base64 */}
                {image.startsWith("data:image/") ? (
                  <div className="relative w-full h-28 max-w-[200px] mx-auto rounded-xl overflow-hidden border border-emerald-600 shadow-2xs">
                    <img 
                      src={image} 
                      alt="Uploaded Soil Lab Document" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-2 py-1 bg-stone-900/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 font-mono border border-emerald-500/30">
                        <Search className="w-3 h-3 text-emerald-400" />
                        OCR Ready
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#c3e2cd] rounded-2xl flex items-center justify-center text-emerald-900 mx-auto border border-[#9ed0b0]">
                    <FileText className="w-6 h-6" />
                  </div>
                )}

                <div className="px-2">
                  <p className="text-xs font-bold text-[#082212] line-clamp-1 font-heading">
                    {imageName}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-mono mt-0.5 font-bold">
                    Document attached • Ready for AI Extraction
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="px-3 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold rounded-lg transition-colors border border-rose-300 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove Document</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-[#c3e2cd] rounded-2xl flex items-center justify-center text-emerald-900 mx-auto border border-[#9ed0b0]">
                  <Upload className="w-6 h-6 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#082212] font-heading">
                    Drag & drop or <span className="text-emerald-800 underline">browse scan</span>
                  </p>
                  <p className="text-[10px] text-[#1b4e2e] font-medium mt-1 max-w-[200px] mx-auto leading-tight">
                    Upload official Soil Health Card, Krishi Vigyan lab photo, or test report PDF
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chemical Metrics Form */}
        <div className="space-y-3 border border-[#a2d3b2] p-4 rounded-2xl bg-[#d8ebd9] shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#a2d3b2]">
            <label className="text-xs font-bold text-[#082212] flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
              Measured Lab Metrics
            </label>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <Sliders className="w-3 h-3" />
              <span>{showAdvanced ? "Basic View" : "Micronutrients"}</span>
            </button>
          </div>

          {/* Primary Metrics: pH & Organic Matter */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                Soil pH
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="10.0"
                placeholder="e.g. 6.8"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#9ed0b0] text-[#082212] placeholder-[#1b4e2e]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                Organic Carbon / Matter
              </label>
              <input
                type="text"
                placeholder="e.g. 0.55%"
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#9ed0b0] text-[#082212] placeholder-[#1b4e2e]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono font-medium shadow-2xs"
              />
            </div>
          </div>

          {/* NPK Status */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                Nitrogen (N)
              </label>
              <select
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full text-xs px-1.5 py-1.5 bg-white border border-[#9ed0b0] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-[#082212] shadow-2xs"
              >
                <option value="Low" className="text-[#082212]">Low</option>
                <option value="Medium" className="text-[#082212]">Medium</option>
                <option value="High" className="text-[#082212]">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                Phosphorus (P)
              </label>
              <select
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full text-xs px-1.5 py-1.5 bg-white border border-[#9ed0b0] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-[#082212] shadow-2xs"
              >
                <option value="Low" className="text-[#082212]">Low</option>
                <option value="Medium" className="text-[#082212]">Medium</option>
                <option value="High" className="text-[#082212]">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                Potassium (K)
              </label>
              <select
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full text-xs px-1.5 py-1.5 bg-white border border-[#9ed0b0] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-[#082212] shadow-2xs"
              >
                <option value="Low" className="text-[#082212]">Low</option>
                <option value="Medium" className="text-[#082212]">Medium</option>
                <option value="High" className="text-[#082212]">High</option>
              </select>
            </div>
          </div>

          {/* Advanced Micronutrients (EC, Zinc, Iron, Boron, Sulfur) */}
          {showAdvanced && (
            <div className="pt-2 border-t border-[#a2d3b2] space-y-2.5 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                    EC (Salinity dS/m)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0.8 dS/m"
                    value={ec}
                    onChange={(e) => setEc(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-[#9ed0b0] text-[#082212] rounded-lg font-mono font-medium placeholder-[#1b4e2e]/50 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#082212] uppercase tracking-wider mb-1 font-mono">
                    Zinc (Zn) Status
                  </label>
                  <select
                    value={zinc}
                    onChange={(e) => setZinc(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-[#9ed0b0] rounded-lg text-[#082212] font-bold shadow-2xs"
                  >
                    <option value="Deficient" className="text-[#082212]">Deficient</option>
                    <option value="Sufficient" className="text-[#082212]">Sufficient</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="block text-[8px] font-bold text-[#082212] uppercase tracking-wider mb-0.5 font-mono">
                    Iron (Fe)
                  </label>
                  <select
                    value={iron}
                    onChange={(e) => setIron(e.target.value)}
                    className="w-full text-[11px] px-1.5 py-1 bg-white border border-[#9ed0b0] text-[#082212] font-bold rounded-lg shadow-2xs"
                  >
                    <option value="Deficient" className="text-[#082212]">Deficient</option>
                    <option value="Sufficient" className="text-[#082212]">Sufficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-[#082212] uppercase tracking-wider mb-0.5 font-mono">
                    Boron (B)
                  </label>
                  <select
                    value={boron}
                    onChange={(e) => setBoron(e.target.value)}
                    className="w-full text-[11px] px-1.5 py-1 bg-white border border-[#9ed0b0] text-[#082212] font-bold rounded-lg shadow-2xs"
                  >
                    <option value="Deficient" className="text-[#082212]">Deficient</option>
                    <option value="Sufficient" className="text-[#082212]">Sufficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-[#082212] uppercase tracking-wider mb-0.5 font-mono">
                    Sulfur (S)
                  </label>
                  <select
                    value={sulfur}
                    onChange={(e) => setSulfur(e.target.value)}
                    className="w-full text-[11px] px-1.5 py-1 bg-white border border-[#9ed0b0] text-[#082212] font-bold rounded-lg shadow-2xs"
                  >
                    <option value="Low" className="text-[#082212]">Low</option>
                    <option value="Medium" className="text-[#082212]">Medium</option>
                    <option value="High" className="text-[#082212]">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Advisory Note */}
      <div className="p-3 bg-amber-100 border border-amber-300 text-[11px] text-amber-950 rounded-xl flex items-start gap-2 shadow-2xs">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed font-sans">
          <span className="font-bold font-heading">AI Agronomy Tip:</span> Uploading a Soil Health Card image uses optical character recognition to analyze chemical values automatically and generate customized fertilizer correction schedules.
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-bold text-[#082212] hover:bg-[#cbe2cd] rounded-xl transition-colors border border-[#a2d3b2] cursor-pointer"
        >
          Reset Form
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 font-heading cursor-pointer"
          id="submit-lab-report-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Soil Report...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Analyze Soil Lab Report</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}


