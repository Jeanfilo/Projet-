import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Beau Rivage — Hôtel à Luc-sur-Mer, Normandie (maquette)",
  description:
    "Maquette de refonte web pour l'hôtel Le Beau Rivage à Luc-sur-Mer, Côte de Nacre, Normandie. Projet de démonstration, non officiel.",
  robots: { index: false, follow: false }, // maquette : ne pas indexer
  openGraph: { title: "Le Beau Rivage — Luc-sur-Mer (maquette)", locale: "fr_FR", type: "website" },
};
export const viewport: Viewport = { themeColor: "#0d2238", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Le Beau Rivage",
  address: { "@type": "PostalAddress", addressLocality: "Luc-sur-Mer", addressRegion: "Normandie", addressCountry: "FR" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
