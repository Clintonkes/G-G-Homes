import { scrollToSection } from '../utils';
import { BRAND, WA_LINK } from '../constants';

export default function Footer() {
  return (
    <footer className="footer" id="footer" aria-label="Site footer">
      <div className="footer-top">
        {/* Brand */}
        <div>
          <span className="footer-logo-text">{BRAND.name}</span>
          <span className="footer-tagline">“{BRAND.tagline}”</span>
          <div className="footer-rentease">G & G Homes — our WhatsApp-native platform</div>
        </div>

        {/* Links */}
        <div>
          <span className="footer-col-title">QUICK LINKS</span>
          <ul className="footer-links">
            <li><a onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>G & G Homes Home</a></li>
            <li><a onClick={() => scrollToSection('properties')} style={{ cursor: 'pointer' }}>Featured Properties</a></li>
            <li><a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-link">G & G Homes on WhatsApp</a></li>
            <li><a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer' }}>Our Services</a></li>
            <li><a onClick={() => scrollToSection('contact')} style={{ cursor: 'pointer' }}>Get In Touch</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <span className="footer-col-title">CONTACT INFO</span>
          <div className="footer-contact-line">
            <span className="footer-contact-icon">📞</span>
            <span>{BRAND.phone}</span>
          </div>
          <div className="footer-contact-line">
            <span className="footer-contact-icon">✉</span>
            <span>{BRAND.email}</span>
          </div>
          <div className="footer-contact-line">
            <span className="footer-contact-icon">📍</span>
            <span>{BRAND.address}</span>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            style={{ marginTop: '1.2rem', padding: '0.6rem 1.2rem', fontSize: '0.65rem' }}
          >
            <span>💬</span> Message Us
          </a>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} {BRAND.name} &middot; RC Number: {BRAND.rc} &middot; {BRAND.address} &middot; All rights reserved.
      </div>
    </footer>
  );
}
