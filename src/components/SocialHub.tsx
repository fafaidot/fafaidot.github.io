import React, { useState, useEffect } from "react";
import { UserProfile, FriendWorkout } from "../types";
import {
  Users,
  Copy,
  Check,
  UserPlus,
  Lock,
  Globe,
  Clock,
  Zap,
  Flame,
  Award,
  ShieldCheck,
  Sparkles,
  Search,
  UserCheck,
  AlertCircle,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { findUserByCodeOrUsername, saveUserProfileToCloud, auth } from "../utils/firebase";

interface SocialHubProps {
  userProfile: UserProfile;
  friendWorkouts: FriendWorkout[];
  onUpdateProfile: (updated: UserProfile) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({
  userProfile,
  friendWorkouts,
  onUpdateProfile,
}) => {
  const [friendInput, setFriendInput] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [verifiedFriend, setVerifiedFriend] = useState<UserProfile | null>(null);
  const [searchStatus, setSearchStatus] = useState<{
    type: "success" | "error" | "info";
    msg: string;
    playerDetails?: { name: string; username: string; rank: string; friendCode: string };
  } | null>(null);

  const handleCopyCode = () => {
    if (userProfile.friendCode) {
      navigator.clipboard.writeText(userProfile.friendCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = friendInput.trim().replace(/^@+/, "");
    if (!clean) return;

    // Disallow adding yourself
    const currentCode = (userProfile.friendCode || "").toUpperCase();
    const currentUsername = (userProfile.username || "").toLowerCase();
    const currentUid = auth.currentUser?.uid;

    if (
      clean.toUpperCase() === currentCode ||
      clean.toLowerCase() === currentUsername ||
      clean === currentUid
    ) {
      setSearchStatus({
        type: "error",
        msg: "You cannot add yourself as a friend.",
      });
      setVerifiedFriend(null);
      return;
    }

    setIsSearching(true);
    setSearchStatus(null);
    setVerifiedFriend(null);

    try {
      // 1. Strictly verify the player exists in Firestore database
      const found = await findUserByCodeOrUsername(clean);

      // If no real registered player exists in the database
      if (!found) {
        setSearchStatus({
          type: "error",
          msg: `Player not found. No registered account exists with the code or username "${clean}". Please verify with your teammate and make sure they have signed in to Hoop Master.`,
        });
        setIsSearching(false);
        return;
      }

      // Check if this is the user's own account by returned profile properties
      if (
        found.friendCode?.toUpperCase() === currentCode ||
        found.username?.toLowerCase() === currentUsername ||
        (found as any).uid === currentUid
      ) {
        setSearchStatus({
          type: "error",
          msg: "You cannot add yourself as a friend.",
        });
        setIsSearching(false);
        return;
      }

      // Check if already in squad
      const targetIdentifier = found.friendCode || found.username;
      const alreadyFriend = userProfile.friends?.some(
        (f) =>
          f.toUpperCase() === (found.friendCode || "").toUpperCase() ||
          f.toLowerCase() === (found.username || "").toLowerCase()
      );

      if (alreadyFriend) {
        setSearchStatus({
          type: "info",
          msg: `${found.name} (@${found.username || "player"}) is already in your squad!`,
          playerDetails: {
            name: found.name,
            username: found.username,
            rank: found.rankTitle || "Bronze",
            friendCode: found.friendCode || clean,
          },
        });
        setIsSearching(false);
        return;
      }

      // 2. Real verified player confirmed! Add their verified friendCode to squad
      const updatedFriends = [...(userProfile.friends || []), targetIdentifier];
      const updatedProfile: UserProfile = {
        ...userProfile,
        friends: updatedFriends,
      };

      onUpdateProfile(updatedProfile);
      if (auth.currentUser) {
        await saveUserProfileToCloud(auth.currentUser.uid, updatedProfile);
      }

      setVerifiedFriend(found);
      setSearchStatus({
        type: "success",
        msg: `Verified real player! ${found.name} was successfully added to your squad.`,
        playerDetails: {
          name: found.name,
          username: found.username,
          rank: found.rankTitle || "Bronze",
          friendCode: found.friendCode || clean,
        },
      });
      setFriendInput("");
    } catch (err) {
      console.error("Error verifying friend:", err);
      setSearchStatus({
        type: "error",
        msg: "Connection error while verifying player. Please check your network and try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveFriend = async (friendIdentifier: string) => {
    const updatedFriends = (userProfile.friends || []).filter(
      (f) => f.toUpperCase() !== friendIdentifier.toUpperCase()
    );
    const updatedProfile: UserProfile = {
      ...userProfile,
      friends: updatedFriends,
    };
    onUpdateProfile(updatedProfile);
    if (auth.currentUser) {
      await saveUserProfileToCloud(auth.currentUser.uid, updatedProfile);
    }
    if (searchStatus?.playerDetails?.friendCode === friendIdentifier) {
      setSearchStatus(null);
      setVerifiedFriend(null);
    }
  };

  const handleTogglePrivacy = async () => {
    const updated: UserProfile = {
      ...userProfile,
      isPrivateWorkouts: !userProfile.isPrivateWorkouts,
    };
    onUpdateProfile(updated);
    if (auth.currentUser) {
      await saveUserProfileToCloud(auth.currentUser.uid, updated);
    }
  };

  return (
    <div id="social-hub-container" className="space-y-4 sm:space-y-6 pb-20 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00]">
                <Users className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                Friends & Squad Feed
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Connect with verified players using their unique Friend Code and track each other&apos;s real workouts.
            </p>
          </div>

          {/* User's Friend Code Badge */}
          <div className="flex items-center gap-2.5 bg-black/60 border border-white/10 rounded-xl p-2.5 sm:px-3.5">
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                Your Friend Code
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-[#FF6B00] tracking-wider">
                {userProfile.friendCode || "HM-7X9K2"}
              </span>
            </div>
            <button
              id="copy-friend-code-btn"
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Copy Friend Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedCode ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Friend Form & Privacy Toggle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Add Friend Form (2 cols) */}
        <div className="md:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#FF6B00]" />
                Add Real Player by Code or Username
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Live Verification
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-3">
              Enter a teammate&apos;s Friend Code (e.g. HM-7X9K2) or @username. The system verifies their registered account in real time.
            </p>

            <form onSubmit={handleAddFriend} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Enter Friend Code (e.g., HM-4921) or @username..."
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !friendInput.trim()}
                className="px-4 py-2 bg-[#FF6B00] text-black font-bold text-xs rounded-xl hover:bg-orange-500 disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1.5"
              >
                {isSearching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Verify & Add</span>
                  </>
                )}
              </button>
            </form>

            {/* Verification Status Alert */}
            {searchStatus && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs border flex items-start gap-2.5 ${
                  searchStatus.type === "success"
                    ? "bg-emerald-950/30 text-emerald-300 border-emerald-500/30"
                    : searchStatus.type === "info"
                    ? "bg-cyan-950/30 text-cyan-300 border-cyan-500/30"
                    : "bg-red-950/30 text-red-300 border-red-500/30"
                }`}
              >
                {searchStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : searchStatus.type === "info" ? (
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-medium leading-relaxed">{searchStatus.msg}</p>
                  {searchStatus.playerDetails && (
                    <div className="pt-1.5 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-white">
                      <span className="font-bold">{searchStatus.playerDetails.name}</span>
                      <span className="text-neutral-400">@{searchStatus.playerDetails.username}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 text-[10px]">
                        {searchStatus.playerDetails.rank}
                      </span>
                      <span className="text-[#FF6B00] font-mono text-[10px]">
                        {searchStatus.playerDetails.friendCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>
              Connected Squad: <strong className="text-white">{userProfile.friends?.length || 0} Real Friends</strong>
            </span>
            <span className="text-neutral-500">Unverified codes are rejected</span>
          </div>
        </div>

        {/* Workout Privacy Settings Card (1 col) */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {userProfile.isPrivateWorkouts ? (
                <Lock className="w-4 h-4 text-amber-400" />
              ) : (
                <Globe className="w-4 h-4 text-emerald-400" />
              )}
              <h2 className="text-xs sm:text-sm font-bold text-white">
                Workout Privacy Setting
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {userProfile.isPrivateWorkouts
                ? "Your completed workouts are currently PRIVATE. Friends cannot see your activity logs."
                : "Your completed workouts are VISIBLE to your connected friends in the feed."}
            </p>
          </div>

          <button
            onClick={handleTogglePrivacy}
            className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
              userProfile.isPrivateWorkouts
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {userProfile.isPrivateWorkouts ? "Switch to Friends Visible" : "Make Workouts Private"}
          </button>
        </div>
      </div>

      {/* Connected Squad Members List */}
      {userProfile.friends && userProfile.friends.length > 0 && (
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF6B00]" />
              Your Squad ({userProfile.friends.length})
            </h2>
            <span className="text-[11px] text-neutral-400">Verified Connections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {userProfile.friends.map((code) => (
              <div
                key={code}
                className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-bold text-xs flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white truncate">{code}</div>
                    <div className="text-[9px] text-emerald-400 font-semibold uppercase">Verified Player</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFriend(code)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                  title="Remove from squad"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends' Recent Workouts Feed */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF6B00]" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Friends&apos; Recent Activity
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400">
            Real-time workout records
          </span>
        </div>

        {friendWorkouts.length > 0 ? (
          <div className="space-y-3">
            {friendWorkouts.map((fw) => (
              <div
                key={fw.id}
                className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* User & Routine Info */}
                <div className="flex items-center gap-3">
                  {/* Initials Badge */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 text-black font-black text-xs flex items-center justify-center border-2 border-white/10 shrink-0">
                    {fw.friendInitials || "HM"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {fw.friendName}
                      </span>
                      {fw.friendUsername && (
                        <span className="text-[11px] text-neutral-500 font-mono">
                          @{fw.friendUsername}
                        </span>
                      )}
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 font-semibold">
                        {fw.friendRank || "Bronze"}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-medium mt-0.5">
                      Completed <span className="text-[#FF6B00] font-semibold">{fw.routineTitle}</span>
                    </p>
                  </div>
                </div>

                {/* Workout Metrics */}
                <div className="flex items-center gap-3 text-xs text-neutral-400 pl-13 sm:pl-0">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {fw.durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1 text-[#FF6B00] font-mono font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    +{fw.xpGained} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-black/30 rounded-xl border border-white/5 space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/5 text-neutral-400 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-300">
              No friend workouts logged yet.
            </p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Share your Friend Code <strong className="text-white">{userProfile.friendCode}</strong> with teammates. When they finish practice sets, their real workouts will appear right here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

