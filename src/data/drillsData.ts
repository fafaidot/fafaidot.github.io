import { Drill, WorkoutRoutine, MilestoneBadge } from "../types";

export const ALL_DRILLS: Drill[] = [
  // ================= 1. BALL HANDLING =================
  {
    id: "bh-pound-pocket",
    title: "Stationary Pound & Pocket Dribble",
    category: "ball_handling",
    level: "beginner",
    durationSec: 180,
    repsOrSets: "3 sets x 30s each hand",
    description: "Build violent dribble force and pocket control without letting the ball carry. Foundational hand-eye coordination drill.",
    coachingCues: [
      "Keep chest up and eyes forward—do not look down at the basketball.",
      "Pound the ball into the hardwood as if pushing it through the floor.",
      "Snap your wrist back to catch the ball in the pocket hip position."
    ],
    equipmentNeeded: "1 Basketball",
    keyFocus: "Finger-pad control, pocket manipulation, forearm strength",
    animationType: "pound_pocket",
    xpReward: 60,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Drop into a balanced athletic base, feet slightly wider than shoulders, knees bent at 45 degrees.",
      "Step 2: Pound the basketball with maximum velocity into the hardwood directly outside your right foot.",
      "Step 3: Allow the ball to rise to waist level, then cup the back side of the ball with your fingers and pull it back to your right hip pocket.",
      "Step 4: Hold in the pocket for a fraction of a second, then immediately explode down into the next pound. Switch to left hand after 30 seconds."
    ],
    footworkGuide: "Stay anchored on the balls of both feet. Distribute weight 50/50 with zero heel lift to ensure dynamic stability.",
    proSecret: "NBA guards use the pocket dribble to freeze on-ball defenders by creating an illusion that they are gathering to shoot or pass.",
    mistakesToAvoid: [
      "Letting your hand slip completely under the ball, which causes a carry violation.",
      "Looking down at the ball instead of surveying the entire floor."
    ],
    courtSteps: [
      { stepNumber: 1, label: "Triple Threat Base", instruction: "Establish low center of gravity", xPercent: 50, yPercent: 68 },
      { stepNumber: 2, label: "Hard Floor Pound", instruction: "Violent downward strike outside foot", xPercent: 58, yPercent: 68 },
      { stepNumber: 3, label: "Hip Pocket Snatch", instruction: "Pull ball back to hip crease", xPercent: 62, yPercent: 65 },
    ],
    directionalVectors: [
      { fromXPercent: 58, fromYPercent: 68, toXPercent: 62, toYPercent: 65, type: "dribble", label: "Pound to Pocket" }
    ]
  },
  {
    id: "bh-in-out-cross",
    title: "In-and-Out Crossover Combo",
    category: "ball_handling",
    level: "beginner",
    durationSec: 240,
    repsOrSets: "4 sets x 45s continuous",
    description: "Sell the fake drive with shoulders and eyes, then explosively snap a low crossover across your shin line.",
    coachingCues: [
      "Drop your lead shoulder on the in-and-out fake to shift the defender.",
      "Keep the crossover below your knees to protect from reaching hands.",
      "Stay in a wide, balanced triple-threat athletic stance throughout."
    ],
    equipmentNeeded: "1 Basketball, 2 Cones (optional)",
    keyFocus: "Deceptive body sway, rapid hand redirection",
    animationType: "in_and_out_crossover",
    xpReward: 80,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Execute a hard pound with your dominant hand, rotating your hand slightly over the outer edge of the ball.",
      "Step 2: Push the ball inward across your midline while dipping your right shoulder and head to sell the drive fake.",
      "Step 3: Before the ball crosses your body, whip your hand underneath and pull it back out wide.",
      "Step 4: Immediately snap a violent low crossover below knee level across to your opposite hand."
    ],
    footworkGuide: "Plant your outside foot firmly during the in-and-out sway, then push off that foot to accelerate into the crossover.",
    proSecret: "The key to freezing defenders is eye manipulation—look towards the drive direction before snapping the crossover.",
    mistakesToAvoid: [
      "Standing up tall on the crossover, which leaves you vulnerable to strips.",
      "Making the in-and-out motion too small to convince the defender."
    ],
    courtSteps: [
      { stepNumber: 1, label: "In-and-Out Sway", instruction: "Drop shoulder and sell the drive", xPercent: 60, yPercent: 66 },
      { stepNumber: 2, label: "Shin Crossover", instruction: "Snap ball low below knee level", xPercent: 40, yPercent: 66 },
    ],
    directionalVectors: [
      { fromXPercent: 60, fromYPercent: 66, toXPercent: 40, toYPercent: 66, type: "dribble", label: "Snap Cross" }
    ]
  },
  {
    id: "bh-two-ball-alt",
    title: "2-Ball Alternating Speed Dribble",
    category: "ball_handling",
    level: "intermediate",
    durationSec: 180,
    repsOrSets: "3 sets x 45s",
    description: "Challenge your nervous system with independent hand control. Piston-action dribbling that builds ambidexterity fast.",
    coachingCues: [
      "Establish a rhythmic piston beat: left strikes as right rises.",
      "Keep both balls below knee level for maximum hand speed.",
      "If you lose control, grab them immediately and jump right back into rhythm."
    ],
    equipmentNeeded: "2 Basketballs",
    keyFocus: "Bilateral motor control, non-dominant hand activation",
    animationType: "two_ball_alternate",
    xpReward: 90,
    intensity: "High",
    stepByStep: [
      "Step 1: Hold a basketball in each hand at waist level in a deep quarter-squat.",
      "Step 2: Drop your right hand ball into a hard pound while keeping the left ball ready.",
      "Step 3: As the right ball bounces back up, immediately pound the left ball down with identical force.",
      "Step 4: Maintain this continuous alternating piston rhythm for the full 45-second set."
    ],
    footworkGuide: "Maintain a wide stationary base with knees slightly flaring out to allow room for the basketballs to bounce freely.",
    proSecret: "Focus your eyes straight ahead at a fixed point on the wall; let your hands rely purely on tactile fingertip feedback.",
    mistakesToAvoid: [
      "Letting the dominant hand dictate a faster pace than the weak hand.",
      "Rounding the lower back; keep spine neutral and chest proud."
    ],
    courtSteps: [
      { stepNumber: 1, label: "Left Piston Down", instruction: "Left hand strikes as right rises", xPercent: 42, yPercent: 68 },
      { stepNumber: 2, label: "Right Piston Down", instruction: "Right hand strikes as left rises", xPercent: 58, yPercent: 68 },
    ]
  },
  {
    id: "bh-figure-eight",
    title: "Figure 8 Speed Wrap & Dribble",
    category: "ball_handling",
    level: "beginner",
    durationSec: 180,
    repsOrSets: "3 sets x 30s forward & reverse",
    description: "Weave the ball through your legs in a continuous figure-8 pattern with fingertip precision.",
    coachingCues: [
      "Sink low into a deep hip hinge, keeping back straight.",
      "Use only the pads of your fingers, avoiding the palm.",
      "Start with small quick taps and gradually expand the circle width."
    ],
    equipmentNeeded: "1 Basketball",
    keyFocus: "Fingertip sensitivity, tight-space control",
    animationType: "figure_eight",
    xpReward: 65,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Stand with feet wider than shoulder-width in a deep squat position.",
      "Step 2: Dribble the ball from front to back through your right leg.",
      "Step 3: Reach behind with your right hand, guide the ball forward around your right thigh, and weave through to the left leg.",
      "Step 4: Continue the smooth figure-8 loop for 30s forward, then reverse the direction for 30s."
    ],
    footworkGuide: "Feet remain pinned to the hardwood with zero shifting; all rotation occurs at the hips and wrists.",
    proSecret: "Top point guards use figure-8 drills to condition the small stabilizer muscles in their wrists and fingers.",
    mistakesToAvoid: [
      "Allowing the basketball to bounce higher than your mid-shin.",
      "Hunching your neck downward toward the floor."
    ]
  },
  {
    id: "bh-spider-dribble",
    title: "Spider Dribble Rapid Tap",
    category: "ball_handling",
    level: "intermediate",
    durationSec: 150,
    repsOrSets: "4 sets x 25s sprint pace",
    description: "Alternating quick taps: Right hand front, Left hand front, Right hand back, Left hand back.",
    coachingCues: [
      "Keep the basketball virtually hovering in place between your legs.",
      "Stay on the balls of your feet with active core engagement.",
      "Count your tap reps out loud to maintain lightning tempo."
    ],
    equipmentNeeded: "1 Basketball",
    keyFocus: "Hand speed, rapid reaction time",
    animationType: "spider_dribble",
    xpReward: 85,
    intensity: "High",
    stepByStep: [
      "Step 1: Straddle the ball with knees bent in a low athletic stance.",
      "Step 2: Tap the ball in front with your right hand, then quickly tap in front with your left hand.",
      "Step 3: Whip your right hand behind your right leg to tap the ball, then left hand behind left leg to tap.",
      "Step 4: Maintain the 4-tap cycle (R-front, L-front, R-back, L-back) at maximum hand speed."
    ],
    footworkGuide: "Keep toes pointed straight ahead; do not allow knees to collapse inward.",
    proSecret: "Rhythm is everything—treat it like a 4/4 musical beat.",
    mistakesToAvoid: [
      "Letting the ball drift away from your center of mass.",
      "Slapping with an open flat palm rather than fingertip pads."
    ]
  },
  {
    id: "bh-kyrie-hezy",
    title: "Kyrie Hesitation & Freeze Hang",
    category: "ball_handling",
    level: "advanced",
    durationSec: 240,
    repsOrSets: "4 sets x 8 reps each side",
    description: "Hang the ball in the air at hip height, momentarily stand up to freeze the defense, then explode downhill.",
    coachingCues: [
      "Float the ball on your fingertips—do not let your hand cup underneath.",
      "Decelerate completely for half a beat to sell the pull-up jumper.",
      "Explode out with a violent push-off the back foot."
    ],
    equipmentNeeded: "1 Basketball, 3 Cones",
    keyFocus: "Pacing change, hang-dribble timing, burst acceleration",
    animationType: "kyrie_hesitation",
    xpReward: 110,
    intensity: "High",
    stepByStep: [
      "Step 1: Dribble aggressively toward the defender at 80% sprint speed.",
      "Step 2: Pound the ball and let it float into a high hang at your hip while slightly straightening your torso.",
      "Step 3: Glance up at the rim with your eyes as if rising into a jump shot.",
      "Step 4: The millisecond the defender rises, drop your hips, push the ball forward, and blow past them."
    ],
    footworkGuide: "Stutter-step into the deceleration, keeping your front foot loaded to push off instantly.",
    proSecret: "Kyrie Irving uses this move because modern defenders are terrified of his pull-up jumper.",
    mistakesToAvoid: [
      "Prematurely speeding up before the defender bites on the hesitation fake.",
      "Carrying the ball by placing your palm under the equator."
    ]
  },
  {
    id: "bh-behind-back-wrap",
    title: "Behind-the-Back Speed Wrap & Go",
    category: "ball_handling",
    level: "advanced",
    durationSec: 210,
    repsOrSets: "4 sets x 10 makes each wing",
    description: "Wrap the basketball tightly around your waist while driving at game speed to shield from aggressive reach-ins.",
    coachingCues: [
      "Wrap the ball tight below your tailbone.",
      "Guide the ball with wrist flexion into the opposite forward pocket.",
      "Keep shoulders square to the basket as you change directions."
    ],
    equipmentNeeded: "1 Basketball, 4 Cones",
    keyFocus: "Protection dribble, change of direction, hip clearance",
    animationType: "behind_back_wrap",
    xpReward: 95,
    intensity: "High",
    stepByStep: [
      "Step 1: Attack the first cone at full speed on a 45-degree angle.",
      "Step 2: Plant your outside foot and snap the ball behind your lower back below the tailbone.",
      "Step 3: Catch cleanly with your opposite hand in the front pocket without breaking stride.",
      "Step 4: Accelerate directly toward the rim for a strong two-foot finish."
    ],
    footworkGuide: "Plant your lead foot at a 45-degree angle to create an instant pivot barrier against the defender.",
    proSecret: "Wrap the ball with enough forward velocity that it leads your opposite hand into the sprint.",
    mistakesToAvoid: [
      "Hitting the back of your thighs or buttocks due to poor ball trajectory.",
      "Slowing down before initiating the wrap."
    ]
  },
  {
    id: "bh-god-shamgod-snatch",
    title: "God Shammgod Snatch Crossover",
    category: "ball_handling",
    level: "elite",
    durationSec: 240,
    repsOrSets: "5 sets x 6 reps per side",
    description: "Throw the ball out forward to bait the defender into a reach, then violently snatch it back across with the opposite hand.",
    coachingCues: [
      "Push ball out with one hand just far enough to tempt the defender.",
      "Cross your opposite hand over and pull the ball back across your midline.",
      "Instantly drop into a low explosive drive."
    ],
    equipmentNeeded: "1 Basketball, 2 Cones",
    keyFocus: "Baiting deception, opposite hand snatch, explosive counter",
    animationType: "shamgod_crossover",
    xpReward: 120,
    intensity: "Pro",
    stepByStep: [
      "Step 1: Attack downhill and push the ball forward with your right hand out in front of your body.",
      "Step 2: Let the ball bounce forward while taking a plant step with your right foot.",
      "Step 3: Reach across with your left hand, grab the outside top of the ball, and violently snatch it back toward your left hip.",
      "Step 4: Cross over into open space and explode past the frozen defender."
    ],
    footworkGuide: "Plant hard on the right foot to sell the drive, then push off that plant foot to change momentum.",
    proSecret: "The magic is in the timing: throw the ball out lazy, but snatch it back with 100% violent speed.",
    mistakesToAvoid: [
      "Pushing the ball too far ahead where you cannot reach it.",
      "Telegraphing the snatch before the ball hits the floor."
    ]
  },

  // ================= 2. SHOOTING =================
  {
    id: "sh-form-sweetspot",
    title: "One-Hand Form Shooting Sweet Spot",
    category: "shooting",
    level: "beginner",
    durationSec: 240,
    repsOrSets: "50 makes from 3-5 feet out",
    description: "Master the pure shooting pocket, hand alignment, and goose-neck wrist snap without guide hand interference.",
    coachingCues: [
      "Center your index finger on the air valve or middle seam.",
      "Dip knees slightly and transfer power smoothly through your release.",
      "Hold your follow-through until the ball swishes through the net."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop",
    keyFocus: "Release consistency, pure backspin, arc elevation",
    animationType: "form_shooting_sweetspot",
    xpReward: 70,
    intensity: "Low",
    stepByStep: [
      "Step 1: Stand 4 feet in front of the rim with feet aligned toward your target.",
      "Step 2: Place your shooting hand directly under the center of the basketball; tuck your off-hand behind your back.",
      "Step 3: Dip your knees slightly, bring the ball up your shooting line in one fluid motion.",
      "Step 4: Extend fully, snap your wrist downward, and hold your goose-neck follow-through."
    ],
    footworkGuide: "Feet shoulder-width apart, 10-degree natural tilt toward the target for optimal shoulder alignment.",
    proSecret: "Look for true vertical backspin on the ball as it travels toward the rim—this guarantees soft bounces on the rim.",
    mistakesToAvoid: [
      "Flaring your shooting elbow out to the side.",
      "Dropping your wrist before the ball reaches the net."
    ]
  },
  {
    id: "sh-catch-and-shoot",
    title: "Catch & Shoot Footwork Hop/1-2",
    category: "shooting",
    level: "intermediate",
    durationSec: 300,
    repsOrSets: "25 makes from 5 mid-range spots",
    description: "Receive the pass on the move, synchronize your gather with your base, and rise into a fluid jumper in under 0.8 seconds.",
    coachingCues: [
      "Show 10 active shooting fingers as your pass target.",
      "Catch on the air-time hop or 1-2 step-in.",
      "Rise straight up—avoid drifting forward or fading sideways."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop, Passer or Wall",
    keyFocus: "Catch-to-release quickness, momentum transfer, square base",
    animationType: "catch_and_shoot",
    xpReward: 85,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Start 3 feet behind your target spot with knees bent, ready to receive.",
      "Step 2: Spin the ball out or receive from a partner; step into the pass with your inside foot (1-2) or hop simultaneously.",
      "Step 3: Gather the ball directly into your shooting pocket without dropping it below your waist.",
      "Step 4: Elevate in one continuous kinetic chain and release at the peak of your jump."
    ],
    footworkGuide: "Inside-foot plant locks your momentum and turns your hips directly toward the rim before you leave the floor.",
    proSecret: "Start dipping your hips while the pass is in the air so you are already loaded when the ball hits your hands.",
    mistakesToAvoid: [
      "Catching with flat feet and dipping after catching, which doubles your release time.",
      "Drifting sideways on the jump."
    ]
  },
  {
    id: "sh-five-spot-threes",
    title: "5-Spot 3-Point Perimeter Sweep",
    category: "shooting",
    level: "advanced",
    durationSec: 300,
    repsOrSets: "5 makes from each: Corners, Wings, Top of Key",
    description: "Sprint from spot to spot around the perimeter arc, lock your feet, and knock down high-percentage 3-pointers.",
    coachingCues: [
      "Sprint to your spot—do not jog into the catch.",
      "Generate power from your ankles and calves, not your shoulders.",
      "Hold your follow-through on every single rep."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop, 5 Spot Markers",
    keyFocus: "Cardiovascular shooting, deep range consistency, spot transition",
    animationType: "five_spot_threes",
    xpReward: 100,
    intensity: "High",
    stepByStep: [
      "Step 1: Start in the right corner, self-spin the ball, step into your shot, and knock down 5 makes.",
      "Step 2: Sprint to the right wing, repeat for 5 makes.",
      "Step 3: Sprint to top of the key, 5 makes.",
      "Step 4: Continue through left wing and left corner until 25 total 3s are completed."
    ],
    footworkGuide: "On corner to wing transitions, maintain wide arc paths to preserve linear forward balance on the catch.",
    proSecret: "On deep 3s, sweep your feet slightly forward on release to create natural shoulder relaxation.",
    mistakesToAvoid: [
      "Fading backward when tired.",
      "Rushing the shot by not establishing your base before rising."
    ]
  },
  {
    id: "sh-curry-relocation",
    title: "Stephen Curry Perimeter Relocation 3PT",
    category: "shooting",
    level: "elite",
    durationSec: 270,
    repsOrSets: "20 makes moving baseline to wing",
    description: "Pass, sprint off the screen, drift to the corner or wing, and catch-and-shoot with zero hesitation.",
    coachingCues: [
      "Sprint 100% off the pass—relocate faster than defensive recovery.",
      "Plant outside foot hard, whip hips square to the basket in mid-air.",
      "Quick release: under 0.6 seconds from catch to ball launch."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop, 2 Cones",
    keyFocus: "Off-ball relocation, high-speed alignment, lightning release",
    animationType: "curry_relocation_three",
    xpReward: 125,
    intensity: "Pro",
    stepByStep: [
      "Step 1: Make a simulated pass from the top of the key to the wing.",
      "Step 2: Sprint violently around an imaginary baseline screen toward the opposite corner.",
      "Step 3: Catch the ball on the relocation drift, set your feet in one synchronized hop.",
      "Step 4: Release the 3-pointer before the recovering defender can get a hand up."
    ],
    footworkGuide: "Use the 'drift step'—jump slightly in the direction of your momentum while keeping shoulders locked on target.",
    proSecret: "Stephen Curry practices relocation until his heart rate hits 180 BPM to simulate 4th quarter clutch moments.",
    mistakesToAvoid: [
      "Stopping your run before catching the ball.",
      "Allowing upper body to tilt away from the rim."
    ]
  },
  {
    id: "sh-kobe-fadeaway",
    title: "Kobe Bryant High-Post Shimmy Fadeaway",
    category: "shooting",
    level: "elite",
    durationSec: 240,
    repsOrSets: "16 makes (8 right baseline, 8 left baseline)",
    description: "Operate out of the mid-post: drop your shoulder, shimmy to freeze the rim protector, and fade backward with high release.",
    coachingCues: [
      "Get low in post position—feel the defender's forearm.",
      "Violent shoulder shimmy left/right to displace defender's balance.",
      "Kick shooting-side leg forward for balance on the backward fade."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop",
    keyFocus: "Mid-post footwork, elevation on fade, apex release",
    animationType: "kobe_fadeaway_post",
    xpReward: 120,
    intensity: "High",
    stepByStep: [
      "Step 1: Catch the ball at the free throw line extended with your back to the basket.",
      "Step 2: Take one hard pound dribble toward the paint, dip your left shoulder, and shimmy right.",
      "Step 3: Plant your pivot foot, elevate straight up while angling your upper body 15 degrees backward.",
      "Step 4: Release at the peak of your jump with high arc over the outstretched defender."
    ],
    footworkGuide: "Front-to-back pivot step creates 3 feet of separation without requiring massive vertical jump.",
    proSecret: "The kick-out leg acts as a counterbalance to keep your head and eyes perfectly steady during the fade.",
    mistakesToAvoid: [
      "Fading too far backward before getting adequate upward vertical lift.",
      "Rushing the release before reaching your jump peak."
    ]
  },

  // ================= 3. FINISHING & FOOTWORK =================
  {
    id: "fn-mikan-drill",
    title: "Classic & Reverse Mikan Touch Drill",
    category: "finishing_footwork",
    level: "beginner",
    durationSec: 180,
    repsOrSets: "30 consecutive makes under rim",
    description: "The golden standard for paint touch: alternate left and right layups off the glass without letting the ball hit the floor.",
    coachingCues: [
      "Keep the basketball above your chin at all times.",
      "High knee drive on the jumping leg for vertical leverage.",
      "Target the top corner of the backboard inner box for soft kiss makes."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop",
    keyFocus: "Ambidextrous touch, rebound gathering, footwork timing",
    animationType: "mikan_drill",
    xpReward: 65,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Stand directly under the rim facing the baseline.",
      "Step 2: Step with your left foot, jump, and lay the ball softly off the right side of the backboard with your right hand.",
      "Step 3: Catch the ball out of the net with both hands above your head before it touches the ground.",
      "Step 4: Immediately step with your right foot, jump, and lay the ball off the left side with your left hand. Repeat."
    ],
    footworkGuide: "Drive the opposite knee upward as high as your waist to generate maximum elevation under the rim.",
    proSecret: "George Mikan practiced this daily to develop touch that was impossible to block without goaltending.",
    mistakesToAvoid: [
      "Bringing the ball down to your waist between reps (a turnover magnet against shot blockers).",
      "Letting the ball bounce on the floor."
    ]
  },
  {
    id: "fn-euro-step",
    title: "Manu Ginobili Euro Step Counter",
    category: "finishing_footwork",
    level: "intermediate",
    durationSec: 210,
    repsOrSets: "16 makes attacking from both wings",
    description: "Attack the paint, take a hard first step in one direction to bait the charge, then leap laterally across for a clean finish.",
    coachingCues: [
      "First step must be long and violent to convince the defender.",
      "Rip the ball high above reaching hands or low below hips.",
      "Extend outside hand for finger-roll finish around rim protector."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop, 2 Cones",
    keyFocus: "Lateral deceleration, ball security sweep, rim avoidance",
    animationType: "euro_step",
    xpReward: 90,
    intensity: "High",
    stepByStep: [
      "Step 1: Drive from the 3PT line toward the center cone in the key.",
      "Step 2: Pick up the dribble and take a hard, heavy first step to the right, loading your right leg.",
      "Step 3: Rip the ball across your chest while leaping diagonally to your left foot.",
      "Step 4: Extend your left arm for a soft finger-roll finish on the left side of the rim."
    ],
    footworkGuide: "First step is for baiting; second step is for maximum lateral separation across the key.",
    proSecret: "Keep your eyes locked on the first direction until your second foot lands to keep the defender committed to the wrong side.",
    mistakesToAvoid: [
      "Taking tiny steps that fail to create lateral separation.",
      "Dropping the ball into the defender's reaching hands during the step transition."
    ]
  },
  {
    id: "fn-floater-runner",
    title: "Teardrop Floater & Runner Package",
    category: "finishing_footwork",
    level: "advanced",
    durationSec: 240,
    repsOrSets: "20 makes from 8-12 feet",
    description: "Launch a high-arcing floater over 7-foot rim protectors from the short mid-range before contact occurs.",
    coachingCues: [
      "One-foot runner or two-foot jump stop balance.",
      "Release with soft, high arc—do not snap downward like a jumper.",
      "Let the ball float off your fingertips with zero guide hand tension."
    ],
    equipmentNeeded: "1 Basketball, 1 Hoop",
    keyFocus: "High arc touch, short-range deceleration, rim protection neutralizer",
    animationType: "floater_runner",
    xpReward: 85,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Drive toward the free throw line at 75% speed.",
      "Step 2: Gather off one foot or plant into a two-foot jump stop inside the paint.",
      "Step 3: Elevate and push the ball upward toward the ceiling with a soft, open palm release.",
      "Step 4: Ball should reach its apex 2 feet above rim height before softly dropping through the net."
    ],
    footworkGuide: "Absorb forward momentum on the plant step so your release travels straight up rather than flying into the defender.",
    proSecret: "Tony Parker mastered this shot to lead the NBA in paint points as a 6'2 guard.",
    mistakesToAvoid: [
      "Snapping your wrist hard like a jump shot, which sends floaters clanging off the back rim.",
      "Driving too deep into the rim protector before releasing."
    ]
  },

  // ================= 4. PASSING =================
  {
    id: "ps-chest-bounce",
    title: "Precision Chest & Bounce Pass Accuracy",
    category: "passing",
    level: "beginner",
    durationSec: 180,
    repsOrSets: "40 passes hitting wall/partner targets",
    description: "Deliver crisp, two-handed chest and bounce passes with thumbs pointing down on release for maximum velocity.",
    coachingCues: [
      "Step into every pass with your dominant lead foot.",
      "Snap wrists outward with thumbs pointing down.",
      "Bounce pass should hit the hardwood 2/3 of the distance to receiver."
    ],
    equipmentNeeded: "1 Basketball, Target Wall or Partner",
    keyFocus: "Wrist snap velocity, target accuracy, passing kinetic chain",
    animationType: "chest_bounce_pass",
    xpReward: 60,
    intensity: "Low",
    stepByStep: [
      "Step 1: Hold the basketball with both hands on the sides, thumbs pointing up, at chest level.",
      "Step 2: Step forward with your lead foot toward your target.",
      "Step 3: Extend your arms forcefully and snap your wrists outward so your thumbs point down.",
      "Step 4: For bounce passes, aim the ball 2/3 of the distance to the receiver so it rises comfortably to their waist."
    ],
    footworkGuide: "Alternate stepping with left and right foot to develop equal passing balance on both sides.",
    proSecret: "Passing velocity comes from the wrist snap, not swinging your arms back like a catapult.",
    mistakesToAvoid: [
      "Bouncing the ball too close to yourself or the receiver.",
      "Failing to step toward the target."
    ]
  },
  {
    id: "ps-jokic-overhead",
    title: "Nikola Jokic Vision Overhead Skip Pass",
    category: "passing",
    level: "advanced",
    durationSec: 220,
    repsOrSets: "20 cross-court zip passes to corner targets",
    description: "Hold the ball high above head in triple-threat, manipulate defensive eyes with head fake, and whip a bullet 2-hand skip pass across the zone.",
    coachingCues: [
      "Keep ball high above brow line to see over double teams.",
      "Deliver pass using triceps and wrist snap without winding up backwards.",
      "Target chest level of weak-side shooter."
    ],
    equipmentNeeded: "1 Basketball, Target Wall or Partner",
    keyFocus: "Zone exploitation, overhead leverage, no-look head manipulation",
    animationType: "jokic_overhead_pass",
    xpReward: 105,
    intensity: "Medium",
    stepByStep: [
      "Step 1: Secure the rebound or catch at the high post and raise the ball firmly above your head.",
      "Step 2: Turn your head and eyes toward the strong-side wing to freeze the weak-side zone defender.",
      "Step 3: Without bringing the ball backward, snap both wrists forward with triceps power.",
      "Step 4: Deliver a laser skip pass directly to the opposite corner shooter in their shooting pocket."
    ],
    footworkGuide: "Keep feet wide and anchored to resist physical contact from help defenders.",
    proSecret: "Never bring the ball behind your head on an overhead pass—it telegraphs the throw and allows strips from behind.",
    mistakesToAvoid: [
      "Winding up behind your neck.",
      "Staring directly at your pass target before throwing."
    ]
  },

  // ================= 5. PLYOMETRICS & CONDITIONING =================
  {
    id: "ply-suicide-sprints",
    title: "Full-Court Line Suicide Sprint Intervals",
    category: "plyometrics_conditioning",
    level: "advanced",
    durationSec: 300,
    repsOrSets: "4 rounds (FT line, Half-court, Far FT, Full-court)",
    description: "The ultimate basketball conditioning staple: sprint to each court marker, touch the line with your hand, and explode back.",
    coachingCues: [
      "Drop hips on turns—never round out your corners.",
      "Touch every line with your fingertips.",
      "Sprint through the baseline on the final stretch."
    ],
    equipmentNeeded: "Basketball Court or 30-yard open space",
    keyFocus: "Lactate threshold, change-of-direction acceleration, mental toughness",
    animationType: "suicide_sprints",
    xpReward: 110,
    intensity: "Pro",
    stepByStep: [
      "Step 1: Start on the baseline in a track sprint stance.",
      "Step 2: Sprint to the near free throw line, touch with right hand, sprint back to baseline, touch with left.",
      "Step 3: Sprint to half court, touch, sprint back to baseline.",
      "Step 4: Sprint to far free throw line, touch, back to baseline; then sprint full court and back."
    ],
    footworkGuide: "Use short, choppy deceleration steps 3 feet before each line to avoid slipping on the hardwood.",
    proSecret: "Breathe in through your nose and out through your mouth on the turns to prevent hyperventilation.",
    mistakesToAvoid: [
      "Rounding off lines instead of touching them.",
      "Standing up too high on turns."
    ]
  },
  {
    id: "ply-depth-drop",
    title: "Depth Drop Reactive Shock Jumps",
    category: "plyometrics_conditioning",
    level: "elite",
    durationSec: 200,
    repsOrSets: "4 sets x 6 maximum elevation reps",
    description: "Step off a 12-inch box, absorb ground contact instantly, and spring skyward with zero ground contact delay.",
    coachingCues: [
      "Step off the box—do NOT jump off it.",
      "Ground contact time must be under 0.2 seconds; rebound like a bouncy ball.",
      "Swing arms violently upward to assist vertical propulsion."
    ],
    equipmentNeeded: "12-18 inch sturdy box/bench",
    keyFocus: "Stretch-shortening cycle, tendon stiffness, peak vertical launch",
    animationType: "vertical_depth_drop",
    xpReward: 130,
    intensity: "Pro",
    stepByStep: [
      "Step 1: Stand on top of a 12-inch box or bench with toes at the edge.",
      "Step 2: Step forward off the box with one foot (do not jump upward).",
      "Step 3: The moment both feet hit the hardwood, land softly on balls of feet and instantly explode skyward.",
      "Step 4: Reach both hands toward the ceiling and land balanced in a deep landing squat."
    ],
    footworkGuide: "Land with feet hip-width apart and knees aligned with second toes; avoid knee valgus (knees caving in).",
    proSecret: "This exercise trains the Achilles tendon to store and release elastic energy for in-game dunking and shot-blocking.",
    mistakesToAvoid: [
      "Staying on the floor for longer than 0.2 seconds before jumping.",
      "Jumping off the box instead of stepping off."
    ]
  },

  // ================= 6. DEFENSE & IQ =================
  {
    id: "def-lateral-slide",
    title: "Zig-Zag Defensive Slide & Wall Contest",
    category: "defense_iq",
    level: "intermediate",
    durationSec: 240,
    repsOrSets: "5 full-court zig-zag reps",
    description: "Slide diagonally baseline-to-baseline in a low stance, beat the ball-handler to the spot, and contest without fouling.",
    coachingCues: [
      "Push off your back foot—never cross your feet.",
      "Keep hands active: one hand tracing the ball, one hand in passing lane.",
      "Chest up and take contact with your core."
    ],
    equipmentNeeded: "6 Cones or Floor Markers",
    keyFocus: "Lateral slide speed, hip mobility, foul-free contest discipline",
    animationType: "lateral_slide_contest",
    xpReward: 90,
    intensity: "High",
    stepByStep: [
      "Step 1: Set up 6 cones in a zig-zag pattern 15 feet apart along the sideline.",
      "Step 2: Drop into a low defensive stance, lead hand high, trail hand low.",
      "Step 3: Push off your trail foot to slide aggressively to the first cone; plant your lead foot to stop.",
      "Step 4: Drop-step 45 degrees, flip your hips, and slide to the next cone. Sprint back on the final straightaway."
    ],
    footworkGuide: "Slide foot-to-foot, maintaining at least 2 feet of space between your shoes at all times.",
    proSecret: "Lead with your hips and feet, not your hands; if your feet are in position, the offensive player cannot blow by.",
    mistakesToAvoid: [
      "Crossing your feet (causes instant loss of balance).",
      "Reaching in with your hands while your feet are flat."
    ]
  },
  {
    id: "def-closeout-choppy",
    title: "Choppy Footwork Sprint Closeout & Wall",
    category: "defense_iq",
    level: "intermediate",
    durationSec: 220,
    repsOrSets: "12 closeout reps from paint to arc",
    description: "Sprint out to contest perimeter shooter: sprint first 2/3 of distance, then stutter with choppy feet and high lead hand to prevent blow-bys.",
    coachingCues: [
      "Sprint with 100% urgency from key to 3PT line.",
      "Last 4 feet: lower center of gravity with rapid, loud choppy steps.",
      "One hand high to contest shot, one hand low to deter crossover drive."
    ],
    equipmentNeeded: "3 Cones or Floor Markers",
    keyFocus: "Deceleration balance, high hand contest, drive containment",
    animationType: "closeout_choppy_feet",
    xpReward: 90,
    intensity: "High",
    stepByStep: [
      "Step 1: Start inside the charge circle in the paint in help defense stance.",
      "Step 2: On the pass call, sprint full speed for the first 10 feet toward the perimeter shooter.",
      "Step 3: 4 feet before reaching the shooter, sink your hips and take 4-6 rapid, loud choppy stutter steps.",
      "Step 4: Contest with your lead hand high above the shooter's eyes while keeping your base balanced to slide."
    ],
    footworkGuide: "Choppy steps transfer linear sprint energy into rotational braking, allowing you to stop on a dime without flying by.",
    proSecret: "Yell 'SHOT!' or 'BALL!' on your closeout—verbal pressure drops shooter conversion rates by up to 12%.",
    mistakesToAvoid: [
      "Flying out of control and jumping to block the shot, which gives up easy drives.",
      "Closing out with both hands down."
    ]
  }
];

// ================= CURATED WORKOUT ROUTINES =================
export const CURATED_ROUTINES: WorkoutRoutine[] = [
  {
    id: "routine-rookie-kickstart",
    title: "Rookie Fundamental Kickstart",
    description: "Master the 3 non-negotiable fundamentals: ball-handling pocket control, one-hand sweetspot shooting form, and Mikan touch around the rim.",
    level: "beginner",
    totalDurationMin: 12,
    totalXp: 250,
    category: "all_around",
    drills: [
      ALL_DRILLS[0], // Pound & Pocket
      ALL_DRILLS[1], // In-and-Out Cross
      ALL_DRILLS[8], // Form Shooting
      ALL_DRILLS[13], // Mikan Drill
    ],
    isCurated: true,
    tags: ["Beginner", "Full Fundamentals", "12 Mins"],
    targetSkill: "All-Around Foundations"
  },
  {
    id: "routine-kyrie-shift",
    title: "Kyrie Shift: Elite Ball Control Matrix",
    description: "Intense handle burnout targeting multi-angle crossovers, deception hesitations, and the God Shammgod snatch.",
    level: "advanced",
    totalDurationMin: 16,
    totalXp: 380,
    category: "ball_handling",
    drills: [
      ALL_DRILLS[2], // 2-Ball Alternate
      ALL_DRILLS[5], // Kyrie Hezy
      ALL_DRILLS[6], // Behind Back Wrap
      ALL_DRILLS[7], // God Shammgod
    ],
    isCurated: true,
    tags: ["Elite Handles", "Ankle Breaker", "16 Mins"],
    targetSkill: "Ball Handling & Shiftiness"
  },
  {
    id: "routine-curry-sniper",
    title: "Curry Arc Sniper: 3PT Relocation Circuit",
    description: "Condition your motor memory to hit perimeter 3-pointers while sprinting off baseline screens at game speed.",
    level: "advanced",
    totalDurationMin: 18,
    totalXp: 420,
    category: "shooting",
    drills: [
      ALL_DRILLS[8], // Form Shooting
      ALL_DRILLS[9], // Catch & Shoot
      ALL_DRILLS[10], // 5-Spot 3s
      ALL_DRILLS[11], // Curry Relocation
    ],
    isCurated: true,
    tags: ["Perimeter Sniper", "Conditioned Shooting", "18 Mins"],
    targetSkill: "High-Speed Shooting"
  },
  {
    id: "routine-lockdown-anchor",
    title: "Lockdown Defender & Vertical Launch",
    description: "Build lateral sliding endurance, lightning deceleration closeouts, and explosive vertical depth jumps.",
    level: "advanced",
    totalDurationMin: 16,
    totalXp: 390,
    category: "defense_iq",
    drills: [
      ALL_DRILLS[18], // Zig-Zag Defense
      ALL_DRILLS[19], // Choppy Closeout
      ALL_DRILLS[16], // Suicides
      ALL_DRILLS[17], // Depth Drops
    ],
    isCurated: true,
    tags: ["On-Ball Defense", "Vertical Boost", "16 Mins"],
    targetSkill: "Defense & Athleticism"
  }
];

// ================= EXPANDED BASKETBALL MILESTONES =================
export const INITIAL_MILESTONES: MilestoneBadge[] = [
  { id: "m-first-workout", title: "First Swish", description: "Complete your first basketball practice routine", requirementText: "1 workout completed", iconName: "Zap", isUnlocked: false, category: "drills" },
  { id: "m-streak-3", title: "Gym Rat Streak", description: "Maintain a 3-day continuous workout streak", requirementText: "3 consecutive days", iconName: "Flame", isUnlocked: false, category: "streak" },
  { id: "m-streak-7", title: "Iron Dedication", description: "Complete 7 days of training in a row", requirementText: "7 consecutive days", iconName: "Flame", isUnlocked: false, category: "streak" },
  { id: "m-streak-14", title: "Unstoppable Force", description: "Maintain a 14-day continuous court streak", requirementText: "14 consecutive days", iconName: "Flame", isUnlocked: false, category: "streak" },
  { id: "m-1000-xp", title: "1,000 XP Club", description: "Earn your first 1,000 XP through dedicated court sessions", requirementText: "1,000 Total XP", iconName: "Trophy", isUnlocked: false, category: "xp" },
  { id: "m-5000-xp", title: "5,000 XP Elite", description: "Cross the 5,000 XP threshold into Diamond territory", requirementText: "5,000 Total XP", iconName: "Trophy", isUnlocked: false, category: "xp" },
  { id: "m-handles-master", title: "Ankle Breaker Initiate", description: "Complete 10 ball-handling workout sessions", requirementText: "10 Handles Drills", iconName: "Sparkles", isUnlocked: false, category: "mastery" },
  { id: "m-sniper-club", title: "Dead-Eye Sniper", description: "Complete 10 shooting workout clinics", requirementText: "10 Shooting Drills", iconName: "Target", isUnlocked: false, category: "mastery" },
  { id: "m-finisher-pro", title: "Paint Dominator", description: "Complete 10 finishing & footwork sessions", requirementText: "10 Finishing Drills", iconName: "Shield", isUnlocked: false, category: "mastery" },
  { id: "m-lockdown-wall", title: "Lockdown Anchor", description: "Complete 10 defense & conditioning sessions", requirementText: "10 Defense Drills", iconName: "ShieldCheck", isUnlocked: false, category: "mastery" },
  { id: "m-century-minutes", title: "Century Minutes", description: "Log over 100 minutes of active on-court practice", requirementText: "100 Minutes Trained", iconName: "Clock", isUnlocked: false, category: "drills" },
  { id: "m-500-minutes", title: "500-Minute Iron Hooper", description: "Log 500 total minutes of disciplined workouts", requirementText: "500 Minutes Trained", iconName: "Clock", isUnlocked: false, category: "drills" },
  { id: "m-rank-silver", title: "Silver Breakthrough", description: "Advance your player rank to Silver tier", requirementText: "Reach Silver Rank", iconName: "Award", isUnlocked: false, category: "xp" },
  { id: "m-rank-gold", title: "Gold Standard", description: "Advance your player rank to Gold tier", requirementText: "Reach Gold Rank", iconName: "Award", isUnlocked: false, category: "xp" },
  { id: "m-rank-platinum", title: "Platinum Prodigy", description: "Advance your player rank to Platinum tier", requirementText: "Reach Platinum Rank", iconName: "Award", isUnlocked: false, category: "xp" },
  { id: "m-friend-connected", title: "Squad Link", description: "Add your first friend using their unique Friend Code", requirementText: "Connect with 1 friend", iconName: "Users", isUnlocked: false, category: "social" },
];
