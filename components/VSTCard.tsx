'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VST } from '@/lib/vsts';

interface VSTCardProps {
  vst: VST;
  featured?: boolean;
}

export default function VSTCard({ vst, featured = false }: VSTCardProps) {
  return (
    <Link href={`/vst/${vst.slug}`} className="group block">
      <div className={`vst-card glass rounded-3xl p-8 h-full flex flex-col border border-white/10 ${featured ? 'ring-1 ring-cyan/30' : ''}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="uppercase tracking-[3px] text-xs text-text-muted mb-1.5">{vst.category}</div>
            <h3 className="text-2xl font-semibold tracking-[-1.2px] group-hover:text-cyan transition-colors">{vst.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">ONE-TIME</div>
            <div className="text-xl font-semibold tabular-nums" style={{ color: vst.color }}>{vst.price}</div>
          </div>
        </div>

        <p className="text-text-muted leading-snug mb-auto">{vst.tagline}</p>

        {featured && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/30 w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan"></span>
            </span>
            HEAT THIS WEEK
          </div>
        )}

        <div className="mt-8 flex items-center justify-between text-sm font-medium">
          <span className="text-cyan group-hover:underline">Deep dive →</span>
          <ArrowRight className="w-4 h-4 text-cyan group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}