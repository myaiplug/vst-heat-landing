import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
      <div>
        <div className="text-8xl font-semibold tracking-tighter mb-4 text-white/30">404</div>
        <h2 className="text-3xl tracking-[-1px] mb-4">VST not found in the arsenal</h2>
        <p className="text-text-muted mb-8 max-w-xs mx-auto">The plugin you&apos;re looking for might have moved or doesn&apos;t exist yet. Check the Heat section for current drops.</p>
        <Link href="/" className="inline-block px-8 py-3 rounded-2xl border border-white/30 hover:bg-white/5">Back to HEAT</Link>
      </div>
    </div>
  );
}