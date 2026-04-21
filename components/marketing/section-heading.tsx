export function SectionHeading({ label, title, body, invert = false }: { label: string; title: string; body?: string; invert?: boolean }) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">{label}</p>
      <h2 className={invert ? "text-brand-white" : "text-brand-dark-text"}>{title}</h2>
      {body ? <p className={invert ? "text-base leading-8 text-brand-white/72" : "text-base leading-8 text-brand-gray"}>{body}</p> : null}
    </div>
  );
}
