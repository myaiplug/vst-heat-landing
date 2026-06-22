'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import * as Tone from 'tone';
import { vsts } from '@/lib/vsts';
import { toast } from 'sonner';

export default function SoloVSTPage() {
  const params = useParams<{ slug: string }>();
  const vst = vsts.find(v => v.slug === params.slug);

  if (!vst) {
    notFound();
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [demoParams, setDemoParams] = useState({
    drive: 0.4,
    cutoff: 1200,
    resonance: 0.6,
    pitch: 0,
    reverb: 0.35,
  });

  let synth: Tone.Synth | null = null;
  let filter: Tone.Filter | null = null;
  let reverb: Tone.Reverb | null = null;
  let distortion: Tone.Distortion | null = null;

  const initAudio = async () => {
    await Tone.start();
    if (!synth) {
      synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.6, release: 0.8 }
      }).toDestination();

      filter = new Tone.Filter({
        type: 'lowpass',
        frequency: demoParams.cutoff,
        Q: demoParams.resonance * 8
      });

      distortion = new Tone.Distortion(demoParams.drive * 1.5);
      reverb = new Tone.Reverb({ decay: 2.8, wet: demoParams.reverb });

      synth.chain(distortion, filter, reverb, Tone.Destination);
    }
  };

  const toggleDemo = async () => {
    if (!synth) await initAudio();

    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      if (synth) {
        const seq = new Tone.Sequence((time, note) => {
          synth!.triggerAttackRelease(note, "8n", time);
        }, ["C2", "G2", "C3", "Eb3", "G2", "C2"], "8n").start(0);

        Tone.Transport.bpm.value = 142;
        Tone.Transport.start();
        setIsPlaying(true);

        setTimeout(() => {
          if (isPlaying) {
            Tone.Transport.stop();
            seq.dispose();
            setIsPlaying(false);
          }
        }, 12000);
      }
    }
  };

  const updateDemoParam = (key: keyof typeof demoParams, value: number) => {
    const newParams = { ...demoParams, [key]: value };
    setDemoParams(newParams);

    if (filter && distortion && reverb) {
      if (key === 'cutoff') filter.frequency.value = value;
      if (key === 'resonance') filter.Q.value = value * 8;
      if (key === 'drive') distortion.distortion = value * 1.8;
      if (key === 'reverb') reverb.wet.value = value;
      if (key === 'pitch' && synth) {
        synth.detune.value = value * 50;
      }
    }
  };

  const resetDemo = () => {
    setDemoParams({ drive: 0.4, cutoff: 1200, resonance: 0.6, pitch: 0, reverb: 0.35 });
    if (filter && distortion && reverb && synth) {
      filter.frequency.value = 1200;
      filter.Q.value = 4.8;
      distortion.distortion = 0.72;
      reverb.wet.value = 0.35;
      synth.detune.value = 0;
    }
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    }
  };

  return (
    <main className="pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" /> BACK TO HEAT
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="uppercase tracking-[4px] text-xs mb-3" style={{ color: vst.color }}>{vst.category}</div>
            <h1 className="text-6xl md:text-7xl tracking-[-4px] font-semibold leading-none">{vst.name}</h1>
            <p className="mt-4 text-2xl text-text-muted tracking-[-1px]">{vst.tagline}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">ONE TIME • LIFETIME UPDATES</div>
            <div className="text-5xl font-semibold tabular-nums mt-1" style={{ color: vst.color }}>{vst.price}</div>
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
                <span className="uppercase tracking-[3px] text-xs text-cyan">LIVE INTERACTIVE DEMO</span>
              </div>
              <h3 className="text-3xl tracking-[-1.5px] font-semibold mt-1">Feel the {vst.name.split(' ').slice(1).join(' ')} in real time</h3>
            </div>
            <button 
              onClick={resetDemo}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/20 hover:bg-white/5"
            >
              <RotateCcw size={14} /> RESET
            </button>
          </div>

          <div className="interactive-demo rounded-3xl p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex justify-between text-xs mb-3 text-text-muted">
                    <span>DRIVE / SATURATION</span>
                    <span className="tabular-nums">{Math.round(demoParams.drive * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={demoParams.drive}
                    onChange={(e) => updateDemoParam('drive', parseFloat(e.target.value))}
                    className="slider w-full accent-cyan" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-3 text-text-muted">
                    <span>CUTOFF / AIR</span>
                    <span className="tabular-nums">{Math.round(demoParams.cutoff)} Hz</span>
                  </div>
                  <input 
                    type="range" min="200" max="8000" step="10" 
                    value={demoParams.cutoff}
                    onChange={(e) => updateDemoParam('cutoff', parseFloat(e.target.value))}
                    className="slider w-full accent-cyan" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-3 text-text-muted">
                    <span>RESONANCE / CHARACTER</span>
                    <span className="tabular-nums">{demoParams.resonance.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={demoParams.resonance}
                    onChange={(e) => updateDemoParam('resonance', parseFloat(e.target.value))}
                    className="slider w-full accent-cyan" 
                  />
                </div>

                {vst.slug.includes('pitch') && (
                  <div>
                    <div className="flex justify-between text-xs mb-3 text-text-muted">
                      <span>PITCH SHIFT (SEMITONES)</span>
                      <span className="tabular-nums">{demoParams.pitch}</span>
                    </div>
                    <input 
                      type="range" min="-12" max="12" step="1" 
                      value={demoParams.pitch}
                      onChange={(e) => updateDemoParam('pitch', parseFloat(e.target.value))}
                      className="slider w-full accent-gold" 
                    />
                  </div>
                )}

                {vst.slug.includes('verb') && (
                  <div>
                    <div className="flex justify-between text-xs mb-3 text-text-muted">
                      <span>REVERB WET / SPACE</span>
                      <span className="tabular-nums">{Math.round(demoParams.reverb * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="0.9" step="0.01" 
                      value={demoParams.reverb}
                      onChange={(e) => updateDemoParam('reverb', parseFloat(e.target.value))}
                      className="slider w-full accent-cyan" 
                    />
                  </div>
                )}
              </div>

              <div className="lg:w-80 flex flex-col items-center justify-center border-l border-white/10 pl-8">
                <button 
                  onClick={toggleDemo}
                  className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6 active:scale-95 transition border-cyan hover:bg-cyan/10"
                  style={{ borderColor: vst.color }}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-0.5" />}
                </button>

                <div className="text-center">
                  <div className="text-xs tracking-widest text-text-muted mb-1">TRAP 142 BPM DEMO LOOP</div>
                  <div className="text-sm">Hear how the processing affects a generated beat + bass line in real time.</div>
                </div>

                <div className="mt-auto pt-8 text-[10px] text-center text-text-muted max-w-[220px]">
                  This demo approximates the core sonic signature of {vst.name}. 
                  The real plugin has far more depth, visual feedback, and musical intelligence.
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-text-muted mt-3">Web Audio API demo • Best experienced with headphones</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16 space-y-16">
        <div>
          <div className="uppercase tracking-[3px] text-xs text-magenta mb-3">THE PROBLEM</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">Why producers reach for {vst.name}</h2>
          <div className="prose prose-invert max-w-none text-lg text-text-muted leading-relaxed">
            {vst.problem}
          </div>
        </div>

        <div className="glass rounded-3xl p-10 border border-white/10">
          <div className="uppercase tracking-[3px] text-xs text-cyan mb-3">THE TECHNOLOGY</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">How {vst.name} actually works</h2>
          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-text-muted">
            {vst.howItWorks}
          </div>
        </div>

        <div>
          <div className="uppercase tracking-[3px] text-xs text-gold mb-3">IN THE STUDIO</div>
          <h2 className="text-4xl tracking-[-2px] font-semibold mb-6">Real workflows that deliver heat</h2>
          <div className="prose prose-invert max-w-none text-lg text-text-muted leading-relaxed">
            {vst.deepUse}
          </div>
        </div>

        <div className="border border-white/10 rounded-3xl p-10">
          <div className="uppercase tracking-[3px] text-xs text-text-muted mb-6">TECHNICAL SPECIFICATIONS</div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
            {vst.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: vst.color }} />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-10 border-t border-white/10">
          <p className="text-text-muted mb-6">Ready to put this in your mixes?</p>
          <button 
            onClick={() => toast.success(`Thank you!`, { description: `In production this would open Stripe checkout or Gumroad for ${vst.name}. Contact bZ for early access.` })}
            className="btn-premium px-14 h-14 rounded-2xl bg-white text-[#0A0A0F] font-semibold text-base inline-flex items-center gap-3 active:scale-[0.985]"
          >
            GET {vst.name.toUpperCase()} — {vst.price} <Zap size={18} />
          </button>
          <div className="mt-4 text-xs text-text-muted">30-day no-questions refund • Lifetime free updates • Works in all major DAWs</div>
        </div>
      </div>
    </main>
  );
}