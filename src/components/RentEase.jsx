import { WA_LINK } from '../constants';
import { useReveal } from '../hooks/useReveal';

function PhoneMockup() {
  return (
    <div className="phone-mockup">
      <div className="phone-outer">
        <div className="phone-screen">
          {/* WhatsApp Header */}
          <div className="wa-header">
            <div className="wa-avatar">🏠</div>
            <div>
              <div className="wa-name">G & G Homes Concierge</div>
              <div className="wa-status">● Online</div>
            </div>
          </div>

          {/* Chat body */}
          <div className="wa-body">
            <div className="wa-msg-user">
              Hello
              <span className="wa-msg-time">2:14 PM ✓✓</span>
            </div>

            <div className="wa-msg-bot">
              🏠 <strong>Welcome to G & G Homes Nigeria!</strong>
              <br /><br />
              Find and rent properties in Ebonyi State — <strong>no agent fees.</strong>
              <br /><br />
              What would you like to do?
              <div className="wa-btns">
                <div className="wa-btn-item">🔍 Find a House</div>
                <div className="wa-btn-item">🏠 List My Property</div>
                <div className="wa-btn-item">👤 My Account</div>
              </div>
              <span className="wa-msg-time">2:14 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Platform() {
  const { ref, visible } = useReveal();

  return (
    <section className="rentease" id="platform" aria-labelledby="platform-heading">
      <div className="rentease-pattern" aria-hidden="true" />

      <div className="rentease-inner" ref={ref}>
        {/* Left: Text + Steps */}
        <div>
          <span className="section-label rentease-label">G & G HOMES EXCELLENCE</span>

          <h2 className="rentease-title" id="platform-heading">
            Rent a Home in Ebonyi State Directly from G & G Homes
          </h2>

          <p className="rentease-sub">
            G & G Homes is Nigeria's first WhatsApp-native real estate platform.
            Search properties, view photos and videos, book inspections, and pay your rent —
            all inside WhatsApp. No app to download. No agent. No hidden fees.
          </p>

          {/* 3-Step Flow */}
          <div className="steps-flow">
            {[
              { num: '01', icon: '💬', bg: 'wa-bg', label: 'Message G & G Homes on WhatsApp' },
              { num: '02', icon: '🔍', bg: 'gold-bg', label: 'Search properties by location & budget' },
              { num: '03', icon: '🏠', bg: 'gold-bg', label: 'Book inspection, pay rent, move in' },
            ].map(s => (
              <div key={s.num} className="step-item">
                <span className="step-num">{s.num}</span>
                <div className={`step-icon ${s.bg}`}>{s.icon}</div>
                <div className="step-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rentease-cta-wrap">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
              id="rentease-main-cta"
              style={{ padding: '1rem 2.2rem', fontSize: '0.78rem' }}
            >
              <span>💬</span> Start Your Journey on WhatsApp
            </a>
            <p className="rentease-beta">
              Premium Property Experience — available to residents of Abakaliki and Ebonyi State
            </p>
          </div>
        </div>

        {/* Right: Phone Mockup */}
        <div className={`reveal${visible ? ' visible' : ''}`}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
