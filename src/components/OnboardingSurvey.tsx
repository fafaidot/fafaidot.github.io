import React, { useState } from "react";
import { SkillLevel, OnboardingAnswers, WorkoutRoutine } from "../types";
import { CURATED_ROUTINES } from "../data/drillsData";
import { ArrowRight, ArrowLeft, Check, Sparkles, X, Trophy, Flame } from "lucide-react";

interface OnboardingSurveyProps {
  onCompleteSurvey: (answers: OnboardingAnswers, recommendedRoutine: WorkoutRoutine) => void;
  onSkipSurvey: () => void;
}

export const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({
  onCompleteSurvey,
  onSkipSurvey,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [experienceLevel, setExperienceLevel] = useState<SkillLevel>("beginner");
  const [primaryGoal, setPrimaryGoal] = useState<string>("ball_handling");
  const [hasHoop, setHasHoop] = useState<boolean>(true);
  const [equipment, setEquipment] = useState<string>("1 Basketball");
  const [workoutDurationPref, setWorkoutDurationPref] = useState<number>(15);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    const answers: OnboardingAnswers = {
      experienceLevel,
      primaryGoal,
      weeklyDays: 4,
      equipment,
      hasHoop,
      workoutDurationPref,
    };

    // Pick best match curated starter routine
    let matchedRoutine = CURATED_ROUTINES[0];
    if (primaryGoal === "ball_handling") {
      matchedRoutine = CURATED_ROUTINES.find((r) => r.id === "routine-kyrie-handles") || CURATED_ROUTINES[0];
    } else if (primaryGoal === "shooting") {
      matchedRoutine = CURATED_ROUTINES.find((r) => r.id === "routine-sniper-shooting") || CURATED_ROUTINES[0];
    } else if (primaryGoal === "plyo_speed") {
      matchedRoutine = CURATED_ROUTINES.find((r) => r.id === "routine-explosive-vertical") || CURATED_ROUTINES[0];
    }

    onCompleteSurvey(answers, matchedRoutine);
  };

  return (
    <div id="onboarding-survey-container" className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F5F5F5] flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FF6B00] text-black font-black text-xs flex items-center justify-center shadow-md">
            {step}
          </span>
          <span className="text-xs font-semibold text-neutral-400">Step {step} of {totalSteps}</span>
        </div>

        <button
          id="skip-onboarding-survey-btn"
          onClick={onSkipSurvey}
          className="text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
        >
          Skip Survey
        </button>
      </div>

      {/* Progress Line */}
      <div className="max-w-md w-full mx-auto my-3 bg-black h-1.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="bg-[#FF6B00] h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Question Card Container */}
      <div className="max-w-md w-full mx-auto my-auto py-2">
        {/* STEP 1: Basketball Experience */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                Hoop Master Assessment
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">What is your current basketball skill level?</h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                We will calibrate routine pacing, drill intensity, and XP milestones to your baseline.
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: "beginner",
                  title: "Beginner (Bronze Tier)",
                  desc: "New to organized basketball or establishing fundamental ball control and shooting form.",
                  icon: "🌱",
                },
                {
                  id: "intermediate",
                  title: "Intermediate (Silver / Gold)",
                  desc: "Comfortable dribbling and shooting. Looking to add shiftiness, footwork, and range.",
                  icon: "⚡",
                },
                {
                  id: "advanced",
                  title: "Advanced (Platinum / Diamond)",
                  desc: "Competitive court player seeking elite separation, rapid decision-making, and conditioning.",
                  icon: "🔥",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`select-experience-${opt.id}`}
                  onClick={() => setExperienceLevel(opt.id as SkillLevel)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    experienceLevel === opt.id
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-[#121212] border-white/5 text-neutral-300 hover:border-white/15"
                  }`}
                >
                  <span className="text-xl mt-0.5">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{opt.title}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                  {experienceLevel === opt.id && (
                    <div className="w-4 h-4 rounded-full bg-[#FF6B00] text-black flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Primary Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                Primary Goal
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">What skill discipline do you want to dominate?</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Your initial recommended workout routine will focus heavily on this category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: "ball_handling", title: "Ball Handling", desc: "Crossovers, hesitations & pocket dribbles", icon: "⚡" },
                { id: "shooting", title: "Pure Shooting", desc: "Catch & shoot, pull-ups & foot alignment", icon: "🎯" },
                { id: "finishing", title: "Rim Finishing", desc: "Mikan touch, floaters & Euro-steps", icon: "🌪️" },
                { id: "plyo_speed", title: "Plyometrics & Speed", desc: "Vertical hops & rapid lateral slides", icon: "🔥" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`select-goal-${opt.id}`}
                  onClick={() => setPrimaryGoal(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    primaryGoal === opt.id
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-[#121212] border-white/5 text-neutral-300 hover:border-white/15"
                  }`}
                >
                  <span className="text-xl mb-2">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{opt.title}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Gear & Hoop Access */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                Training Setup
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">Do you have access to a basketball hoop?</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Hoop Master offers both hoop drills and stationary driveway / ground training sets.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="survey-has-hoop-yes"
                  onClick={() => setHasHoop(true)}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                    hasHoop
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-[#121212] border-white/5 text-neutral-400 hover:border-white/15"
                  }`}
                >
                  <span className="text-2xl">🏀</span>
                  <span>Hoop Available</span>
                </button>

                <button
                  id="survey-has-hoop-no"
                  onClick={() => setHasHoop(false)}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                    !hasHoop
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-[#121212] border-white/5 text-neutral-400 hover:border-white/15"
                  }`}
                >
                  <span className="text-2xl">🚫</span>
                  <span>No Hoop (Ground Only)</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121212] border border-white/5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  What equipment do you have right now?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["1 Basketball", "2 Basketballs", "Cones / Markers"].map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => setEquipment(eq)}
                      className={`py-2 px-1.5 rounded-lg border text-[10px] font-bold text-center transition-colors ${
                        equipment === eq
                          ? "bg-[#FF6B00] text-black border-[#FF6B00]"
                          : "bg-black/60 border-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Session Duration & Rank Introduction */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                Session Target
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">How many minutes can you train per session?</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Gain XP for every drill, rise through 8 ranks from Bronze to Hall of Fame!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[10, 15, 20].map((duration) => (
                <button
                  key={duration}
                  id={`select-duration-${duration}`}
                  onClick={() => setWorkoutDurationPref(duration)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    workoutDurationPref === duration
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-[#121212] border-white/5 text-neutral-400 hover:border-white/15"
                  }`}
                >
                  <div className="text-xl font-bold text-[#FF6B00]">{duration}m</div>
                  <div className="text-[10px] font-semibold text-neutral-400 mt-0.5">Quick Session</div>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Starting Rank: Bronze Tier I
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Earn XP on every completed drill. Silver rank unlocks at 2,000 XP!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-md w-full mx-auto flex items-center gap-2.5 pt-3">
        {step > 1 && (
          <button
            id="onboarding-prev-step-btn"
            onClick={() => setStep(step - 1)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <button
          id="onboarding-next-step-btn"
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
        >
          <span>{step === totalSteps ? "Generate Recommended Plan" : "Continue"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
