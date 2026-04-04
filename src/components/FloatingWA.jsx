import { WA_LINK } from '../constants';

export default function FloatingWA() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      id="floating-wa-btn"
      aria-label="Find a Home on G & G Homes"
    >
      <span className="floating-wa-label">Find a Home on G & G Homes</span>
      <div className="floating-wa-btn">
        <span>💬</span>
      </div>
    </a>
  );
}
