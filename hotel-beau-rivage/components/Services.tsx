import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Photo from "./Photo";

const hours = [
  ["Lundi", "Fermé"], ["Mardi – Jeudi", "Soir · 19h – 21h30"], ["Vendredi – Samedi", "12h – 14h · 19h – 21h30"], ["Dimanche", "Midi · 12h – 14h"],
];
const services = ["Wi-Fi gratuit", "Parking public gratuit", "Bar", "Accessible PMR", "Salle de réception (jusqu'à 25 pers.)", "Petit-déjeuner dès 16 €"];

export default function Services() {
  return (
    <section id="restaurant" className="relative overflow-hidden bg-navy py-24 text-ivory md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle light eyebrow="À table" title="Le Comptoir du Beau Rivage" />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">Une cuisine authentique et généreuse, élaborée à partir de produits frais et de saison : produits de la mer, viandes grillées, légumes de saison. Le chef Yann Bouquerel signe une cuisine bistrot de bord de mer, à 20 mètres des vagues, avec petite terrasse extérieure.</p>
              <div className="mt-8 inline-flex items-baseline gap-4 border-y border-gold/40 py-4">
                <span className="font-serif text-4xl text-gold-light">41 €</span>
                <span className="text-sm text-white/70">Menu Beau Rivage — entrée, plat, dessert<br />du mardi au samedi soir</span>
              </div>
              <ul className="mt-10 divide-y divide-white/10 text-sm">
                {hours.map(([d, h]) => (<li key={d} className="flex justify-between py-3"><span className="text-white/60">{d}</span><span>{h}</span></li>))}
              </ul>
              <p className="mt-3 text-xs text-white/45">Horaires indicatifs, susceptibles d&apos;évoluer selon la saison. Réservation : 02 31 77 06 09.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative">
            <div className="grid grid-cols-5 gap-3">
              <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-3xl"><Photo name="salle-resto" alt="La salle du restaurant" sizes="(min-width:1024px) 30vw, 60vw" pos="30% 50%" /></div>
              <div className="col-span-2 grid gap-3">
                <div className="relative overflow-hidden rounded-3xl"><Photo name="plat-burrata" alt="Burrata et fraises" sizes="20vw" /></div>
                <div className="relative overflow-hidden rounded-3xl"><Photo name="verre" alt="Un verre au bar" sizes="20vw" /></div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mt-20 flex flex-wrap gap-3">
          {services.map((s, i) => (<Reveal key={s} delay={i * 0.05}><span className="inline-block rounded-full border border-gold/40 px-5 py-2.5 text-sm text-gold-light transition-colors duration-300 hover:bg-gold hover:text-navy">{s}</span></Reveal>))}
        </div>
      </div>
    </section>
  );
}
