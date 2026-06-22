'use client';

import React from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

export function VideoDropzone({ onFileSelect }: Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-white/30 hover:border-[var(--neon-cyan)] rounded-3xl p-12 text-center cursor-pointer transition-all active:scale-[0.985]"
    >
      <Upload className="mx-auto mb-4 w-10 h-10 text-white/60" />
      <p className="text-lg">Drop video or audio here</p>
      <p className="text-sm text-white/50 mt-1">MP4, MOV, MP3 supported</p>
    </div>
  );
}
