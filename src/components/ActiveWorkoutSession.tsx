import React, { useState, useEffect, useRef } from "react";
import { WorkoutRoutine, UserProfile, Drill } from "../types";
import { DrillVisualizer } from "./DrillVisualizer";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  ArrowRight,
  Heart,
  Share2,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playRefereeWhistle, playCountdownBeep, playSwishReward } from "../utils/audioCues";
import { getRankByXp } from "../utils/ranks";
import { logCompletedWorkoutToCloud, auth } from "../utils/firebase";

interface ActiveWorkoutSessionProps {
  routine: WorkoutRoutine;
  userProfile: UserProfile;
  onFinishWorkout: (updatedProfile: UserProfile, xpGained: number, durationMinutes: number) => void;
  onClose: () => void;
}

export const ActiveWorkoutSession: React.FC<ActiveWorkoutSessionProps> = ({
  routine,
  userProfile,
  onFinishWorkout,
  onClose,
}) => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(25);
  const [drillSecondsRemaining, setDrillSecondsRemaining] = useState<number>(
    routine.drills[0]?.durationSec || 180
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedDrillIds, setCompletedDrillIds] = useState<string[]>([]);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [aiCoachInsights, setAiCoachInsights] = useState<{ tips: string[]; motivationalQuote: string } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [isFavoriteRoutine, setIsFavoriteRoutine] = useState<boolean>(
    userProfile.favoriteRoutineIds?.includes(routine.id) || false
  );

  const startTimeRef = useRef<number>(Date.now());
  const currentDrill = routine.drills[currentDrillIndex] || routine.drills[0];
  const totalDrills = routine.drills.length;

  // On mount: whistle start
  useEffect(() => {
    if (soundEnabled) {
      playRefereeWhistle();
    }
  }, []);

  // Drill countdown timer
  useEffect(() => {
    if (isPaused || showCelebrationModal) return;

    if (isResting) {
      if (restSecondsRemaining <= 0) {
        setIsResting(false);
        const nextIndex = currentDrillIndex + 1;
        if (nextIndex < totalDrills) {
          setCurrentDrillIndex(nextIndex);
          setDrillSecondsRemaining(routine.drills[nextIndex].durationSec);
          if (soundEnabled) playRefereeWhistle();
        }
        return;
      }

      const timer = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownBeep(false);
          } else if (prev === 1 && soundEnabled) {
            playCountdownBeep(true);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      if (drillSecondsRemaining <= 0) {
        handleDrillComplete();
        return;
      }

      const timer = setInterval(() => {
        setDrillSecondsRemaining((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownBeep(false);
          } else if (prev === 1 && soundEnabled) {
            playCountdownBeep(true);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, isResting, restSecondsRemaining, drillSecondsRemaining, currentDrillIndex, showCelebrationModal, soundEnabled]);

  const handleDrillComplete = () => {
    if (soundEnabled) playSwishReward();

    if (!completedDrillIds.includes(currentDrill.id)) {
      setCompletedDrillIds((prev) => [...prev, currentDrill.id]);
    }

    if (currentDrillIndex < totalDrills - 1) {
      setIsResting(true);
      setRestSecondsRemaining(20);
    } else {
      triggerWorkoutFinish();
    }
  };

  const triggerWorkoutFinish = () => {
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#FF6B00", "#fbbf24", "#38bdf8", "#ffffff"],
    });

    setShowCelebrationModal(true);
    fetchAiFeedback(elapsedMinutes);
  };

  const fetchAiFeedback = async (minutes: number) => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/coach-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProgress: userProfile,
          recentWorkoutTitle: routine.title,
        }),
      });
      const data = await res.json();
      if (data.success && data.insights) {
        setAiCoachInsights(data.insights);
      }
    } catch (err) {
      console.error("Failed to load coach feedback", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const finalizeAndSave = async () => {
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const xpGained = routine.totalXp;
    const newTotalXp = userProfile.totalXp + xpGained;
    const { currentRank } = getRankByXp(newTotalXp);

    const updatedProfile: UserProfile = {
      ...userProfile,
      totalXp: newTotalXp,
      rankTitle: currentRank.title,
      rankLevel: currentRank.level,
      totalTrainingMinutes: userProfile.totalTrainingMinutes + elapsedMinutes,
      completedRoutinesCount: userProfile.completedRoutinesCount + 1,
      completedDrillsCount: userProfile.completedDrillsCount + completedDrillIds.length,
      currentStreakDays: userProfile.currentStreakDays + 1,
      lastWorkoutDate: new Date().toISOString(),
      favoriteRoutineIds: isFavoriteRoutine
        ? Array.from(new Set([...(userProfile.favoriteRoutineIds || []), routine.id]))
        : (userProfile.favoriteRoutineIds || []).filter((id) => id !== routine.id),
      history: [
        {
          id: `hist-${Date.now()}`,
          routineId: routine.id,
          routineTitle: routine.title,
          completedAt: new Date().toISOString(),
          durationMinutes: elapsedMinutes,
          xpGained,
          drillsCount: routine.drills.length,
          drillsCompleted: completedDrillIds,
        },
        ...(userProfile.history || []),
      ],
    };

    // Log to Firebase Cloud / Friends Feed
    if (auth.currentUser) {
      try {
        const record = {
          id: `hist-${Date.now()}`,
          routineId: routine.id,
          routineTitle: routine.title,
          completedAt: new Date().toISOString(),
          durationMinutes: elapsedMinutes,
          xpGained,
          drillsCount: routine.drills.length,
          drillsCompleted: completedDrillIds,
          userInitials: updatedProfile.initials,
          userName: updatedProfile.name,
        };
        await logCompletedWorkoutToCloud(
          auth.currentUser.uid,
          record,
          updatedProfile
        );
      } catch (err) {
        console.warn("Cloud log failed:", err);
      }
    }

    onFinishWorkout(updatedProfile, xpGained, elapsedMinutes);
    onClose();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const nextDrill = routine.drills[currentDrillIndex + 1];

  return (
    <div id="active-workout-session" className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F5F5F5] flex flex-col overflow-y-auto animate-fadeIn">
      {/* Top Session Bar */}
      <div className="sticky top-0 z-20 px-4 py-2.5 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <button
          id="close-workout-btn"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
            {isResting ? "Rest & Recover" : `Drill ${currentDrillIndex + 1} of ${totalDrills}`}
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
            {routine.title}
          </h2>
        </div>

        <button
          id="toggle-workout-audio"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-1.5 rounded-lg transition-colors border ${
            soundEnabled ? "bg-[#FF6B00]/15 border-[#FF6B00]/30 text-[#FF6B00]" : "bg-white/5 border-white/10 text-neutral-500"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Dots Bar */}
      <div className="w-full bg-black h-1 flex">
        {routine.drills.map((d, i) => (
          <div
            key={d.id}
            className={`h-full flex-1 transition-all duration-300 ${
              i < currentDrillIndex
                ? "bg-emerald-400"
                : i === currentDrillIndex
                ? "bg-[#FF6B00]"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 max-w-xl w-full mx-auto p-3 sm:p-4 flex flex-col gap-3 pb-24">
        {/* REST INTERVAL SCREEN */}
        {isResting ? (
          <div id="rest-interval-screen" className="flex-1 flex flex-col items-center justify-center p-6 bg-[#121212] rounded-2xl border border-white/10 text-center shadow-xl my-auto">
            <div className="w-12 h-12 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center mb-3 border border-[#FF6B00]/20">
              <Zap className="w-6 h-6 animate-pulse fill-[#FF6B00]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] mb-1">
              Rest & Hydrate
            </span>
            <div className="text-5xl font-mono font-bold tracking-tight text-white mb-2">
              {restSecondsRemaining}s
            </div>
            <p className="text-xs text-neutral-400 max-w-xs mb-4">
              Take slow breaths and reset your basketball stance before the next set.
            </p>

            {nextDrill && (
              <div className="w-full p-3.5 rounded-xl bg-black/60 border border-white/5 text-left mb-4">
                <div className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider mb-0.5">
                  Up Next
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">{nextDrill.title}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                  <span>{nextDrill.repsOrSets}</span>
                  <span>•</span>
                  <span>{nextDrill.equipmentNeeded}</span>
                </div>
              </div>
            )}

            <button
              id="skip-rest-btn"
              onClick={() => setRestSecondsRemaining(0)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <span>Skip Rest & Begin</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* ACTIVE DRILL SCREEN */
          <div className="flex flex-col gap-3">
            {/* Visualizer Court */}
            <DrillVisualizer drill={currentDrill} autoPlay={!isPaused} showExplanation={true} />

            {/* Drill Info & Main Timer */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-white/10 flex flex-col gap-2.5 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20">
                      {currentDrill.category.replace("_", " ")}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      +{currentDrill.xpReward} XP
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                    {currentDrill.title}
                  </h3>
                </div>

                {/* Big Timer Display */}
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#FF6B00]">
                    {formatTimer(drillSecondsRemaining)}
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Remaining</span>
                </div>
              </div>

              {/* Reps/Sets and Equipment badges */}
              <div className="flex flex-wrap gap-1.5 text-xs text-neutral-300 pt-2 border-t border-white/5">
                <span className="bg-black/60 border border-white/5 px-2.5 py-1 rounded-lg text-[11px]">🎯 {currentDrill.repsOrSets}</span>
                <span className="bg-black/60 border border-white/5 px-2.5 py-1 rounded-lg text-[11px]">⚡ {currentDrill.keyFocus}</span>
              </div>
            </div>

            {/* Coaching Cues List */}
            <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/5">
              <h4 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                Coach Execution Keys
              </h4>
              <ul className="space-y-1.5">
                {currentDrill.coachingCues.map((cue, idx) => (
                  <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded bg-[#FF6B00]/20 text-[#FF6B00] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 z-30">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
          <button
            id="reset-drill-timer-btn"
            onClick={() => setDrillSecondsRemaining(currentDrill.durationSec)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Reset Drill Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="pause-resume-workout-btn"
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/15 transition-colors"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            id="complete-drill-btn"
            onClick={handleDrillComplete}
            className="py-2.5 px-5 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
          >
            <span>{currentDrillIndex === totalDrills - 1 ? "Finish Workout" : "Next Drill"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WORKOUT COMPLETION CELEBRATION MODAL */}
      {showCelebrationModal && (
        <div id="workout-celebration-modal" className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-black mb-3 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] mb-0.5">
              Practice Complete!
            </span>
            <h3 className="text-lg font-bold text-white mb-1">{routine.title}</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Great work! Your XP and workout log have been recorded.
            </p>

            {/* XP & Stats Grid */}
            <div className="grid grid-cols-3 gap-2 w-full mb-4">
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <div className="text-base font-bold text-[#FF6B00]">+{routine.totalXp}</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase">XP Gained</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <div className="text-base font-bold text-emerald-400">{routine.drills.length}</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase">Drills Hit</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <div className="text-base font-bold text-blue-400">{userProfile.currentStreakDays + 1}d</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase">Streak</div>
              </div>
            </div>

            {/* AI Coach Insights Box */}
            <div className="w-full p-3.5 rounded-xl bg-black/60 border border-white/5 text-left mb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="text-xs font-bold text-white">AI Coach Breakdown</span>
              </div>
              {loadingInsights ? (
                <div className="text-xs text-neutral-400 italic py-1 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
                  Generating coach insights...
                </div>
              ) : aiCoachInsights ? (
                <div className="space-y-1">
                  {aiCoachInsights.tips.map((tip, i) => (
                    <div key={i} className="text-xs text-neutral-300 flex items-start gap-1.5">
                      <span className="text-[#FF6B00] font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                  {aiCoachInsights.motivationalQuote && (
                    <p className="text-[11px] text-[#FF6B00] italic pt-1 border-t border-white/5">
                      &quot;{aiCoachInsights.motivationalQuote}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">
                  Solid rhythm and deceleration mechanics on your sets. Keep that intensity for tomorrow!
                </p>
              )}
            </div>

            {/* Done Button */}
            <button
              id="finish-and-return-btn"
              onClick={finalizeAndSave}
              className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <span>Save Workout & Collect XP</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
