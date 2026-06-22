'use client';

import React, { useState, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Award } from 'lucide-react';
import * as Tone from 'tone';
import { vsts } from '@/lib/vsts';
import { toast } from 'sonner';

export default function SoloVSTPage() {
  const params = useParams<{ slug: string }>();
  const vst = vsts.find(v => v.slug === params.slug);
  if (!vst) notFound();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState('default');
  const [demoParams, setDemoParams] = useState({ drive: 0.45, cutoff: 1350, resonance: 0.65, pitch: 0, reverb: 0.32 });

  const synthRef = useRef<any>(null);
  const filterRef = useRef<any>(null);
  const distortionRef = useRef<any>(null);
  const reverbRef = useRef<any>(null);
  const seqRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const presets: Record<string, any> = {
    default: { drive: 0.45, cutoff: 1350, resonance: 0.65, pitch: 0, reverb: 0.32 },
    trapPunch: { drive: 0.72, cutoff: 980, resonance: 0.8, pitch: -2, reverb: 0.18 },
    vocalAir: { drive: 0.28, cutoff: 4200, resonance: 0.45, pitch: 3, reverb: 0.48 },
    loFiScrew: { drive: 0.85, cutoff: 680, resonance: 0.9, pitch: -7, reverb: 0.55 },
  };

  const applyPreset = (presetName: string) => {
    const preset = presets[presetName];
    setActivePreset(presetName);
    setDemoParams(preset);
    if (filterRef.current && distortionRef.current && reverbRef.current) {
      filterRef.current.frequency.value = preset.cutoff;
      filterRef.current.Q.value = preset.resonance * 8;
      distortionRef.current.distortion = preset.drive * 1.8;
      reverbRef.current.wet.value = preset.reverb;
      if (synthRef.current) synthRef.current.detune.value = preset.pitch * 50;
    }
  };

  const initAudio = async () => {
    await Tone.start();
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.004, decay: 0.12, sustain: 0.55, release: 0.9 } });
      filterRef.current = new Tone.Filter({ type: 'lowpass', frequency: demoParams.cutoff, Q: demoParams.resonance * 8 });
      distortionRef.current = new Tone.Distortion(demoParams.drive * 1.8);
      reverbRef.current = new Tone.Reverb({ decay: 3.2, wet: demoParams.reverb });
      synthRef.current.chain(distortionRef.current, filterRef.current, reverbRef.current, Tone.Destination);
    }
  };

  const drawSpectrum = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.2;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
      ctx.fillStyle = `hsla(${190 + (i / bufferLength) * 40}, 100%, 65%, 0.85)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  const toggleDemo = async () => {
    if (!synthRef.current) await initAudio();
    if (isPlaying) {
      Tone.Transport.stop();
      if (seqRef.current) { seqRef.current.dispose(); seqRef.current = null; }
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      const analyser = Tone.context.createAnalyser();
      analyser.fftSize = 64;
      reverbRef.current?.connect(analyser);
      const seq = new Tone.Sequence((time, note) => {
        synthRef.current?.triggerAttackRelease(note, "8n", time);
      }, ["C2", "G2", "C3", "Eb3", "G2", "C2"], "8n").start(0);
      seqRef.current = seq;
      Tone.Transport.bpm.value = 142;
      Tone.Transport.start();
      setIsPlaying(true);
      const animate = () => { drawSpectrum(analyser); animationRef.current = requestAnimationFrame(animate); };
      animate();
      setTimeout(() => {
        if (isPlaying) {
          Tone.Transport.stop();
          seq.dispose();
          setIsPlaying(false);
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
      }, 14000);
    }
  };

  const updateParam = (key: keyof typeof demoParams, value: number) => {
    const newParams = { ...demoParams, [key]: value };
    setDemoParams(newParams);
    setActivePreset('default');
    if (filterRef.current && distortionRef.current && reverbRef.current) {
      if (key === 'cutoff') filterRef.current.frequency.value = value;
      if (key === 'resonance') filterRef.current.Q.value = value * 8;
      if (key === 'drive') distortionRef.current.distortion = value * 1.8;
      if (key === 'reverb') reverbRef.current.wet.value = value;
      if (key === 'pitch' && synthRef.current) synthRef.current.detune.value = value * 50;
    }
  };

  const resetDemo = () => {
    applyPreset('default');
    if (isPlaying) { Tone.Transport.stop(); setIsPlaying(false); }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <main className="pt-20 pb-24 bg-[#0A0A0F]">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" /> BACK TO HEAT
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="uppercase tracking-[4px] text-xs mb-3" style={{ color: vst.color }}>{vst.category}</div>
            <h1 className="text-6xl md:text-7xl tracking-[-4.2px] font-semibold leading-none">{vst.name}</h1>
            <p className="mt-4 text-2xl text-text-muted tracking-[-1px]">{vst.tagline}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">ONE TIME • LIFETIME UPDATES</div>
            <div className="text-6xl font-semibold tabular-nums mt-1" style={{ color: vst.color }}>{vst.price}</div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEMO */}
      <div className="bg-[#111114] border-y border-white/10 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Zap className="text-cyan" />
                <span className="uppercase tracking-[3px] text-xs text-cyan">LIVE INTERACTIVE DEMO — REAL AUDIO ENGINE</span>
              </div>
              <h3 className="text-3xl tracking-[-1.5px] font-semibold mt-1">Hear exactly what this plugin does</h3>
            </div>
            <button onClick={resetDemo} className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/20 hover:bg-white/5">
              <RotateCcw size={14} /> RESET TO DEFAULT
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(presets).map((key) => (
              <button key={key} onClick={() => applyPreset(key)} className={`px-5 py-1.5 text-xs rounded-full border transition-all ${activePreset === key ? 'bg-white text-[#0A0A0F] border-white' : 'border-white/20 hover:border-white/50'}`}>
                {key === 'default' ? 'DEFAULT' : key.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="interactive-demo rounded-3xl p-8 md:p-10 border border-white/10">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-7">
                {[
                  { label: "DRIVE / SATURATION", key: "drive" as const, min: 0, max: 1, step: 0.01, unit: "%" },
                  { label: "CUTOFF / AIR", key: "cutoff" as const, min: 200, max: 8000, step: 10, unit: "Hz" },
                  { label: "RESONANCE / CHARACTER", key: "resonance" as const, min: 0, max: 1, step: 0.01 },
                  ...(vst.slug.includes('pitch') ? [{ label: "PITCH SHIFT", key: "pitch" as const, min: -12, max: 12, step: 1, unit: "st" }] : []),
                  ...(vst.slug.includes('verb') ? [{ label: "REVERB WET", key: "reverb" as const, min: 0, max: 0.85, step: 0.01 }] : []),
                ].map(({ label, key, min, max, step, unit }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-2.5 text-text-muted">
                      <span>{label}</span>
                      <span className="tabular-nums font-mono">
                        {key === 'cutoff' ? Math.round(demoParams[key]) : (demoParams[key] * (key === 'drive' || key === 'reverb' ? 100 : 1)).toFixed(key === 'drive' || key === 'reverb' ? 0 : 2)}{unit || ''}
                      </span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={demoParams[key]} onChange={(e) => updateParam(key, parseFloat(e.target.value))} className="slider w-full accent-cyan" />
                  </div>
                ))}
              </div>

              <div className="lg:w-96 flex flex-col items-center justify-center border-l border-white/10 pl-8">
                <button onClick={toggleDemo} className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-6 active:scale-95 transition-all" style={{ borderColor: vst.color }}>
                  {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                </button>
                <canvas ref={canvasRef} width={320} height={110} className="rounded-xl bg-black/40 mb-4" />
                <div className="text-center text-xs text-text-muted max-w-[260px]">Real-time spectrum visualizer. This is the actual signal path running in your browser.</div>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-text-muted mt-3 tracking-widest">TRAP 142 BPM • WEB AUDIO API • BEST WITH HEADPHONES</p>
        </div>
      </div>

      {/* DEEP CONTENT */}
      <div className="max-w-5xl mx-auto px-6 pt-16 space-y-16">
        <div>
          <div className="uppercase tracking-[3px] text-xs text-magenta mb-3">THE PROBLEM</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">Why producers reach for {vst.name}</h2>
          <div className="prose prose-invert max-w-none text-lg text-text-muted leading-relaxed">{vst.problem}</div>
        </div>

        <div className="glass rounded-3xl p-10 border border-white/10">
          <div className="uppercase tracking-[3px] text-xs text-cyan mb-3">THE TECHNOLOGY</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">How {vst.name} actually works</h2>
          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-text-muted">{vst.howItWorks}</div>
        </div>

        <div>
          <div className="uppercase tracking-[3px] text-xs text-gold mb-3">IN THE STUDIO</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">Real workflows that deliver heat</h2>
          <div className="prose prose-invert max-w-none text-lg text-text-muted leading-relaxed">{vst.deepUse}</div>
        </div>

        <div className="border border-white/10 rounded-3xl p-10">
          <div className="uppercase tracking-[3px] text-xs text-text-muted mb-6">TECHNICAL SPECIFICATIONS</div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
            {vst.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: vst.color }} />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-10 border-t border-white/10">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 text-xs">
              <Award className="w-3.5 h-3.5" /> BATTLE-TESTED BY PRODUCERS IN LOUISVILLE &amp; BEYOND
            </div>
          </div>
          <p className="text-text-muted mb-6">Ready to stop fighting your mixes?</p>
          <button onClick={() => toast.success(`Thank you!`, { description: `In a real deployment this opens Stripe or Gumroad checkout for ${vst.name}.` })} className="btn-premium px-16 h-14 rounded-2xl bg-white text-[#0A0A0F] font-semibold text-base inline-flex items-center gap-3 active:scale-[0.985]">
            GET {vst.name.toUpperCase()} — {vst.price} <Zap size={18} />
          </button>
          <div className="mt-4 text-xs text-text-muted">30-day no questions refund • Works in every major DAW</div>
        </div>
      </div>
    </main>
  );
}