import React, { useState } from "react";
import { WorkoutRoutine, SkillLevel, IntensityLevel, Drill } from "../types";
import { ALL_DRILLS } from "../data/drillsData";
import { Sparkles, Bot, Clock, Flame, Zap, ArrowRight, CheckCircle2, RotateCcw, AlertCircle, Play } from "lucide-react";

interface AiRoutineGeneratorProps {
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onSaveRoutine: (routine: WorkoutRoutine) => void;
}

export const AiRoutineGenerator: React.FC<AiRoutineGeneratorProps> = ({
  onStartRoutine,
  onSaveRoutine,
}) => {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [primaryGoal, setPrimaryGoal] = useState<string>("Kyrie Ball Handling & Rapid Deceleration");
  const [timeMinutes, setTimeMinutes] = useState<number>(20);
  const [equipment, setEquipment] = useState<string>("1 Basketball");
  const [hasHoop, setHasHoop] = useState<boolean>(true);
  const [intensity, setIntensity] = useState<IntensityLevel>("Medium");
  const [specificNotes, setSpecificNotes] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<WorkoutRoutine | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const goalPresets = [
    { title: "Kyrie Shift Handles", desc: "Violent change of pace & tight pocket dribbles", icon: "⚡" },
    { title: "Pure Sniper Spot-Up", desc: "Elbow rhythm, high arc & 3PT consistency", icon: "🎯" },
    { title: "Explosive First-Step", desc: "Lateral speed, vertical hops & deceleration", icon: "🔥" },
    { title: "Paint Finisher & Touch", desc: "Euro-steps, floaters & glass baby hooks", icon: "🌪️" },
    { title: "Lockdown Defender", desc: "Stance endurance, slide agility & contests", icon: "🛡️" },
    { title: "No-Hoop Home Workout", desc: "100% stationary ground dribble & footwork", icon: "🏠" },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedRoutine(null);

    try {
      const res = await fetch("/api/ai/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillLevel,
          primaryGoal,
          timeMinutes,
          equipment,
          hasHoop,
          intensity,
          specificNotes,
          availableDrills: ALL_DRILLS,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.routine) {
        throw new Error(data.error || "Failed to create workout plan");
      }

      const routineRaw = data.routine;

      // Map generated drills into standard Drill objects with animation types
      const mappedDrills: Drill[] = (routineRaw.drills || []).map((d: any, idx: number) => {
        // Match existing drill or fallback to dynamic drill
        const matched = ALL_DRILLS.find(
          (ad) => ad.title.toLowerCase().includes(d.title?.toLowerCase() || "")
        );
        return {
          id: matched?.id || `ai-drill-${Date.now()}-${idx}`,
          title: d.title || `Skill Progression #${idx + 1}`,
          category: d.category || (matched ? matched.category : "ball_handling"),
          level: skillLevel,
          durationSec: Number(d.durationSec) || 180,
          repsOrSets: d.repsOrSets || "3 sets x 40s",
          description: d.description || "Focus on explosive execution and pure technique.",
          coachingCues: Array.isArray(d.coachingCues) && d.coachingCues.length > 0
            ? d.coachingCues
            : ["Keep eyes up and chest active", "Drive power through your hips", "Hold your follow-through"],
          equipmentNeeded: equipment,
          keyFocus: d.keyFocus || "Kinetic energy transfer & ball control",
          animationType: matched ? matched.animationType : "pound_pocket",
          xpReward: Math.round(Number(d.durationSec || 180) / 3),
          intensity: d.intensity || intensity,
        };
      });

      const newRoutine: WorkoutRoutine = {
        id: `ai-routine-${Date.now()}`,
        title: routineRaw.title || "AI Custom Practice Routine",
        description: routineRaw.description || "Custom AI-engineered basketball practice routine.",
        level: skillLevel,
        totalDurationMin: timeMinutes,
        totalXp: routineRaw.totalXp || Math.max(200, mappedDrills.reduce((a, b) => a + b.xpReward, 0)),
        category: "all_around",
        drills: mappedDrills,
        isCurated: false,
        isAiGenerated: true,
        tags: ["AI Generated", `${timeMinutes}m Workout`, `${skillLevel} Level`],
        targetSkill: primaryGoal,
      };

      setGeneratedRoutine(newRoutine);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Could not generate routine. Please verify network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-routine-generator-view" className="flex flex-col gap-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Powered by Gemini AI
          </span>
          <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight text-white">AI Workout Plan Generator</h2>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col gap-5 shadow-xl">
        {/* Goal Preset Selectors */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
            1. Select Your Primary Target Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {goalPresets.map((gp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrimaryGoal(gp.title)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  primaryGoal === gp.title
                    ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                    : "bg-black/60 border-white/5 text-white/50 hover:text-white hover:border-white/15"
                }`}
              >
                <div className="text-lg mb-1">{gp.icon}</div>
                <div className="text-xs font-black uppercase italic text-white">{gp.title}</div>
                <div className="text-[10px] text-white/40 font-medium line-clamp-1 mt-0.5">{gp.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level & Time Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
              2. Skill Level
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/5">
              {(["beginner", "intermediate", "advanced"] as SkillLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSkillLevel(lvl)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    skillLevel === lvl
                      ? "bg-[#FF6B00] text-black shadow-sm"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
              3. Time Available
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/5">
              {[10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTimeMinutes(mins)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    timeMinutes === mins
                      ? "bg-[#FF6B00] text-black shadow-sm"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment & Hoop Access */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
              4. Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-[#FF6B00]"
            >
              <option value="1 Basketball">1 Basketball</option>
              <option value="2 Basketballs">2 Basketballs (Bilateral)</option>
              <option value="1 Basketball & Cones">1 Basketball & Cones</option>
              <option value="Wall / Rebounder">Wall / Rebounder</option>
              <option value="No Equipment (Footwork/Plyo)">No Equipment (Footwork only)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
              5. Hoop Access
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasHoop(true)}
                className={`py-3 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition ${
                  hasHoop
                    ? "bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00]"
                    : "bg-black/60 border-white/5 text-white/40"
                }`}
              >
                🏀 Hoop Available
              </button>
              <button
                type="button"
                onClick={() => setHasHoop(false)}
                className={`py-3 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition ${
                  !hasHoop
                    ? "bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00]"
                    : "bg-black/60 border-white/5 text-white/40"
                }`}
              >
                🚫 No Hoop (Ground)
              </button>
            </div>
          </div>
        </div>

        {/* Custom Prompt Notes */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">
            6. Custom Focus Notes (Optional)
          </label>
          <input
            type="text"
            value={specificNotes}
            onChange={(e) => setSpecificNotes(e.target.value)}
            placeholder="e.g. Focus on off-hand left side dribbling, preparing for high school tryouts..."
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B00] font-medium"
          />
        </div>

        {/* Generate Button */}
        <button
          id="generate-ai-routine-btn"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,107,0,0.3)] transition transform active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Coach AI is designing your workout...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Custom Workout Plan</span>
            </>
          )}
        </button>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* GENERATED ROUTINE PREVIEW CARD */}
      {generatedRoutine && (
        <div id="ai-generated-routine-card" className="p-6 rounded-3xl bg-[#0D0D0D] border border-[#FF6B00]/40 shadow-2xl flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FF6B00] text-black">
                  AI Plan Ready
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">
                  +{generatedRoutine.totalXp} XP
                </span>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white mt-2">{generatedRoutine.title}</h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed font-medium">
                {generatedRoutine.description}
              </p>
            </div>
          </div>

          {/* Drills List Preview */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Drill Sequence ({generatedRoutine.drills.length} Drills)
            </span>
            {generatedRoutine.drills.map((drill, idx) => (
              <div
                key={drill.id}
                className="p-3.5 rounded-2xl bg-black border border-white/5 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{drill.title}</h4>
                    <span className="text-[10px] text-white/40 font-mono">
                      {Math.round(drill.durationSec / 60)}m
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">{drill.repsOrSets}</div>
                  <div className="text-[10px] text-[#FF6B00]/90 italic mt-1 font-medium">
                    "{drill.coachingCues[0]}"
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              id="save-ai-routine-btn"
              onClick={() => onSaveRoutine(generatedRoutine)}
              className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Save to Dashboard</span>
            </button>

            <button
              id="start-ai-routine-btn"
              onClick={() => onStartRoutine(generatedRoutine)}
              className="flex-1 py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.3)] transition"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Start Practice Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
