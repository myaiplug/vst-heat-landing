'use client';

import React from 'react';

interface Settings {
  speed: number;
  pitch: number;
  effect: string;
  colorGrade: string;
  intensity: number;
}

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function EffectControls({ settings, onChange }: Props) {
  const update = (key: keyof Settings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6 mt-8">
      <div>
        <label className="text-sm text-white/60">SPEED</label>
        <input type="range" min="0.5" max="1.0" step="0.01" value={settings.speed} onChange={(e) => update('speed', parseFloat(e.target.value))} className="w-full accent-[var(--neon-cyan)]" />
        <div className="text-right text-xs text-white/50">{(settings.speed * 100).toFixed(0)}%</div>
      </div>

      <div>
        <label className="text-sm text-white/60">PITCH (Independent)</label>
        <input type="range" min="0.7" max="1.3" step="0.01" value={settings.pitch} onChange={(e) => update('pitch', parseFloat(e.target.value))} className="w-full accent-[var(--neon-magenta)]" />
      </div>

      <div>
        <label className="text-sm text-white/60 block mb-2">VISUAL STYLE</label>
        <select value={settings.effect} onChange={(e) => update('effect', e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm">
          <option value="purple-double">Purple Double Vision (Signature)</option>
          <option value="datamosh">Strong Datamosh / Glitch</option>
          <option value="chromatic-trippy">Trippy Chromatic</option>
          <option value="vhs">VHS + Heavy Glitch</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-white/60 block mb-2">COLOR GRADING</label>
        <select value={settings.colorGrade} onChange={(e) => update('colorGrade', e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm">
          <option value="cinematic">Cinematic</option>
          <option value="syrup">Syrup Dream</option>
          <option value="neon-night">Neon Night</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-white/60">EFFECT INTENSITY</label>
        <input type="range" min="0.5" max="2.0" step="0.1" value={settings.intensity} onChange={(e) => update('intensity', parseFloat(e.target.value))} className="w-full accent-[var(--neon-cyan)]" />
      </div>
    </div>
  );
}
