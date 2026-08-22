import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini client
  let genAiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!genAiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return null;
      }
      genAiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return genAiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Hoop Master Basketball Server" });
  });

  // AI Workout Plan Generator Endpoint
  app.post("/api/ai/generate-routine", async (req, res) => {
    try {
      const {
        skillLevel = "beginner",
        primaryGoal = "Ball Handling & Shooting",
        timeMinutes = 20,
        equipment = "1 Basketball",
        hasHoop = true,
        intensity = "Medium",
        specificNotes = "",
        availableDrills = [],
      } = req.body;

      const ai = getGenAI();

      if (ai) {
        const prompt = `You are an elite NBA skills trainer and basketball development coach.
Create a personalized, high-intensity basketball practice workout plan for this player:
- Skill Level: ${skillLevel}
- Primary Focus/Goal: ${primaryGoal}
- Time Available: ${timeMinutes} minutes
- Equipment Available: ${equipment}
- Hoop Access: ${hasHoop ? "Yes, full/half hoop available" : "No hoop (purely stationary, ground, dribble, footwork, plyometrics)"}
- Target Intensity: ${intensity}
- Additional Player Notes: ${specificNotes || "None"}

Available drill database references for inspiration or direct inclusion:
${JSON.stringify(availableDrills.slice(0, 18).map((d: any) => ({ id: d.id, title: d.title, category: d.category, level: d.level, durationSec: d.durationSec })))}

Generate a complete, structured basketball routine. Return a JSON object with:
1. title: Catchy motivational routine title (e.g., "Kyrie Ankle-Breaker Matrix & Shift", "Stephen Curry 3PT Relocation Blast", "Paint Beast Touch & Euro Circuit").
2. description: Inspiring coach-level breakdown of the routine's purpose.
3. totalXp: Estimated XP reward (between 250 to 550 XP).
4. drills: Array of 4 to 6 drills with:
   - title: string
   - category: ('ball_handling' | 'shooting' | 'passing' | 'finishing_footwork' | 'plyometrics_conditioning' | 'defense_iq')
   - durationSec: number (e.g. 180, 240, 300)
   - repsOrSets: string (e.g. "3 sets x 40s each hand", "25 swishes from 5 spots")
   - coachingCues: array of 3 actionable coaching cues
   - intensity: ('Low' | 'Medium' | 'High' | 'Pro')
   - keyFocus: string

Output clean JSON conforming strictly to the requested schema.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              systemInstruction: "You are an elite basketball skills trainer. Output valid JSON only with basketball drills matching the requested skill level and time.",
            },
          });

          const text = response.text || "{}";
          const routineData = JSON.parse(text);
          return res.json({ success: true, routine: routineData });
        } catch (geminiError) {
          console.warn("Gemini generation failed, falling back to algorithmic plan:", geminiError);
        }
      }

      // Fallback: Algorithmic NBA Trainer Routine Generator
      const filtered = (availableDrills || []).filter((d: any) => {
        if (!hasHoop && (d.category === "shooting" || d.category === "finishing_footwork")) return false;
        return true;
      });

      const selected = filtered.length > 0 ? filtered.slice(0, Math.max(4, Math.floor(timeMinutes / 4))) : [
        {
          title: "Stationary Pound & Pocket Dribble",
          category: "ball_handling",
          durationSec: 180,
          repsOrSets: "3 sets x 30s each hand",
          coachingCues: ["Keep chest up and eyes forward", "Pound through the hardwood", "Snap into the hip pocket"],
          intensity: "Medium",
          keyFocus: "Pocket control & forearm snap",
        },
        {
          title: "In-and-Out Crossover Combo",
          category: "ball_handling",
          durationSec: 240,
          repsOrSets: "4 sets x 45s continuous",
          coachingCues: ["Drop lead shoulder", "Keep crossover below knees", "Stay in wide athletic base"],
          intensity: "High",
          keyFocus: "Deceptive body sway",
        },
        {
          title: "One-Hand Form Shooting Sweet Spot",
          category: "shooting",
          durationSec: 240,
          repsOrSets: "50 makes from 3 feet out",
          coachingCues: ["Center shooting hand", "Hold goose-neck follow through", "Drive power with legs"],
          intensity: "Medium",
          keyFocus: "Pure shooting arc & backspin",
        },
        {
          title: "Zig-Zag Defensive Slides & High Contest",
          category: "defense_iq",
          durationSec: 240,
          repsOrSets: "5 full court zig-zags",
          coachingCues: ["Push off trail leg", "Keep hands active", "Contest straight up"],
          intensity: "High",
          keyFocus: "Lateral agility & contest discipline",
        },
      ];

      const fallbackRoutine = {
        title: `${primaryGoal} - ${skillLevel.toUpperCase()} Accelerator`,
        description: `Custom high-performance workout routine focusing on ${primaryGoal}. Designed to build motor coordination, stamina, and repeatable game mechanics.`,
        totalXp: Math.max(250, timeMinutes * 18),
        drills: selected,
      };

      res.json({ success: true, routine: fallbackRoutine });
    } catch (error: any) {
      console.error("AI Routine Generation Error:", error);
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate workout plan. Please try again.",
      });
    }
  });

  // AI Personalized Coach Insights endpoint
  app.post("/api/ai/coach-feedback", async (req, res) => {
    try {
      const { userProgress, recentWorkoutTitle } = req.body;
      const ai = getGenAI();

      if (ai) {
        const prompt = `Provide personalized coach feedback and recommendations for a basketball player who completed "${recentWorkoutTitle || "a basketball practice session"}".
Player Profile:
- Rank: ${userProgress?.rankTitle || userProgress?.rank || "Rookie"}
- Total XP: ${userProgress?.totalXp || 0}
- Workouts Completed: ${userProgress?.completedRoutinesCount || 0}
- Current Streak: ${userProgress?.currentStreakDays || 1} days

Give 3 motivating, high-IQ basketball tips (1 sentence each) and an inspiring motivational quote.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              systemInstruction: "You are an encouraging NBA skills trainer. Provide 3 short tips in JSON: { tips: string[], motivationalQuote: string }",
            },
          });

          const text = response.text || "{}";
          const insights = JSON.parse(text);
          return res.json({ success: true, insights });
        } catch (e) {
          console.warn("Gemini coach feedback error, using fallback:", e);
        }
      }

      // High-IQ Basketball Coach Feedback fallback
      res.json({
        success: true,
        insights: {
          tips: [
            "Keep your off-hand active as an offensive shield on every dribble drive.",
            "Hold your shooting follow-through until the ball passes the net to lock in muscle memory.",
            "Stay on the balls of your feet during lateral transitions to avoid knee torque and maintain explosive reaction.",
          ],
          motivationalQuote: "Great players are made when the gym is empty. Lock in and dominate tomorrow's session!",
        },
      });
    } catch (error: any) {
      console.error("AI Coach Feedback Error:", error);
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate coaching feedback",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hoop Master basketball server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
