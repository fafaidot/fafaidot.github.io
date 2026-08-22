import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  UserProfile,
  WorkoutRoutine,
  Drill,
  OnboardingAnswers,
  FriendWorkout,
} from "./types";
import {
  loadUserProfile,
  saveUserProfile,
  loadThemeMode,
  saveThemeMode,
} from "./utils/offlineStorage";
import {
  auth,
  onAuthStateChanged,
  fetchUserProfile,
  saveUserProfileToCloud,
  subscribeToFriendWorkouts,
} from "./utils/firebase";
import { HomeDashboard } from "./components/HomeDashboard";
import { DrillsLibrary } from "./components/DrillsLibrary";
import { AiRoutineGenerator } from "./components/AiRoutineGenerator";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SocialHub } from "./components/SocialHub";
import { ActiveWorkoutSession } from "./components/ActiveWorkoutSession";
import { OnboardingSurvey } from "./components/OnboardingSurvey";
import { AuthModal } from "./components/AuthModal";
import {
  Home,
  Layers,
  Bot,
  Trophy,
  Users,
  Flame,
  Cloud,
  LogIn,
  Lock,
} from "lucide-react";
import { computeInitials } from "./utils/ranks";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [friendWorkouts, setFriendWorkouts] = useState<FriendWorkout[]>([]);
  const [themeMode, setThemeMode] = useState<"dark" | "light">(loadThemeMode);

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"home" | "library" | "ai" | "progress" | "social">("home");
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<WorkoutRoutine | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthInitialized(true);

      if (user) {
        try {
          const cloudProfile = await fetchUserProfile(user.uid);
          if (cloudProfile) {
            setUserProfile(cloudProfile);
            saveUserProfile(cloudProfile);
          } else {
            // Save initial profile
            const parts = (user.displayName || "").trim().split(" ");
            const firstName = parts[0] || userProfile.firstName || "Player";
            const lastName = parts.slice(1).join(" ") || userProfile.lastName || "One";
            const updated: UserProfile = {
              ...userProfile,
              email: user.email || "",
              firstName,
              lastName,
              name: `${firstName} ${lastName}`,
            };
            await saveUserProfileToCloud(user.uid, updated);
            setUserProfile(updated);
          }
        } catch (e) {
          console.warn("Could not sync profile from Firestore:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time friend workouts feed
  useEffect(() => {
    const unsub = subscribeToFriendWorkouts((workouts) => {
      if (workouts) {
        setFriendWorkouts(workouts);
      }
    });
    return () => unsub();
  }, []);

  const updateProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setUserProfile((prev) => {
      const next = updater(prev);
      saveUserProfile(next);
      if (currentUser) {
        saveUserProfileToCloud(currentUser.uid, next).catch((err) =>
          console.warn("Cloud save error:", err)
        );
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const toggleTheme = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextMode);
    saveThemeMode(nextMode);
  };

  const handleToggleFavoriteDrill = (drillId: string) => {
    updateProfile((prev) => {
      const isFav = prev.favoriteDrillIds?.includes(drillId);
      const updated = isFav
        ? prev.favoriteDrillIds.filter((id) => id !== drillId)
        : [...(prev.favoriteDrillIds || []), drillId];
      showToast(isFav ? "Removed from favorite drills" : "Added to favorite drills ⭐");
      return { ...prev, favoriteDrillIds: updated };
    });
  };

  const handleSaveCustomRoutine = (routine: WorkoutRoutine) => {
    updateProfile((prev) => {
      const updatedCustom = [routine, ...prev.customRoutines.filter((r) => r.id !== routine.id)];
      showToast(`Custom routine "${routine.title}" saved!`);
      return { ...prev, customRoutines: updatedCustom };
    });
  };

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    setActiveWorkoutRoutine(routine);
    updateProfile((prev) => ({
      ...prev,
      activeWorkoutRoutineId: routine.id,
    }));
  };

  const handleStartDrillSingle = (drill: Drill) => {
    const singleRoutine: WorkoutRoutine = {
      id: `single-drill-${Date.now()}`,
      title: drill.title,
      description: drill.description,
      level: drill.level,
      totalDurationMin: Math.max(1, Math.round(drill.durationSec / 60)),
      totalXp: drill.xpReward,
      category: drill.category,
      drills: [drill],
      isCurated: false,
      tags: ["Single Drill", drill.level],
      targetSkill: drill.keyFocus,
    };
    setActiveWorkoutRoutine(singleRoutine);
  };

  const handleFinishWorkout = (updatedProfile: UserProfile, xpGained: number, durationMinutes: number) => {
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    showToast(`+${xpGained} XP Earned! Logged to Hoop Master.`);
  };

  const handleCompleteSurvey = (answers: OnboardingAnswers, recommendedRoutine: WorkoutRoutine) => {
    updateProfile((prev) => ({
      ...prev,
      onboardingCompleted: true,
      activeWorkoutRoutineId: recommendedRoutine.id,
    }));
    setShowOnboarding(false);
    showToast(`Calibrated starter plan: "${recommendedRoutine.title}"!`);
  };

  const handleSkipSurvey = () => {
    updateProfile((prev) => ({
      ...prev,
      onboardingCompleted: true,
    }));
    setShowOnboarding(false);
    showToast("Welcome to Hoop Master!");
  };

  const initials = computeInitials(userProfile.firstName, userProfile.lastName, userProfile.name);

  // Gating requirement: "You can't use the app unless you sign in"
  const isUserUnauthenticated = authInitialized && !currentUser;

  return (
    <div
      id="hoop-master-app-root"
      className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] transition-colors relative flex flex-col justify-between"
    >
      {/* Top Header Bar */}
      <header
        id="app-top-header"
        className="h-14 border-b border-white/10 flex items-center justify-between px-3 sm:px-6 bg-[#0D0D0D] sticky top-0 z-40 backdrop-blur-md"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6B00] rounded-lg flex items-center justify-center text-black font-black text-xs shadow-md">
            <Flame className="w-4 h-4 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                HOOP MASTER
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Status: Cloud status & Initials Avatar */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-neutral-300"
            title={currentUser ? "Synced with Firebase" : "Sign in to sync"}
          >
            {currentUser ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Cloud className="w-3 h-3" />
                <span className="hidden sm:inline">Synced</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-neutral-400">
                <Lock className="w-3 h-3 text-[#FF6B00]" />
                <span className="hidden sm:inline">Sign In Required</span>
              </span>
            )}
          </div>

          {/* Account Initials Avatar Button */}
          <button
            id="auth-profile-header-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 p-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Player Account & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-bold text-xs flex items-center justify-center border border-white/10">
              {initials}
            </div>
            {currentUser && (
              <div className="text-left hidden sm:block pr-1">
                <div className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                  {userProfile.name}
                </div>
                <div className="text-[9px] text-[#FF6B00] font-mono">
                  @{userProfile.username}
                </div>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Responsive Mobile Container */}
      <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col px-3 sm:px-5 pt-3 sm:pt-4">
        {/* Dynamic Tab View */}
        {activeTab === "home" && (
          <HomeDashboard
            userProfile={userProfile}
            themeMode={themeMode}
            onToggleTheme={toggleTheme}
            onStartRoutine={handleStartRoutine}
            onNavigateTab={setActiveTab}
            onOpenSurvey={() => setShowOnboarding(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === "library" && (
          <DrillsLibrary
            userProfile={userProfile}
            onToggleFavoriteDrill={handleToggleFavoriteDrill}
            onStartCustomRoutine={handleStartRoutine}
            onSaveCustomRoutine={handleSaveCustomRoutine}
          />
        )}

        {activeTab === "ai" && (
          <AiRoutineGenerator
            onStartRoutine={handleStartRoutine}
            onSaveRoutine={(routine) => {
              handleSaveCustomRoutine(routine);
              showToast("AI routine saved to your plan!");
            }}
          />
        )}

        {activeTab === "progress" && (
          <ProgressDashboard
            userProfile={userProfile}
            onStartRoutine={handleStartRoutine}
            onStartDrillSingle={handleStartDrillSingle}
          />
        )}

        {activeTab === "social" && (
          <SocialHub
            userProfile={userProfile}
            friendWorkouts={friendWorkouts}
            onUpdateProfile={(updated) => {
              setUserProfile(updated);
              saveUserProfile(updated);
            }}
          />
        )}
      </main>

      {/* ACTIVE WORKOUT RUNNER OVERLAY */}
      {activeWorkoutRoutine && (
        <ActiveWorkoutSession
          routine={activeWorkoutRoutine}
          userProfile={userProfile}
          onFinishWorkout={handleFinishWorkout}
          onClose={() => setActiveWorkoutRoutine(null)}
        />
      )}

      {/* ONBOARDING SURVEY */}
      {showOnboarding && (
        <OnboardingSurvey
          onCompleteSurvey={handleCompleteSurvey}
          onSkipSurvey={handleSkipSurvey}
        />
      )}

      {/* FIREBASE AUTH MODAL (MANDATORY IF NOT SIGNED IN) */}
      <AuthModal
        isOpen={isAuthModalOpen || isUserUnauthenticated}
        onClose={() => {
          if (!isUserUnauthenticated) {
            setIsAuthModalOpen(false);
          }
        }}
        isMandatoryAuth={isUserUnauthenticated}
        currentUser={currentUser}
        userProfile={userProfile}
        onAuthSuccess={(user, profile) => {
          setCurrentUser(user);
          setUserProfile(profile);
          saveUserProfile(profile);
          setIsAuthModalOpen(false);
        }}
        onProfileUpdate={(profile) => {
          setUserProfile(profile);
          saveUserProfile(profile);
        }}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-xl bg-[#141414] border border-[#FF6B00]/40 text-white font-semibold text-xs shadow-lg backdrop-blur-md flex items-center gap-2 animate-fadeIn"
        >
          <Flame className="w-3.5 h-3.5 text-[#FF6B00] fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NATIVE BOTTOM NAVIGATION BAR */}
      <nav
        id="bottom-mobile-nav"
        className="fixed bottom-0 left-0 right-0 z-30 h-14 sm:h-16 bg-[#0D0D0D]/95 border-t border-white/10 backdrop-blur-md flex items-center justify-around px-2"
      >
        <div className="max-w-md w-full mx-auto flex items-center justify-around">
          <button
            id="nav-tab-home"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === "home" ? "text-[#FF6B00] font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            id="nav-tab-library"
            onClick={() => setActiveTab("library")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === "library" ? "text-[#FF6B00] font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px]">Skills</span>
          </button>

          <button
            id="nav-tab-ai"
            onClick={() => setActiveTab("ai")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors relative ${
              activeTab === "ai" ? "text-[#FF6B00] font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#FF6B00] text-black flex items-center justify-center -mt-2 shadow-md">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-[#FF6B00]">AI Coach</span>
          </button>

          <button
            id="nav-tab-progress"
            onClick={() => setActiveTab("progress")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === "progress" ? "text-[#FF6B00] font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px]">Ranks</span>
          </button>

          <button
            id="nav-tab-social"
            onClick={() => setActiveTab("social")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === "social" ? "text-[#FF6B00] font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px]">Squad</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
