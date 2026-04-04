import { useReveal } from '../hooks/useReveal';
import { BRAND, WA_LINK } from '../constants';

export default function Contact() {
  const { ref, visible } = useReveal();

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading" ref={ref}>
      <div className="contact-header">
        <span className="section-label gold-text">GET IN TOUCH</span>
        <h2 className="contact-title" id="contact-heading">
          Let's Find Your Perfect Property
        </h2>
      </div>

      <div className="contact-inner">
        {/* Left: Details */}
        <div className={`reveal reveal-delay-1${visible ? ' visible' : ''}`}>
          <div className="contact-detail">
            <span className="contact-icon">📞</span>
            <div>
              <span className="contact-label">Phone</span>
              <div className="contact-value">
                <a href={`tel:${BRAND.phone}`}>{BRAND.phone}</a>
              </div>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-icon">✉</span>
            <div>
              <span className="contact-label">Email</span>
              <div className="contact-value">
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </div>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-icon">📍</span>
            <div>
              <span className="contact-label">Address</span>
              <div className="contact-value">{BRAND.address}</div>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-icon">🔗</span>
            <div>
              <span className="contact-label">RC Number</span>
              <div className="contact-value">{BRAND.rc}</div>
            </div>
          </div>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            id="contact-wa-btn"
            style={{ marginTop: '2rem', padding: '1rem 2rem' }}
          >
            <span>💬</span> Chat With Us on WhatsApp
          </a>
        </div>

        {/* Right: Form */}
        <form
          className={`contact-form reveal reveal-delay-2${visible ? ' visible' : ''}`}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Full Name" required />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" placeholder="+234..." required />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="email@address.com" required />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="How can we help you?" required></textarea>
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: '1rem' }}>
            Submit Message
          </button>
        </form>
      </div>
    </section>
  );
}
