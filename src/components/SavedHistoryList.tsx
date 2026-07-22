/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SavedAnalysis } from "../types";
import { Compass, Calendar, Check, Trash2, ArrowRight, FileText, Beaker, X, Search, Sparkles, FolderOpen } from "lucide-react";

interface SavedHistoryListProps {
  history: SavedAnalysis[];
  onSelect: (analysis: SavedAnalysis) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  selectedId?: string;
  onClose: () => void;
}

export default function SavedHistoryList({
  history,
  onSelect,
  onDelete,
  selectedId,
  onClose
}: SavedHistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      item.soilType.toLowerCase().includes(query) ||
      item.analysisType?.toLowerCase().includes(query) ||
      item.analysis.soilImprovementTips?.some(r => r.toLowerCase().includes(query)) ||
      item.analysis.suitableCrops?.some(c => c.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click handler */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#e6f3eb] rounded-3xl border border-[#b0d6be] shadow-2xl p-5 sm:p-7 font-sans z-10 space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 text-[#082212]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#b0d6be] pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#0a2e1a] text-emerald-300 rounded-xl shadow-xs border border-[#164d2d]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#082212] font-heading">
                Saved Soil Diagnostic Tests
              </h3>
              <p className="text-xs text-[#18482a] font-sans font-medium">
                {history.length} {history.length === 1 ? "record" : "records"} stored in local session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#082212] hover:bg-[#cbe2cd] transition-colors p-2 rounded-2xl flex items-center gap-1 cursor-pointer"
            id="close-history-modal"
            aria-label="Close saved tests dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar (if history has items) */}
        {history.length > 0 && (
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter saved tests by soil type or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#9ed0b0] rounded-xl text-xs font-medium text-[#082212] placeholder-[#1b4e2e]/50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all shadow-2xs"
            />
          </div>
        )}

        {/* List Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[220px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#d8ebd9] border border-[#a2d3b2] flex items-center justify-center text-emerald-800">
                <FolderOpen className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#082212] font-heading">No Saved Soil Diagnostic Tests</h4>
                <p className="text-xs text-[#18482a] max-w-sm mt-1 leading-relaxed font-medium">
                  Run a soil photo analysis or submit laboratory chemical values. Your test reports will automatically be logged here for quick retrieval!
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer font-heading"
              >
                Start New Soil Test
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#18482a] font-medium">
              No saved tests match your filter search &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredHistory.map((record) => {
              const isSelected = selectedId === record.id;
              const formattedDate = new Date(record.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelect(record);
                    onClose();
                  }}
                  className={`group flex items-center justify-between gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-[#0a2e1a] text-white shadow-xs"
                      : "border-[#a2d3b2] hover:border-emerald-600 bg-[#d8ebd9] hover:bg-[#cbe2cd] text-[#082212]"
                  }`}
                  id={`history-item-${record.id}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#9ed0b0] flex items-center justify-center shadow-2xs">
                      {record.imageUrl ? (
                        <img
                          src={record.imageUrl}
                          alt={record.soilType}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-emerald-800 bg-[#c3e2cd] w-full h-full flex items-center justify-center">
                          <Beaker className="w-6 h-6 text-emerald-800" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs sm:text-sm font-bold truncate font-heading ${isSelected ? "text-white" : "text-[#082212]"}`}>
                          {record.soilType}
                        </h4>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isSelected ? "text-emerald-300 bg-[#164d2d] border-emerald-500/40" : "text-emerald-900 bg-white border-[#9ed0b0]"}`}>
                          {record.confidenceScore}% Confidence
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${isSelected ? "text-emerald-200 bg-[#123e25] border border-[#164d2d]" : "text-[#082212] bg-[#c3e2cd] border border-[#9ed0b0]"}`}>
                          {record.analysisType === "lab_report" ? "Lab Test" : "Photo Scan"}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] mt-1 font-mono ${isSelected ? "text-emerald-200/80" : "text-[#18482a] font-medium"}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => onDelete(record.id, e)}
                      className="p-2 text-rose-700 hover:text-rose-900 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Delete record"
                      id={`delete-record-${record.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`p-2 rounded-xl transition-colors ${isSelected ? "text-white" : "text-emerald-800 group-hover:bg-[#c3e2cd]"}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#1f4e30] flex items-center justify-between text-xs text-emerald-300/70 font-mono shrink-0">
          <span className="flex items-center gap-1 text-[10px]">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Click any report to view recommendations
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#143c24] hover:bg-[#18482a] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer border border-[#235e39]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

