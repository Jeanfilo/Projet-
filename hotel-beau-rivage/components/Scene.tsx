// Visuels provisoires illustrés (SVG). À remplacer par les vraies photographies de l'hôtel.
type Variant = "dawn" | "day" | "dusk" | "room" | "table" | "dune";
const palettes: Record<Variant, { sky: [string, string]; sea: [string, string]; sun: string }> = {
  dawn: { sky: ["#f3d9bf", "#f9efe3"], sea: ["#6d8fae", "#27496b"], sun: "#f6c98d" },
  day: { sky: ["#bcd7ea", "#eaf3f8"], sea: ["#5b91b8", "#17446b"], sun: "#fff6dd" },
  dusk: { sky: ["#2b3f66", "#e4a27c"], sea: ["#2a4366", "#0b1b30"], sun: "#f3b184" },
  room: { sky: ["#e8dcc8", "#f6efe3"], sea: ["#b9a888", "#8a7a5c"], sun: "#fff" },
  table: { sky: ["#d9c9ae", "#efe6d6"], sea: ["#7b6a4c", "#4b3f2b"], sun: "#fff" },
  dune: { sky: ["#cfe2ee", "#f6f1e6"], sea: ["#e6d8b8", "#cbb98f"], sun: "#fff3d4" },
};

export default function Scene({ variant = "day", label = "Photo à fournir", className = "", top = false }: { variant?: Variant; label?: string; className?: string; top?: boolean }) {
  const p = palettes[variant];
  const id = `g-${variant}`;
  const horizon = variant === "room" || variant === "table" ? 70 : variant === "dune" ? 55 : 58;
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} role="img" aria-label={`Visuel provisoire — ${label}`}>
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sky[0]} /><stop offset="1" stopColor={p.sky[1]} /></linearGradient>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sea[0]} /><stop offset="1" stopColor={p.sea[1]} /></linearGradient>
          <radialGradient id={`${id}-g`}><stop offset="0" stopColor={p.sun} stopOpacity=".95" /><stop offset="1" stopColor={p.sun} stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#${id}-s)`} />
        {variant !== "room" && variant !== "table" && <circle cx="540" cy={horizon * 6 - 60} r="190" fill={`url(#${id}-g)`} />}
        <rect y={horizon * 6} width="800" height={600 - horizon * 6} fill={`url(#${id}-w)`} />
        {variant === "dune" && <path d="M0 420 Q200 330 420 390 T800 360 V600 H0Z" fill="#e8dbbc" />}
        {(variant === "day" || variant === "dawn" || variant === "dusk") && (
          <g stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none">
            <path d="M80 400h120M300 440h180M560 410h150M150 500h220M470 520h200" />
          </g>
        )}
        {variant === "room" && (<g><rect x="260" y="250" width="280" height="140" rx="14" fill="#fff" opacity=".9" /><rect x="260" y="230" width="280" height="40" rx="14" fill="#0d2238" opacity=".85" /><rect x="90" y="90" width="150" height="190" rx="6" fill="#bcd7ea" opacity=".8" /></g>)}
        {variant === "table" && (<g><ellipse cx="400" cy="380" rx="200" ry="38" fill="#fff" opacity=".85" /><ellipse cx="400" cy="372" rx="120" ry="22" fill="#d9c9ae" /></g>)}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" />
      <span className={`absolute ${top ? "top-3" : "bottom-3"} right-3 rounded-full bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[.2em] text-navy backdrop-blur`}>{label}</span>
    </div>
  );
}
