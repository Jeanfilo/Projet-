import { site } from "@/lib/site";
export default function Footer() {
  return (
    <footer className="bg-navy px-5 py-12 text-center text-sm text-white/70">
      <p className="font-serif text-2xl text-ivory">{site.name}</p>
      <p className="mt-2">{site.city} · {site.region}</p>
      <p className="mx-auto mt-6 max-w-xl text-xs text-white/50">Maquette de démonstration — proposition de refonte non officielle. Informations et photographies issues du site officiel de l&apos;hôtel, à valider par l&apos;établissement.</p>
    </footer>
  );
}
