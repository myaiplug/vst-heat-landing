'use client';

import { motion } from 'framer-motion';

interface Props {
  progress: number;
  isProcessing: boolean;
}

export function ProgressBar({ progress, isProcessing }: Props) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
      <motion.div
        className="h-full bg-[var(--neon-cyan)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: 'easeOut' }}
      />
    </div>
  );
}
