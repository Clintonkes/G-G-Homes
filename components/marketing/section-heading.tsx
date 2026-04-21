export function SectionHeading({ label, title, body }: { label: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">{label}</p>
      <h2 className="text-brand-dark-text">{title}</h2>
      {body ? <p className="text-base leading-8 text-brand-gray">{body}</p> : null}
    </div>
  );
}
