import { useEffect, useRef } from 'react';
import { WA_LINK } from '../constants';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=85&auto=format&fit=crop';

const headline = ['Discover', 'Homes', 'That', 'Define', 'Excellence'];

export default function Hero() {
  const bgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="hero" aria-label="Hero">
      <div
        ref={bgRef}
        className="hero-bg"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        role="img"
        aria-label="Aerial view of luxury residential estate"
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-label">
          PREMIUM REAL ESTATE · EBONYI STATE · NIGERIA
        </span>

        <h1 className="hero-title">
          {headline.map((word, i) => (
            <span
              key={word}
              className="word"
              style={{ animationDelay: `${0.7 + i * 0.12}s`, marginRight: '0.25em' }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle">
          G &amp; G Homes connects discerning buyers and tenants with exceptional
          properties across Ebonyi State and Southeast Nigeria.
        </p>

        <div className="hero-btns">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            id="hero-explore-btn"
          >
            Explore Properties on WhatsApp
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            id="hero-wa-btn"
          >
            <span>💬</span> Start Your Journey on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
