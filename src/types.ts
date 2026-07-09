/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Crop {
  name: string;
  type: string; // e.g., Vegetable, Cereal, Fruit, Legume, Flower, Herb
  whySuitable: string;
  sowingSeason: string;
  waterRequirement: string; // e.g., Low, Moderate, High, with description
  careTips: string[];
}

export interface FertilizerRec {
  nutrient: string; // e.g., "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"
  status: string; // e.g., "Deficient", "Optimum", "Surplus"
  recommendation: string; // Advice on what action to take
  organicSources: string[]; // e.g., ["Compost", "Fish Meal", "Manure"]
  chemicalSources: string[]; // e.g., ["Urea", "DAP", "MOP"]
}

export interface SoilAnalysis {
  soilType: string; // e.g., Sandy, Clay, Silty, Peaty, Chalky, Loamy
  confidenceScore: number; // 0-100 percentage
  color: string;
  texture: string;
  phRange: string;
  moistureRetention: string;
  nutrientProfile: string[];
  keyCharacteristics: string[];
  suitableCrops: Crop[];
  soilImprovementTips: string[];
  funFact: string;
  
  // New features
  isFallback?: boolean;
  analysisType?: "image" | "lab_report";
  fertilizerRecommendations?: FertilizerRec[];
  irrigationSchedule?: {
    frequency: string;
    optimalTiming: string;
    criticalTips: string[];
  };
  labValues?: {
    ph?: number;
    nitrogen?: string;
    phosphorus?: string;
    potassium?: string;
    organicMatter?: string;
  };
}

export interface SavedAnalysis {
  id: string;
  timestamp: string;
  soilType: string;
  confidenceScore: number;
  imageUrl?: string; // Base64 or sample ref (optional for reports with manual values only)
  analysisType: "image" | "lab_report";
  analysis: SoilAnalysis;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  isLoggedIn: boolean;
}
