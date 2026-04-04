import { useEffect, useState } from 'react';
import { scrollToSection } from '../utils';
import { BRAND, WA_LINK } from '../constants';

const links = [
  { label: 'Properties', id: 'properties' },
  { label: 'G & G Homes', id: 'platform' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Contact', id: 'contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <a onClick={() => scrollToSection('hero')} className="navbar-logo" style={{ cursor: 'pointer' }}>{BRAND.name}</a>

      <ul className="navbar-links">
        {links.map(link => (
          <li key={link.id}>
            <a onClick={() => scrollToSection(link.id)} style={{ cursor: 'pointer' }}>{link.label}</a>
          </li>
        ))}
        <li>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.65rem' }}
            id="nav-wa-btn"
          >
            <span>📱</span> Open G & G Homes
          </a>
        </li>
      </ul>
    </nav>
  );
}
