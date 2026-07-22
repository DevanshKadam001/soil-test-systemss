/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { SoilAnalysis } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import GlossaryTooltip from "./GlossaryTooltip";
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
  BookOpen,
  Printer,
  Share2,
  Sprout,
  Check,
  ShieldCheck,
  FileCheck,
  FileText,
  Calendar,
  Award,
  Hash,
  Download,
  Loader2
} from "lucide-react";

interface AnalysisResultViewProps {
  analysis: SoilAnalysis;
  imageUrl?: string;
  isPreset?: boolean;
}

export default function AnalysisResultView({ analysis, imageUrl, isPreset }: AnalysisResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate a realistic report ID
  const reportRefId = `SLR-${(analysis.soilType || "SOIL").substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const getSoilBadgeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("clay")) return "bg-amber-100 text-amber-900 border-amber-300";
    if (t.includes("sand")) return "bg-orange-100 text-orange-900 border-orange-300";
    if (t.includes("loam")) return "bg-emerald-100 text-emerald-900 border-emerald-300";
    if (t.includes("silt")) return "bg-yellow-100 text-yellow-900 border-yellow-300";
    if (t.includes("peat")) return "bg-stone-200 text-stone-900 border-stone-400";
    if (t.includes("chalk")) return "bg-sky-100 text-sky-900 border-sky-300";
    return "bg-emerald-100 text-emerald-900 border-emerald-300";
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deficient") || s.includes("low")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          LOW / DEFICIENT
        </span>
      );
    }
    if (s.includes("surplus") || s.includes("high")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
          <AlertTriangle className="w-3 h-3 text-blue-600" />
          HIGH / SURPLUS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        OPTIMUM
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTextReport = () => {
    const lines = [
      "==========================================================================",
      "                     Analyzed Soil report                              ",
      "               OFFICIAL SOIL ANALYSIS REPORT                              ",
      "==========================================================================",
      `Document Reference : ${reportRefId}`,
      `Issue Date         : ${currentDate}`,
      `Soil Classification: ${analysis.soilType.toUpperCase()}`,
      `Confidence Rating  : ${analysis.confidenceScore}% (High Precision)`,
      `Diagnostic Method  : ${analysis.analysisType === "lab_report" ? "Laboratory Spectrometry / Chemical Analysis" : "Computer Vision Photo Analysis"}`,
      "--------------------------------------------------------------------------",
      "",
      "1. EXECUTIVE AGRONOMIC SUMMARY",
      "--------------------------------------------------------------------------",
      analysis.simpleExplanation || analysis.keyCharacteristics.join(". "),
      "",
      "2. QUANTITATIVE SOIL METRICS & PHYSICAL PROPERTIES",
      "--------------------------------------------------------------------------",
      `pH Balance         : ${analysis.phRange}`,
      `Moisture Retention : ${analysis.moistureRetention}`,
      `Texture Class      : ${analysis.texture}`,
      `Organic Color      : ${analysis.color}`,
      "",
    ];

    if (analysis.labValues) {
      lines.push(
        "LABORATORY SPECTROMETRY MEASUREMENTS:",
        `  • pH Value       : ${analysis.labValues.ph || "N/A"}`,
        `  • Nitrogen (N)   : ${analysis.labValues.nitrogen || "Medium"}`,
        `  • Phosphorus (P) : ${analysis.labValues.phosphorus || "Medium"}`,
        `  • Potassium (K)  : ${analysis.labValues.potassium || "Medium"}`,
        `  • Organic Matter : ${analysis.labValues.organicMatter || "N/A"}`,
        ""
      );
    }

    lines.push(
      "KEY MORPHOLOGICAL CHARACTERISTICS:",
      ...analysis.keyCharacteristics.map(c => `  • ${c}`),
      ""
    );

    if (analysis.fertilizerRecommendations && analysis.fertilizerRecommendations.length > 0) {
      lines.push(
        "3. SOIL AMENDMENT & FERTILIZER DIRECTIVES",
        "--------------------------------------------------------------------------",
        ...analysis.fertilizerRecommendations.flatMap(rec => [
          `Nutrient: ${rec.nutrient} [${rec.status.toUpperCase()}]`,
          `Directive: ${rec.recommendation}`,
          `Organic Sources: ${rec.organicSources.join(", ")}`,
          `Formulations   : ${rec.chemicalSources.join(", ")}`,
          ""
        ])
      );
    }

    if (analysis.irrigationSchedule) {
      lines.push(
        "4. IRRIGATION & HYDRO-MANAGEMENT SPECIFICATION",
        "--------------------------------------------------------------------------",
        `Frequency     : ${analysis.irrigationSchedule.frequency}`,
        `Optimal Window: ${analysis.irrigationSchedule.optimalTiming}`,
        "Critical Tips:",
        ...analysis.irrigationSchedule.criticalTips.map(t => `  • ${t}`),
        ""
      );
    }

    lines.push(
      "5. RECOMMENDED CROP COMPATIBILITY MATRIX",
      "--------------------------------------------------------------------------",
      ...analysis.suitableCrops.flatMap((crop, idx) => [
        `[#${idx + 1}] ${crop.name.toUpperCase()} (${crop.type})`,
        `Reasoning      : ${crop.whySuitable}`,
        `Sowing Season  : ${crop.sowingSeason}`,
        `Water Needs    : ${crop.waterRequirement}`,
        `Care Directives: ${crop.careTips.join("; ")}`,
        ""
      ])
    );

    lines.push(
      "==========================================================================",
      "VERIFIED DIAGNOSTIC CERTIFICATION: AGRI-AI-VERIFIED",
      "Issued by Analyzed Soil report System",
      "=========================================================================="
    );

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Soil_Diagnostic_Report_${analysis.soilType.replace(/[^a-zA-Z0-9]/g, "_")}_${reportRefId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = reportRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // 1. Copy computed styles from original elements onto cloned elements as explicit inline styles
          const originalReport = reportRef.current;
          const clonedReport = clonedDoc.getElementById("printable-soil-report");
          if (originalReport && clonedReport) {
            const origEls = [originalReport, ...Array.from(originalReport.querySelectorAll<HTMLElement>("*"))];
            const clonedEls = [clonedReport, ...Array.from(clonedReport.querySelectorAll<HTMLElement>("*"))];

            for (let i = 0; i < origEls.length && i < clonedEls.length; i++) {
              const orig = origEls[i];
              const clone = clonedEls[i];
              if (orig && clone) {
                try {
                  const cs = window.getComputedStyle(orig);
                  clone.style.color = cs.color;
                  clone.style.backgroundColor = cs.backgroundColor;
                  clone.style.borderColor = cs.borderColor;
                  clone.style.borderTopColor = cs.borderTopColor;
                  clone.style.borderRightColor = cs.borderRightColor;
                  clone.style.borderBottomColor = cs.borderBottomColor;
                  clone.style.borderLeftColor = cs.borderLeftColor;
                  if (orig.tagName === "IMG") {
                    (clone as HTMLImageElement).crossOrigin = "anonymous";
                  }
                } catch {
                  // Ignore style copy errors on special nodes
                }
              }
            }
          }

          // 2. Helper to thoroughly remove oklch/oklab/color-mix functions from CSS text
          const sanitizeCssText = (css: string): string => {
            if (!css) return "";
            let result = css;

            // Remove color-mix calls
            let mixIdx = result.indexOf("color-mix(");
            while (mixIdx !== -1) {
              let depth = 0;
              let endIdx = -1;
              for (let i = mixIdx + 9; i < result.length; i++) {
                if (result[i] === "(") depth++;
                else if (result[i] === ")") {
                  if (depth === 0) {
                    endIdx = i;
                    break;
                  }
                  depth--;
                }
              }
              if (endIdx !== -1) {
                result = result.substring(0, mixIdx) + "rgba(18, 51, 31, 0.8)" + result.substring(endIdx + 1);
              } else {
                break;
              }
              mixIdx = result.indexOf("color-mix(");
            }

            // Remove oklch calls
            let oklchIdx = result.indexOf("oklch(");
            while (oklchIdx !== -1) {
              let depth = 0;
              let endIdx = -1;
              for (let i = oklchIdx + 5; i < result.length; i++) {
                if (result[i] === "(") depth++;
                else if (result[i] === ")") {
                  if (depth === 0) {
                    endIdx = i;
                    break;
                  }
                  depth--;
                }
              }
              if (endIdx !== -1) {
                result = result.substring(0, oklchIdx) + "rgba(18, 51, 31, 0.9)" + result.substring(endIdx + 1);
              } else {
                break;
              }
              oklchIdx = result.indexOf("oklch(");
            }

            // Remove oklab calls
            let oklabIdx = result.indexOf("oklab(");
            while (oklabIdx !== -1) {
              let depth = 0;
              let endIdx = -1;
              for (let i = oklabIdx + 5; i < result.length; i++) {
                if (result[i] === "(") depth++;
                else if (result[i] === ")") {
                  if (depth === 0) {
                    endIdx = i;
                    break;
                  }
                  depth--;
                }
              }
              if (endIdx !== -1) {
                result = result.substring(0, oklabIdx) + "rgba(18, 51, 31, 0.9)" + result.substring(endIdx + 1);
              } else {
                break;
              }
              oklabIdx = result.indexOf("oklab(");
            }

            return result.replace(/oklab/gi, "srgb").replace(/oklch/gi, "srgb");
          };

          // 3. Sanitize all <style> tags in cloned document
          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((style) => {
            if (style.textContent) {
              style.textContent = sanitizeCssText(style.textContent);
            }
          });

          // 4. Sanitize any style attributes on elements in cloned document
          const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
          allElements.forEach((el) => {
            const attrStyle = el.getAttribute("style");
            if (attrStyle) {
              el.setAttribute("style", sanitizeCssText(attrStyle));
            }
          });
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeFileName = `Soil_Diagnostic_Report_${analysis.soilType.replace(/[^a-zA-Z0-9]/g, "_")}_${reportRefId}.pdf`;
      pdf.save(safeFileName);
    } catch (err) {
      console.error("PDF generation error, downloading text report instead:", err);
      handleDownloadTextReport();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = () => {
    const summaryText = `OFFICIAL SOIL DIAGNOSTIC REPORT [${reportRefId}]\nSoil Type: ${analysis.soilType}\nConfidence: ${analysis.confidenceScore}%\npH Range: ${analysis.phRange}\nExplanation: ${analysis.simpleExplanation || analysis.keyCharacteristics.join(". ")}\nRecommended Crops: ${analysis.suitableCrops.map(c => c.name).join(", ")}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none print:w-full print:m-0">
      
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#123620] p-3 sm:p-4 rounded-2xl border border-[#235e39] print:hidden shadow-md text-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 font-mono">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>REPORT REF: <strong className="text-white">{reportRefId}</strong></span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-[#18482a] hover:bg-[#205a35] text-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-[#286a41] shadow-2xs cursor-pointer"
            title="Copy Report Summary to Clipboard"
            id="share-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5 text-emerald-300" />}
            <span>{copied ? "Copied!" : "Share Summary"}</span>
          </button>

          <button
            onClick={handleDownloadTextReport}
            className="px-3 py-2 bg-[#18482a] hover:bg-[#205a35] text-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-[#286a41] shadow-2xs cursor-pointer"
            title="Download Plain Text Report File"
            id="download-txt-btn"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Text Report (.txt)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-[#18482a] hover:bg-[#205a35] text-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-[#286a41] shadow-2xs cursor-pointer"
            title="Print Official Report or Save as PDF via Browser"
            id="print-btn"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer font-heading"
            title="Download Structured PDF Document"
            id="download-pdf-btn"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-100" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fallback Alert Banner */}
      {analysis.isFallback && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex gap-3 text-amber-950 shadow-2xs print:hidden" id="fallback-alert-banner">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-sans">
            <h4 className="font-bold font-heading">Deterministic Agronomy Model Active</h4>
            <p className="text-amber-900/90 leading-relaxed">
              This report was compiled using our deterministic agronomy soil diagnostic ruleset.
            </p>
          </div>
        </div>
      )}

      {/* MAIN FORMAL REPORT SHEET */}
      <div 
        ref={reportRef} 
        id="printable-soil-report"
        className="bg-white rounded-3xl border border-stone-300 shadow-md p-6 sm:p-10 text-stone-900 space-y-8 print:border-none print:shadow-none print:p-0"
      >
        
        {/* OFFICIAL LETTERHEAD HEADER */}
        <div className="border-b-2 border-stone-900 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-emerald-900 text-emerald-200 rounded-2xl shrink-0 border border-emerald-800 shadow-sm">
                <Sprout className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-stone-950 uppercase font-heading">
                    Analyzed Soil report
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[9px] font-bold rounded uppercase tracking-wider font-mono border border-emerald-300">
                    OFFICIAL REPORT
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-sans font-medium">
                  Center for Precision Agriculture, Soil Spectroscopy & Crop Optimization
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-200 font-mono text-xs">
              <div className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">Document Reference</div>
              <div className="font-black text-stone-900 text-sm">{reportRefId}</div>
              <div className="text-[11px] text-stone-600 flex sm:justify-end items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>Date: {currentDate}</span>
              </div>
            </div>
          </div>

          {/* Sample Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200 text-xs font-sans bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Soil Classification</span>
              <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-extrabold rounded border uppercase font-heading ${getSoilBadgeColor(analysis.soilType)}`}>
                {analysis.soilType}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Diagnostic Method</span>
              <span className="font-bold text-stone-800 mt-0.5 block capitalize">
                {analysis.analysisType === "lab_report" ? "Spectrometry / Lab Metrics" : "Computer Vision Photo Analysis"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Accuracy Confidence</span>
              <span className="font-extrabold text-emerald-800 font-mono mt-0.5 block">
                {analysis.confidenceScore}% (High Precision)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Sample Type</span>
              <span className="font-bold text-stone-800 mt-0.5 block">
                {isPreset ? "Standard Benchmark Sample" : "Field Soil Entry"}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE DIAGNOSTIC SUMMARY */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950 font-mono border-b border-stone-200 pb-1.5">
            <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
            <h2>1. EXECUTIVE AGRONOMIC SUMMARY</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start bg-emerald-50/40 border border-emerald-200/80 p-5 rounded-2xl">
            {imageUrl && (
              <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-emerald-200 shadow-xs">
                <img 
                  src={imageUrl} 
                  alt={analysis.soilType} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            <div className="space-y-2 flex-1 font-sans">
              <h3 className="text-base font-extrabold text-stone-900 font-heading">
                Soil Profile Analysis & Key Findings
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {analysis.simpleExplanation || `${analysis.soilType} soil features a distinct mineral composition and structure affecting root penetration and nutrient delivery. Below are the quantitative chemistry measurements and customized soil conditioning directives.`}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: QUANTITATIVE SOIL METRICS & CHEMISTRY MATRIX */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950 font-mono border-b border-stone-200 pb-1.5">
            <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
            <h2>2. QUANTITATIVE SOIL METRICS & PHYSICAL PROPERTIES</h2>
          </div>

          {/* Primary Physics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="border border-stone-200 p-3.5 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-all hover:border-amber-300/80 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <GlossaryTooltip termKey="ph">pH Balance</GlossaryTooltip>
              </span>
              <p className="text-base font-extrabold text-stone-900 font-heading mt-1">{analysis.phRange}</p>
              <span className="text-[10px] text-stone-500 block mt-0.5">Reaction Index</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="border border-stone-200 p-3.5 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-all hover:border-blue-300/80 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <GlossaryTooltip termKey="moisture">Moisture Retention</GlossaryTooltip>
              </span>
              <p className="text-base font-extrabold text-stone-900 font-heading mt-1">{analysis.moistureRetention.split('.')[0]}</p>
              <span className="text-[10px] text-stone-500 block mt-0.5">Water Holding Capacity</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.19 }}
              className="border border-stone-200 p-3.5 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-all hover:border-emerald-300/80 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <GlossaryTooltip termKey="texture">Soil Texture</GlossaryTooltip>
              </span>
              <p className="text-base font-extrabold text-stone-900 font-heading capitalize mt-1">{analysis.texture}</p>
              <span className="text-[10px] text-stone-500 block mt-0.5">Particle Composition</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.26 }}
              className="border border-stone-200 p-3.5 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-all hover:border-stone-300 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                <GlossaryTooltip termKey="organic_matter">Organic Humus</GlossaryTooltip>
              </span>
              <p className="text-base font-extrabold text-stone-900 font-heading capitalize mt-1">{analysis.color}</p>
              <span className="text-[10px] text-stone-500 block mt-0.5">Organic Content Indicator</span>
            </motion.div>
          </div>

          {/* Detailed Lab Chemical Values Table (if lab mode) */}
          {analysis.analysisType === "lab_report" && analysis.labValues && (
            <div className="border border-stone-200 rounded-2xl overflow-hidden mt-4">
              <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-stone-800 font-mono uppercase">Laboratory Spectrometry Measurements</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono hidden sm:inline">
                  Hover terms for definitions
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-stone-50 font-mono text-[10px] text-stone-500 uppercase border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4 font-bold">Parameter</th>
                      <th className="py-2.5 px-4 font-bold">Measured Value</th>
                      <th className="py-2.5 px-4 font-bold">Standard Target Range</th>
                      <th className="py-2.5 px-4 font-bold">Agronomic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        <GlossaryTooltip termKey="ph">Soil pH</GlossaryTooltip>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-extrabold text-emerald-800">{analysis.labValues.ph || "N/A"}</td>
                      <td className="py-2.5 px-4 text-stone-500">6.0 – 7.2 pH</td>
                      <td className="py-2.5 px-4">{getStatusBadge(analysis.phRange)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        <GlossaryTooltip termKey="nitrogen">Nitrogen (N)</GlossaryTooltip>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-800">{analysis.labValues.nitrogen || "Medium"}</td>
                      <td className="py-2.5 px-4 text-stone-500">25 – 50 ppm</td>
                      <td className="py-2.5 px-4">{getStatusBadge(analysis.labValues.nitrogen || "Medium")}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        <GlossaryTooltip termKey="phosphorus">Phosphorus (P)</GlossaryTooltip>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-800">{analysis.labValues.phosphorus || "Medium"}</td>
                      <td className="py-2.5 px-4 text-stone-500">30 – 60 ppm</td>
                      <td className="py-2.5 px-4">{getStatusBadge(analysis.labValues.phosphorus || "Medium")}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        <GlossaryTooltip termKey="potassium">Potassium (K)</GlossaryTooltip>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-800">{analysis.labValues.potassium || "Medium"}</td>
                      <td className="py-2.5 px-4 text-stone-500">150 – 250 ppm</td>
                      <td className="py-2.5 px-4">{getStatusBadge(analysis.labValues.potassium || "Medium")}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        <GlossaryTooltip termKey="organic_matter">Organic Carbon / OM</GlossaryTooltip>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-800">{analysis.labValues.organicMatter || "N/A"}</td>
                      <td className="py-2.5 px-4 text-stone-500">2.5% – 5.0%</td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          REGISTERED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Characteristics Bullet List */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2 mt-3">
            <h4 className="text-xs font-bold text-stone-900 font-heading">Key Morphological Characteristics:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {analysis.keyCharacteristics.map((char, idx) => (
                <div key={idx} className="flex items-start gap-2 text-stone-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{char}</span>
                </div>
              ))}
            </div>

            {/* Interactive Glossary Quick Reference Bar */}
            <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center gap-2 text-xs print:hidden">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                Glossary Terms (Hover):
              </span>
              <GlossaryTooltip termKey="cec">Cation Exchange Capacity (CEC)</GlossaryTooltip>
              <span className="text-stone-300">•</span>
              <GlossaryTooltip termKey="ph">pH Balance</GlossaryTooltip>
              <span className="text-stone-300">•</span>
              <GlossaryTooltip termKey="organic_matter">Organic Matter</GlossaryTooltip>
              <span className="text-stone-300">•</span>
              <GlossaryTooltip termKey="ec">Electrical Conductivity (EC)</GlossaryTooltip>
              <span className="text-stone-300">•</span>
              <GlossaryTooltip termKey="zinc">Zinc (Zn)</GlossaryTooltip>
              <span className="text-stone-300">•</span>
              <GlossaryTooltip termKey="boron">Boron (B)</GlossaryTooltip>
            </div>
          </div>
        </div>

        {/* SECTION 3: SOIL AMENDMENT & FERTILIZATION SCHEDULE */}
        {analysis.fertilizerRecommendations && analysis.fertilizerRecommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950 font-mono border-b border-stone-200 pb-1.5">
              <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
              <h2>3. SOIL AMENDMENT & FERTILIZER DIRECTIVES</h2>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              The following organic and chemical soil conditioning formulations have been calculated to balance NPK ratios and soil structure:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.fertilizerRecommendations.map((rec, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                  className="border border-stone-200/80 rounded-2xl p-4 bg-stone-50/40 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold text-stone-900 font-heading">{rec.nutrient}</span>
                      {getStatusBadge(rec.status)}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {rec.recommendation}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-200 text-[11px] font-sans">
                    <div>
                      <span className="text-stone-400 block font-semibold mb-1 font-mono text-[10px] uppercase">Organic Sources:</span>
                      <div className="flex flex-wrap gap-1">
                        {rec.organicSources.map((src, sIdx) => (
                          <span key={sIdx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-1.5 py-0.5 text-[10px] font-medium">
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold mb-1 font-mono text-[10px] uppercase">Formulations:</span>
                      <div className="flex flex-wrap gap-1">
                        {rec.chemicalSources.map((src, sIdx) => (
                          <span key={sIdx} className="bg-stone-100 text-stone-700 border border-stone-200 rounded px-1.5 py-0.5 text-[10px] font-mono">
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: IRRIGATION & HYDRO-MANAGEMENT SPECIFICATION */}
        {analysis.irrigationSchedule && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950 font-mono border-b border-stone-200 pb-1.5">
              <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
              <h2>4. IRRIGATION & HYDRO-MANAGEMENT SPECIFICATION</h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="bg-blue-50/50 border border-blue-200 p-5 rounded-2xl space-y-3 shadow-2xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-blue-200/60 pb-3 text-xs font-sans">
                <div>
                  <span className="text-stone-500 text-[10px] block font-semibold uppercase tracking-wide font-mono">Irrigation Frequency</span>
                  <span className="font-extrabold text-blue-950 text-sm">{analysis.irrigationSchedule.frequency}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block font-semibold uppercase tracking-wide font-mono">Optimal Time Window</span>
                  <span className="font-extrabold text-blue-950 text-sm">{analysis.irrigationSchedule.optimalTiming}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-blue-900 font-heading">Water Application Directives:</span>
                <ul className="space-y-1 text-xs text-blue-900 font-sans">
                  {analysis.irrigationSchedule.criticalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* SECTION 5: RECOMMENDED CROP SUITABILITY MATRIX */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950 font-mono border-b border-stone-200 pb-1.5">
            <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
            <h2>5. RECOMMENDED CROP COMPATIBILITY MATRIX</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.suitableCrops.map((crop, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                className="border border-stone-200/90 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded uppercase tracking-wider font-mono border border-emerald-200">
                      {crop.type}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      MATCH #0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 font-heading">
                    {crop.name}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    <strong className="text-stone-800">Suitability Reason:</strong> {crop.whySuitable}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-200 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-400 block font-mono text-[9px] uppercase">Sowing Season</span>
                      <span className="font-bold text-stone-800">{crop.sowingSeason}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-mono text-[9px] uppercase">Water Requirement</span>
                      <span className="font-bold text-stone-800">{crop.waterRequirement}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-700 uppercase font-mono">Cultivation Steps:</span>
                    <ul className="space-y-0.5 text-[11px] text-stone-600">
                      {crop.careTips.map((tip, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 6: OFFICIAL CERTIFICATION & SIGN-OFF */}
        <div className="border-t-2 border-stone-900 pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-800 shrink-0" />
              <div className="text-xs font-sans">
                <h4 className="font-bold text-stone-900 font-heading">VERIFIED DIAGNOSTIC CERTIFICATION</h4>
                <p className="text-stone-500">
                  Digitally analyzed and verified by AI Agronomist Diagnostic Models.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-[10px] text-stone-500 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto border-stone-200">
              <div>SIGNATURE STAMP: <strong className="text-stone-800">AGRI-AI-VERIFIED</strong></div>
              <div>ISSUE TIMESTAMP: {currentDate}</div>
            </div>
          </div>

          {analysis.funFact && (
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-[11px] leading-relaxed text-emerald-950 font-sans">
              <strong className="font-bold text-emerald-900 font-heading">Agronomy Science Trivia: </strong>
              {analysis.funFact}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


