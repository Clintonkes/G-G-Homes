import { useReveal } from '../hooks/useReveal';
import { WA_LINK } from '../constants';

const TRUST_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85&auto=format&fit=crop';

const POINTS = [
  'Zero agent fees on all G & G Homes rentals',
  'Verified and inspected properties only',
  'End-to-end transaction support via WhatsApp',
  '100% transparent pricing — no hidden charges',
  'Automated rent renewal reminders for every tenant',
  'Landlord payments processed within 24 hours',
];

export default function WhyChooseUs() {
  const { ref, visible } = useReveal();

  return (
    <section className="why-us" id="about" aria-labelledby="why-heading" ref={ref}>
      <div className="why-us-inner">
        {/* Left: Gold-framed image */}
        <div className={`why-img-frame reveal${visible ? ' visible' : ''}`}>
          <img
            src={TRUST_IMG}
            alt="Professional real estate consultation at G & G Homes"
            className="why-img"
            loading="lazy"
          />
        </div>

        {/* Right: Text */}
        <div>
          <span className={`section-label why-text-label reveal${visible ? ' visible' : ''}`}>
            OUR PROMISE
          </span>

          <h2
            className={`why-title reveal reveal-delay-1${visible ? ' visible' : ''}`}
            id="why-heading"
          >
            Built on Trust. Driven by Excellence.
          </h2>

          <ul className={`why-list reveal reveal-delay-2${visible ? ' visible' : ''}`}>
            {POINTS.map(p => (
              <li key={p} className="why-item">
                <span className="why-check">✦</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline reveal reveal-delay-3${visible ? ' visible' : ''}`}
            id="why-learn-more-btn"
          >
            Connect on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
