import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';

const TESTIMONIALS = [
  {
    text: "I found my flat in GRA through G & G Homes on WhatsApp. No agent, no stress, no extra fees. I paid my rent directly and moved in within a week.",
    author: "Adaeze O.",
    location: "Abakaliki",
  },
  {
    text: "As a landlord, I listed my property and had a verified tenant within 10 days. G & G Homes handled everything. I just received my payment alert.",
    author: "Chief Emmanuel N.",
    location: "GRA, Abakaliki",
  },
  {
    text: "I was skeptical about finding a house on WhatsApp but G & G Homes sent me photos, videos, and even scheduled my inspection through the chat. Incredible.",
    author: "Emeka U.",
    location: "Kpirikpiri",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonials" id="testimonials" aria-labelledby="testimonials-heading" ref={ref}>
      <div className="testimonials-header">
        <span className="section-label gold-text">WHAT OUR CLIENTS SAY</span>
        <h2 className="testimonials-title" id="testimonials-heading">
          Trusted by Clients Across Growing Markets
        </h2>
      </div>

      <div className={`testimonials-carousel reveal reveal-delay-1${visible ? ' visible' : ''}`}>
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className={`testimonial-slide ${i === current ? 'active' : ''}`}
            aria-hidden={i !== current}
          >
            <div className="testimonial-card">
              <span className="quote-mark">“</span>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-loc">{t.location}</div>
            </div>
          </div>
        ))}

        <div className="carousel-dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
