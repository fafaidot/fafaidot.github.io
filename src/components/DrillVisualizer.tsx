import React, { useState, useEffect, useRef } from "react";
import { Drill } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  AlertTriangle,
  Footprints,
  Compass,
} from "lucide-react";
import { playDribbleBounce } from "../utils/audioCues";

interface DrillVisualizerProps {
  drill: Drill;
  autoPlay?: boolean;
  compact?: boolean;
  showExplanation?: boolean;
}

export const DrillVisualizer: React.FC<DrillVisualizerProps> = ({
  drill,
  autoPlay = true,
  compact = false,
  showExplanation = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  // Default speed set to 0.25x as requested
  const [speed, setSpeed] = useState<number>(0.25);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isExpandedBreakdown, setIsExpandedBreakdown] = useState<boolean>(!compact);

  const animRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);
  const lastBounceRef = useRef<number>(0);

  // Auto-advance step every 4s when playing
  useEffect(() => {
    if (!isPlaying || !drill.stepByStep?.length) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % drill.stepByStep.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, drill.stepByStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;

      if (isPlaying) {
        tickRef.current += 0.03 * speed;
      }

      const t = tickRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Clear & draw basketball court background
      ctx.clearRect(0, 0, width, height);

      // Hardwood floor gradient (Obsidian #0A0A0A to #141414)
      const courtGrad = ctx.createLinearGradient(0, 0, 0, height);
      courtGrad.addColorStop(0, "#161616");
      courtGrad.addColorStop(1, "#0A0A0A");
      ctx.fillStyle = courtGrad;
      ctx.fillRect(0, 0, width, height);

      // Hardwood plank lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Court Lines (Electric Orange #FF6B00)
      ctx.strokeStyle = "rgba(255, 107, 0, 0.45)";
      ctx.lineWidth = 2;

      const centerX = width / 2;
      const hoopY = 46;
      const hoopRadius = 14;

      // Backboard
      ctx.beginPath();
      ctx.moveTo(centerX - 36, 26);
      ctx.lineTo(centerX + 36, 26);
      ctx.strokeStyle = "rgba(245, 245, 245, 0.9)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Rim
      ctx.beginPath();
      ctx.arc(centerX, hoopY, hoopRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#FF6B00";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Key Rectangle
      ctx.strokeStyle = "rgba(255, 107, 0, 0.35)";
      ctx.lineWidth = 2;
      const keyWidth = Math.min(width * 0.45, 140);
      ctx.strokeRect(centerX - keyWidth / 2, 26, keyWidth, height * 0.48);

      // Free throw circle
      ctx.beginPath();
      ctx.arc(centerX, 26 + height * 0.48, keyWidth / 2, 0, Math.PI);
      ctx.stroke();

      // 3-Point Arc
      ctx.beginPath();
      ctx.arc(centerX, hoopY, width * 0.44, 0.25 * Math.PI, 0.75 * Math.PI, false);
      ctx.stroke();

      // Draw Animated Directional Arrows & Paths on Court
      drawDirectionalArrows(ctx, width, height, t);

      // Draw Animated Step Markers on Court
      drawCourtSteps(ctx, width, height, t);

      // Draw Player & Basketball animation
      drawDrillAnimation(ctx, width, height, centerX, hoopY, t, drill.animationType, drill.category);

      animRef.current = requestAnimationFrame(render);
    };

    const drawDirectionalArrows = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      t: number
    ) => {
      const vectors = drill.directionalVectors || [
        {
          fromXPercent: 50,
          fromYPercent: 78,
          toXPercent: 50,
          toYPercent: 45,
          type: "dribble" as const,
          label: "Attack Lane",
        },
      ];

      vectors.forEach((vec, idx) => {
        const fromX = (vec.fromXPercent / 100) * width;
        const fromY = (vec.fromYPercent / 100) * height;
        const toX = (vec.toXPercent / 100) * width;
        const toY = (vec.toYPercent / 100) * height;

        // Animated dashed line
        ctx.save();
        ctx.strokeStyle = "rgba(255, 107, 0, 0.75)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -(t * 20);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = 10;
        ctx.setLineDash([]);
        ctx.fillStyle = "#FF6B00";
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headLen * Math.cos(angle - Math.PI / 6),
          toY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headLen * Math.cos(angle + Math.PI / 6),
          toY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Animated pulse along arrow
        const pulseRatio = (t * 0.5 + idx * 0.3) % 1;
        const pulseX = fromX + (toX - fromX) * pulseRatio;
        const pulseY = fromY + (toY - fromY) * pulseRatio;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const drawCourtSteps = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      t: number
    ) => {
      const steps = drill.courtSteps || [
        { stepNumber: 1, label: "Gather", instruction: "Set base", xPercent: 50, yPercent: 78 },
        { stepNumber: 2, label: "Execute", instruction: "Attack angle", xPercent: 50, yPercent: 60 },
        { stepNumber: 3, label: "Score", instruction: "Finish soft", xPercent: 50, yPercent: 42 },
      ];

      steps.forEach((step, idx) => {
        const stepX = (step.xPercent / 100) * width;
        const stepY = (step.yPercent / 100) * height;
        const isActive = activeStepIndex === idx;

        ctx.save();
        // Glow if active
        if (isActive) {
          ctx.shadowColor = "#FF6B00";
          ctx.shadowBlur = 12;
        }

        // Circle badge
        ctx.fillStyle = isActive ? "#FF6B00" : "rgba(30, 30, 30, 0.9)";
        ctx.strokeStyle = isActive ? "#FFFFFF" : "rgba(255, 107, 0, 0.6)";
        ctx.lineWidth = isActive ? 2.5 : 1.5;

        ctx.beginPath();
        ctx.arc(stepX, stepY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Number
        ctx.shadowBlur = 0;
        ctx.fillStyle = isActive ? "#000000" : "#FFFFFF";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(step.stepNumber.toString(), stepX, stepY);

        // Step Label Tag
        ctx.fillStyle = isActive ? "rgba(255, 107, 0, 0.9)" : "rgba(255, 255, 255, 0.6)";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText(step.label, stepX, stepY + 18);

        ctx.restore();
      });
    };

    const drawDrillAnimation = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      centerX: number,
      hoopY: number,
      t: number,
      animType: string,
      category: string
    ) => {
      let playerX = centerX;
      let playerY = height * 0.68;
      let ballX = centerX;
      let ballY = height * 0.68;
      const ballRadius = 7.5;

      // Category specific animations
      if (category === "ball_handling") {
        if (animType === "shamgod_crossover") {
          const cycle = (t * 2) % 4;
          playerX = centerX;
          playerY = height * 0.68;
          drawPlayerAvatar(ctx, playerX, playerY, "wide");

          if (cycle < 1.8) {
            const pushDist = (cycle / 1.8) * 38;
            ballX = playerX + pushDist;
            ballY = playerY - (cycle / 1.8) * 20;
          } else if (cycle < 2.6) {
            const snatchPhase = (cycle - 1.8) / 0.8;
            ballX = playerX + 38 - snatchPhase * 68;
            ballY = playerY - 20 + snatchPhase * 25;
          } else {
            ballX = playerX - 30;
            ballY = playerY + Math.abs(Math.sin(t * 8)) * 12;
          }

          drawBasketball(ctx, ballX, ballY, ballRadius);
          drawDribbleRipples(ctx, ballX, playerY + 22, Math.sin(t * 6));
          triggerBounceSound(t * 4);
          return;
        }

        if (animType === "two_ball_alternate") {
          playerX = centerX;
          playerY = height * 0.68;
          const leftBallY = playerY + Math.sin(t * 8) * 20;
          const rightBallY = playerY + Math.sin(t * 8 + Math.PI) * 20;

          drawPlayerAvatar(ctx, playerX, playerY, "wide");
          drawBasketball(ctx, playerX - 24, leftBallY, ballRadius);
          drawDribbleRipples(ctx, playerX - 24, playerY + 20, Math.sin(t * 8));

          drawBasketball(ctx, playerX + 24, rightBallY, ballRadius);
          drawDribbleRipples(ctx, playerX + 24, playerY + 20, Math.sin(t * 8 + Math.PI));

          triggerBounceSound(t * 8);
          return;
        }

        // Standard pound & pocket
        const bounce = Math.abs(Math.sin(t * 6));
        playerX = centerX;
        playerY = height * 0.68;
        ballX = playerX + 24;
        ballY = playerY + bounce * 22;

        drawPlayerAvatar(ctx, playerX, playerY, "athletic");
        drawBasketball(ctx, ballX, ballY, ballRadius);
        drawDribbleRipples(ctx, ballX, playerY + 22, bounce);
        triggerBounceSound(t * 6);
        return;
      }

      if (category === "shooting") {
        const shotCycle = (t * 1.5) % 4;
        playerX = centerX + Math.sin(t * 0.4) * 35;
        playerY = height * 0.72;

        if (shotCycle < 1.4) {
          // Gather & Dip
          drawPlayerAvatar(ctx, playerX, playerY + 6, "low_squat");
          drawBasketball(ctx, playerX + 8, playerY - 4, ballRadius);
        } else if (shotCycle < 2.5) {
          // Release elevation
          const releaseProgress = (shotCycle - 1.4) / 1.1;
          const jumpY = playerY - 14;
          drawPlayerAvatar(ctx, playerX, jumpY, "jump");

          // Shot parabolic trajectory
          ballX = playerX + (centerX - playerX) * releaseProgress;
          ballY = jumpY - 20 - Math.sin(releaseProgress * Math.PI) * 70;
          drawBasketball(ctx, ballX, ballY, ballRadius);
        } else {
          // Swish & reset
          drawPlayerAvatar(ctx, playerX, playerY, "athletic");
          drawBasketball(ctx, centerX, hoopY + 6, ballRadius);
          triggerBounceSound(t);
        }
        return;
      }

      if (category === "finishing_footwork") {
        const layupCycle = (t * 2) % 3.5;
        if (layupCycle < 1.6) {
          const progress = layupCycle / 1.6;
          playerX = centerX + 40 - progress * 40;
          playerY = height * 0.75 - progress * 70;
          drawPlayerAvatar(ctx, playerX, playerY, "dynamic");
          drawBasketball(ctx, playerX - 10, playerY, ballRadius);
        } else {
          playerX = centerX;
          playerY = hoopY + 28;
          drawPlayerAvatar(ctx, playerX, playerY - 12, "jump");
          drawBasketball(ctx, centerX, hoopY + 2, ballRadius);
        }
        return;
      }

      // Default all-around animation
      const generalProgress = Math.sin(t * 2) * 30;
      playerX = centerX + generalProgress;
      playerY = height * 0.65;
      drawPlayerAvatar(ctx, playerX, playerY, "athletic");
      drawBasketball(ctx, playerX + 16, playerY + Math.abs(Math.sin(t * 6)) * 18, ballRadius);
    };

    const drawPlayerAvatar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      stance: string
    ) => {
      ctx.save();
      // Head
      ctx.fillStyle = "#FF6B00";
      ctx.beginPath();
      ctx.arc(x, y - 22, 7, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Legs / Stance
      ctx.strokeStyle = "#FF6B00";
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (stance === "wide" || stance === "low_squat") {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 14, y + 18);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 14, y + 18);
      } else if (stance === "jump") {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 6, y + 14);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 6, y + 14);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10, y + 16);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y + 16);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawBasketball = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      ctx.save();
      ctx.fillStyle = "#FF6B00";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.moveTo(x - r, y);
      ctx.lineTo(x + r, y);
      ctx.moveTo(x, y - r);
      ctx.lineTo(x, y + r);
      ctx.stroke();
      ctx.restore();
    };

    const drawDribbleRipples = (
      ctx: CanvasRenderingContext2D,
      x: number,
      groundY: number,
      phase: number
    ) => {
      if (phase < 0.2) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 107, 0, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, groundY, 14, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    const triggerBounceSound = (currT: number) => {
      if (!soundEnabled) return;
      if (currT - lastBounceRef.current > 1.2) {
        playDribbleBounce();
        lastBounceRef.current = currT;
      }
    };

    render();

    return () => {
      isSubscribed = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speed, soundEnabled, drill, activeStepIndex]);

  return (
    <div
      id={`drill-visualizer-${drill.id}`}
      className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Clean, Compact Top Bar (No bulky stats) */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-white/10 bg-[#161616] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-white truncate">
            {drill.title}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 shrink-0 capitalize">
            {drill.level}
          </span>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Speed Selector (0.25x default) */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5">
            {[0.25, 0.5, 0.75, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  speed === s
                    ? "bg-[#FF6B00] text-black"
                    : "text-neutral-400 hover:text-white"
                } transition-colors`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? "bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/40"
                : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
            }`}
            title="Metronome & Ball Bounce Audio"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-[#FF6B00] text-black hover:bg-orange-500 rounded-lg font-bold transition-transform active:scale-95"
            title={isPlaying ? "Pause Visualizer" : "Play Visualizer"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* Visualizer Court Canvas (Responsive for mobile & desktop) */}
      <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] max-h-[340px] bg-[#0A0A0A] flex items-center justify-center p-2 sm:p-4">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          className="w-full h-full object-contain rounded-xl border border-white/5 shadow-inner"
        />

        {/* Legend Overlay on Canvas */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2 text-[10px] text-neutral-300">
          <span className="flex items-center gap-1 text-[#FF6B00]">
            <Compass className="w-3 h-3" /> Vectors & Steps
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-white font-mono">{speed}x Pace</span>
        </div>
      </div>

      {/* Step Sequence Timeline Bar */}
      {drill.stepByStep && drill.stepByStep.length > 0 && (
        <div className="p-3 bg-[#151515] border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-[#FF6B00]" />
              Court Execution Steps
            </span>
            <span className="text-[10px] text-neutral-400">
              Step {activeStepIndex + 1} of {drill.stepByStep.length}
            </span>
          </div>

          {/* Step Pill Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {drill.stepByStep.map((stepText, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition-all ${
                    isActive
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm"
                      : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span className="font-bold text-[#FF6B00] block text-[10px]">
                    Step {idx + 1}
                  </span>
                  <span className="line-clamp-1">{stepText.replace(/^Step \d+:\s*/i, "")}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Full Description */}
          <div className="mt-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-200 leading-relaxed">
            <strong className="text-[#FF6B00]">Active Coaching Focus: </strong>
            {drill.stepByStep[activeStepIndex]}
          </div>
        </div>
      )}

      {/* In-Depth Coaching Explanation Accordion */}
      {showExplanation && (
        <div className="border-t border-white/10 bg-[#121212]">
          <button
            onClick={() => setIsExpandedBreakdown(!isExpandedBreakdown)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-neutral-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              Full Drill Breakdown & NBA Pro Secrets
            </span>
            {isExpandedBreakdown ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {isExpandedBreakdown && (
            <div className="p-4 pt-1 space-y-3 text-xs border-t border-white/5 animate-fadeIn">
              {/* Footwork Guide */}
              {drill.footworkGuide && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-[#FF6B00] flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1">
                    <Footprints className="w-3.5 h-3.5" />
                    Footwork & Body Alignment
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{drill.footworkGuide}</p>
                </div>
              )}

              {/* NBA Pro Secret */}
              {drill.proSecret && (
                <div className="p-3 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30">
                  <span className="font-bold text-[#FF6B00] flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    NBA Pro Secret Cue
                  </span>
                  <p className="text-neutral-200 leading-relaxed font-medium">{drill.proSecret}</p>
                </div>
              )}

              {/* Common Mistakes to Avoid */}
              {drill.mistakesToAvoid && drill.mistakesToAvoid.length > 0 && (
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                  <span className="font-bold text-red-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Common Mistakes to Avoid
                  </span>
                  <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                    {drill.mistakesToAvoid.map((mistake, i) => (
                      <li key={i} className="leading-relaxed">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
