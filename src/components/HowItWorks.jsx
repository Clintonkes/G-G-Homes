import { useReveal } from '../hooks/useReveal';
import { WA_LINK } from '../constants';

const STEPS = [
  {
    n: 1,
    title: 'Message G & G Homes',
    text: 'Send a WhatsApp message to our G & G Homes number. No registration. No password. Just message.',
    icon: '💬',
  },
  {
    n: 2,
    title: 'Search Properties',
    text: 'Tell us your preferred neighbourhood, budget, and property type. We show you verified listings with photos and videos.',
    icon: '🔍',
  },
  {
    n: 3,
    title: 'Book an Inspection',
    text: 'Choose a property you like and schedule a physical visit directly in the chat. A G & G Homes coordinator will be present.',
    icon: '📅',
  },
  {
    n: 4,
    title: 'Make Payment',
    text: 'Decided? Pay your rent securely through our Paystack-powered payment link — sent directly in WhatsApp.',
    icon: '💳',
  },
  {
    n: 5,
    title: 'Move In',
    text: 'Your tenancy is registered. You receive reminders 90, 60, and 30 days before renewal. Your landlord gets paid. No agents involved.',
    icon: '🏠',
  },
];

export default function HowItWorks() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="how-works" id="how-it-works" aria-labelledby="how-heading" ref={ref}>
      <div className="how-works-header">
        <span className="section-label gold-text">HOW IT WORKS</span>
        <h2 className="how-works-title" id="how-heading">
          From WhatsApp Message to New Home in 5 Steps
        </h2>
      </div>

      <div className="timeline">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`timeline-step reveal reveal-delay-${Math.min(i + 1, 5)}${visible ? ' visible' : ''}`}
          >
            <div className="timeline-dot">{s.n}</div>
            <div className="timeline-content">
              <h3 className="timeline-title">
                {s.icon} {s.title}
              </h3>
              <p className="timeline-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="how-works-cta">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
          id="how-works-cta-btn"
          style={{ padding: '1rem 2.4rem', fontSize: '0.78rem' }}
        >
          <span>💬</span> Try G & G Homes Now
        </a>
      </div>
    </section>
  );
}
