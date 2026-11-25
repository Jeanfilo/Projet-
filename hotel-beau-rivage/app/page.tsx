import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Presentation from "@/components/Presentation";
import Rooms from "@/components/Rooms";
import Services from "@/components/Services";
import Discover from "@/components/Discover";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Presentation />
        <Rooms />
        <Services />
        <Discover />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
