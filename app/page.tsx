'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Play, Zap } from 'lucide-react';
import { vsts, freeTools } from '@/lib/vsts';
import VSTCard from '@/components/VSTCard';
import { toast } from 'sonner';

export default function HeatVSTLanding() {
  const featuredVSTs = vsts.slice(0, 3);

  const handleDownload = (toolName: string) => {
    toast.success(`${toolName} download started`, {
      description: "Check your Downloads folder. These are offline .bat tools for Windows. Mac/Linux versions coming soon.",
      duration: 6000,
    });
  };

  const handleWebDemo = (toolName: string) => {
    if (toolName === "SplitIt" || toolName === "PromptIT") {
      window.location.href = toolName === "SplitIt" ? "/vst/eq-forge#demo" : "#free-tools";
    } else {
      toast.info(`${toolName} Web Demo`, {
        description: "Full web versions live inside the NoDAW Launcher. Grab the free suite for instant access.",
      });
    }
  };

  return (
    <main className="overflow-hidden">
      {/* HERO — Cinematic & High-Production */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-6 pt-12 pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A20_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-50" />
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/15 text-xs tracking-[3.5px] mb-8 text-text-muted">
            <Zap className="w-3.5 h-3.5 text-cyan" /> BUILT IN LOUISVILLE, KY • 2026
          </div>

          <h1 className="text-[72px] md:text-[96px] leading-[0.88] font-semibold tracking-[-7px] mb-6">
            IGNITE YOUR<br />MIXES.
          </h1>
          
          <p className="max-w-2xl mx-auto text-2xl md:text-[28px] tracking-[-1.2px] text-text-muted mb-3">
            Premium VST plugins for producers who refuse to settle.
          </p>
          <p className="max-w-lg mx-auto text-text-muted mb-10">
            Character. Clarity. Soul. One-time purchase. 100% local. No subscriptions. Ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#heat" 
              className="group inline-flex items-center justify-center gap-3 px-10 h-14 rounded-2xl bg-white text-[#0A0A0F] font-semibold text-base active:scale-[0.985] transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            >
              SEE THIS WEEK&apos;S HEAT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
            <a 
              href="#free-tools" 
              className="inline-flex items-center justify-center gap-3 px-9 h-14 rounded-2xl border border-white/30 hover:border-white/60 font-medium text-base transition-all active:scale-[0.985]"
            >
              <Download className="w-4 h-4" /> START WITH FREE TOOLS
            </a>
          </div>

          <div className="mt-14 flex justify-center">
            <div className="flex items-center gap-8 text-[10px] tracking-[3px] text-text-muted/70">
              <div>VST3 • AU • AAX</div>
              <div>APPLE SILICON NATIVE</div>
              <div>ONE-TIME • LIFETIME UPDATES</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2/3 max-w-md h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </section>

      {/* HEAT THIS WEEK */}
      <section id="heat" className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="uppercase tracking-[4px] text-xs text-cyan mb-3">THIS WEEK&apos;S HEAT</div>
            <h2 className="text-5xl md:text-6xl tracking-[-3.5px] font-semibold">Featured Drops</h2>
          </div>
          <a href="#arsenal" className="text-sm text-cyan hover:underline flex items-center gap-1.5">
            VIEW FULL ARSENAL <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredVSTs.map((vst, index) => (
            <motion.div
              key={vst.slug}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <VSTCard vst={vst} featured />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FULL ARSENAL */}
      <section id="arsenal" className="bg-[#111114] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="uppercase tracking-[4px] text-xs text-magenta mb-3">THE COMPLETE COLLECTION</div>
            <h2 className="text-5xl tracking-[-3px] font-semibold">bZ VST Arsenal</h2>
            <p className="mt-4 text-text-muted max-w-md mx-auto">Four core plugins. One philosophy: tools that actually solve problems in the mix.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vsts.map((vst, index) => (
              <motion.div
                key={vst.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.2) }}
              >
                <VSTCard vst={vst} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE TOOLS FUNNEL */}
      <section id="free-tools" className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-magenta/10 text-magenta text-xs tracking-[3px] mb-4">NO SIGNUP • NO BULLSHIT</div>
          <h2 className="text-5xl tracking-[-3px] font-semibold mb-4">Start Here. Feel the Difference.</h2>
          <p className="text-xl text-text-muted">Instant offline tools that make your workflow stupid fast. The on-ramp to owning real heat.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {freeTools.map((tool, index) => (
            <div key={index} className="glass rounded-3xl p-8 border border-white/10 flex flex-col group">
              <div className="flex-1">
                <div className="font-mono text-xs tracking-[2px] mb-3" style={{ color: tool.color }}>{tool.type.toUpperCase()}</div>
                <h4 className="text-3xl tracking-[-1.5px] font-semibold mb-4 group-hover:text-cyan transition-colors">{tool.name}</h4>
                <p className="text-text-muted leading-relaxed">{tool.desc}</p>
              </div>

              <div className="mt-8">
                {tool.type.includes("Download") ? (
                  <button 
                    onClick={() => handleDownload(tool.name)}
                    className="w-full h-12 rounded-2xl bg-white/90 hover:bg-white text-[#0A0A0F] font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.985] transition-all"
                  >
                    <Download size={16} /> DOWNLOAD FOR WINDOWS
                  </button>
                ) : (
                  <button 
                    onClick={() => handleWebDemo(tool.name)}
                    className="w-full h-12 rounded-2xl border border-white/40 hover:bg-white/5 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.985]"
                  >
                    <Play size={16} /> OPEN WEB DEMO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-text-muted max-w-md mx-auto">
          These tools are 100% free, offline, and local forever. They exist so you can experience the quality before you buy the full VSTs.
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 py-20 px-6 bg-[#111114]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-cyan text-sm tracking-[4px] mb-4">NO SUBSCRIPTIONS. NO COMPROMISE.</div>
          <h3 className="text-5xl tracking-[-2.5px] font-semibold mb-6">Ready to put real heat in your beats?</h3>
          <p className="text-text-muted mb-8">Join producers who are done with average tools and average mixes.</p>
          
          <a href="#heat" className="inline-flex items-center gap-3 px-12 h-14 rounded-2xl bg-gradient-to-r from-cyan to-magenta text-[#0A0A0F] font-semibold text-base active:scale-[0.985]">
            BROWSE THIS WEEK&apos;S HEAT <ArrowRight />
          </a>
        </div>
      </section>
    </main>
  );
}