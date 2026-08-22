import React, { useState } from "react";
import { User } from "firebase/auth";
import { UserProfile } from "../types";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  completeGoogleOnboarding,
  logoutUser,
  resetUserPassword,
  getFriendlyAuthErrorMessage,
  saveUserProfileToCloud,
} from "../utils/firebase";
import {
  Mail,
  Lock,
  User as UserIcon,
  AtSign,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  ShieldCheck,
  Cloud,
  Globe,
  Award,
} from "lucide-react";
import { computeInitials } from "../utils/ranks";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userProfile: UserProfile;
  isMandatoryAuth?: boolean;
  onAuthSuccess: (user: User, profile: UserProfile) => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userProfile,
  isMandatoryAuth = false,
  onAuthSuccess,
  onProfileUpdate,
  onLogout,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "google_onboard" | "forgot" | "profile">(
    currentUser ? "profile" : "signin"
  );

  // Sign up & Google fields (Mandatory first name, last name, username)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.isNewUser) {
        setPendingGoogleUser(res.user);
        // Pre-fill name from Google display name if available
        const parts = (res.user.displayName || "").trim().split(" ");
        if (parts.length >= 2) {
          setFirstName(parts[0]);
          setLastName(parts.slice(1).join(" "));
        } else if (parts.length === 1) {
          setFirstName(parts[0]);
        }
        setMode("google_onboard");
      } else if (res.profile) {
        onAuthSuccess(res.user, res.profile);
        setSuccessMsg("Welcome back to Hoop Master!");
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setErrorMsg("First Name, Last Name, and Username are all mandatory.");
      return;
    }
    if (!pendingGoogleUser) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const profile = await completeGoogleOnboarding(
        pendingGoogleUser,
        firstName,
        lastName,
        username
      );
      onAuthSuccess(pendingGoogleUser, profile);
      setSuccessMsg("Profile created! Welcome to Hoop Master.");
      setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithEmail(email, password);
      setSuccessMsg("Welcome back!");
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg("First Name, Last Name, Username, Email, and Password are all required.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const { user, profile } = await registerWithEmail(
        email,
        password,
        firstName,
        lastName,
        username
      );
      onAuthSuccess(user, profile);
      setSuccessMsg("Account created! Let's start training.");
      setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Enter your email address to receive reset instructions.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await resetUserPassword(email);
      setSuccessMsg("Password reset link sent! Check your inbox.");
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      onLogout();
      setMode("signin");
    } catch (err) {
      console.warn("Logout error:", err);
    }
  };

  const initials = computeInitials(
    userProfile.firstName,
    userProfile.lastName,
    userProfile.name
  );

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={() => {
        if (!isMandatoryAuth) onClose();
      }}
    >
      <div
        id="auth-modal-card"
        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161616]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-black text-xs flex items-center justify-center">
              HM
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {mode === "profile"
                  ? "Player Account"
                  : mode === "google_onboard"
                  ? "Complete Profile"
                  : mode === "signup"
                  ? "Create Account"
                  : mode === "forgot"
                  ? "Reset Password"
                  : "Sign In"}
              </h2>
              <p className="text-[11px] text-neutral-400">Hoop Master Cloud Sync</p>
            </div>
          </div>

          {!isMandatoryAuth && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === "signin" && (
            <div className="space-y-3">
              {/* Google Sign In Button */}
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-neutral-100 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 my-2 text-[10px] text-neutral-500 uppercase font-semibold">
                <div className="flex-1 h-px bg-white/10" />
                <span>or email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@hoopmaster.app"
                      className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[10px] text-[#FF6B00] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#FF6B00] text-black font-bold text-xs rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 mt-1"
                >
                  {loading ? "Signing in..." : "Sign In with Email"}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-neutral-400 border-t border-white/5">
                New to Hoop Master?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                  }}
                  className="text-[#FF6B00] font-bold hover:underline"
                >
                  Create an Account
                </button>
              </div>
            </div>
          )}

          {/* MODE: SIGN UP (MANDATORY FIRST NAME, LAST NAME, USERNAME) */}
          {mode === "signup" && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your mandatory First and Last name. Your name and username are permanently locked once chosen.
              </p>

              <form onSubmit={handleSignUp} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                      First Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Kobe"
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                      Last Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Bryant"
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Username <span className="text-[#FF6B00]">*</span> (Permanent)
                  </label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="mamba_kb8"
                      className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">
                    Letters, numbers, and underscores only. Cannot be changed.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Email Address <span className="text-[#FF6B00]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@hoopmaster.app"
                      className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Password <span className="text-[#FF6B00]">*</span> (Min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#FF6B00] text-black font-bold text-xs rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? "Creating Account..." : "Create Account & Lock Name"}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-neutral-400 border-t border-white/5">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                  }}
                  className="text-[#FF6B00] font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* MODE: GOOGLE FIRST TIME ONBOARDING */}
          {mode === "google_onboard" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-xs text-neutral-200">
                <strong className="text-[#FF6B00]">Final Step: </strong> Please confirm your First Name, Last Name, and choose a unique @username. These will be permanently locked.
              </div>

              <form onSubmit={handleCompleteGoogleOnboarding} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                      First Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Stephen"
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                      Last Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Curry"
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Username <span className="text-[#FF6B00]">*</span> (Permanent)
                  </label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="chef_curry30"
                      className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#FF6B00] text-black font-bold text-xs rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving Profile..." : "Complete Setup & Enter App"}
                </button>
              </form>
            </div>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === "forgot" && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                Enter your email address and we will send you a link to reset your password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@hoopmaster.app"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#FF6B00] text-black font-bold text-xs rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="w-full py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Back to Sign In
                </button>
              </form>
            </div>
          )}

          {/* MODE: PROFILE & SETTINGS */}
          {mode === "profile" && (
            <div className="space-y-4">
              {/* User Hero with Initials Avatar */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-black text-sm flex items-center justify-center border-2 border-white/15 shrink-0 shadow-lg">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white truncate">{userProfile.name}</h3>
                    <span title="Name locked permanently">
                      <Lock className="w-3 h-3 text-neutral-500" />
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">@{userProfile.username}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF6B00]/20 text-[#FF6B00] font-semibold inline-block mt-1">
                    {userProfile.rankTitle} Tier {userProfile.rankLevel} • {userProfile.totalXp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Account Details (Permanent Lock Indicators) */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-neutral-400">Full Name</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    {userProfile.name} <Lock className="w-3 h-3 text-neutral-500" />
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-neutral-400">Username</span>
                  <span className="text-white font-mono flex items-center gap-1">
                    @{userProfile.username} <Lock className="w-3 h-3 text-neutral-500" />
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-neutral-400">Friend Code</span>
                  <span className="text-[#FF6B00] font-mono font-bold">{userProfile.friendCode}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium block">Workout Privacy</span>
                    <span className="text-[10px] text-neutral-500">
                      {userProfile.isPrivateWorkouts
                        ? "Only you can see your workouts"
                        : "Visible to your connected friends"}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      const updated: UserProfile = {
                        ...userProfile,
                        isPrivateWorkouts: !userProfile.isPrivateWorkouts,
                      };
                      onProfileUpdate(updated);
                      if (currentUser) {
                        await saveUserProfileToCloud(currentUser.uid, updated);
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border ${
                      userProfile.isPrivateWorkouts
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {userProfile.isPrivateWorkouts ? "Private" : "Friends Visible"}
                  </button>
                </div>
              </div>

              {/* Sign out button */}
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
