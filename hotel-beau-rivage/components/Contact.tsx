"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { site } from "@/lib/site";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const maps = site.maps;
  const field = "w-full rounded-xl border border-sand-deep bg-white/70 px-4 py-3.5 text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
  return (
    <section id="contact" className="bg-sand/60 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionTitle eyebrow="Réserver" title="Contact & réservation" />
          <Reveal delay={0.1}>
            <dl className="mt-10 space-y-5 text-navy-soft">
              <div><dt className="eyebrow">Adresse</dt><dd className="mt-1">{site.address}</dd></div>
              <div><dt className="eyebrow">Téléphone</dt><dd className="mt-1">{site.phoneDisplay}</dd></div>
              <div><dt className="eyebrow">E-mail</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="link-u">{site.email}</a></dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`tel:${site.phone}`} variant="navy">Appeler</Button>
              <Button href={maps} external variant="outline">Itinéraire</Button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-3">
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-3xl bg-ivory p-7 shadow-xl md:p-10">
            {sent ? (
              <div className="py-10 text-center">
                <p className="font-serif text-3xl">Merci !</p>
                <p className="mx-auto mt-3 max-w-sm text-navy-soft">Maquette de démonstration : ce formulaire n&apos;envoie rien et aucune réservation n&apos;est enregistrée ni confirmée.</p>
                <div className="mt-6"><Button variant="outline" onClick={() => setSent(false)}>Nouvelle demande</Button></div>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl">Demande de réservation</h3>
                <p className="mt-1 text-sm text-navy-soft">Demande sans engagement — l&apos;hôtel vous répondra pour confirmer disponibilité et tarif.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">Nom<input required className={`${field} mt-1`} autoComplete="name" /></label>
                  <label className="text-sm">E-mail<input required type="email" className={`${field} mt-1`} autoComplete="email" /></label>
                  <label className="text-sm">Arrivée<input required type="date" className={`${field} mt-1`} /></label>
                  <label className="text-sm">Départ<input required type="date" className={`${field} mt-1`} /></label>
                  <label className="text-sm">Voyageurs<input type="number" min={1} defaultValue={2} className={`${field} mt-1`} /></label>
                  <label className="text-sm">Téléphone<input type="tel" className={`${field} mt-1`} autoComplete="tel" /></label>
                  <label className="text-sm sm:col-span-2">Message<textarea rows={4} className={`${field} mt-1`} /></label>
                </div>
                <div className="mt-6"><Button type="submit" variant="gold">Envoyer la demande</Button></div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
