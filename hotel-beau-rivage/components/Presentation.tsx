import Scene from "./Scene";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { PLACEHOLDER } from "@/lib/site";

const gallery: { v: "dawn" | "day" | "dusk" | "room" | "table" | "dune"; label: string; cls: string }[] = [
  { v: "day", label: "Façade — photo à fournir", cls: "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto" },
  { v: "room", label: "Intérieur — photo à fournir", cls: "aspect-square" },
  { v: "dune", label: "Plage — photo à fournir", cls: "aspect-square" },
  { v: "table", label: "Salle — photo à fournir", cls: "aspect-square" },
  { v: "dawn", label: "Vue mer — photo à fournir", cls: "aspect-square" },
];

export default function Presentation() {
  return (
    <section id="hotel" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="L'établissement" title="Une adresse face à la Manche" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-navy-soft">
              Le Beau Rivage vous accueille à Luc-sur-Mer, station balnéaire de la Côte de Nacre, dans le Calvados. Ici, le rythme est celui des marées : longues promenades sur la plage, lumière changeante, air iodé.
            </p>
            <p className="mt-5 max-w-xl rounded-xl border border-dashed border-gold/60 bg-sand/50 p-4 text-sm text-navy-soft">
              <strong>{PLACEHOLDER} :</strong> texte de présentation définitif (histoire de la maison, propriétaires, classement, nombre de chambres) à fournir et valider par l&apos;hôtel.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] shadow-2xl"><Scene variant="dawn" label="Photo à fournir" /></div>
        </Reveal>
      </div>

      <div className="mt-24 md:mt-32">
        <SectionTitle eyebrow="Galerie" title="L'hôtel en images" />
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {gallery.map((g, i) => (
            <Reveal key={i} delay={i * 0.07} className={g.cls}>
              <div className="group h-full w-full overflow-hidden rounded-2xl"><div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110"><Scene variant={g.v} label={g.label} /></div></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
