import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-[28px] tracking-[0.16em]">NOVA</p>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">
            Hear it. See every layer. Configure yours.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-[14px]">
          <div className="space-y-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
              Explore
            </p>
            <Link href="/products" className="block text-text/90 hover:text-accent">
              Catalog
            </Link>
            <Link href="/configure/nova-h1" className="block text-text/90 hover:text-accent">
              Configurator
            </Link>
            <Link href="/assistant" className="block text-text/90 hover:text-accent">
              AI Concierge
            </Link>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
              Support
            </p>
            <Link href="/cart" className="block text-text/90 hover:text-accent">
              Cart
            </Link>
            <Link href="/compare" className="block text-text/90 hover:text-accent">
              Compare
            </Link>
            <a href="mailto:hello@nova.audio" className="block text-text/90 hover:text-accent">
              hello@nova.audio
            </a>
          </div>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
            Drop GLB assets
          </p>
          <p className="mt-3 text-[14px] text-muted">
            Place models in <code className="text-accent-2">/public/models/</code>
          </p>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-[14px] text-muted">
        © 2026 NOVA Audio · Interactive showcase
      </div>
    </footer>
  );
}
