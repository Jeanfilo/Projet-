import type { ReactNode } from "react";
type Props = { href?: string; variant?: "gold" | "ghost" | "navy" | "outline"; children: ReactNode; external?: boolean; disabled?: boolean; type?: "button" | "submit"; onClick?: () => void };
export default function Button({ href, variant = "gold", children, external, disabled, type = "button", onClick }: Props) {
  const cls = `btn btn-${variant}`;
  const inner = (<><span>{children}</span><span className="arrow" aria-hidden>→</span></>);
  if (href && !disabled) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
  if (href && disabled) return <span className={cls} aria-disabled="true">{inner}</span>;
  return <button type={type} className={cls} onClick={onClick}>{inner}</button>;
}
