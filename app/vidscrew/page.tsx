'use client';

import React, { useState } from 'react';
import { VideoDropzone } from './components/VideoDropzone';
import { EffectControls } from './components/EffectControls';
import { WebGLPreview } from './components/WebGLPreview';
import { ProgressBar } from './components/ProgressBar';
import { FuturisticPanel } from './components/FuturisticPanel';
import { processWithVidScrew } from '@/lib/ffmpeg';

export default function VidScrew() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    speed: 0.8,
    pitch: 1.0,
    effect: 'purple-double',
    colorGrade: 'cinematic',
    intensity: 1.0,
  });
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOutputUrl(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await processWithVidScrew(file, settings, (p) => setProgress(p));
      const url = URL.createObjectURL(result);
      setOutputUrl(url);
    } catch (error) {
      console.error(error);
      alert('Processing failed. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[4px] text-white/50 mb-2">THE BEAT MOB • FREE TOOL</div>
          <h1 className="text-7xl font-semibold tracking-[-4px]">VIDSCREW</h1>
          <p className="text-xl text-white/70">Slowed. Screwed. Cinematic.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <FuturisticPanel>
            <VideoDropzone onFileSelect={handleFileSelect} />

            {file && (
              <>
                <EffectControls settings={settings} onChange={setSettings} />

                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="mt-8 w-full py-4 rounded-2xl bg-white text-black font-semibold disabled:opacity-50 active:scale-[0.985] transition-all"
                >
                  {isProcessing ? 'PROCESSING...' : 'EXPORT WITH VIDSCREW'}
                </button>

                <ProgressBar progress={progress} isProcessing={isProcessing} />
              </>
            )}
          </FuturisticPanel>

          <FuturisticPanel>
            {file ? (
              <WebGLPreview file={file} settings={settings} />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-white/40">
                Drop media to preview effects
              </div>
            )}
          </FuturisticPanel>
        </div>

        {outputUrl && (
          <div className="mt-8 text-center">
            <a href={outputUrl} download="vidscrew-output.mp4" className="inline-block px-8 py-3 rounded-2xl border border-white/30 hover:bg-white/5">
              Download Processed File
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
