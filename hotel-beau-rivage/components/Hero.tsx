"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Scene from "./Scene";
import Button from "./Button";
import { site } from "@/lib/site";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const e = [0.2, 0.8, 0.2, 1] as const;
  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center text-white">
      <motion.div style={{ y, scale }} className="absolute inset-0"><Scene variant="dusk" label="Photo du bord de mer à fournir" /></motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/20 to-navy/70" />
      {/* vagues animées */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden opacity-90">
        <svg className="h-full w-[200%]" style={{ animation: "wave 14s linear infinite" }} viewBox="0 0 1600 100" preserveAspectRatio="none">
          <path d="M0 50 Q100 20 200 50 T400 50 T600 50 T800 50 T1000 50 T1200 50 T1400 50 T1600 50 V100 H0Z" fill="#faf7f2" />
        </svg>
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: e }} className="eyebrow !text-gold-light">Luc-sur-Mer · Côte de Nacre · Normandie</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: e }} className="mt-6 font-serif text-6xl leading-[1.02] md:text-8xl">{site.name}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.8 }} className="mx-auto mt-6 max-w-xl font-serif text-xl italic text-white/90 md:text-2xl">{site.tagline}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease: e }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="#hotel" variant="ghost">Découvrir l&apos;hôtel</Button>
          <Button href="#contact" variant="gold">Demander une réservation</Button>
        </motion.div>
      </div>
      <motion.a href="#hotel" aria-label="Défiler" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 md:block">
        <span className="block h-12 w-7 rounded-full border border-white/60"><span className="mx-auto mt-2 block h-2 w-1 animate-bounce rounded-full bg-white" /></span>
      </motion.a>
    </section>
  );
}
