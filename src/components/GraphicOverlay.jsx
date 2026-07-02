import { useEffect, useMemo, useRef, useState } from 'react';
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

// 底圖拆成三層（滿版方案）：上半部咕咕力橫幅 go-header、底部工作列 go-taskbar、
// 中段為純藍底色（CSS）。商品散落在中段 canvas。
// left/top/width 皆為中段 canvas 的百分比；rot 為旋轉角度。
// top 允許負值＝疊到 header 下緣（桌面版沿用原拼貼構圖）；
// mTop 為手機版覆寫，避免高個子商品把橫幅標題整個蓋住。
const ITEMS = [
  { id: 'tee-best', src: 'items/tee-best.webp', alt: 'BEST tee', left: 3, top: -18.7, mTop: 2, width: 31, rot: -6 },
  { id: 'mirro', src: 'items/mirro.webp', alt: 'Mirror', left: 35, top: -20.2, mTop: 1, width: 31, rot: -4 },
  { id: 'tee-pushover', src: 'items/tee-pushover.webp', alt: 'PUSHOVER tee', left: 66, top: -21.8, mTop: 0, width: 27, rot: 5 },
  { id: 'stickers-1', src: 'items/stickers-1.webp', alt: 'Stickers', left: 2, top: 18.7, width: 14, rot: 8 },
  { id: 'keyring-cat', src: 'items/keyring-cat.webp', alt: 'Cat keyring', left: 16, top: 15.6, width: 13, rot: -7 },
  { id: 'birthday-cake', src: 'items/birthday-cake.webp', alt: 'Birthday cake', left: 29, top: 14, width: 40, rot: 3 },
  { id: 'keyring-car', src: 'items/keyring-car.webp', alt: 'Car keyring', left: 70, top: 15.6, width: 26, rot: 7 },
  { id: 'lighter-long', src: 'items/lighter-long.webp', alt: 'Lighter', left: 2, top: 45.2, width: 7, rot: -14 },
  { id: 'keyring-dog', src: 'items/keyring-dog.webp', alt: 'Dog keyring', left: 14, top: 40.5, width: 15, rot: 6 },
  { id: 'grip-dog', src: 'items/grip-dog.webp', alt: 'Dog grip', left: 31, top: 45.2, width: 15, rot: -9 },
  { id: 'stickers-7', src: 'items/stickers-7.webp', alt: 'Stickers', left: 47, top: 42, width: 20, rot: 5 },
  { id: 'stickers-2', src: 'items/stickers-2.webp', alt: 'Stickers', left: 68, top: 46.7, width: 24, rot: -5 },
  { id: 'grip-hotdog', src: 'items/grip-hotdog.webp', alt: 'Hotdog grip', left: 88, top: 42, width: 11, rot: 12 },
  { id: 'stickers-3', src: 'items/stickers-3.webp', alt: 'Stickers', left: 4, top: 68.5, width: 24, rot: -6 },
  { id: 'stickers-4', src: 'items/stickers-4.webp', alt: 'Stickers', left: 32, top: 70.1, width: 13, rot: 9 },
  { id: 'stickers-5', src: 'items/stickers-5.webp', alt: 'Stickers', left: 47, top: 70.1, width: 13, rot: -8 },
  { id: 'stickers-6', src: 'items/stickers-6.webp', alt: 'Stickers', left: 63, top: 76.3, width: 25, rot: 6 },
  { id: 'lighter-short', src: 'items/lighter-short.webp', alt: 'Lighter', left: 91, top: 67, width: 7, rot: 10 },
];

// 給 BrandSection 在使用者滑到門之前預載，點門進來才不會等圖
export const COLLAGE_ASSETS = [
  `${BASE}/bg/go-header.webp`,
  `${BASE}/bg/go-taskbar.webp`,
  ...ITEMS.map((item) => `${BASE}/${item.src}`),
].map((path) => assetPath(path));

function DraggableItem({ item, offset, z, isMobile }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  // 已存下的位移 + 這次拖曳的即時位移
  const x = offset.x + (transform?.x || 0);
  const y = offset.y + (transform?.y || 0);
  const top = isMobile && item.mTop !== undefined ? item.mTop : item.top;

  const style = {
    left: `${item.left}%`,
    top: `${top}%`,
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
  // 開啟當下判斷一次即可（覆蓋層生命週期短）
  const isMobile = useMemo(() => window.matchMedia('(max-width: 768px)').matches, []);

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
        {/* 噪點在 header/taskbar 之上、商品（positioned 的 canvas）之下 */}
        <div className="graphic-overlay__noise" aria-hidden="true" />
        <img className="graphic-overlay__header" src={assetPath(`${BASE}/bg/go-header.webp`)} alt="GOOGOO STORE" />
        <div className="graphic-overlay__canvas">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {ITEMS.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                offset={offsets[item.id] || { x: 0, y: 0 }}
                z={zMap[item.id] || index + 1}
                isMobile={isMobile}
              />
            ))}
          </DndContext>
        </div>
        <img className="graphic-overlay__taskbar" src={assetPath(`${BASE}/bg/go-taskbar.webp`)} alt="" />
      </div>
    </div>
  );
}
