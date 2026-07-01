import { useEffect, useRef, useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import gsap from 'gsap';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/GraphicOverlay.css';

const ITEMS = [
  { id: 'tshirt', label: 'T-shirt', image: '/images/graphic/item-tshirt.png', x: 15, y: 20 },
  { id: 'sticker', label: 'Sticker', image: '/images/graphic/item-sticker.png', x: 60, y: 15 },
  { id: 'poster', label: 'Poster', image: '/images/graphic/item-poster.png', x: 30, y: 55 },
  { id: 'keyring', label: 'Keyring', image: '/images/graphic/item-keyring.png', x: 70, y: 60 },
  { id: 'market', label: 'Market', image: '/images/graphic/item-market.png', x: 45, y: 35 },
];

function DraggableItem({ item, onSelect }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const style = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <button
      ref={setNodeRef}
      className="graphic-overlay__item"
      style={style}
      onClick={() => onSelect(item)}
      {...listeners}
      {...attributes}
    >
      <img src={assetPath(item.image)} alt={item.label} />
    </button>
  );
}

export default function GraphicOverlay({ onClose }) {
  const overlayRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!overlayRef.current) return undefined;
    const items = overlayRef.current.querySelectorAll('.graphic-overlay__item');
    if (!items.length) return undefined;
    const tween = gsap.from(items, {
      x: () => gsap.utils.random(-400, 400),
      y: () => gsap.utils.random(-400, 400),
      opacity: 0,
      rotation: () => gsap.utils.random(-90, 90),
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
    });
    return () => tween.revert();
  }, []);

  return (
    <div className="graphic-overlay" ref={overlayRef}>
      <img className="graphic-overlay__bg" src={assetPath('/images/graphic/overlay-bg.jpg')} alt="" />
      <button className="graphic-overlay__close" onClick={onClose}>
        ✕
      </button>
      <DndContext>
        {ITEMS.map((item) => (
          <DraggableItem key={item.id} item={item} onSelect={setSelected} />
        ))}
      </DndContext>
      {selected && (
        <div className="graphic-overlay__card" onClick={() => setSelected(null)}>
          <img src={assetPath(selected.image)} alt={selected.label} />
          <p>{selected.label}</p>
        </div>
      )}
    </div>
  );
}
