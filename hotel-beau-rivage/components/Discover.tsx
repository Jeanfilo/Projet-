import Scene from "./Scene";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

// Éléments généraux sur Luc-sur-Mer (station balnéaire de la Côte de Nacre, Calvados).
const spots = [
  { t: "La plage & la digue", d: "Grande plage de sable face à la Manche, promenade en bord de mer.", v: "dune" as const },
  { t: "La Côte de Nacre", d: "Une côte de stations balnéaires entre Ouistreham et Courseulles-sur-Mer.", v: "day" as const },
  { t: "Les plages du Débarquement", d: "Sites historiques de la bataille de Normandie à proximité.", v: "dawn" as const },
];

export default function Discover() {
  return (
    <section id="luc-sur-mer" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
      <SectionTitle eyebrow="Alentours" title="Découvrir Luc-sur-Mer" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {spots.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.1}>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl text-white">
              <div className="absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-110"><Scene top variant={s.v} label="Photo à fournir" /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-7 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="font-serif text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-white/80 opacity-90">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
