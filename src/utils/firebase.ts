import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { UserProfile, CompletedWorkoutRecord, FriendWorkout } from "../types";
import { computeInitials, generateFriendCode, getRankByXp } from "./ranks";
import { INITIAL_MILESTONES } from "../data/drillsData";

export const firebaseConfig = {
  apiKey: "AIzaSyCzWacLFudielwvfzny-Y0Mzaz1Ol5_hU0",
  authDomain: "hoop-master-app.firebaseapp.com",
  projectId: "hoop-master-app",
  storageBucket: "hoop-master-app.firebasestorage.app",
  messagingSenderId: "326240583591",
  appId: "1:326240583591:web:b600dd26208f4e98700082",
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };

const googleProvider = new GoogleAuthProvider();

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please double check.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    default:
      return "Authentication error: " + (errorCode || "Please try again.");
  }
}

/**
 * Sign up user with Email, Password, First Name, Last Name, and Username
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  firstName: string,
  lastName: string,
  username: string
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  const cleanFirst = firstName.trim();
  const cleanLast = lastName.trim();
  const cleanUsername = username.trim().replace(/^@+/, "").toLowerCase();
  const fullName = `${cleanFirst} ${cleanLast}`.trim();
  const initials = computeInitials(cleanFirst, cleanLast, fullName);
  const friendCode = generateFriendCode(cleanUsername);

  // Create Firebase Auth user
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;

  await updateProfile(user, {
    displayName: fullName,
  });

  const rankData = getRankByXp(200);

  // Construct initial Firestore user profile
  const newProfile: UserProfile = {
    firstName: cleanFirst,
    lastName: cleanLast,
    name: fullName,
    username: cleanUsername,
    nameLocked: true, // Permanent lock once chosen
    email: user.email || email.trim(),
    initials,
    friendCode,
    isPrivateWorkouts: false,
    friends: [],
    rankTitle: rankData.currentRank.title,
    rankLevel: rankData.currentRank.level,
    totalXp: 200,
    currentStreakDays: 1,
    lastWorkoutDate: new Date().toISOString(),
    completedRoutinesCount: 0,
    completedDrillsCount: 0,
    totalTrainingMinutes: 0,
    skillBreakdown: {
      ball_handling: 25,
      shooting: 25,
      passing: 20,
      finishing_footwork: 20,
      plyometrics_conditioning: 20,
      defense_iq: 20,
    },
    favoriteDrillIds: ["bh-pound-pocket", "sh-form-sweetspot", "fn-mikan-drill"],
    favoriteRoutineIds: ["routine-rookie-kickstart"],
    customRoutines: [],
    milestones: INITIAL_MILESTONES,
    history: [],
    activeWorkoutRoutineId: "routine-rookie-kickstart",
    onboardingCompleted: false,
  };

  // Persist to Firestore
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      ...newProfile,
      uid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save to Firestore, continuing locally:", err);
  }

  return { user, profile: newProfile };
}

/**
 * Sign in existing user with Email & Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<{ user: FirebaseUser; isNewUser: boolean; profile?: UserProfile }> {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;

  // Check if profile exists in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    return { user, isNewUser: false, profile: snap.data() as UserProfile };
  } else {
    // User needs to provide First Name, Last Name, and Username
    return { user, isNewUser: true };
  }
}

/**
 * Complete Google Sign In Profile Onboarding
 */
export async function completeGoogleOnboarding(
  user: FirebaseUser,
  firstName: string,
  lastName: string,
  username: string
): Promise<UserProfile> {
  const cleanFirst = firstName.trim();
  const cleanLast = lastName.trim();
  const cleanUsername = username.trim().replace(/^@+/, "").toLowerCase();
  const fullName = `${cleanFirst} ${cleanLast}`.trim();
  const initials = computeInitials(cleanFirst, cleanLast, fullName);
  const friendCode = generateFriendCode(cleanUsername);

  const rankData = getRankByXp(200);

  const newProfile: UserProfile = {
    firstName: cleanFirst,
    lastName: cleanLast,
    name: fullName,
    username: cleanUsername,
    nameLocked: true,
    email: user.email || "",
    initials,
    friendCode,
    isPrivateWorkouts: false,
    friends: [],
    rankTitle: rankData.currentRank.title,
    rankLevel: rankData.currentRank.level,
    totalXp: 200,
    currentStreakDays: 1,
    lastWorkoutDate: new Date().toISOString(),
    completedRoutinesCount: 0,
    completedDrillsCount: 0,
    totalTrainingMinutes: 0,
    skillBreakdown: {
      ball_handling: 25,
      shooting: 25,
      passing: 20,
      finishing_footwork: 20,
      plyometrics_conditioning: 20,
      defense_iq: 20,
    },
    favoriteDrillIds: ["bh-pound-pocket", "sh-form-sweetspot", "fn-mikan-drill"],
    favoriteRoutineIds: ["routine-rookie-kickstart"],
    customRoutines: [],
    milestones: INITIAL_MILESTONES,
    history: [],
    activeWorkoutRoutineId: "routine-rookie-kickstart",
    onboardingCompleted: false,
  };

  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      ...newProfile,
      uid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save Google profile to Firestore:", err);
  }

  return newProfile;
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Fetch User Profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch user profile from Firestore:", err);
    return null;
  }
}

/**
 * Save / Update User Profile in Firestore
 */
export async function saveUserProfileToCloud(uid: string, profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      {
        ...profile,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Error updating user profile in Firestore:", err);
  }
}

/**
 * Real-time listener for User Profile
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile) => void
): () => void {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      }
    },
    (err) => {
      console.warn("Error in user profile subscription:", err);
    }
  );
}

/**
 * Save completed workout record to Firestore
 */
export async function logCompletedWorkoutToCloud(
  uid: string,
  recordOrTitle: CompletedWorkoutRecord | string,
  updatedProfileOrDuration?: UserProfile | number,
  optionalXp?: number
): Promise<void> {
  try {
    const workoutRef = collection(db, "users", uid, "workouts");
    const globalWorkoutRef = collection(db, "friend_workouts");

    if (typeof recordOrTitle === "string") {
      const workoutData = {
        routineTitle: recordOrTitle,
        durationMinutes: typeof updatedProfileOrDuration === "number" ? updatedProfileOrDuration : 15,
        xpGained: optionalXp || 100,
        completedAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
      };
      await addDoc(workoutRef, workoutData);
    } else {
      await addDoc(workoutRef, {
        ...recordOrTitle,
        timestamp: serverTimestamp(),
      });

      // If user profile allows sharing workouts, also post to friend feed
      if (updatedProfileOrDuration && typeof updatedProfileOrDuration === "object") {
        const profile = updatedProfileOrDuration as UserProfile;
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, {
          ...profile,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        if (!profile.isPrivateWorkouts) {
          await addDoc(globalWorkoutRef, {
            userId: uid,
            friendName: profile.name,
            friendInitials: profile.initials || computeInitials(profile.firstName, profile.lastName, profile.name),
            friendUsername: profile.username || "",
            friendRank: profile.rankTitle || "Bronze",
            friendCode: profile.friendCode || "",
            routineTitle: recordOrTitle.routineTitle,
            completedAt: recordOrTitle.completedAt,
            durationMinutes: recordOrTitle.durationMinutes,
            xpGained: recordOrTitle.xpGained,
            drillsCount: recordOrTitle.drillsCount,
            timestamp: serverTimestamp(),
          });
        }
      }
    }
  } catch (err) {
    console.warn("Failed to log workout to cloud:", err);
  }
}

/**
 * Subscribe to Friend Workouts from Firestore
 */
export function subscribeToFriendWorkouts(
  friendCodesOrOnUpdate: string[] | ((workouts: FriendWorkout[]) => void),
  maybeOnUpdate?: (workouts: FriendWorkout[]) => void
): () => void {
  const onUpdate = typeof friendCodesOrOnUpdate === "function" ? friendCodesOrOnUpdate : maybeOnUpdate;
  if (!onUpdate) return () => {};

  try {
    const workoutsRef = collection(db, "friend_workouts");
    const q = query(workoutsRef, orderBy("timestamp", "desc"), limit(30));
    return onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const list: FriendWorkout[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
          onUpdate(list);
        } else {
          onUpdate([]);
        }
      },
      (err) => {
        console.warn("Friend workouts listener error:", err);
      }
    );
  } catch (err) {
    console.warn("Could not subscribe to friend workouts:", err);
    return () => {};
  }
}

/**
 * Find user by friend code, username, or UID in Firestore to verify they are a real registered player
 */
export async function findUserByCodeOrUsername(searchTerm: string): Promise<UserProfile | null> {
  const clean = searchTerm.trim().replace(/^@+/, "");
  if (!clean) return null;

  try {
    const usersRef = collection(db, "users");

    // 1. Search by friendCode (exact uppercase and as-is)
    const qCodeUpper = query(usersRef, where("friendCode", "==", clean.toUpperCase()), limit(1));
    const snapCodeUpper = await getDocs(qCodeUpper);
    if (!snapCodeUpper.empty) {
      const docData = snapCodeUpper.docs[0].data() as UserProfile;
      return { ...docData, uid: snapCodeUpper.docs[0].id };
    }

    const qCode = query(usersRef, where("friendCode", "==", clean), limit(1));
    const snapCode = await getDocs(qCode);
    if (!snapCode.empty) {
      const docData = snapCode.docs[0].data() as UserProfile;
      return { ...docData, uid: snapCode.docs[0].id };
    }

    // 2. Search by username (exact lowercase and as-is)
    const qUserLower = query(usersRef, where("username", "==", clean.toLowerCase()), limit(1));
    const snapUserLower = await getDocs(qUserLower);
    if (!snapUserLower.empty) {
      const docData = snapUserLower.docs[0].data() as UserProfile;
      return { ...docData, uid: snapUserLower.docs[0].id };
    }

    const qUser = query(usersRef, where("username", "==", clean), limit(1));
    const snapUser = await getDocs(qUser);
    if (!snapUser.empty) {
      const docData = snapUser.docs[0].data() as UserProfile;
      return { ...docData, uid: snapUser.docs[0].id };
    }

    // 3. Search by doc UID if matching document ID
    try {
      const userDocRef = doc(db, "users", clean);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const docData = userSnap.data() as UserProfile;
        return { ...docData, uid: userSnap.id };
      }
    } catch {
      // Not a valid doc path or not found
    }

    return null;
  } catch (err) {
    console.warn("Error finding user:", err);
    return null;
  }
}
