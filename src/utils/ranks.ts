import { RankInfo } from "../types";

export const ALL_RANKS: RankInfo[] = [
  {
    id: "bronze",
    title: "Bronze",
    level: 1,
    minXp: 0,
    maxXp: 499,
    color: "#cd7f32",
    badgeBg: "bg-amber-900/20 text-amber-500 border-amber-600/30",
    description: "Beginner basketball foundational rank. Building hand-eye coordination and motor habits.",
    perks: [
      "Access to all fundamental drills",
      "Interactive 60FPS Court Visualizer",
      "Local practice tracking",
    ],
  },
  {
    id: "silver",
    title: "Silver",
    level: 2,
    minXp: 500,
    maxXp: 1199,
    color: "#94a3b8",
    badgeBg: "bg-slate-800/40 text-slate-300 border-slate-500/30",
    description: "Developing consistent mechanical rhythm and ball control fluidity.",
    perks: [
      "Unlock intermediate signature combos",
      "Connect with friends via Friend Code",
      "Personalized training milestones",
    ],
  },
  {
    id: "gold",
    title: "Gold",
    level: 3,
    minXp: 1200,
    maxXp: 2499,
    color: "#eab308",
    badgeBg: "bg-yellow-950/30 text-yellow-400 border-yellow-500/30",
    description: "High court awareness, repeatable shooting form, and dynamic multi-direction agility.",
    perks: [
      "AI Workout Generator access",
      "Advanced footwork breakdowns",
      "Gold profile badge in friend feed",
    ],
  },
  {
    id: "platinum",
    title: "Platinum",
    level: 4,
    minXp: 2500,
    maxXp: 4499,
    color: "#38bdf8",
    badgeBg: "bg-cyan-950/30 text-cyan-400 border-cyan-500/30",
    description: "Dominant all-around player with elite motor control and high-pressure finishing.",
    perks: [
      "Curated pro masterclasses",
      "In-depth tactical drill breakdowns",
      "Special Platinum court visualizer effects",
    ],
  },
  {
    id: "diamond",
    title: "Diamond",
    level: 5,
    minXp: 4500,
    maxXp: 7499,
    color: "#a855f7",
    badgeBg: "bg-purple-950/30 text-purple-400 border-purple-500/30",
    description: "Unshakable handles, laser perimeter shooting, and lock-down on-ball defense.",
    perks: [
      "Pro level intensity workouts",
      "Exclusive NBA trainer cues",
      "Diamond status badge",
    ],
  },
  {
    id: "master",
    title: "Master",
    level: 6,
    minXp: 7500,
    maxXp: 11999,
    color: "#f43f5e",
    badgeBg: "bg-rose-950/30 text-rose-400 border-rose-500/30",
    description: "Mastery across all 6 core basketball disciplines with supreme muscle memory.",
    perks: [
      "Master tier analytics and breakdown",
      "Speed customization up to 2.0x",
      "Master court badge",
    ],
  },
  {
    id: "grandmaster",
    title: "Grandmaster",
    level: 7,
    minXp: 12000,
    maxXp: 17999,
    color: "#f97316",
    badgeBg: "bg-orange-950/30 text-orange-400 border-orange-500/30",
    description: "Elite tier hooper. Razor-sharp execution and supreme practice dedication.",
    perks: [
      "Grandmaster profile border",
      "Custom routine creator tools",
      "Priority AI workout plans",
    ],
  },
  {
    id: "legend",
    title: "Legend",
    level: 8,
    minXp: 18000,
    maxXp: 24999,
    color: "#10b981",
    badgeBg: "bg-emerald-950/30 text-emerald-400 border-emerald-500/30",
    description: "Legendary gym presence with hundreds of hours of dedicated court practice.",
    perks: [
      "Legend badge and court emblem",
      "Full access to all future signature drills",
      "Exclusive coach notes",
    ],
  },
  {
    id: "hall_of_fame",
    title: "Hall of Fame",
    level: 9,
    minXp: 25000,
    maxXp: 999999,
    color: "#FF6B00",
    badgeBg: "bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/40",
    description: "The pinnacle of basketball dedication. Immortalized among the greatest.",
    perks: [
      "Golden Hall of Fame crown",
      "Ultimate court prestige",
      "Infinite practice tracking",
    ],
  },
];

export function getRankByXp(xp: number): {
  currentRank: RankInfo;
  nextRank: RankInfo | null;
  progressPercent: number;
  xpInCurrentTier: number;
  xpNeededForNextTier: number;
  xpToNextRank: number;
} {
  const current =
    ALL_RANKS.slice()
      .reverse()
      .find((r) => xp >= r.minXp) || ALL_RANKS[0];

  const currentIndex = ALL_RANKS.findIndex((r) => r.id === current.id);
  const nextRank = currentIndex < ALL_RANKS.length - 1 ? ALL_RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return {
      currentRank: current,
      nextRank: null,
      progressPercent: 100,
      xpInCurrentTier: xp - current.minXp,
      xpNeededForNextTier: 0,
      xpToNextRank: 0,
    };
  }

  const range = nextRank.minXp - current.minXp;
  const currentProgress = xp - current.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  const xpToNextRank = Math.max(0, nextRank.minXp - xp);

  return {
    currentRank: current,
    nextRank,
    progressPercent,
    xpInCurrentTier: currentProgress,
    xpNeededForNextTier: range,
    xpToNextRank,
  };
}

export function computeInitials(firstName: string, lastName: string, fallbackName = "Player"): string {
  const first = (firstName || "").trim().charAt(0).toUpperCase();
  const last = (lastName || "").trim().charAt(0).toUpperCase();
  if (first && last) return `${first}${last}`;
  if (first) return first;
  const parts = fallbackName.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0].charAt(0).toUpperCase()}${parts[parts.length - 1].charAt(0).toUpperCase()}`;
  }
  return fallbackName.slice(0, 2).toUpperCase() || "HM";
}

export function generateFriendCode(username?: string): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  if (username) {
    const clean = username.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
    return `HM-${clean || "PRO"}${randomStr.slice(0, 2)}`;
  }
  return `HM-${randomStr}`;
}
