import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Button from "./Button";

// Descriptions reprises du site officiel de l'hôtel. Les tarifs varient selon les dates : demande de devis.
const rooms = [
  { n: "chambre-confort", name: "Chambre standard · vue mer", d: "Chambre vue mer ou vue latérale mer, lit 140×190, espace de travail, Smart TV, salle de bains neuve avec douche et WC." },
  { n: "chambre-vue-mer", name: "Chambre confort · vue mer", d: "Chambre confort neuve avec pleine vue mer en face, salle de bains neuve, Smart TV et bureau." },
  { n: "chambre-blanche", name: "Chambre triple · vue mer", d: "Un lit double et un lit 90, vue sur la mer, Smart TV, bureau, trois fenêtres, volets électriques, salle de bains neuve." },
  { n: "chambre-twin", name: "Chambre supérieure · famille", d: "26 m² : deux chambres communicantes, lit de 180 séparable en deux lits de 90 et deux lits de 80, salle de bains neuve, WC séparé, 2 Smart TV." },
];

export default function Rooms() {
  return (
    <section id="chambres" className="bg-sand/60 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionTitle eyebrow="Séjourner" title="Les chambres" />
        <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg text-navy-soft">Mer ou village, vous choisissez. La plupart de nos chambres donnent sur le front de mer : vous serez bercés par les vagues. Wi-Fi gratuit dans toutes les chambres.</p></Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <article className="group h-full overflow-hidden rounded-3xl bg-ivory shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden"><div className="absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-105"><Photo name={r.n} alt={r.name} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" /></div></div>
                <div className="p-6">
                  <h3 className="font-serif text-xl leading-snug">{r.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-soft">{r.d}</p>
                  <div className="mt-6"><Button href="#contact" variant="outline">Demander</Button></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}><p className="mt-10 text-sm text-navy-soft">Autres catégories : chambres vue village, chambre confort PMR en rez-de-chaussée. Tarifs variables selon les dates — nous consulter.</p></Reveal>
      </div>
    </section>
  );
}
