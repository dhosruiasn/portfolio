import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { src: '/images/graphic/poster/poster_1.png', alt: 'Mirror poster' },
  { src: '/images/graphic/poster/poster_2.png', alt: 'Story poster' },
  { src: '/images/graphic/poster/poster_3.png', alt: 'MEOW TEE poster' },
  { src: '/images/graphic/collage/items/tee-best.webp', alt: 'BEST tee merchandise' },
  { src: '/images/graphic/collage/items/birthday-cake.webp', alt: 'Birthday cake merchandise' },
  { src: '/images/graphic/collage/items/keyring-cat.webp', alt: 'Cat keyring merchandise' },
];

export default function Gallery() {
  const { t } = useLanguage();
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return undefined;
    const items = gridRef.current.querySelectorAll('.gallery__item');
    if (!items.length) return undefined;
    const tween = gsap.from(items, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
      },
    });
    return () => tween.revert();
  }, []);

  return (
    <section className="section section--texture gallery">
      <div className="container">
        <h3 className="gallery__title">{t.gallery.title}</h3>
        <div className="gallery__grid" ref={gridRef}>
          {IMAGES.map((item, i) => (
            <div
              key={item.src}
              className="gallery__item"
              style={i === 0 ? { gridRow: 'span 2' } : undefined}
            >
              <img src={assetPath(item.src)} alt={item.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
