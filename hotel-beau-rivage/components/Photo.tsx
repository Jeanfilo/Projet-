import Image from "next/image";
export default function Photo({ name, alt, sizes = "100vw", priority = false, pos = "50% 50%", className = "" }: { name: string; alt: string; sizes?: string; priority?: boolean; pos?: string; className?: string }) {
  return <Image src={`/photos/${name}.webp`} alt={alt} fill sizes={sizes} priority={priority} quality={80} className={`object-cover ${className}`} style={{ objectPosition: pos }} />;
}
