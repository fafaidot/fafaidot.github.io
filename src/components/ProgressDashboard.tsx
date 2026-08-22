import React, { useState } from "react";
import { UserProfile, WorkoutRoutine, Drill } from "../types";
import { ALL_DRILLS, CURATED_ROUTINES } from "../data/drillsData";
import { getRankByXp, ALL_RANKS, computeInitials } from "../utils/ranks";
import { RankProgressionModal } from "./RankProgressionModal";
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Lock,
  Heart,
  Play,
  Layers,
  ChevronRight,
  Shield,
} from "lucide-react";

interface ProgressDashboardProps {
  userProfile: UserProfile;
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onStartDrillSingle: (drill: Drill) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userProfile,
  onStartRoutine,
  onStartDrillSingle,
}) => {
  const [showRankModal, setShowRankModal] = useState<boolean>(false);
  const { currentRank, nextRank, progressPercent, xpToNextRank } = getRankByXp(userProfile.totalXp);
  const initials = computeInitials(userProfile.firstName, userProfile.lastName, userProfile.name);

  const favoriteDrills = ALL_DRILLS.filter((d) =>
    userProfile.favoriteDrillIds?.includes(d.id)
  );

  const favoriteRoutines = [...CURATED_ROUTINES, ...userProfile.customRoutines].filter((r) =>
    userProfile.favoriteRoutineIds?.includes(r.id)
  );

  return (
    <div id="progress-dashboard-view" className="flex flex-col gap-4 sm:gap-5 pb-24 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
          Player Progress & Tier Tracker
        </h1>
        <p className="text-xs text-neutral-400">
          Track your XP progression, daily streak, unlocked ranks, and workout history.
        </p>
      </div>

      {/* Hero Rank Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-black text-xs flex items-center justify-center border-2 border-white/10 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FF6B00]/20 text-[#FF6B00]">
                  Tier {currentRank.level}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {userProfile.totalXp.toLocaleString()} Total XP
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {currentRank.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-xs font-semibold text-[#FF6B00]">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{userProfile.currentStreakDays} Day Streak</span>
            </div>

            <button
              onClick={() => setShowRankModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All Tiers</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 text-[11px]">Rank Progress</span>
            <span className="text-[#FF6B00] font-bold font-mono text-xs">
              {progressPercent}% to {nextRank.title}
            </span>
          </div>
          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className="bg-[#FF6B00] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span>{currentRank.minXp.toLocaleString()} XP</span>
            <span>{xpToNextRank.toLocaleString()} XP needed for {nextRank.title}</span>
            <span>{nextRank.minXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Lifetime Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Workouts</div>
          <div className="text-lg font-bold text-white mt-0.5">{userProfile.completedRoutinesCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Training Time</div>
          <div className="text-lg font-bold text-white mt-0.5">{userProfile.totalTrainingMinutes} mins</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Drills Completed</div>
          <div className="text-lg font-bold text-white mt-0.5">{userProfile.completedDrillsCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Squad Friends</div>
          <div className="text-lg font-bold text-[#FF6B00] mt-0.5">{userProfile.friends?.length || 0}</div>
        </div>
      </div>

      {/* All 8 Ranks Overview */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-white">Rank Progression Tiers</h3>
          <span className="text-[11px] text-neutral-400 font-mono">Tier I to Tier VIII</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_RANKS.map((r) => {
            const isUnlocked = userProfile.totalXp >= r.minXp;
            const isCurrent = currentRank.level === r.level;

            return (
              <div
                key={r.level}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-[#FF6B00]/15 border-[#FF6B00] shadow-sm"
                    : isUnlocked
                    ? "bg-white/[0.02] border-white/10 text-neutral-300"
                    : "bg-black/30 border-white/5 opacity-50 text-neutral-500"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400">
                    Tier {r.level}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{r.title}</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {r.minXp.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workout History */}
      {userProfile.history && userProfile.history.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/10">
          <h3 className="text-xs sm:text-sm font-bold text-white mb-3">Recent Workout History</h3>
          <div className="space-y-2">
            {userProfile.history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{item.routineTitle}</span>
                  <span className="text-[10px] text-neutral-500">
                    {new Date(item.completedAt).toLocaleDateString()} • {item.durationMinutes} mins
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-[#FF6B00]">+{item.xpGained} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rank Modal */}
      <RankProgressionModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        profile={userProfile}
      />
    </div>
  );
};
