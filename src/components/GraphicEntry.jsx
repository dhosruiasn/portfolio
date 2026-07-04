import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import GraphicOverlay from './GraphicOverlay.jsx';
import '../styles/components/GraphicEntry.css';

export default function GraphicEntry() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="graphic-entry">
        <button className="graphic-entry__image" onClick={() => setOpen(true)}>
          <img src={assetPath('/images/graphic/collage/bg/go-header.webp')} alt="Graphic Works" />
          <span className="graphic-entry__cta">{t.enter}</span>
        </button>
      </div>
      {open && <GraphicOverlay onClose={() => setOpen(false)} />}
    </>
  );
}
