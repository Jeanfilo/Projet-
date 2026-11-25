"use client";
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Photo from "./Photo";
import Button from "./Button";
import { site } from "@/lib/site";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Hero() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  const dusk = useTransform(sp, [0.05, 0.6], [0, 1]);
  const shade = useTransform(sp, [0, 0.7], [0.12, 0.34]);
  const scale = useTransform(sp, [0, 1], [1.04, 1.22]);
  const y = useTransform(sp, [0, 1], ["0%", "-9%"]);
  const textO = useTransform(sp, [0, 0.28], [1, 0]);
  const textY = useTransform(sp, [0, 0.28], [0, -50]);
  const bandY = useTransform(sp, [0.5, 0.82], ["102%", "0%"]);

  const d = reduce ? 0 : 1;
  return (
    <div ref={track} id="top" className="relative h-[260svh]">
      <section className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#ebe1d7]">
        {/* Plan 1 : bord de mer, de jour vers le crépuscule (piloté par le scroll) */}
        <motion.div className="absolute inset-0" style={{ scale, y }}>
          <motion.div initial={{ scale: reduce ? 1 : 1.18 }} animate={{ scale: 1 }} transition={{ duration: 2.2, delay: 0.5, ease: EASE }} className="absolute inset-0">
            <Photo name="pier" alt="Le ponton de Luc-sur-Mer face à la Manche" priority sizes="100vw" pos="50% 60%" />
            <motion.div className="absolute inset-0" style={{ opacity: dusk }}>
              <Photo name="sunset" alt="La plage de Luc-sur-Mer au coucher du soleil, vue depuis une chambre" sizes="100vw" pos="50% 45%" />
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className="absolute inset-0 bg-navy" style={{ opacity: shade }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/40" />

        {/* Texte d'accueil */}
        <motion.div style={{ opacity: textO, y: textY }} className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-white">
          <div className="max-w-4xl pt-16">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 * d, duration: 1 }} className="eyebrow !text-gold-light">Luc-sur-Mer · Côte de Nacre · Normandie</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.85 * d, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }} className="mt-6 font-serif text-6xl leading-[1.02] md:text-8xl">{site.name}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 * d, duration: 1.2 }} className="mx-auto mt-6 max-w-xl font-serif text-xl italic text-white/90 md:text-2xl">{site.tagline}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.45 * d, duration: 1 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="#hotel" variant="ghost">Découvrir l&apos;hôtel</Button>
              <Button href="#contact" variant="gold">Demander une réservation</Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bandeau qui monte en fin de scroll */}
        <motion.div style={{ y: bandY }} className="absolute inset-x-0 bottom-0 z-20 border-t border-gold/60 bg-navy px-6 pb-10 pt-8 text-center text-ivory shadow-[0_-30px_60px_rgba(0,0,0,.35)] md:pb-12 md:pt-10">
          <p className="eyebrow">Hôtel · Restaurant · Logis</p>
          <p className="mt-3 font-serif text-5xl leading-none md:text-7xl">{site.name}</p>
          <p className="mt-3 text-sm text-white/70">{site.address}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#chambres" variant="ghost">Les chambres</Button>
            <Button href="#contact" variant="gold">Demander une réservation</Button>
          </div>
        </motion.div>

        {/* Façade qui s'ouvre au centre */}
        {!done && !reduce && (
          <>
            {(["l", "r"] as const).map((s) => (
              <motion.div key={s} className={`absolute inset-y-0 z-30 w-1/2 overflow-hidden bg-[#ebe1d7] ${s === "l" ? "left-0" : "right-0"}`}
                initial={{ x: 0 }} animate={{ x: s === "l" ? "-101%" : "101%" }} transition={{ delay: 0.45, duration: 1.5, ease: EASE }}
                onAnimationComplete={s === "r" ? () => setDone(true) : undefined}>
                <div className={`absolute inset-y-0 w-[200%] ${s === "l" ? "left-0" : "right-0"}`}>
                  <Photo name="facade" alt={s === "l" ? "Façade de l'hôtel Le Beau Rivage" : ""} priority sizes="100vw" pos="72% 50%" />
                </div>
                <div className={`absolute inset-y-0 w-10 from-black/30 to-transparent ${s === "l" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"}`} />
              </motion.div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
