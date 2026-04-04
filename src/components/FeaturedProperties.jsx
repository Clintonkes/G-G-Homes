import { useReveal } from '../hooks/useReveal';
import { WA_LINK } from '../constants';

const PROPERTIES = [
  {
    id: 'prop-duplex',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop',
    name: 'Luxury 4-Bedroom Duplex',
    address: 'GRA, Abakaliki',
    price: '₦45,000,000',
    type: 'sale',
  },
  {
    id: 'prop-flat',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop',
    name: 'Modern 3-Bedroom Flat',
    address: 'Waterworks Road, Abakaliki',
    price: '₦180,000/year',
    type: 'rent',
  },
  {
    id: 'prop-commercial',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop',
    name: 'Commercial Office Space',
    address: 'Ogoja Road, Abakaliki',
    price: '₦2,500,000/year',
    type: 'rent',
  },
];

export default function FeaturedProperties() {
  const { ref, visible } = useReveal();

  return (
    <section className="properties" id="properties" aria-labelledby="properties-heading" ref={ref}>
      <div className="properties-header">
        <span className="section-label gold-text">FEATURED LISTINGS</span>
        <h2 className="properties-title" id="properties-heading">
          Properties Curated for the Discerning
        </h2>
      </div>

      <div className="properties-grid">
        {PROPERTIES.map((p, i) => (
          <article
            key={p.id}
            id={p.id}
            className={`prop-card reveal reveal-delay-${i + 1}${visible ? ' visible' : ''}`}
          >
            <div className="prop-img-wrap">
              <img src={p.img} alt={p.name} className="prop-img" loading="lazy" />
              <div className="prop-price-tag">{p.price}</div>
            </div>
            <div className="prop-body">
              <h3 className="prop-name">{p.name}</h3>
              <p className="prop-address">📍 {p.address}</p>
              {p.type === 'rent' && (
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                  id={`${p.id}-wa-btn`}
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.65rem', borderRadius: '4px' }}
                >
                  <span>💬</span> Enquire on WhatsApp
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
