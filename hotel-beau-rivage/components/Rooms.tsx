import Scene from "./Scene";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Button from "./Button";

// Types de chambres provisoires — aucune caractéristique, équipement ni tarif n'est affirmé.
const rooms = [
  { name: "Chambre — catégorie 1", v: "room" as const },
  { name: "Chambre — catégorie 2", v: "dawn" as const },
  { name: "Chambre — catégorie 3", v: "day" as const },
];

export default function Rooms() {
  return (
    <section id="chambres" className="bg-sand/60 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionTitle eyebrow="Séjourner" title="Les chambres" />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {rooms.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <article className="group overflow-hidden rounded-3xl bg-ivory shadow-sm transition-shadow duration-500 hover:shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden"><div className="h-full transition-transform duration-[1200ms] group-hover:scale-105"><Scene variant={r.v} label="Photo à fournir" /></div></div>
                <div className="p-7">
                  <h3 className="font-serif text-2xl">{r.name}</h3>
                  <p className="mt-3 text-sm text-navy-soft">Description, surface, équipements : <em>à compléter après validation par l&apos;hôtel.</em></p>
                  <p className="mt-2 text-sm text-navy-soft">Tarif : <em>sur demande</em></p>
                  <div className="mt-6"><Button href="#contact" variant="outline">Demander cette chambre</Button></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
