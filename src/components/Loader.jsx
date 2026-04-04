import { useEffect, useState } from 'react';
import { BRAND } from '../constants';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`loader${hidden ? ' hidden' : ''}`} aria-hidden={hidden}>
      <div className="loader-logo">{BRAND.name}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--gold)', opacity: 0.6, letterSpacing: '0.25em' }}>
        WHERE EVERY HOME TELLS A STORY
      </div>
      <div className="loader-bar" />
    </div>
  );
}
