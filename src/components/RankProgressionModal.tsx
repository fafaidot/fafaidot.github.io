import React from "react";
import { X, Trophy, CheckCircle2, Lock, Sparkles, ChevronRight, Shield } from "lucide-react";
import { ALL_RANKS, getRankByXp } from "../utils/ranks";
import { UserProfile } from "../types";

interface RankProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const RankProgressionModal: React.FC<RankProgressionModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const { currentRank, nextRank, progressPercent, xpToNextRank, xpInCurrentTier, xpNeededForNextTier } =
    getRankByXp(profile.totalXp);

  return (
    <div
      id="rank-progression-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="rank-progression-modal-card"
        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#181818]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Rank Progression & XP Tiers
              </h2>
              <p className="text-xs text-neutral-400">
                Track your journey from Bronze to Hall of Fame
              </p>
            </div>
          </div>
          <button
            id="close-rank-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Standing Hero */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#1c1a17] to-[#121212] border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-semibold text-[#FF6B00] uppercase tracking-wider">
                Current Rank
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {currentRank.title}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40 font-semibold">
                  Tier {currentRank.level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-neutral-400 block">Total XP</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#FF6B00]">
                {profile.totalXp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Progress Bar to next rank */}
          {nextRank ? (
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-300">
                <span>
                  Progress to <strong className="text-white">{nextRank.title}</strong>
                </span>
                <span className="text-[#FF6B00] font-semibold">
                  {xpToNextRank.toLocaleString()} XP needed
                </span>
              </div>
              <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-[#FF6B00] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>{currentRank.minXp.toLocaleString()} XP</span>
                <span>{nextRank.minXp.toLocaleString()} XP</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-xs text-[#FF6B00]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>You have reached the maximum pinnacle rank of Hall of Fame!</span>
            </div>
          )}
        </div>

        {/* Scrollable Rank Tiers List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 divide-y divide-white/5">
          {ALL_RANKS.map((rank) => {
            const isCurrent = rank.id === currentRank.id;
            const isUnlocked = profile.totalXp >= rank.minXp;
            const xpRequirement = rank.minXp;
            const isNext = nextRank?.id === rank.id;

            return (
              <div
                key={rank.id}
                id={`rank-card-${rank.id}`}
                className={`pt-2.5 first:pt-0 rounded-xl p-3 transition-all ${
                  isCurrent
                    ? "bg-[#FF6B00]/10 border border-[#FF6B00]/40 shadow-inner"
                    : isNext
                    ? "bg-white/[0.03] border border-white/10"
                    : "opacity-80"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: `${rank.color}20`,
                        color: rank.color,
                        borderColor: `${rank.color}50`,
                        borderWidth: "1px",
                      }}
                    >
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-sm"
                          style={{ color: isUnlocked ? rank.color : "#9ca3af" }}
                        >
                          {rank.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Tier {rank.level}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-[#FF6B00] text-black font-bold px-1.5 py-0.2 rounded uppercase">
                            Your Rank
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                        {rank.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white block">
                      {xpRequirement === 0 ? "0 XP" : `${xpRequirement.toLocaleString()} XP`}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-medium">Unlocked</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {(xpRequirement - profile.totalXp).toLocaleString()} XP away
                      </span>
                    )}
                  </div>
                </div>

                {/* Rank Perks list */}
                <div className="mt-2 pl-10 flex flex-wrap gap-1.5">
                  {rank.perks.map((perk, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5"
                    >
                      • {perk}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#151515] flex justify-end">
          <button
            id="close-rank-modal-bottom-btn"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
