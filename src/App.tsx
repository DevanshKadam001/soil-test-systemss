/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import LabReportForm from "./components/LabReportForm";
import AnalysisResultView from "./components/AnalysisResultView";
import SavedHistoryList from "./components/SavedHistoryList";
import LoginView from "./components/LoginView";
import { SoilAnalysis, SavedAnalysis, UserProfile } from "./types";
import { auth, onAuthStateChanged, signOut as firebaseSignOut } from "./lib/firebase";
import { 
  Sprout, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Award,
  LogIn,
  CheckCircle,
  FileCheck
} from "lucide-react";

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<SoilAnalysis | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<"photo" | "lab_report">("photo");
  
  // User authentication state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false
  });

  // Panels visibility
  const [showHistory, setShowHistory] = useState(true);

  // Load history on mount and listen to Firebase Auth changes
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("soil_analysis_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to read persistent states:", e);
    }

    // Bind Firebase authentication listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Authenticated User",
          email: firebaseUser.email || "",
          picture: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
          isLoggedIn: true
        });
      } else {
        // Fallback to local storage for any non-auth/anonymous fallback guest session
        const storedUser = localStorage.getItem("soil_test_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem("soil_test_user");
          }
        } else {
          setUser({
            name: "",
            email: "",
            picture: "",
            isLoggedIn: false
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save history to local storage when changed
  const saveHistory = (newHistory: SavedAnalysis[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("soil_analysis_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Handle Google Login / Demo Login
  const handleLogin = (customUser?: UserProfile) => {
    if (customUser) {
      setUser(customUser);
      localStorage.setItem("soil_test_user", JSON.stringify(customUser));
    }
  };

  // Handle mock Google Logout
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Error signing out from Firebase:", e);
    }
    const loggedOutUser: UserProfile = {
      name: "",
      email: "",
      picture: "",
      isLoggedIn: false
    };
    setUser(loggedOutUser);
    localStorage.removeItem("soil_test_user");
  };

  // Upload/capture a new custom image (backend Gemini call)
  const handleImageSelected = async (base64Image: string) => {
    setError(null);
    setIsLoading(true);
    setActiveImageUrl(base64Image);
    setActiveAnalysis(null);

    try {
      const response = await fetch("/api/analyze-soil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: SoilAnalysis = await response.json();
      setActiveAnalysis(result);

      // Save to history list
      const newRecord: SavedAnalysis = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        soilType: result.soilType,
        confidenceScore: result.confidenceScore,
        imageUrl: base64Image,
        analysisType: "image",
        analysis: result,
      };

      saveHistory([newRecord, ...history]);
      setShowHistory(true);
    } catch (err: any) {
      console.error("Soil analysis error:", err);
      setError(err.message || "An unexpected error occurred while analyzing the soil image. Please try again.");
      setActiveAnalysis(null);
      setActiveImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze Lab Report with manual metrics + file upload
  const handleAnalyzeLabReport = async (payload: { image?: string; manualValues?: any }) => {
    setError(null);
    setIsLoading(true);
    setActiveAnalysis(null);
    setActiveImageUrl(payload.image || null);

    try {
      const response = await fetch("/api/analyze-lab-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: SoilAnalysis = await response.json();
      setActiveAnalysis(result);

      // Save to history list
      const newRecord: SavedAnalysis = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        soilType: result.soilType,
        confidenceScore: result.confidenceScore,
        imageUrl: payload.image || undefined,
        analysisType: "lab_report",
        analysis: result,
      };

      saveHistory([newRecord, ...history]);
      setShowHistory(true);
    } catch (err: any) {
      console.error("Lab report analysis error:", err);
      setError(err.message || "An unexpected error occurred while analyzing the lab report. Please check input parameters.");
      setActiveAnalysis(null);
      setActiveImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Select item from saved history list
  const handleSelectHistoryItem = (item: SavedAnalysis) => {
    setError(null);
    setActiveAnalysis(item.analysis);
    setActiveImageUrl(item.imageUrl || null);
    if (item.analysisType) {
      setActiveTab(item.analysisType);
    }
  };

  // Delete saved analysis from history
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);

    const deletedRecord = history.find((item) => item.id === id);
    if (deletedRecord && activeImageUrl === deletedRecord.imageUrl) {
      setActiveAnalysis(null);
      setActiveImageUrl(null);
    }
  };

  if (!user.isLoggedIn) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-stone-800 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Top Banner for Premium Header */}
      <Header 
        historyCount={history.length}
        onOpenHistory={() => setShowHistory(!showHistory)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* User Specific welcome card or general intro */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-50 rounded-2xl p-6 sm:p-8 border border-emerald-900 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700/50 rounded-lg text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-600/30">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning Agronomy
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {user.isLoggedIn ? `Welcome Back, ${user.name.split(" ")[0]}!` : "Instant Soil Diagnostic & Crop Optimizer"}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-medium">
              Upload soil photography for instant texture diagnostics, or enter laboratory metrics to translate scientific results into actionable organic cultivation plans.
            </p>
          </div>
        </div>

        {/* Dynamic Warning/Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Soil Analysis Failed</span>
              <p className="text-xs text-red-600/90 leading-normal">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher: Soil Photo vs Soil Lab Report */}
        <div className="flex border-b border-stone-200/60 pb-px">
          <button
            onClick={() => {
              setActiveTab("photo");
              setError(null);
            }}
            className={`flex items-center gap-2 pb-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === "photo"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
            id="tab-photo-btn"
          >
            <Sprout className="w-4 h-4" />
            Soil Photo Diagnostics
          </button>
          
          <button
            onClick={() => {
              setActiveTab("lab_report");
              setError(null);
            }}
            className={`flex items-center gap-2 pb-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === "lab_report"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
            id="tab-lab-btn"
          >
            <FileText className="w-4 h-4" />
            Lab Report Explainer
          </button>
        </div>

        {/* Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Forms, Presets, History */}
          <div className="lg:col-span-5 space-y-6">
            
            {activeTab === "photo" ? (
              <div className="space-y-6">
                {/* Image Scanner Box */}
                <ImageUploader 
                  onImageSelected={handleImageSelected} 
                  isLoading={isLoading} 
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200/60 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Lab Report Translation Engine</h3>
                    <p className="text-[10px] text-stone-500">Provide lab sheets or input raw chemical measurements</p>
                  </div>
                </div>
                
                <LabReportForm 
                  onAnalyze={handleAnalyzeLabReport}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Saved tests / Historic panel */}
            {showHistory && history.length > 0 && (
              <SavedHistoryList 
                history={history}
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistoryItem}
                selectedId={history.find(h => h.imageUrl === activeImageUrl)?.id}
                onClose={() => setShowHistory(false)}
              />
            )}
          </div>

          {/* RIGHT VIEW COLUMN: Interactive Results View */}
          <div className="lg:col-span-7">
            {activeAnalysis ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AnalysisResultView 
                  analysis={activeAnalysis} 
                  imageUrl={activeImageUrl || undefined}
                />
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl border border-stone-200/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[500px] shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-50/20 to-transparent pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 mb-6 shadow-inner">
                  <Sprout className="w-8 h-8 text-stone-400" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  No Diagnostic Report Loaded
                </h3>
                
                <p className="text-xs text-stone-500 max-w-sm mt-2 leading-relaxed">
                  {activeTab === "photo" 
                    ? "Upload a close-up soil photograph to generate a diagnostic report."
                    : "Fill in chemical soil values or upload a physical laboratory sheet to activate our agronomical interpretation module."}
                </p>

                {/* Interactive onboarding options list */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                  <div 
                    onClick={() => setActiveTab("photo")}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/50 text-left space-y-1 cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Method A</span>
                    <h4 className="text-xs font-bold text-stone-800">Photo Diagnostics</h4>
                    <p className="text-[10px] text-stone-500 leading-normal">
                      Examines visual parameters of real topsoil image instantly.
                    </p>
                  </div>
                  <div 
                    onClick={() => setActiveTab("lab_report")}
                    className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-100/30 text-left space-y-1 cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Method B</span>
                    <h4 className="text-xs font-bold text-emerald-800">Lab Reports</h4>
                    <p className="text-[10px] text-stone-500 leading-normal">
                      Explains laboratory measures (pH, N, P, K) into a simple plan.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
                  <Award className="w-3.5 h-3.5 text-stone-400" />
                  <span>PRECISION AGRONOMY SYSTEM</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 bg-white py-6 mt-16 text-center text-xs text-stone-400 font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Soil Test System. Dedicated to Sustainable Agriculture & Precision Agronomy.</p>
        </div>
      </footer>

    </div>
  );
}
