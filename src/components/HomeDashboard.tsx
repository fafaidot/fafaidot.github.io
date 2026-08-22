import React, { useState } from "react";
import { UserProfile, WorkoutRoutine, Drill } from "../types";
import { CURATED_ROUTINES } from "../data/drillsData";
import { getRankByXp, computeInitials } from "../utils/ranks";
import { RankProgressionModal } from "./RankProgressionModal";
import {
  Play,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Bot,
  Target,
  Layers,
  ChevronRight,
  ClipboardCheck,
  Lock,
} from "lucide-react";

interface HomeDashboardProps {
  userProfile: UserProfile;
  themeMode: "dark" | "light";
  onToggleTheme: () => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onNavigateTab: (tab: "home" | "library" | "ai" | "progress" | "social") => void;
  onOpenSurvey: () => void;
  onOpenAuthModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  themeMode,
  onToggleTheme,
  onStartRoutine,
  onNavigateTab,
  onOpenSurvey,
  onOpenAuthModal,
}) => {
  const [showRankModal, setShowRankModal] = useState<boolean>(false);
  const { currentRank, nextRank, progressPercent, xpToNextRank } = getRankByXp(userProfile.totalXp);
  const initials = computeInitials(userProfile.firstName, userProfile.lastName, userProfile.name);

  // Active / Recommended Routine
  const activeRoutine =
    CURATED_ROUTINES.find((r) => r.id === userProfile.activeWorkoutRoutineId) ||
    userProfile.customRoutines[0] ||
    CURATED_ROUTINES[0];

  return (
    <div id="home-dashboard-view" className="flex flex-col gap-4 sm:gap-5 pb-24 animate-fadeIn">
      {/* Top Profile & Rank Bar */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          {/* Initials Avatar */}
          <button
            id="user-profile-avatar-btn"
            onClick={onOpenAuthModal}
            className="relative group focus:outline-none"
            title="Account Details"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-black text-xs flex items-center justify-center border-2 border-white/10 group-hover:border-[#FF6B00] transition-colors shadow-inner">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-[#FF6B00] text-black font-bold text-[8px] uppercase">
              T{currentRank.level}
            </div>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {userProfile.name}
              </h1>
              {userProfile.username && (
                <span className="text-[11px] text-neutral-500 font-mono">
                  @{userProfile.username}
                </span>
              )}
            </div>

            {/* Clickable Rank Tag */}
            <button
              id="open-rank-progression-btn"
              onClick={() => setShowRankModal(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mt-0.5 group"
            >
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 group-hover:bg-[#FF6B00]/25 transition-colors">
                {currentRank.title}
              </span>
              <span className="text-[11px] text-neutral-400 group-hover:underline">
                • {userProfile.totalXp.toLocaleString()} XP
              </span>
              <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-[#FF6B00]" />
            </button>
          </div>
        </div>

        {/* Quick Streak & Survey Controls */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-xs font-semibold text-neutral-300">
            <Flame className="w-3.5 h-3.5 text-[#FF6B00] fill-current" />
            <span>{userProfile.currentStreakDays}d Streak</span>
          </div>

          <button
            id="retake-survey-btn"
            onClick={onOpenSurvey}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Skill Assessment Survey"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{userProfile.onboardingCompleted ? "Survey" : "Take Survey"}</span>
          </button>
        </div>
      </div>

      {/* SURVEY GATING BANNER (If survey not completed) */}
      {!userProfile.onboardingCompleted ? (
        <div
          id="survey-required-banner"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#181411] to-[#121212] border border-[#FF6B00]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                Assessment Required
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Complete the 1-Minute Skill Survey to Unlock Recommended Workouts
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
                Hoop Master calibrates training sets based on your court equipment, experience level, and primary growth focus.
              </p>
            </div>
          </div>

          <button
            id="launch-onboarding-survey-btn"
            onClick={onOpenSurvey}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-bold text-xs flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md"
          >
            <span>Start 1-Min Survey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* RECOMMENDED WORKOUT HERO CARD (Unlocked after survey) */
        <div
          id="recommended-workout-card"
          className="bg-gradient-to-br from-[#1c1916] to-[#121212] border border-white/10 p-5 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between gap-4 shadow-xl"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-neutral-300">
                Recommended For You
              </span>
              <div className="flex items-center gap-1 text-xs font-bold bg-[#FF6B00]/20 border border-[#FF6B00]/30 px-2 py-0.5 rounded-full text-[#FF6B00]">
                <Zap className="w-3 h-3 fill-current" />
                <span>+{activeRoutine.totalXp} XP</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeRoutine.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed max-w-lg">
              {activeRoutine.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mt-3">
              <span className="flex items-center gap-1 bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
                <Clock className="w-3 h-3 text-[#FF6B00]" />
                {activeRoutine.totalDurationMin} Mins
              </span>
              <span className="flex items-center gap-1 bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
                <Layers className="w-3 h-3 text-[#FF6B00]" />
                {activeRoutine.drills.length} Drills
              </span>
              <span className="bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg capitalize text-neutral-300">
                {activeRoutine.level}
              </span>
            </div>
          </div>

          {/* Launch button */}
          <button
            id="hero-launch-workout-btn"
            onClick={() => onStartRoutine(activeRoutine)}
            className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.99] relative z-10 shadow-md"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch Workout Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* AI PRACTICE ARCHITECT BANNER */}
      <div
        id="ai-coach-card"
        onClick={() => onNavigateTab("ai")}
        className="p-4 sm:p-5 rounded-2xl bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF6B00]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Practice Architect
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
              Custom AI Plan For Your Available Minutes & Gear
            </h3>
            <p className="text-[11px] text-neutral-400 line-clamp-1">
              Specify your target skill and duration for an instant structured workout.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>

      {/* CURATED ROUTINES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Daily Workout Routines</h3>
            <p className="text-[11px] text-neutral-400">Structured basketball clinics</p>
          </div>
          <button
            onClick={() => onNavigateTab("library")}
            className="text-xs font-semibold text-[#FF6B00] hover:underline flex items-center gap-1"
          >
            <span>View All Drills</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CURATED_ROUTINES.map((routine) => (
            <div
              key={routine.id}
              id={`routine-card-${routine.id}`}
              className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20">
                    {routine.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#FF6B00]">+{routine.totalXp} XP</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {routine.title}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {routine.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2.5 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {routine.totalDurationMin} mins
                  </span>
                  <span>•</span>
                  <span>{routine.drills.length} Drills</span>
                  <span>•</span>
                  <span className="capitalize">{routine.level}</span>
                </div>
              </div>

              <button
                id={`start-curated-btn-${routine.id}`}
                onClick={() => onStartRoutine(routine)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#FF6B00] hover:text-black border border-white/10 hover:border-transparent text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Routine</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rank Progression Modal */}
      <RankProgressionModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        profile={userProfile}
      />
    </div>
  );
};
