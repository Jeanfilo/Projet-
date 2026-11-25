"use client";
import { useEffect, useState } from "react";
import { site, nav } from "@/lib/site";
export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 60); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const dark = solid || open;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${dark ? "bg-ivory/90 shadow-sm backdrop-blur-lg" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className={`font-serif text-xl tracking-wide transition-colors ${dark ? "text-navy" : "text-white"}`}>{site.name}</a>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {nav.map((n) => (<a key={n.href} href={n.href} className={`link-u text-[13px] uppercase tracking-[.18em] ${dark ? "text-navy" : "text-white"}`}>{n.label}</a>))}
          <a href="#contact" className="btn btn-gold !px-6 !py-3"><span>Réserver</span></a>
        </nav>
        <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="relative h-10 w-10 lg:hidden">
          <span className={`absolute left-2 right-2 h-px transition-all duration-300 ${dark ? "bg-navy" : "bg-white"} ${open ? "top-5 rotate-45" : "top-4"}`} />
          <span className={`absolute left-2 right-2 h-px transition-all duration-300 ${dark ? "bg-navy" : "bg-white"} ${open ? "top-5 -rotate-45" : "top-6"}`} />
        </button>
      </div>
      <div className={`overflow-hidden bg-ivory transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[420px]" : "max-h-0"}`}>
        <nav className="flex flex-col gap-1 px-5 pb-6">
          {nav.map((n) => (<a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-sand py-4 font-serif text-2xl text-navy">{n.label}</a>))}
        </nav>
      </div>
    </header>
  );
}
