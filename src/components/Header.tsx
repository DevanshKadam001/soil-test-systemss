/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sprout, Compass, LogIn, LogOut, User, Check, Sparkles, Activity } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  user: UserProfile;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  historyCount,
  onOpenHistory,
  user,
  onLogin,
  onLogout
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="border-b border-[#18482a] bg-[#061a10]/95 backdrop-blur-md sticky top-0 z-40 transition-all text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl shadow-sm shadow-emerald-950/40 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-heading">
                Soil Test System
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1d4d30] text-emerald-300 border border-[#2c6944]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI v3.5
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-200/80 font-sans font-medium">
              Precision Agronomy & Lab Report Explainer
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-[#1a432b] hover:bg-[#225638] rounded-xl transition-all border border-[#2b5e3f] shadow-2xs active:scale-[0.98] cursor-pointer"
            id="history-btn"
            title="View Saved Diagnostic Soil Tests"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Saved Tests</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full font-bold border border-emerald-500/30">
              {historyCount}
            </span>
          </button>

          {/* User Profile / Auth Area */}
          <div className="relative">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 hover:bg-[#1a432b] rounded-xl border border-[#2b5e3f] transition-all active:scale-[0.98]"
                  id="user-profile-menu-btn"
                >
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-emerald-400/40"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden md:inline text-xs font-bold text-emerald-100 pr-1 truncate max-w-[110px] font-heading">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-stone-900 text-stone-100 rounded-2xl border border-stone-700/80 shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-stone-800 pb-3 mb-2">
                        <p className="text-xs font-bold text-white font-heading">{user.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono truncate mt-0.5">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md w-max border border-emerald-800/60">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Google Account Linked</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 flex items-center gap-2 transition-colors"
                        id="logout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow active:scale-[0.98]"
                id="login-btn"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

