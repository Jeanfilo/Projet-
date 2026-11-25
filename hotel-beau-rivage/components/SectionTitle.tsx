import Reveal from "./Reveal";
export default function SectionTitle({ eyebrow, title, light = false, center = false }: { eyebrow: string; title: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`mt-4 font-serif text-4xl leading-[1.1] md:text-6xl ${light ? "text-ivory" : "text-navy"}`}>{title}</h2>
      <span className={`mt-6 block h-px w-16 bg-gold ${center ? "mx-auto" : ""}`} />
    </Reveal>
  );
}
