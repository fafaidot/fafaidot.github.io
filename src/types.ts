export type SkillCategory =
  | "ball_handling"
  | "shooting"
  | "passing"
  | "finishing_footwork"
  | "plyometrics_conditioning"
  | "defense_iq";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "elite";

export type IntensityLevel = "Low" | "Medium" | "High" | "Pro";

export type DrillAnimationType =
  | "pound_pocket"
  | "two_ball_alternate"
  | "in_and_out_crossover"
  | "figure_eight"
  | "spider_dribble"
  | "kyrie_hesitation"
  | "behind_back_wrap"
  | "shamgod_crossover"
  | "form_shooting_sweetspot"
  | "catch_and_shoot"
  | "five_spot_threes"
  | "one_dribble_pullup"
  | "step_back_jumper"
  | "free_throw_pressure"
  | "curry_relocation_three"
  | "kobe_fadeaway_post"
  | "chest_bounce_pass"
  | "pocket_pass"
  | "jokic_overhead_pass"
  | "mikan_drill"
  | "euro_step"
  | "floater_runner"
  | "drop_step"
  | "reverse_layup_spin"
  | "suicide_sprints"
  | "box_jumps"
  | "lateral_slide_contest"
  | "skater_hops"
  | "wall_sit_react"
  | "closeout_choppy_feet"
  | "vertical_depth_drop";

export interface DrillStep {
  stepNumber: number;
  label: string;
  instruction: string;
  xPercent: number; // 0-100 on court
  yPercent: number; // 0-100 on court
}

export interface DirectionalVector {
  fromXPercent: number;
  fromYPercent: number;
  toXPercent: number;
  toYPercent: number;
  label?: string;
  type: "dribble" | "shot" | "pass" | "slide" | "sprint" | "cut";
}

export interface Drill {
  id: string;
  title: string;
  category: SkillCategory;
  level: SkillLevel;
  durationSec: number;
  repsOrSets: string;
  description: string;
  coachingCues: string[];
  equipmentNeeded: string;
  keyFocus: string;
  animationType: DrillAnimationType;
  xpReward: number;
  intensity: IntensityLevel;
  isFavorite?: boolean;
  // In-depth explanation breakdown
  stepByStep: string[];
  footworkGuide: string;
  proSecret: string;
  mistakesToAvoid: string[];
  courtSteps?: DrillStep[];
  directionalVectors?: DirectionalVector[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  level: SkillLevel;
  totalDurationMin: number;
  totalXp: number;
  category: SkillCategory | "all_around";
  drills: Drill[];
  isCurated: boolean;
  isAiGenerated?: boolean;
  isFavorite?: boolean;
  tags: string[];
  targetSkill: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: "streak" | "xp" | "drills" | "mastery" | "social";
  requirementText: string;
}

export interface CompletedWorkoutRecord {
  id: string;
  routineId: string;
  routineTitle: string;
  completedAt: string;
  durationMinutes: number;
  xpGained: number;
  drillsCount: number;
  drillsCompleted: string[];
  userInitials?: string;
  userName?: string;
}

export interface SkillBreakdown {
  ball_handling: number; // 0 - 100%
  shooting: number;
  passing: number;
  finishing_footwork: number;
  plyometrics_conditioning: number;
  defense_iq: number;
}

export interface FriendWorkout {
  id: string;
  friendName: string;
  friendInitials: string;
  friendUsername: string;
  friendRank: string;
  routineTitle: string;
  completedAt: string;
  durationMinutes: number;
  xpGained: number;
  drillsCount: number;
}

export interface UserProfile {
  uid?: string; // Firebase Auth UID
  firstName: string;
  lastName: string;
  name: string; // Full Name
  username: string; // Unique @username
  nameLocked: boolean; // Locked once created
  email: string;
  initials: string; // e.g. "KB"
  friendCode: string; // Unique friend code e.g. "HM-8492"
  isPrivateWorkouts: boolean; // Privacy setting: private vs visible to friends
  friends: string[]; // List of friend codes or friend usernames
  rankTitle: string;
  rankLevel: number;
  totalXp: number;
  currentStreakDays: number;
  lastWorkoutDate: string;
  completedRoutinesCount: number;
  completedDrillsCount: number;
  totalTrainingMinutes: number;
  skillBreakdown: SkillBreakdown;
  favoriteDrillIds: string[];
  favoriteRoutineIds: string[];
  customRoutines: WorkoutRoutine[];
  milestones: MilestoneBadge[];
  history: CompletedWorkoutRecord[];
  activeWorkoutRoutineId?: string;
  onboardingCompleted: boolean;
}

export interface OnboardingAnswers {
  experienceLevel: SkillLevel;
  primaryGoal: string;
  weeklyDays: number;
  equipment: string;
  hasHoop: boolean;
  workoutDurationPref?: number;
}

export interface RankInfo {
  id: string;
  title: string;
  level: number;
  minXp: number;
  maxXp: number;
  color: string;
  badgeBg: string;
  perks: string[];
  description: string;
}
