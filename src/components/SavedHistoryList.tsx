/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SavedAnalysis } from "../types";
import { Compass, Calendar, Check, Trash2, ArrowRight, FileText, Beaker } from "lucide-react";

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
  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          Historic Soil Records ({history.length})
        </h3>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          id="close-history-panel"
        >
          Hide Panel
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {history.map((record) => {
          const isSelected = selectedId === record.id;
          const formattedDate = new Date(record.timestamp).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div
              key={record.id}
              onClick={() => onSelect(record)}
              className={`group flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600"
                  : "border-stone-200/80 hover:border-stone-300 bg-stone-50/20"
              }`}
              id={`history-item-${record.id}`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/30 flex items-center justify-center">
                {record.imageUrl ? (
                  <img
                    src={record.imageUrl}
                    alt={record.soilType}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-emerald-700 bg-emerald-50 w-full h-full flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-stone-900 truncate max-w-[120px]">
                    {record.soilType}
                  </h4>
                  <span className="text-[8px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1 rounded">
                    {record.confidenceScore}%
                  </span>
                  <span className="text-[8px] font-semibold text-stone-500 bg-stone-100 px-1 rounded capitalize">
                    {record.analysisType === "lab_report" ? "Lab" : "Photo"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => onDelete(record.id, e)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100/80 transition-colors"
                  title="Delete record"
                  id={`delete-record-${record.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
