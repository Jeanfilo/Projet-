import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const facts = [
  ["15 min", "de Caen"],
  ["2 h", "de Paris"],
  ["Plage", "à deux pas"],
  ["Gratuit", "parking public"],
];
const gallery = [
  { n: "terrasse", a: "La terrasse face à la mer", c: "md:col-span-2 md:row-span-2" },
  { n: "chambre-vue-mer", a: "Chambre avec vue sur la mer", c: "" },
  { n: "salle-resto", a: "La salle du restaurant", c: "" },
  { n: "plat-poulpe", a: "Poulpe, cuisine de bord de mer", c: "" },
  { n: "aerien", a: "Luc-sur-Mer vue du ciel", c: "" },
];

export default function Presentation() {
  return (
    <section id="hotel" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="L'établissement" title="Un havre de paix face à la Manche" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-navy-soft">Logis Hôtel Restaurant à Luc-sur-Mer, à quelques pas de la ligne Brittany Ferries. Vacances en amoureux, en famille ou séjour professionnel : la plupart des chambres ont une vue imprenable sur la Manche — réveil au son des vagues, horizon pour seul voisin.</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-soft">Au cœur de la Vélo Maritime, Luc-sur-Mer est l&apos;étape idéale pour explorer les plages du Débarquement à vélo ou à pied, entre baignade, promenades sur le sable et sports nautiques.</p>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6">
              {facts.map(([a, b]) => (<div key={a} className="border-t border-gold/50 pt-3"><dt className="font-serif text-3xl">{a}</dt><dd className="text-xs uppercase tracking-[.2em] text-navy-soft">{b}</dd></div>))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] shadow-2xl"><Photo name="facade-angle" alt="Façade de l'hôtel Le Beau Rivage" sizes="(min-width:1024px) 50vw, 100vw" pos="40% 50%" /></div>
            <div className="absolute -bottom-8 -left-4 hidden w-44 rotate-[-4deg] bg-ivory p-2 pb-6 shadow-xl md:block">
              <div className="relative aspect-[4/3]"><Photo name="historique" alt="Carte postale ancienne de l'hôtel Beau Rivage" sizes="180px" /></div>
              <p className="mt-2 text-center font-serif text-xs italic text-navy-soft">Carte postale ancienne</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-24 md:mt-36">
        <SectionTitle eyebrow="Galerie" title="L'hôtel en images" />
        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {gallery.map((g, i) => (
            <Reveal key={g.n} delay={i * 0.07} className={g.c}>
              <div className="group relative h-full w-full overflow-hidden rounded-2xl">
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-110"><Photo name={g.n} alt={g.a} sizes="(min-width:768px) 40vw, 50vw" /></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
