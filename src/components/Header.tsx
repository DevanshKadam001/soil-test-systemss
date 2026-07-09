/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sprout, Compass, LogIn, LogOut, User, Check } from "lucide-react";
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
    <header className="border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100/50 shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              Soil Test System
            </h1>
            <p className="text-[9px] sm:text-xs text-stone-500 font-mono">
              AI Agronomy & Lab Report Explainer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-emerald-700 bg-stone-50 hover:bg-emerald-50 rounded-lg transition-colors border border-stone-200/50 hover:border-emerald-200/30"
              id="history-btn"
            >
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Saved Tests ({historyCount})</span>
              <span className="sm:hidden">{historyCount}</span>
            </button>
          )}

          {/* User Profile / Auth Area */}
          <div className="relative">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 hover:bg-stone-50 rounded-xl border border-stone-200/40 transition-colors"
                  id="user-profile-menu-btn"
                >
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden md:inline text-xs font-bold text-stone-700 pr-1 truncate max-w-[100px]">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200/80 shadow-lg py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2 border-b border-stone-100 pb-2.5 mb-2">
                        <p className="text-xs font-bold text-stone-900">{user.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono truncate">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md w-max">
                          <Check className="w-3 h-3" />
                          <span>Google Connected</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                        id="logout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm hover:shadow"
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
