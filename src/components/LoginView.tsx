import React, { useState } from "react";
import { 
  LogIn, 
  Shield, 
  Settings, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Lock, 
  UserPlus, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously 
} from "../lib/firebase";
import { UserProfile } from "../types";

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<"google" | "email">("google");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Read preview URLs from window origin to show dynamically in the setup guide
  const devOrigin = window.location.origin;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // Direct Firebase Auth Sign In with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userProfile: UserProfile = {
        name: user.displayName || "Google User",
        email: user.email || "",
        picture: user.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80",
        isLoggedIn: true
      };
      
      onLoginSuccess(userProfile);
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      // Give fallback warning or specific detail
      if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please permit popups for this page or try Email Sign-In.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(`This domain (${window.location.hostname}) is not authorized in your Firebase Project. Please add it to Authorized Domains in Firebase Auth Console.`);
      } else {
        setError(err.message || "An error occurred during Google Sign-In.");
      }
      setIsConnecting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userProfile: UserProfile = {
          name: result.user.email?.split("@")[0] || "User",
          email: result.user.email || "",
          picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
          isLoggedIn: true
        };
        onLoginSuccess(userProfile);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userProfile: UserProfile = {
          name: result.user.displayName || result.user.email?.split("@")[0] || "User",
          email: result.user.email || "",
          picture: result.user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
          isLoggedIn: true
        };
        onLoginSuccess(userProfile);
      }
    } catch (err: any) {
      console.error("Firebase Email Auth error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Try signing in instead.");
      } else {
        setError(err.message || "Authentication failed. Check your network or configuration.");
      }
      setIsConnecting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // Firebase real Anonymous sign-in
      const result = await signInAnonymously(auth);
      const demoUser: UserProfile = {
        name: "Agronomy Guest",
        email: "guest@example.com",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
        isLoggedIn: true
      };
      onLoginSuccess(demoUser);
    } catch (err: any) {
      console.warn("Anonymous Sign In failed, falling back to local guest access:", err);
      // Fallback guest bypass if anonymous sign-in is disabled in Firebase dashboard
      const fallbackUser: UserProfile = {
        name: "Agronomy Expert (Guest)",
        email: "guest@example.com",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
        isLoggedIn: true
      };
      onLoginSuccess(fallbackUser);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between" id="login-container">
      {/* Upper section */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/60 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Accent Header */}
          <div className="bg-stone-900 px-6 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Soil Diagnostic System</h1>
              <p className="text-xs text-stone-400 mt-1.5 max-w-xs">
                AI-Powered Agronomical & Lab Report Interpretation Portal
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-stone-100">
            <button
              onClick={() => { setActiveTab("google"); setError(null); }}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "google"
                  ? "border-emerald-600 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Google Access
            </button>
            <button
              onClick={() => { setActiveTab("email"); setError(null); }}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "email"
                  ? "border-emerald-600 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Email Access
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200/60 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
                <Shield className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div className="leading-relaxed font-medium">{error}</div>
              </div>
            )}

            {activeTab === "google" ? (
              <div className="space-y-4">
                {/* Primary OAuth Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm py-3 px-4 border border-stone-300 rounded-xl transition-all duration-200 hover:border-stone-400 active:scale-[0.98] disabled:opacity-50 shadow-sm"
                  id="google-signin-btn"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.16-3.16C17.45 1.73 14.93 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.79 2.94C6.21 7.23 8.87 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.97 3.7-8.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.29 10.44c-.25-.75-.39-1.56-.39-2.44s.14-1.69.39-2.44L1.5 2.61C.54 4.5.01 6.64.01 8.91c0 2.27.53 4.41 1.49 6.3l3.79-2.94c-.25-.76-.39-1.57-.39-2.43z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.73-2.89c-1.04.7-2.37 1.11-3.96 1.11-3.13 0-5.79-2.19-6.71-5.13L1.77 16.1C3.66 19.94 7.6 23 12 23z"
                    />
                  </svg>
                  <span>{isConnecting ? "Connecting to Google..." : "Sign in with Google"}</span>
                </button>

                <div className="flex items-center my-4 text-xs text-stone-400">
                  <span className="flex-grow border-t border-stone-200"></span>
                  <span className="px-3">or</span>
                  <span className="flex-grow border-t border-stone-200"></span>
                </div>

                {/* Seamless Demo Button */}
                <button
                  onClick={handleDemoSignIn}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-sm"
                  id="demo-signin-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isConnecting ? "Activating Guest Access..." : "Demo Guest Access"}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 bg-stone-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 bg-stone-50/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-sm mt-2"
                >
                  {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>
                    {isConnecting 
                      ? "Processing..." 
                      : isSignUp 
                        ? "Create Account" 
                        : "Sign In"}
                  </span>
                </button>

                {/* Toggle Action */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    {isSignUp 
                      ? "Already have an account? Sign In" 
                      : "New to the system? Create an Account"}
                  </button>
                </div>
              </form>
            )}

            {/* Quick explanation */}
            <p className="text-[11px] text-stone-500 text-center mt-6 leading-relaxed">
              Firebase Auth securely manages identity credentials. Sign up in seconds or utilize the <strong className="font-semibold text-emerald-700">Demo Guest Access</strong> shortcut for instant access.
            </p>

            {/* Help configuration toggle */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between text-stone-600 hover:text-stone-900 transition-colors py-1 text-xs font-semibold"
                id="toggle-instructions-btn"
              >
                <span className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  Firebase Auth & Google Integration Instructions
                </span>
                {showInstructions ? (
                  <ChevronUp className="w-4 h-4 text-stone-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                )}
              </button>

              {showInstructions && (
                <div className="mt-4 bg-stone-50 rounded-2xl border border-stone-200/50 p-4 text-[11px] text-stone-600 space-y-3.5 leading-relaxed">
                  <p>
                    This applet connects directly to a real Firebase Cloud instance (<strong className="font-semibold text-stone-800">Project ID: glass-vector-bfs6l</strong>). Let's review the authorization guidelines:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="font-bold text-stone-800">1. Authorized Domains:</div>
                    <p>
                      If Google Sign-In gives an <code className="font-mono bg-stone-200 px-1 py-0.5 rounded text-stone-800">auth/unauthorized-domain</code> error, register this URL domain under Firebase Authentication console &gt; Settings &gt; Authorized Domains:
                    </p>
                    <div className="bg-stone-200/80 p-2 rounded-lg font-mono text-stone-800 break-all select-all">
                      {window.location.hostname}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-stone-800">2. OAuth Consent Screen configuration:</div>
                    <p>
                      In Google Cloud Console, ensure Google Sign-In has been enabled for authentication. You can also utilize the built-in <strong className="font-semibold text-stone-800">Email/Password</strong> or <strong className="font-semibold text-stone-800">Guest Access</strong> fallback which runs immediately.
                    </p>
                  </div>

                  <div className="pt-1.5 flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Real-time persistence and Cloud Firestore are active.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-stone-400 border-t border-stone-200/40 bg-white/50">
        Soil Diagnostic System &copy; {new Date().getFullYear()} &middot; Designed for Intelligent Agriculture
      </footer>
    </div>
  );
}
