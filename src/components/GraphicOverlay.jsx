import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import gsap from 'gsap';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/GraphicOverlay.css';

const BASE = '/images/graphic/collage';

// 散落在手機藍色桌面上的去背商品。
// left/top/width 皆為手機框的百分比；rot 為旋轉角度。調位置只改這裡。
const ITEMS = [
  { id: 'tee-best', src: 'items/tee-best.webp', alt: 'BEST tee', left: 3, top: 21, width: 31, rot: -6 },
  { id: 'mirro', src: 'items/mirro.webp', alt: 'Mirror', left: 35, top: 20, width: 31, rot: -4 },
  { id: 'tee-pushover', src: 'items/tee-pushover.webp', alt: 'PUSHOVER tee', left: 66, top: 19, width: 27, rot: 5 },
  { id: 'stickers-1', src: 'items/stickers-1.webp', alt: 'Stickers', left: 2, top: 45, width: 14, rot: 8 },
  { id: 'keyring-cat', src: 'items/keyring-cat.webp', alt: 'Cat keyring', left: 16, top: 43, width: 13, rot: -7 },
  { id: 'birthday-cake', src: 'items/birthday-cake.webp', alt: 'Birthday cake', left: 29, top: 42, width: 40, rot: 3 },
  { id: 'keyring-car', src: 'items/keyring-car.webp', alt: 'Car keyring', left: 70, top: 43, width: 26, rot: 7 },
  { id: 'lighter-long', src: 'items/lighter-long.webp', alt: 'Lighter', left: 2, top: 62, width: 7, rot: -14 },
  { id: 'keyring-dog', src: 'items/keyring-dog.webp', alt: 'Dog keyring', left: 14, top: 59, width: 15, rot: 6 },
  { id: 'grip-dog', src: 'items/grip-dog.webp', alt: 'Dog grip', left: 31, top: 62, width: 15, rot: -9 },
  { id: 'stickers-7', src: 'items/stickers-7.webp', alt: 'Stickers', left: 47, top: 60, width: 20, rot: 5 },
  { id: 'stickers-2', src: 'items/stickers-2.webp', alt: 'Stickers', left: 68, top: 63, width: 24, rot: -5 },
  { id: 'grip-hotdog', src: 'items/grip-hotdog.webp', alt: 'Hotdog grip', left: 88, top: 60, width: 11, rot: 12 },
  { id: 'stickers-3', src: 'items/stickers-3.webp', alt: 'Stickers', left: 4, top: 77, width: 24, rot: -6 },
  { id: 'stickers-4', src: 'items/stickers-4.webp', alt: 'Stickers', left: 32, top: 78, width: 13, rot: 9 },
  { id: 'stickers-5', src: 'items/stickers-5.webp', alt: 'Stickers', left: 47, top: 78, width: 13, rot: -8 },
  { id: 'stickers-6', src: 'items/stickers-6.webp', alt: 'Stickers', left: 63, top: 82, width: 25, rot: 6 },
  { id: 'lighter-short', src: 'items/lighter-short.webp', alt: 'Lighter', left: 91, top: 76, width: 7, rot: 10 },
];

// 給 BrandSection 在使用者滑到門之前預載，點門進來才不會等圖
export const COLLAGE_ASSETS = [
  `${BASE}/bg/bg-phone-nocam.webp`,
  ...ITEMS.map((item) => `${BASE}/${item.src}`),
].map((path) => assetPath(path));

function DraggableItem({ item, offset, z }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  // 已存下的位移 + 這次拖曳的即時位移
  const x = offset.x + (transform?.x || 0);
  const y = offset.y + (transform?.y || 0);

  const style = {
    left: `${item.left}%`,
    top: `${item.top}%`,
    width: `${item.width}%`,
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${item.rot}deg)`,
    zIndex: z,
  };

  return (
    <button
      ref={setNodeRef}
      className={`graphic-overlay__item${isDragging ? ' is-dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <img src={assetPath(`${BASE}/${item.src}`)} alt={item.alt} draggable="false" />
    </button>
  );
}

export default function GraphicOverlay({ onClose }) {
  const overlayRef = useRef(null);
  const [offsets, setOffsets] = useState({}); // 每件商品拖曳後保留的位移 (px)
  const [zMap, setZMap] = useState({}); // 拖過的商品浮到最上層
  const zCounter = useRef(ITEMS.length);

  // 小門檻：避免輕點就觸發拖曳
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragStart = ({ active }) => {
    zCounter.current += 1;
    setZMap((prev) => ({ ...prev, [active.id]: zCounter.current }));
  };

  const handleDragEnd = ({ active, delta }) => {
    setOffsets((prev) => ({
      ...prev,
      [active.id]: {
        x: (prev[active.id]?.x || 0) + delta.x,
        y: (prev[active.id]?.y || 0) + delta.y,
      },
    }));
  };

  useEffect(() => {
    if (!overlayRef.current) return undefined;
    const items = overlayRef.current.querySelectorAll('.graphic-overlay__item');
    if (!items.length) return undefined;
    const tween = gsap.from(items, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.05,
      transformOrigin: '50% 50%',
    });
    return () => tween.revert();
  }, []);

  return (
    <div className="graphic-overlay" ref={overlayRef}>
      <button className="graphic-overlay__close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className="graphic-overlay__frame">
        <img className="graphic-overlay__bg" src={assetPath(`${BASE}/bg/bg-phone-nocam.webp`)} alt="GOOGOO STORE" />
        <div className="graphic-overlay__noise" aria-hidden="true" />
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {ITEMS.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              offset={offsets[item.id] || { x: 0, y: 0 }}
              z={zMap[item.id] || index + 1}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
