import { useReveal } from '../hooks/useReveal';

const SERVICES = [
  {
    icon: '🏛️',
    name: 'Property Sales',
    desc: 'Premium residential and commercial properties across multiple markets, curated for quality and value.',
    wa: false,
  },
  {
    icon: '💬',
    name: 'Rental Management via G & G Homes',
    desc: 'Our WhatsApp platform connects landlords and tenants directly, eliminating agent fees entirely.',
    wa: true,
  },
  {
    icon: '📊',
    name: 'Real Estate Consulting',
    desc: 'Expert guidance on property investment, valuation, and market trends across diverse real estate markets.',
    wa: false,
  },
  {
    icon: '🏗️',
    name: 'Property Development',
    desc: 'Partnering with developers to bring world-class residential estates to high-potential locations.',
    wa: false,
  },
];

export default function Services() {
  const { ref, visible } = useReveal();

  return (
    <section className="services" id="services" aria-labelledby="services-heading" ref={ref}>
      <div className="services-header">
        <span className="section-label gold-text">OUR SERVICES</span>
        <h2 className="services-title" id="services-heading">
          Everything You Need in Real Estate
        </h2>
      </div>

      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <div
            key={s.name}
            className={`service-card reveal reveal-delay-${i + 1}${visible ? ' visible' : ''}`}
          >
            {s.wa && <span className="wa-badge">Live on WhatsApp</span>}
            <div className="service-icon">{s.icon}</div>
            <h3 className="service-name">{s.name}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
