import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Scene from "./Scene";

const items = [
  { t: "Restauration", d: "Présentation du restaurant / petit-déjeuner : horaires, carte et formules à compléter." },
  { t: "Services", d: "Wi-Fi, accueil, parking, animaux… : liste à confirmer par l'établissement." },
  { t: "Groupes & événements", d: "Séminaires, mariages, séjours en groupe : à confirmer." },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-navy py-24 text-ivory md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <SectionTitle light eyebrow="Table & prestations" title="Restauration et services" />
          <ul className="mt-12 space-y-6">
            {items.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.1}>
                <li className="group flex gap-5 border-t border-white/15 pt-6">
                  <span className="font-serif text-3xl text-gold transition-transform duration-500 group-hover:translate-x-2">0{i + 1}</span>
                  <div><h3 className="font-serif text-2xl">{s.t}</h3><p className="mt-2 text-white/70">{s.d}</p><span className="mt-3 inline-block rounded-full border border-gold/50 px-3 py-1 text-[11px] uppercase tracking-widest text-gold-light">À compléter</span></div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.2}><div className="aspect-[4/5] overflow-hidden rounded-3xl"><Scene variant="table" label="Photo à fournir" /></div></Reveal>
      </div>
    </section>
  );
}
