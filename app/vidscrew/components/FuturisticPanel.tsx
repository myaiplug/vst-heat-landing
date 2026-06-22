'use client';

import { ReactNode } from 'react';

export function FuturisticPanel({ children }: { children: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-8 md:p-10 border border-white/10">
      {children}
    </div>
  );
}
