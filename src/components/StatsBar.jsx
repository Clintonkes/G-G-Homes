import { useEffect, useRef, useState } from 'react';

const STATS = [
  { end: 500, suffix: '+', label: 'Properties Listed' },
  { end: 1200, suffix: '+', label: 'Happy Clients' },
  { end: 8, suffix: '', label: 'Years Experience' },
  { end: 13, suffix: '', label: 'Locations Covered' },
];

function useCountUp(end, duration = 2000, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

function StatItem({ stat, active, idx }) {
  const count = useCountUp(stat.end, 2000, active);
  return (
    <div className={`stat-item reveal reveal-delay-${idx + 1}${active ? ' visible' : ''}`}>
      <span className="stat-number">{count}{stat.suffix}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

export default function StatsBar() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-bar" ref={ref} aria-label="Company statistics">
      {STATS.map((s, i) => (
        <StatItem key={s.label} stat={s} active={active} idx={i} />
      ))}
    </section>
  );
}
