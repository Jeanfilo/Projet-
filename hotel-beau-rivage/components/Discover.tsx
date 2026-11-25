import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const spots = [
  { t: "La plage", d: "Baignade, promenades sur le sable et sports nautiques, à deux pas de l'hôtel.", n: "plage" },
  { t: "Le ponton", d: "Le front de mer de Luc-sur-Mer, face à la Manche.", n: "pier" },
  { t: "Les cabines de plage", d: "La digue et ses cabines blanches, typiques de la Côte de Nacre.", n: "cabines" },
];
const around = [
  ["Mémorial de Caen", "Journée sur les plages du Débarquement : pointe du Hoc, Omaha Beach, cimetière américain."],
  ["Château de Caen", "Fondé vers 1060 par Guillaume le Conquérant, l'un des plus grands châteaux d'Europe."],
  ["Abbaye aux Hommes & aux Dames", "Deux joyaux du patrimoine normand, à Caen."],
  ["La Roche d'Oëtre", "Un coup de cœur de la Suisse normande."],
  ["Luc Yacht Club", "Club de voile de Luc-sur-Mer."],
  ["Golf de Caen-la-Mer", "À proximité de l'hôtel."],
];

export default function Discover() {
  return (
    <section id="luc-sur-mer" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
      <SectionTitle eyebrow="Alentours" title="Découvrir Luc-sur-Mer" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {spots.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.1}>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl text-white">
              <div className="absolute inset-0 transition-transform duration-[1600ms] group-hover:scale-110"><Photo name={s.n} alt={s.t} sizes="(min-width:768px) 33vw, 100vw" /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-7 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="font-serif text-2xl">{s.t}</h3><p className="mt-2 text-sm text-white/85">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <ul className="mt-16 grid gap-x-12 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {around.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.05}><li className="border-t border-gold/50 pt-4"><h4 className="font-serif text-xl">{t}</h4><p className="mt-1 text-sm text-navy-soft">{d}</p></li></Reveal>
        ))}
      </ul>
    </section>
  );
}
