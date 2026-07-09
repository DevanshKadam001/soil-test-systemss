/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SoilAnalysis } from "../types";
import { 
  Sparkles, 
  Droplets, 
  Compass, 
  Tag, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  Flame, 
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  Clock,
  BookOpen
} from "lucide-react";

interface AnalysisResultViewProps {
  analysis: SoilAnalysis;
  imageUrl?: string;
  isPreset?: boolean;
}

export default function AnalysisResultView({ analysis, imageUrl, isPreset }: AnalysisResultViewProps) {
  const getSoilBadgeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("clay")) return "bg-amber-100 text-amber-900 border-amber-200/50";
    if (t.includes("sand")) return "bg-orange-100 text-orange-900 border-orange-200/50";
    if (t.includes("loam")) return "bg-emerald-100 text-emerald-900 border-emerald-200/50";
    if (t.includes("silt")) return "bg-yellow-100 text-yellow-900 border-yellow-200/50";
    if (t.includes("peat")) return "bg-stone-200 text-stone-900 border-stone-300/50";
    if (t.includes("chalk")) return "bg-sky-100 text-sky-900 border-sky-200/50";
    return "bg-emerald-100 text-emerald-900 border-emerald-200/50";
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deficient") || s.includes("low")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Deficient / Low
        </span>
      );
    }
    if (s.includes("surplus") || s.includes("high")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <AlertTriangle className="w-3 h-3 text-blue-600" />
          Surplus / High
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Optimum
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {analysis.isFallback && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-amber-950 shadow-sm" id="fallback-alert-banner">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold">Backup Diagnostic Engine Active</h4>
            <p className="text-amber-900/90 leading-relaxed">
              The remote Gemini API is currently offline or experiencing a high-traffic rate limit. To keep your workflow seamless, our high-fidelity deterministic agronomical models have successfully analyzed your soil profile.
            </p>
          </div>
        </div>
      )}

      {/* Soil Type Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
          {imageUrl && (
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100 shadow-sm/50">
              <img 
                src={imageUrl} 
                alt={analysis.soilType} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getSoilBadgeColor(analysis.soilType)}`}>
                {analysis.soilType}
              </span>
              <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200/30 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-stone-500" />
                Confidence: {analysis.confidenceScore}%
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100/30 capitalize">
                {analysis.analysisType === "lab_report" ? "Lab Report Analysis" : "Soil Photo Analysis"}
              </span>
              {isPreset && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold rounded-lg">
                  Practice Preset
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              {analysis.soilType} Analysis Result
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              Our AI agronomist has analyzed your soil profile. Below is your tailored, deep-dive report of mineral balance, fertilizer amendments, and optimal irrigation cycles.
            </p>
          </div>
        </div>

        {/* Diagnostic Metrics Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-stone-100 divide-x divide-y md:divide-y-0 divide-stone-100 bg-stone-50/40">
          <div className="p-5 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-stone-500" />
              pH Balance
            </span>
            <p className="text-sm sm:text-base font-bold text-stone-800">{analysis.phRange}</p>
          </div>
          <div className="p-5 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-stone-500" />
              Moisture Retention
            </span>
            <p className="text-sm sm:text-base font-bold text-stone-800">{analysis.moistureRetention.split('.')[0]}</p>
          </div>
          <div className="p-5 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              Texture Profile
            </span>
            <p className="text-sm sm:text-base font-bold text-stone-800 capitalize">{analysis.texture}</p>
          </div>
          <div className="p-5 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              Primary Color
            </span>
            <p className="text-sm sm:text-base font-bold text-stone-800 capitalize">{analysis.color}</p>
          </div>
        </div>
      </div>

      {/* Lab Values visualizer (if lab report mode and values exist) */}
      {analysis.analysisType === "lab_report" && analysis.labValues && (
        <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-6 shadow-sm/50 space-y-4">
          <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-100/40">
            <Beaker className="w-4 h-4 text-emerald-700" />
            Registered Soil Chemistry Inputs
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-3 rounded-xl border border-stone-100 text-center">
              <p className="text-[10px] text-stone-400 uppercase font-mono">Soil pH</p>
              <p className="text-lg font-extrabold text-emerald-800 font-mono mt-1">{analysis.labValues.ph || "N/A"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-100 text-center">
              <p className="text-[10px] text-stone-400 uppercase font-mono">Nitrogen (N)</p>
              <p className="text-sm font-extrabold text-stone-800 mt-1">{analysis.labValues.nitrogen || "Medium"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-100 text-center">
              <p className="text-[10px] text-stone-400 uppercase font-mono">Phosphorus (P)</p>
              <p className="text-sm font-extrabold text-stone-800 mt-1">{analysis.labValues.phosphorus || "Medium"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-100 text-center">
              <p className="text-[10px] text-stone-400 uppercase font-mono">Potassium (K)</p>
              <p className="text-sm font-extrabold text-stone-800 mt-1">{analysis.labValues.potassium || "Medium"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-100 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] text-stone-400 uppercase font-mono">Organic Matter</p>
              <p className="text-sm font-extrabold text-emerald-800 font-mono mt-1">{analysis.labValues.organicMatter || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Characteristics, Improvements & Irrigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Characteristics Column */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2 border-b border-stone-100 pb-3">
            <Info className="w-4 h-4 text-emerald-600" />
            Physical & Mineral Characteristics
          </h3>
          <ul className="space-y-2.5">
            {analysis.keyCharacteristics.map((char, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 leading-normal">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{char}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-800 mb-2">Nutrient Assessment:</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.nutrientProfile.map((nutrient, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-200/30 text-[11px] leading-tight font-medium"
                >
                  {nutrient}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Irrigation Schedule & Soil Conditioning */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2 border-b border-stone-100 pb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Soil conditioning & Amendments
          </h3>
          <div className="space-y-3">
            {analysis.soilImprovementTips.slice(0, 3).map((tip, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 border border-amber-100/30">
                  {idx + 1}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Irrigation Schedule details (New feature) */}
          {analysis.irrigationSchedule && (
            <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-xl mt-4 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Optimal Irrigation Blueprint
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-1 border-b border-blue-100/20 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block font-semibold uppercase tracking-wide">Frequency</span>
                  <span className="font-bold text-blue-900">{analysis.irrigationSchedule.frequency}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block font-semibold uppercase tracking-wide">Best Time of Day</span>
                  <span className="font-bold text-blue-900">{analysis.irrigationSchedule.optimalTiming}</span>
                </div>
              </div>
              <ul className="space-y-1 pt-1">
                {analysis.irrigationSchedule.criticalTips.map((tip, idx) => (
                  <li key={idx} className="text-[11px] text-blue-800 leading-normal flex items-start gap-1.5">
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* NEW: Fertilizer & Nutrient Recommendations Panel */}
      {analysis.fertilizerRecommendations && analysis.fertilizerRecommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2 border-b border-stone-100 pb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
            Fertilizer & Mineral Recommendations Panel
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed max-w-3xl">
            Correct mineral deficiencies or manage excess nutrients safely with these crop-specific guidelines and compost recommendations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {analysis.fertilizerRecommendations.map((rec, idx) => (
              <div key={idx} className="border border-stone-100 rounded-xl p-4.5 bg-stone-50/30 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold text-stone-900">{rec.nutrient}</span>
                    {getStatusBadge(rec.status)}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {rec.recommendation}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-stone-100 text-[11px]">
                  <div>
                    <span className="text-stone-400 block font-semibold mb-1">Organic Solutions:</span>
                    <div className="flex flex-wrap gap-1">
                      {rec.organicSources.map((src, sIdx) => (
                        <span key={sIdx} className="bg-emerald-50 text-emerald-800 border border-emerald-100/40 rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-semibold mb-1">Chemical Formulations:</span>
                    <div className="flex flex-wrap gap-1">
                      {rec.chemicalSources.map((src, sIdx) => (
                        <span key={sIdx} className="bg-stone-100 text-stone-700 border border-stone-200/40 rounded-md px-1.5 py-0.5 text-[10px] font-mono">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suitable Crops Section */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px bg-stone-200 flex-1" />
          <h3 className="text-xs font-bold text-stone-400 tracking-widest uppercase px-3">
            Suitable Crop Optimization Matrix
          </h3>
          <div className="h-px bg-stone-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.suitableCrops.map((crop, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm flex flex-col hover:border-emerald-500/30 transition-all duration-200">
              {/* Crop Header */}
              <div className="p-5 border-b border-stone-100 bg-stone-50/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100/50 uppercase tracking-wider">
                    {crop.type}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    OPTIMAL #0{idx + 1}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 mt-2">
                  {crop.name}
                </h4>
              </div>

              {/* Crop Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-800 block mb-0.5">Why it succeeds:</span>
                    {crop.whySuitable}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-stone-100">
                    <div>
                      <span className="text-stone-400 block font-medium">Sowing Season</span>
                      <span className="font-bold text-stone-700">{crop.sowingSeason}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Water Needed</span>
                      <span className="font-bold text-stone-700">{crop.waterRequirement}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-stone-800 block">Cultivation Action Tips:</span>
                  <ul className="space-y-1.5">
                    {crop.careTips.map((tip, cIdx) => (
                      <li key={cIdx} className="text-[11px] text-stone-500 leading-normal flex items-start gap-1.5">
                        <span className="text-emerald-500 shrink-0 select-none">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fact & Science Footer */}
      {analysis.funFact && (
        <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/30 text-[11px] leading-relaxed text-emerald-800">
          <span className="font-bold flex items-center gap-1 mb-1 text-emerald-900">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Science Trivia Fact
          </span>
          {analysis.funFact}
        </div>
      )}
    </div>
  );
}
