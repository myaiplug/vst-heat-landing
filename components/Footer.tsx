import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F] py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-y-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
              <span className="text-[#0A0A0F] text-sm font-bold">bZ</span>
            </div>
            <span className="font-semibold tracking-[-1px] text-xl">HEAT by bZ</span>
          </div>
          <p className="text-text-muted max-w-xs">
            Premium VST plugins and instant audio tools built for producers who refuse to settle for average mixes.
          </p>
          <div className="mt-6 text-xs text-text-muted">
            Built with ❤️ in Louisville, KY • South End
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-medium mb-4 text-text-muted">EXPLORE</div>
            <div className="space-y-2.5 text-text-muted">
              <Link href="#heat" className="block hover:text-cyan">Heat This Week</Link>
              <Link href="#arsenal" className="block hover:text-cyan">Full VST Arsenal</Link>
              <Link href="#free-tools" className="block hover:text-cyan">Free Audio Tools</Link>
            </div>
          </div>
          <div>
            <div className="font-medium mb-4 text-text-muted">RESOURCES</div>
            <div className="space-y-2.5 text-text-muted">
              <a href="https://github.com/myaiplug" target="_blank" className="block hover:text-cyan">GitHub</a>
              <a href="https://thebeatmob.com" target="_blank" className="block hover:text-cyan">thebeatmob.com</a>
              <Link href="/vst/eq-forge" className="block hover:text-cyan">Example Solo Page</Link>
            </div>
          </div>
          <div>
            <div className="font-medium mb-4 text-text-muted">LEGAL &amp; SUPPORT</div>
            <div className="space-y-2.5 text-text-muted text-xs">
              <div>One-time purchases • Lifetime updates</div>
              <div>100% local processing</div>
              <div>No subscriptions. Ever.</div>
              <div className="pt-2">© {new Date().getFullYear()} bZ / the beat mob</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-[10px] tracking-[2px] text-text-muted">
        CHROMATIC NIHILISM • ANTI-GRAVITY MIXING • BUILT FOR THE CULTURE
      </div>
    </footer>
  );
}