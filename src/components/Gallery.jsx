import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  '/images/graphic/gallery-1.jpg',
  '/images/graphic/gallery-2.jpg',
  '/images/graphic/gallery-3.jpg',
  '/images/graphic/gallery-4.jpg',
  '/images/graphic/gallery-5.jpg',
  '/images/graphic/gallery-6.jpg',
];

export default function Gallery() {
  const { t } = useLanguage();
  const gridRef = useRef(null);

  useEffect(() => {
    const items = gridRef.current.querySelectorAll('.gallery__item');
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
          {IMAGES.map((src, i) => (
            <div
              key={src}
              className="gallery__item"
              style={i === 0 ? { gridRow: 'span 2' } : undefined}
            >
              <img src={assetPath(src)} alt={`graphic-${i}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
