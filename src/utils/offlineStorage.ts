import { UserProfile, WorkoutRoutine, MilestoneBadge, CompletedWorkoutRecord } from "../types";
import { INITIAL_MILESTONES } from "../data/drillsData";
import { getRankByXp, generateFriendCode, computeInitials } from "./ranks";

const STORAGE_KEYS = {
  USER_PROFILE: "hoopmaster_user_profile_v2",
  THEME_MODE: "hoopmaster_theme_mode_v2",
  CUSTOM_ROUTINES: "hoopmaster_custom_routines_v2",
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: "Kobe",
  lastName: "Bryant",
  name: "Kobe Bryant",
  username: "mamba_kb8",
  nameLocked: false,
  email: "",
  initials: "KB",
  friendCode: "HM-KB24",
  isPrivateWorkouts: false,
  friends: [],
  rankTitle: "Bronze Tier I",
  rankLevel: 1,
  totalXp: 280,
  currentStreakDays: 1,
  lastWorkoutDate: new Date().toISOString(),
  completedRoutinesCount: 1,
  completedDrillsCount: 3,
  totalTrainingMinutes: 18,
  skillBreakdown: {
    ball_handling: 45,
    shooting: 35,
    passing: 20,
    finishing_footwork: 30,
    plyometrics_conditioning: 25,
    defense_iq: 20,
  },
  favoriteDrillIds: ["bh-pound-pocket", "sh-form-sweetspot", "fn-mikan-drill"],
  favoriteRoutineIds: ["routine-kyrie-handles"],
  customRoutines: [],
  milestones: INITIAL_MILESTONES,
  history: [
    {
      id: "hist-starter-1",
      routineId: "routine-kyrie-handles",
      routineTitle: "Kyrie Shift & Pocket Deceleration",
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      durationMinutes: 15,
      xpGained: 280,
      drillsCount: 3,
      drillsCompleted: ["bh-pound-pocket", "bh-two-ball-alternate", "bh-in-out-crossover"],
      userInitials: "KB",
      userName: "Kobe Bryant",
    },
  ],
  activeWorkoutRoutineId: "routine-kyrie-handles",
  onboardingCompleted: false,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    const { currentRank } = getRankByXp(parsed.totalXp || 0);
    const initials = computeInitials(parsed.firstName, parsed.lastName, parsed.name);
    return {
      ...DEFAULT_USER_PROFILE,
      ...parsed,
      initials,
      rankTitle: currentRank.title,
      rankLevel: currentRank.level,
    };
  } catch (e) {
    console.error("Error loading user profile:", e);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const { currentRank } = getRankByXp(profile.totalXp || 0);
    const initials = computeInitials(profile.firstName, profile.lastName, profile.name);
    const updated = {
      ...profile,
      initials,
      rankTitle: currentRank.title,
      rankLevel: currentRank.level,
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving user profile:", e);
  }
}

export function loadThemeMode(): "dark" | "light" {
  return "dark";
}

export function saveThemeMode(mode: "dark" | "light"): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  } catch (e) {
    console.error("Error saving theme:", e);
  }
}
