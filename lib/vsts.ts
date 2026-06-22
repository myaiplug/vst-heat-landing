export interface VST {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  category: string;
  problem: string;
  howItWorks: string;
  deepUse: string;
  specs: string[];
  color: string;
}

export const vsts: VST[] = [
  {
    slug: "eq-forge",
    name: "bZ EQ Forge",
    tagline: "Precision Parametric EQ with Chromatic Response",
    price: "$49",
    category: "EQ & Tone Shaping",
    problem: "Dense trap and hip-hop beats often turn into muddy, masked chaos where kicks swallow 808s, snares lose crack, and vocals sit on top instead of cutting through. Standard EQs force you to fight the mix with static bands that don't respond musically to the groove.",
    howItWorks: "EQ Forge uses a 12-band parametric engine with proprietary 'Chromatic Response Curves' — each band doesn't just boost/cut, it intelligently shapes Q and response based on surrounding frequencies and detected musical key. Real-time FFT spectrum HUD shows you exactly where energy lives with neon-mapped visuals (magenta for vocal fundamentals, cyan for transient bite). Zero-latency mode for tracking, plus 'Forge Link' mode that intelligently ducks competing bands while preserving punch and air. Anti-gravity visualizer lets bands 'float' with musical gravity simulation for intuitive mixing.",
    deepUse: "Load on your master bus and engage Auto-Sculpt for instant clarity on a crowded beat. Use the 3-band 'Punch' preset to make 808s and kicks coexist without sidechaining everything. For vocals, dial in the 'Air Forge' band — it adds presence without sibilance by dynamically taming harsh harmonics. In solo page demos you can play with live sliders and hear immediate spectrum shift on generated tones representing a trap loop.",
    specs: [
      "12-band parametric EQ",
      "Real-time 2048-point FFT spectrum with HUD overlay",
      "Chromatic Response & key detection",
      "Forge Link intelligent band interaction",
      "Zero-latency tracking mode",
      "VST3 / AU / AAX • Apple Silicon native",
      "Low CPU: <3% on M1 for 12 bands"
    ],
    color: "#00F0FF"
  },
  {
    slug: "saturation-core",
    name: "bZ Saturation Core",
    tagline: "Multi-Stage Harmonic Saturation & Drive Engine",
    price: "$49",
    category: "Distortion & Color",
    problem: "Modern digital productions sound sterile and lifeless. Drums lack body, basses have no growl, and the entire mix feels like it was made in a vacuum. You reach for saturation but most plugins either destroy transients or add harsh, unmusical distortion that fights your mix.",
    howItWorks: "Saturation Core runs four parallel stages: Tube (even harmonics, warm compression), Tape (odd + even with flutter & wow simulation), Transformer (iron saturation + low-end glue), and Bit (musical bit-depth reduction with dither). Each stage has dynamic envelope followers so saturation reacts to the groove — transients stay sharp while sustained notes bloom with harmonics. The 'Core Link' system lets stages interact: push tube into tape for that perfect 90s R&B warmth or modern trap edge. Visual 'Heat Meter' shows harmonic content in real time with chromatic glow intensity.",
    deepUse: "Slap it on individual 808s for instant analog weight and movement. Use mild Tape + Transformer on the drum bus to glue the kit without killing punch. For melodic loops, automate the Bit stage for evolving lo-fi character that still hits hard. The interactive demo lets you blend stages live and hear the harmonic build-up on a generated bass + drum loop.",
    specs: [
      "4-stage parallel saturation architecture",
      "Dynamic envelope-driven harmonic generation",
      "Tube • Tape • Transformer • Bit engines",
      "Core Link inter-stage modulation",
      "Real-time Heat Meter harmonic visualizer",
      "VST3 / AU / AAX • Apple Silicon native",
      "Ultra low CPU even at extreme settings"
    ],
    color: "#FF00AA"
  },
  {
    slug: "pitch-helix",
    name: "bZ Pitch Helix",
    tagline: "Formant-Safe Pitch Shifter & Time Domain Sculptor",
    price: "$49",
    category: "Pitch & Time",
    problem: "Pitch shifting vocals or instruments in trap/hip-hop often sounds robotic or destroys the emotional character. Formants shift unnaturally, timing feels mechanical, and you lose the human feel that makes a performance special. Chopping and pitching 808s or samples feels like a compromise.",
    howItWorks: "Pitch Helix uses advanced spectral processing with real-time formant preservation and 'Helix' time-domain morphing. Instead of simple granular or FFT shift, it analyzes the source's resonant structure and keeps formants locked while pitch moves — vocals stay natural even at ±12 semitones. The Helix engine adds musical time-stretching with groove-sync that locks to your DAW tempo and can add subtle swing or humanize. Visual 'Helix Path' shows pitch trajectory in 3D space with anti-gravity particle trails.",
    deepUse: "Create perfect melodic 808 slides that retain low-end weight. Pitch vocal chops up an octave while keeping chest/body intact for that signature chopped & screwed modern feel. Use the 'Glide Helix' mode for portamento leads that sing. The solo demo includes a vocal phrase and bass you can pitch in real time with formant lock toggle.",
    specs: [
      "Real-time formant-preserving pitch engine",
      "Helix time-domain morphing with groove lock",
      "±24 semitone range with musical curve options",
      "3D Helix Path visual trajectory",
      "Humanize & swing timing controls",
      "VST3 / AU / AAX • Apple Silicon native",
      "Phase-coherent for stereo sources"
    ],
    color: "#FFD700"
  },
  {
    slug: "degloss-verb",
    name: "bZ DeGloss Verb",
    tagline: "Cinematic Reverb with Intelligent De-Harsh Tail Processing",
    price: "$49",
    category: "Space & Atmosphere",
    problem: "Most reverbs either wash everything into a muddy cloud or add piercing, sibilant tails that cut through and fatigue listeners. You spend hours EQing reverb returns only to have them still feel disconnected from the dry signal. Great space should feel expensive and intentional, not like an afterthought.",
    howItWorks: "DeGloss Verb combines premium convolution + algorithmic engines with a unique 'DeGloss' processor that continuously analyzes and tames harsh frequencies in the decaying tail in real time — without dulling the body or high-end sparkle. Pre-delay and modulation are BPM-synced. The 'Liminal Space' algorithm creates those in-between, haunting yet clear atmospheres perfect for modern trap & cinematic beats. Visual 'Tail Spectrum' shows you exactly what the reverb is doing to your highs in real time.",
    deepUse: "Send your snare to a short DeGloss plate for crack that blooms without harshness. Use long Liminal halls on pads and vocals for depth that doesn't clutter the low end. Automate the DeGloss amount on risers for smooth, professional builds. The interactive demo lets you trigger a snare or pad and watch the tail spectrum clean itself live.",
    specs: [
      "Hybrid convolution + algorithmic core",
      "Real-time DeGloss harsh-frequency suppression",
      "BPM-synced pre-delay, modulation & decay",
      "Liminal Space, Hall, Plate, Room & Shimmer modes",
      "Live Tail Spectrum visualizer",
      "VST3 / AU / AAX • Apple Silicon native",
      "True stereo & mid/side processing"
    ],
    color: "#00F0FF"
  }
];

export const freeTools = [
  {
    name: "TrimIt",
    desc: "Instant trim, fade & silence removal. Drag & drop audio → clean file in seconds. No DAW needed.",
    type: "Download .bat (Windows)",
    color: "#00F0FF"
  },
  {
    name: "FxIT",
    desc: "Apply your favorite FX chain instantly. Chain saturation, EQ, compression with one drop.",
    type: "Download .bat (Windows)",
    color: "#FF00AA"
  },
  {
    name: "ConvertIT",
    desc: "Lightning fast batch format converter. WAV ↔ MP3 ↔ FLAC with metadata preserved.",
    type: "Download .bat (Windows)",
    color: "#FFD700"
  },
  {
    name: "SplitIt",
    desc: "Quick stem separation preview. Drag stems out for quick arrangement or reference.",
    type: "Web Demo + Download",
    color: "#00F0FF"
  },
  {
    name: "ScrewIt",
    desc: "Classic chopped & screwed pitch/time effect. Instant lo-fi movement on any loop or vocal.",
    type: "Download .bat (Windows)",
    color: "#FF00AA"
  },
  {
    name: "PromptIT",
    desc: "Generate perfect prompts for AI music tools or cover art concepts. Built for producers.",
    type: "Web Tool",
    color: "#FFD700"
  }
];