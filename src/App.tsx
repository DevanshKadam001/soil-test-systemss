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
  FileCheck,
  Maximize2,
  Columns,
  Plus,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from "lucide-react";

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<SoilAnalysis | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<"photo" | "lab_report">("photo");
  const [viewMode, setViewMode] = useState<"full" | "split">("full");
  const [showInputPanel, setShowInputPanel] = useState<boolean>(false);
  
  // User authentication state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false
  });

  // Panels visibility
  const [showHistory, setShowHistory] = useState(false);

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

      const rawText = await response.text();
      let result: SoilAnalysis;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Invalid response from server (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error((result as any)?.error || `Server responded with status ${response.status}`);
      }

      setActiveAnalysis(result);
      setShowInputPanel(false);

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
      setShowHistory(false);
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

      const rawText = await response.text();
      let result: SoilAnalysis;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Invalid response from server (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error((result as any)?.error || `Server responded with status ${response.status}`);
      }

      setActiveAnalysis(result);
      setShowInputPanel(false);

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
      setShowHistory(false);
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
    setShowInputPanel(false);
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
    <div className="min-h-screen bg-[#092215] bg-mesh-pattern text-emerald-100 font-sans antialiased flex flex-col selection:bg-emerald-800 selection:text-white">
      
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
        
        {/* Welcome Section - Light Green Background */}
        <div className="bg-[#e6f3eb] text-[#082212] rounded-3xl p-6 sm:p-8 border border-[#b0d6be] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a2e1a] rounded-full text-emerald-300 text-xs font-bold tracking-wide border border-[#164d2d] font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Precision Agronomy & Diagnostic Suite</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#082212] font-heading">
              {user.isLoggedIn ? `Welcome Back, ${user.name.split(" ")[0]}!` : "Instant Soil Diagnostic & Crop Optimizer"}
            </h2>
            
            <p className="text-xs sm:text-sm text-[#18482a] leading-relaxed font-sans font-medium max-w-2xl">
              Upload soil photography for instant texture & organic content analysis, or enter laboratory test sheets to transform complex chemical data into actionable cultivation plans.
            </p>

            {/* Micro feature pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium font-sans">
              <span className="px-2.5 py-1 bg-[#d8ebd9] text-[#082212] rounded-xl border border-[#a2d3b2] flex items-center gap-1.5 font-bold shadow-2xs">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                Soil Texture Scan
              </span>
              <span className="px-2.5 py-1 bg-[#d8ebd9] text-[#082212] rounded-xl border border-[#a2d3b2] flex items-center gap-1.5 font-bold shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Lab Report OCR
              </span>
              <span className="px-2.5 py-1 bg-[#d8ebd9] text-[#082212] rounded-xl border border-[#a2d3b2] flex items-center gap-1.5 font-bold shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                NPK Amendment
              </span>
              <span className="px-2.5 py-1 bg-[#d8ebd9] text-[#082212] rounded-xl border border-[#a2d3b2] flex items-center gap-1.5 font-bold shadow-2xs">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                Crop Matcher
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Warning/Error */}
        {error && (
          <div className="p-4 bg-rose-100 border border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-900 flex items-start gap-3 shadow-xs font-sans">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-700 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold font-heading">Soil Diagnostic Failed</span>
              <p className="text-xs text-rose-800 leading-normal">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        {activeAnalysis ? (
          /* ACTIVE REPORT WORKSPACE */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Control Bar for Active Report */}
            <div className="bg-[#e6f3eb] p-3 sm:p-4 rounded-2xl border border-[#b0d6be] shadow-xs text-[#082212] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold font-heading">
                <span className="px-2.5 py-1 bg-[#0a2e1a] text-emerald-300 rounded-lg border border-[#164d2d] flex items-center gap-1.5 font-mono">
                  <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ACTIVE: {activeAnalysis.soilType.toUpperCase()}</span>
                </span>

                <button
                  onClick={() => setShowInputPanel(!showInputPanel)}
                  className="px-3 py-1.5 bg-[#d8ebd9] hover:bg-[#c6e2ca] text-[#082212] rounded-xl border border-[#a2d3b2] flex items-center gap-1.5 transition-colors cursor-pointer"
                  id="toggle-input-panel-btn"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{showInputPanel ? "Hide Scanner / Input Form" : "Analyze Another Sample"}</span>
                  {showInputPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setActiveAnalysis(null);
                    setActiveImageUrl(null);
                    setShowInputPanel(true);
                  }}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl border border-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  id="reset-analysis-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
                  <span>Reset View</span>
                </button>
              </div>

              {/* Desktop View Mode Switcher */}
              <div className="hidden lg:flex items-center gap-1 bg-[#d8ebd9] p-1 rounded-xl border border-[#a2d3b2] text-xs font-bold font-heading">
                <button
                  onClick={() => setViewMode("full")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "full"
                      ? "bg-[#0a2e1a] text-emerald-200 shadow-2xs"
                      : "text-[#082212] hover:bg-[#c2dec5]"
                  }`}
                  id="viewmode-full-btn"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Width Widescreen</span>
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "split"
                      ? "bg-[#0a2e1a] text-emerald-200 shadow-2xs"
                      : "text-[#082212] hover:bg-[#c2dec5]"
                  }`}
                  id="viewmode-split-btn"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Side-by-Side Split</span>
                </button>
              </div>
            </div>

            {/* Expandable Scanner / Form Panel when report is active */}
            {showInputPanel && (
              <div className="bg-[#e6f3eb] p-5 sm:p-6 rounded-3xl border border-[#b0d6be] shadow-md animate-in slide-in-from-top-2 duration-300 text-[#082212] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#b0d6be]">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-sm font-bold font-heading uppercase tracking-wide">
                      {activeTab === "photo" ? "Upload New Soil Photograph" : "Enter Laboratory Measurements"}
                    </h3>
                  </div>
                  
                  {/* Tab switcher inside active drawer */}
                  <div className="flex items-center gap-1 bg-[#d8ebd9] p-1 rounded-xl border border-[#a2d3b2] text-xs font-bold font-heading">
                    <button
                      onClick={() => setActiveTab("photo")}
                      className={`px-2.5 py-1 rounded-lg ${activeTab === "photo" ? "bg-[#0a2e1a] text-white" : "text-[#082212]"}`}
                    >
                      Photo
                    </button>
                    <button
                      onClick={() => setActiveTab("lab_report")}
                      className={`px-2.5 py-1 rounded-lg ${activeTab === "lab_report" ? "bg-[#0a2e1a] text-white" : "text-[#082212]"}`}
                    >
                      Lab Sheet
                    </button>
                  </div>
                </div>

                <div className="max-w-3xl mx-auto">
                  {activeTab === "photo" ? (
                    <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />
                  ) : (
                    <LabReportForm onAnalyze={handleAnalyzeLabReport} isLoading={isLoading} />
                  )}
                </div>
              </div>
            )}

            {/* Saved tests / Historic modal dialog */}
            {showHistory && (
              <SavedHistoryList 
                history={history}
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistoryItem}
                selectedId={history.find(h => h.imageUrl === activeImageUrl)?.id}
                onClose={() => setShowHistory(false)}
              />
            )}

            {/* REPORT VIEW: Render Full Width or Split View */}
            {viewMode === "split" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                  {activeTab === "photo" ? (
                    <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />
                  ) : (
                    <div className="bg-[#e6f3eb] rounded-2xl border border-[#b0d6be] p-5 sm:p-6 shadow-sm text-[#082212]">
                      <LabReportForm onAnalyze={handleAnalyzeLabReport} isLoading={isLoading} />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-7">
                  <AnalysisResultView 
                    analysis={activeAnalysis} 
                    imageUrl={activeImageUrl || undefined}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <AnalysisResultView 
                  analysis={activeAnalysis} 
                  imageUrl={activeImageUrl || undefined}
                />
              </div>
            )}
          </div>
        ) : (
          /* NO REPORT ACTIVE: Standard Input + Onboarding Workspace */
          <div className="space-y-6">
            {/* Tab Switcher: Light Green Section */}
            <div className="bg-[#e6f3eb] p-1.5 rounded-2xl border border-[#b0d6be] flex items-center gap-1 max-w-xl shadow-xs">
              <button
                onClick={() => {
                  setActiveTab("photo");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all font-heading cursor-pointer ${
                  activeTab === "photo"
                    ? "bg-[#0a2e1a] text-white shadow-md ring-1 ring-[#164d2d]"
                    : "text-[#082212] hover:bg-[#d8ebd9]"
                }`}
                id="tab-photo-btn"
              >
                <Sprout className={`w-4 h-4 ${activeTab === "photo" ? "text-emerald-300" : "text-emerald-700"}`} />
                <span>Soil Photo Diagnostics</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("lab_report");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all font-heading cursor-pointer ${
                  activeTab === "lab_report"
                    ? "bg-[#0a2e1a] text-white shadow-md ring-1 ring-[#164d2d]"
                    : "text-[#082212] hover:bg-[#d8ebd9]"
                }`}
                id="tab-lab-btn"
              >
                <FileText className={`w-4 h-4 ${activeTab === "lab_report" ? "text-emerald-300" : "text-emerald-700"}`} />
                <span>Soil Lab Report Analyzer</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === "lab_report" ? "bg-emerald-800 text-white" : "bg-[#cce6d3] text-[#082212] font-bold"}`}>
                  OCR
                </span>
              </button>
            </div>

            {/* Grid Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Input Forms */}
              <div className="lg:col-span-5 space-y-6">
                {activeTab === "photo" ? (
                  <div className="space-y-6">
                    <ImageUploader 
                      onImageSelected={handleImageSelected} 
                      isLoading={isLoading} 
                    />
                  </div>
                ) : (
                  <div className="bg-[#e6f3eb] rounded-2xl border border-[#b0d6be] p-5 sm:p-6 shadow-sm text-[#082212]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-[#0a2e1a] rounded-lg text-emerald-300 border border-[#164d2d]">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#082212] uppercase tracking-wide font-heading">Lab Report Translation Engine</h3>
                        <p className="text-[10px] text-[#1b4e2e] font-medium">Provide lab sheets or input raw chemical measurements</p>
                      </div>
                    </div>
                    
                    <LabReportForm 
                      onAnalyze={handleAnalyzeLabReport}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {/* Saved tests / Historic modal dialog */}
                {showHistory && (
                  <SavedHistoryList 
                    history={history}
                    onSelect={handleSelectHistoryItem}
                    onDelete={handleDeleteHistoryItem}
                    selectedId={history.find(h => h.imageUrl === activeImageUrl)?.id}
                    onClose={() => setShowHistory(false)}
                  />
                )}
              </div>

              {/* RIGHT VIEW COLUMN: Empty State */}
              <div className="lg:col-span-7">
                <div className="bg-[#e6f3eb] rounded-2xl border border-[#b0d6be] p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[500px] shadow-sm relative overflow-hidden text-[#082212]">
                  <div className="absolute inset-0 bg-radial from-emerald-400/15 to-transparent pointer-events-none" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-[#d8ebd9] border border-[#a2d3b2] flex items-center justify-center text-emerald-800 mb-6 shadow-inner">
                    <Sprout className="w-8 h-8 text-emerald-700" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#082212] tracking-tight font-heading">
                    No Diagnostic Report Loaded
                  </h3>
                  
                  <p className="text-xs text-[#18482a] max-w-sm mt-2 leading-relaxed font-sans font-medium">
                    {activeTab === "photo" 
                      ? "Upload a close-up soil photograph to generate a diagnostic report."
                      : "Fill in chemical soil values or upload a physical laboratory sheet to activate our agronomical interpretation module."}
                  </p>

                  {/* Interactive onboarding options list */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                    <div 
                      onClick={() => setActiveTab("photo")}
                      className="p-3 bg-[#d8ebd9] rounded-xl border border-[#a2d3b2] text-left space-y-1 cursor-pointer hover:border-emerald-600 transition-colors shadow-2xs"
                    >
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Method A</span>
                      <h4 className="text-xs font-bold text-[#082212] font-heading">Photo Diagnostics</h4>
                      <p className="text-[10px] text-[#1b4e2e] leading-normal font-medium">
                        Examines visual parameters of real topsoil image instantly.
                      </p>
                    </div>
                    <div 
                      onClick={() => setActiveTab("lab_report")}
                      className="p-3 bg-[#d8ebd9] rounded-xl border border-[#a2d3b2] text-left space-y-1 cursor-pointer hover:border-emerald-600 transition-colors shadow-2xs"
                    >
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Method B</span>
                      <h4 className="text-xs font-bold text-[#082212] font-heading">Lab Reports</h4>
                      <p className="text-[10px] text-[#1b4e2e] leading-normal font-medium">
                        Explains laboratory measures (pH, N, P, K) into a simple plan.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-1.5 text-[10px] text-emerald-800 font-mono font-bold">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span>PRECISION AGRONOMY SYSTEM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#18482a] bg-[#061a10] py-6 mt-16 text-center text-xs text-emerald-200/80 font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Soil Test System. Dedicated to Sustainable Agriculture & Precision Agronomy.</p>
        </div>
      </footer>

    </div>
  );
}
