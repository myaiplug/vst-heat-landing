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
      duration: 5000,
    });
  };

  const handleWebDemo = (toolName: string) => {
    if (toolName === "SplitIt" || toolName === "PromptIT") {
      window.location.href = toolName === "SplitIt" ? "/vst/eq-forge#demo" : "#free-tools";
    } else {
      toast.info(`${toolName} Web Demo`, {
        description: "Web versions of these tools are available inside the NoDAW Launcher. Download the free suite for full access.",
      });
    }
  };

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-6 pt-12 pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A20_0.8px,transparent_1px)] bg-[length:5px_5px] opacity-60" />
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-xs tracking-[3px] mb-6">
            <Zap className="w-3.5 h-3.5" /> LOUISVILLE • 2026
          </div>

          <h1 className="text-7xl md:text-[92px] leading-[0.92] font-semibold tracking-[-6.5px] mb-6">
            IGNITE YOUR<br />MIXES.
          </h1>
          <p className="max-w-2xl mx-auto text-2xl md:text-3xl tracking-[-1.5px] text-text-muted mb-4">
            Premium VST plugins built for producers who want real heat.
          </p>
          <p className="max-w-md mx-auto text-text-muted mb-10">
            Character. Clarity. Soul. No subscriptions. No cloud. Just powerful, musical tools that make your beats hit different.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#heat" 
              className="btn-premium group inline-flex items-center justify-center gap-3 px-10 h-14 rounded-2xl bg-white text-[#0A0A0F] font-semibold text-base active:scale-[0.985] transition-all"
            >
              SEE HEAT THIS WEEK
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
            <a 
              href="#free-tools" 
              className="inline-flex items-center justify-center gap-3 px-8 h-14 rounded-2xl border border-white/30 hover:border-white/60 font-medium text-base transition-all"
            >
              <Download className="w-4 h-4" /> GRAB FREE TOOLS FIRST
            </a>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-8 text-xs tracking-widest text-text-muted">
              <div>VST3 • AU • AAX</div>
              <div>APPLE SILICON NATIVE</div>
              <div>ONE-TIME PAYMENT</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-2/3 max-w-lg h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      </div>

      {/* HEAT THIS WEEK */}
      <section id="heat" className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="uppercase tracking-[4px] text-xs text-cyan mb-3">THIS WEEK&apos;S HEAT</div>
            <h2 className="section-header text-5xl tracking-[-3px] font-semibold">Featured Drops</h2>
          </div>
          <a href="#arsenal" className="hidden md:flex items-center gap-2 text-sm text-cyan hover:underline">
            VIEW FULL ARSENAL <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredVSTs.map((vst, index) => (
            <motion.div
              key={vst.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <VSTCard vst={vst} featured={true} />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mt-8 tracking-widest">NEW DROPS EVERY MONDAY • LIMITED EARLY BIRD PRICING ON FRESH RELEASES</p>
      </section>

      {/* THE FULL ARSENAL */}
      <section id="arsenal" className="bg-[#111114] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="uppercase tracking-[4px] text-xs text-magenta mb-3">THE COMPLETE COLLECTION</div>
            <h2 className="section-header text-5xl tracking-[-3px] font-semibold">bZ VST Arsenal</h2>
            <p className="mt-4 text-text-muted max-w-md mx-auto">Four core plugins. One philosophy: musical tools that solve real problems in the mix.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vsts.map((vst, index) => (
              <motion.div
                key={vst.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
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
          <div className="inline-block px-4 py-1 rounded-full bg-magenta/10 text-magenta text-xs tracking-[3px] mb-4">START HERE • NO SIGNUP</div>
          <h2 className="text-5xl tracking-[-3px] font-semibold mb-4">Instant Free Audio Tools</h2>
          <p className="text-xl text-text-muted">Drag. Drop. Done. Powerful offline tools that make your workflow stupid fast. The perfect on-ramp to the full VST experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {freeTools.map((tool, index) => (
            <div key={index} className="funnel-card glass rounded-3xl p-8 border border-white/10 flex flex-col">
              <div className="flex-1">
                <div className="font-mono text-xs tracking-[2px] mb-3" style={{ color: tool.color }}>{tool.type.toUpperCase()}</div>
                <h4 className="text-3xl tracking-[-1.5px] font-semibold mb-4">{tool.name}</h4>
                <p className="text-text-muted leading-relaxed">{tool.desc}</p>
              </div>

              <div className="mt-8 flex gap-3">
                {tool.type.includes("Download") ? (
                  <button 
                    onClick={() => handleDownload(tool.name)}
                    className="flex-1 btn-premium flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/90 hover:bg-white text-[#0A0A0F] font-medium text-sm active:scale-[0.985]"
                  >
                    <Download size={16} /> DOWNLOAD FOR WINDOWS
                  </button>
                ) : (
                  <button 
                    onClick={() => handleWebDemo(tool.name)}
                    className="flex-1 btn-premium flex items-center justify-center gap-2 h-12 rounded-2xl border border-white/40 hover:bg-white/5 font-medium text-sm"
                  >
                    <Play size={16} /> OPEN WEB DEMO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            These tools are 100% offline, local, and free forever. No accounts. No tracking. 
            They&apos;re our way of giving back to the culture while you explore the full power of the bZ VST suite.
          </p>
          <a href="https://github.com/myaiplug" target="_blank" className="inline-block mt-4 text-xs underline hover:text-cyan">View all free tools &amp; source on GitHub →</a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 py-20 px-6 bg-[#111114]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-cyan text-sm tracking-[4px] mb-4">NO SUBSCRIPTIONS. NO COMPROMISE.</div>
          <h3 className="text-5xl tracking-[-2.5px] font-semibold mb-6">Ready to put real heat in your beats?</h3>
          <p className="text-text-muted mb-10">Join hundreds of producers using bZ tools to make mixes that actually move the needle.</p>
          
          <a href="#heat" className="btn-premium inline-flex items-center gap-3 px-12 h-14 rounded-2xl bg-gradient-to-r from-cyan to-magenta text-[#0A0A0F] font-semibold text-base">
            BROWSE HEAT THIS WEEK <ArrowRight />
          </a>
        </div>
      </section>
    </main>
  );
}