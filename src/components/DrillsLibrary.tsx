import React, { useState } from "react";
import { Drill, SkillCategory, SkillLevel, WorkoutRoutine, UserProfile } from "../types";
import { ALL_DRILLS } from "../data/drillsData";
import { DrillVisualizer } from "./DrillVisualizer";
import {
  Search,
  Plus,
  Check,
  Heart,
  Play,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Footprints,
  AlertTriangle,
  Flame,
  Shield,
  Target,
  Zap,
} from "lucide-react";

interface DrillsLibraryProps {
  userProfile: UserProfile;
  onToggleFavoriteDrill: (drillId: string) => void;
  onStartCustomRoutine: (routine: WorkoutRoutine) => void;
  onSaveCustomRoutine: (routine: WorkoutRoutine) => void;
}

export const DrillsLibrary: React.FC<DrillsLibraryProps> = ({
  userProfile,
  onToggleFavoriteDrill,
  onStartCustomRoutine,
  onSaveCustomRoutine,
}) => {
  // Skill category pages
  const [activeSkillCategory, setActiveSkillCategory] = useState<SkillCategory>("ball_handling");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewDrill, setPreviewDrill] = useState<Drill | null>(null);

  // Routine Builder State
  const [builderDrills, setBuilderDrills] = useState<Drill[]>([]);
  const [customTitle, setCustomTitle] = useState<string>("My Custom Basketball Routine");
  const [showBuilderDrawer, setShowBuilderDrawer] = useState<boolean>(false);

  const skillPages: {
    id: SkillCategory;
    title: string;
    icon: string;
    subtitle: string;
    accentColor: string;
  }[] = [
    {
      id: "ball_handling",
      title: "Ball Handling",
      icon: "⚡",
      subtitle: "Pocket control, crossovers, and shifty rhythm deception",
      accentColor: "#FF6B00",
    },
    {
      id: "shooting",
      title: "Shooting",
      icon: "🎯",
      subtitle: "Catch & shoot, off-ball relocation, and pull-up jumpers",
      accentColor: "#eab308",
    },
    {
      id: "finishing_footwork",
      title: "Finishing & Footwork",
      icon: "🌪️",
      subtitle: "Mikan touch, Euro steps, floaters, and rim avoidance",
      accentColor: "#38bdf8",
    },
    {
      id: "passing",
      title: "Passing & IQ",
      icon: "👁️",
      subtitle: "Skip passes, pocket deliveries, and court vision",
      accentColor: "#a855f7",
    },
    {
      id: "plyometrics_conditioning",
      title: "Plyometrics & Speed",
      icon: "🔥",
      subtitle: "Vertical depth drops, suicides, and elastic stamina",
      accentColor: "#f43f5e",
    },
    {
      id: "defense_iq",
      title: "Defense & IQ",
      icon: "🛡️",
      subtitle: "Lateral slides, choppy closeouts, and on-ball containment",
      accentColor: "#10b981",
    },
  ];

  const currentSkillInfo = skillPages.find((p) => p.id === activeSkillCategory) || skillPages[0];

  const levels: { id: string; label: string }[] = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "elite", label: "Elite" },
  ];

  const filteredDrills = ALL_DRILLS.filter((drill) => {
    if (drill.category !== activeSkillCategory) return false;
    if (selectedLevel !== "all" && drill.level !== selectedLevel) return false;
    if (
      searchQuery &&
      !drill.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !drill.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !drill.keyFocus.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const isDrillInBuilder = (drillId: string) => builderDrills.some((d) => d.id === drillId);

  const toggleAddDrillToBuilder = (drill: Drill) => {
    if (isDrillInBuilder(drill.id)) {
      setBuilderDrills(builderDrills.filter((d) => d.id !== drill.id));
    } else {
      setBuilderDrills([...builderDrills, drill]);
      setShowBuilderDrawer(true);
    }
  };

  const removeDrillFromBuilder = (drillId: string) => {
    setBuilderDrills(builderDrills.filter((d) => d.id !== drillId));
  };

  const totalBuilderDurationMin = Math.round(
    builderDrills.reduce((acc, d) => acc + d.durationSec, 0) / 60
  );
  const totalBuilderXp = builderDrills.reduce((acc, d) => acc + d.xpReward, 0);

  const handleCreateAndStart = () => {
    if (builderDrills.length === 0) return;
    const newRoutine: WorkoutRoutine = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || "Custom Skill Workout",
      description: `Custom ${builderDrills.length}-drill training set created in Hoop Master.`,
      level: "intermediate",
      totalDurationMin: Math.max(1, totalBuilderDurationMin),
      totalXp: totalBuilderXp,
      category: activeSkillCategory,
      drills: builderDrills,
      isCurated: false,
      tags: ["Custom", `${builderDrills.length} Drills`],
      targetSkill: currentSkillInfo.title,
    };
    onSaveCustomRoutine(newRoutine);
    onStartCustomRoutine(newRoutine);
  };

  return (
    <div id="drills-library-container" className="space-y-4 sm:space-y-6 pb-20 animate-fadeIn">
      {/* Skill Navigation Header Tabs (Dedicated Page per Skill) */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Skill Disciplines
            </h1>
            <p className="text-xs text-neutral-400">
              Select a dedicated discipline to practice with step-by-step breakdowns
            </p>
          </div>
          {builderDrills.length > 0 && (
            <button
              onClick={() => setShowBuilderDrawer(true)}
              className="px-3 py-1.5 rounded-lg bg-[#FF6B00] text-black font-bold text-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Routine ({builderDrills.length})</span>
            </button>
          )}
        </div>

        {/* Skill Category Pill Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {skillPages.map((page) => {
            const isActive = activeSkillCategory === page.id;
            return (
              <button
                key={page.id}
                id={`skill-nav-btn-${page.id}`}
                onClick={() => {
                  setActiveSkillCategory(page.id);
                  setSearchQuery("");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-[#FF6B00]/15 border-[#FF6B00] shadow-sm"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-neutral-400"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{page.icon}</span>
                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-white" : "text-neutral-300"
                    }`}
                  >
                    {page.title}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  {ALL_DRILLS.filter((d) => d.category === page.id).length} Drills
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Skill Page Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181614] to-[#121212] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-lg">
            {currentSkillInfo.icon}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {currentSkillInfo.title} Mastery
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              {currentSkillInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Level Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative min-w-[160px] sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search drills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6B00]"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`text-[10px] font-semibold px-2 py-1 rounded ${
                  selectedLevel === lvl.id
                    ? "bg-[#FF6B00] text-black"
                    : "text-neutral-400 hover:text-white"
                } transition-colors`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredDrills.map((drill) => {
          const isFavorite = userProfile.favoriteDrillIds?.includes(drill.id);
          const inBuilder = isDrillInBuilder(drill.id);

          return (
            <div
              key={drill.id}
              id={`drill-card-${drill.id}`}
              className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all shadow-md group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/20">
                      {drill.level}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-[#FF6B00] transition-colors line-clamp-1">
                      {drill.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onToggleFavoriteDrill(drill.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isFavorite
                        ? "bg-red-500/20 text-red-500 border-red-500/30"
                        : "bg-white/5 text-neutral-500 border-white/5 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-3">
                  {drill.description}
                </p>

                {/* Key focus tag */}
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-neutral-300 mb-3">
                  <span className="font-semibold text-neutral-400">Focus: </span>
                  {drill.keyFocus}
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-3 border-b border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {Math.round(drill.durationSec / 60)} mins ({drill.repsOrSets})
                  </span>
                  <span className="text-[#FF6B00] font-bold font-mono">
                    +{drill.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
                <button
                  id={`open-visualizer-btn-${drill.id}`}
                  onClick={() => setPreviewDrill(drill)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current text-[#FF6B00]" />
                  <span>Visualizer & Steps</span>
                </button>

                <button
                  onClick={() => toggleAddDrillToBuilder(drill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    inBuilder
                      ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 hover:bg-[#FF6B00]/25"
                  }`}
                >
                  {inBuilder ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrills.length === 0 && (
        <div className="p-8 text-center bg-[#121212] rounded-2xl border border-white/10">
          <p className="text-sm text-neutral-400">No drills found matching your filters.</p>
        </div>
      )}

      {/* Drill Visualizer & In-Depth Details Modal */}
      {previewDrill && (
        <div
          id="drill-preview-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewDrill(null)}
        >
          <div
            className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentSkillInfo.icon}</span>
                <span className="font-bold text-sm text-white">{previewDrill.title}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FF6B00]/20 text-[#FF6B00] capitalize">
                  {previewDrill.level}
                </span>
              </div>
              <button
                onClick={() => setPreviewDrill(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Visualizer & Detailed Guide */}
            <div className="p-4 overflow-y-auto space-y-4">
              <DrillVisualizer drill={previewDrill} autoPlay={true} showExplanation={true} />

              <div className="p-3.5 rounded-xl bg-[#181818] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span><strong>Equipment:</strong> {previewDrill.equipmentNeeded}</span>
                  <span className="text-[#FF6B00] font-mono font-bold">+{previewDrill.xpReward} XP</span>
                </div>
                <div>
                  <strong className="text-white">Coaching Cues:</strong>
                  <ul className="mt-1 space-y-1 text-neutral-300 list-disc list-inside">
                    {previewDrill.coachingCues.map((cue, i) => (
                      <li key={i}>{cue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-white/10 bg-[#151515] flex justify-between items-center">
              <button
                onClick={() => toggleAddDrillToBuilder(previewDrill)}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white"
              >
                {isDrillInBuilder(previewDrill.id) ? "Remove from Plan" : "+ Add to Workout Plan"}
              </button>
              <button
                onClick={() => {
                  const singleRoutine: WorkoutRoutine = {
                    id: `solo-${previewDrill.id}`,
                    title: previewDrill.title,
                    description: previewDrill.description,
                    level: previewDrill.level,
                    totalDurationMin: Math.round(previewDrill.durationSec / 60),
                    totalXp: previewDrill.xpReward,
                    category: previewDrill.category,
                    drills: [previewDrill],
                    isCurated: false,
                    tags: ["Single Drill Practice"],
                    targetSkill: currentSkillInfo.title,
                  };
                  setPreviewDrill(null);
                  onStartCustomRoutine(singleRoutine);
                }}
                className="px-4 py-1.5 bg-[#FF6B00] text-black font-bold rounded-lg text-xs flex items-center gap-1.5 hover:bg-orange-500"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Practice Drill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routine Builder Drawer / Modal */}
      {showBuilderDrawer && (
        <div
          id="routine-builder-drawer"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowBuilderDrawer(false)}
        >
          <div
            className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="text-sm font-bold text-white">Custom Practice Routine</h3>
              </div>
              <button
                onClick={() => setShowBuilderDrawer(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Give your routine a title..."
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6B00]"
              />

              <div className="flex items-center justify-between text-xs text-neutral-400 p-2.5 rounded-xl bg-white/[0.02]">
                <span>{builderDrills.length} Drills Selected</span>
                <span>~{totalBuilderDurationMin} Mins</span>
                <span className="text-[#FF6B00] font-bold">+{totalBuilderXp} XP</span>
              </div>

              {/* Selected drills list */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {builderDrills.map((drill, index) => (
                  <div
                    key={drill.id}
                    className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-neutral-500 font-mono">#{index + 1}</span>
                      <span className="text-white truncate">{drill.title}</span>
                    </div>
                    <button
                      onClick={() => removeDrillFromBuilder(drill.id)}
                      className="p-1 text-neutral-500 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 border-t border-white/10 bg-[#151515] flex justify-end gap-2">
              <button
                onClick={() => setShowBuilderDrawer(false)}
                className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
              >
                Keep Browsing
              </button>
              <button
                onClick={handleCreateAndStart}
                disabled={builderDrills.length === 0}
                className="px-4 py-1.5 bg-[#FF6B00] text-black font-bold text-xs rounded-lg hover:bg-orange-500 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>Launch Practice ({builderDrills.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
