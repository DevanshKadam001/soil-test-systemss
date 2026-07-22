/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from "react";
import { HelpCircle, Info, BookOpen } from "lucide-react";

export interface GlossaryTerm {
  term: string;
  shortDef: string;
  fullDef: string;
  idealRange?: string;
  icon?: string;
}

export const GLOSSARY_DICTIONARY: Record<string, GlossaryTerm> = {
  ph: {
    term: "pH Balance",
    shortDef: "Scale measuring soil acidity or alkalinity.",
    fullDef: "Soil pH dictates how easily plant roots can absorb nutrients. Values below 6.0 indicate acidic soil (restricting Phosphorus and Calcium), while values above 7.5 indicate alkaline soil (locking up Iron and Zinc).",
    idealRange: "6.0 – 7.2 (Slightly Acidic to Neutral)"
  },
  cec: {
    term: "Cation Exchange Capacity (CEC)",
    shortDef: "Measure of nutrient holding capacity.",
    fullDef: "CEC measures the soil's ability to hold onto positively charged mineral ions (Calcium, Magnesium, Potassium, Ammonium). High CEC soils (clays, organic soils) hold nutrients well; low CEC soils (sands) leach nutrients quickly.",
    idealRange: "15 – 25+ meq/100g"
  },
  moisture: {
    term: "Moisture Retention",
    shortDef: "Water holding capacity of soil particles.",
    fullDef: "Reflects how effectively soil stores moisture between rainfall or irrigation cycles without causing root rot from waterlogging.",
    idealRange: "30% – 50% Available Water Capacity"
  },
  organic_matter: {
    term: "Organic Carbon / Matter (OM)",
    shortDef: "Decomposed biological matter (humus).",
    fullDef: "Organic matter feeds beneficial soil microbes, binds soil particles into crumbly aggregates, improves water retention in sandy soil, and enhances drainage in heavy clay.",
    idealRange: "2.5% – 5.0% for agricultural soils"
  },
  nitrogen: {
    term: "Nitrogen (N)",
    shortDef: "Primary nutrient for foliage & vegetative growth.",
    fullDef: "Nitrogen drives protein and chlorophyll synthesis. Deficiencies cause pale yellow older leaves (chlorosis), while excess causes overly lush leaves with weak stems.",
    idealRange: "25 – 50 ppm (Available N)"
  },
  phosphorus: {
    term: "Phosphorus (P)",
    shortDef: "Primary nutrient for roots, flowers & seeds.",
    fullDef: "Phosphorus fuels cellular energy transfer (ATP), rapid early root growth, uniform flowering, and crop seed maturation.",
    idealRange: "30 – 60 ppm (Olsen P)"
  },
  potassium: {
    term: "Potassium (K)",
    shortDef: "Primary nutrient for plant immunity & fruit density.",
    fullDef: "Potassium regulates leaf stomata water loss, disease resistance, stalk strength, and fruit size/sweetness.",
    idealRange: "150 – 250 ppm (Exchangeable K)"
  },
  ec: {
    term: "Electrical Conductivity (EC)",
    shortDef: "Salinity indicator of soil water.",
    fullDef: "EC measures soluble mineral salts in soil solution. High EC (> 2.0 dS/m) causes osmotic stress, preventing roots from drawing water even in moist soil.",
    idealRange: "0.2 – 1.2 dS/m"
  },
  zinc: {
    term: "Zinc (Zn)",
    shortDef: "Micronutrient for growth hormones.",
    fullDef: "Required for auxin hormone synthesis, leaf expansion, and internode elongation. Common deficiency in high pH soils causing 'little leaf' syndrome.",
    idealRange: "1.0 – 3.0 ppm"
  },
  iron: {
    term: "Iron (Fe)",
    shortDef: "Micronutrient for chlorophyll formation.",
    fullDef: "Essential for electron transport and chlorophyll creation. Deficiencies show as bright yellowing between green leaf veins in young leaves.",
    idealRange: "4.5 – 10.0 ppm"
  },
  boron: {
    term: "Boron (B)",
    shortDef: "Micronutrient for seed set & cell wall structure.",
    fullDef: "Critical for pollen viability, flowering fruit set, cell wall synthesis, and sugar transportation throughout roots.",
    idealRange: "0.5 – 1.5 ppm"
  },
  texture: {
    term: "Soil Texture Class",
    shortDef: "Proportion of sand, silt, and clay.",
    fullDef: "Soil texture determines aeration, water infiltration rate, workability, and nutrient retention speed.",
    idealRange: "Loam or Clay Loam"
  }
};

interface GlossaryTooltipProps {
  termKey: keyof typeof GLOSSARY_DICTIONARY;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export default function GlossaryTooltip({ termKey, children, showIcon = true }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = GLOSSARY_DICTIONARY[termKey];

  if (!data) return <>{children}</>;

  return (
    <span className="relative inline-block font-sans">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-0.5 text-inherit hover:text-emerald-800 underline decoration-dotted underline-offset-4 cursor-help font-semibold transition-colors group focus:outline-none"
        aria-label={`Glossary definition for ${data.term}`}
      >
        <span>{children || data.term}</span>
        {showIcon && (
          <HelpCircle className="w-3 h-3 text-emerald-600/70 group-hover:text-emerald-800 transition-colors shrink-0 print:hidden" />
        )}
      </button>

      {/* Floating Tooltip Card */}
      {isOpen && (
        <div 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-stone-900 text-stone-100 rounded-2xl shadow-xl border border-stone-700/80 text-left text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150 print:hidden pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-1.5">
            <span className="font-bold text-emerald-400 font-heading flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              {data.term}
            </span>
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase bg-stone-800 px-1.5 py-0.5 rounded">
              Agronomy Term
            </span>
          </div>

          <p className="text-stone-300 text-[11px] leading-relaxed">
            {data.fullDef}
          </p>

          {data.idealRange && (
            <div className="bg-stone-800/90 p-2 rounded-xl text-[10px] font-mono border border-stone-700/60">
              <span className="text-stone-400 block font-semibold uppercase text-[9px] tracking-wider">Optimal Crop Range:</span>
              <span className="text-emerald-300 font-bold">{data.idealRange}</span>
            </div>
          )}

          {/* Arrow Indicator */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
        </div>
      )}
    </span>
  );
}
