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
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock.js';
import '../styles/components/GraphicOverlay.css';

const BASE = '/images/graphic/collage';

// StrictMode 安全的 history 清理：cleanup 排程 back()，重掛載時取消（見下方 effect）
let pendingCollageBack = null;

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

function DraggableItem({ item, offset, z, isMobile, jitter }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  // 已存下的位移 + 這次拖曳的即時位移
  const x = offset.x + (transform?.x || 0);
  const y = offset.y + (transform?.y || 0);
  const baseTop = isMobile && item.mTop !== undefined ? item.mTop : item.top;
  // 手機商品放大（1.18，比 1.3 溫和以減少重疊）；不再往中央收攏（那會讓商品橫向擠成一團），
  // 保留原本橫跨整個畫布的分佈，只夾住右緣避免出界。垂直額外拉開讓商品分散。
  const width = isMobile ? item.width * 1.18 : item.width;
  const baseLeft = isMobile ? item.left : item.left;
  const baseTopSpread = isMobile ? baseTop * 1.12 : baseTop;
  // 每次開啟的隨機抖動（left/top/rot），限制在畫布內
  const left = Math.min(Math.max(0, 98 - width), Math.max(0, baseLeft + (jitter?.dl || 0)));
  const top = baseTopSpread + (jitter?.dt || 0);

  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${item.rot + (jitter?.dr || 0)}deg)`,
    zIndex: z,
  };

  return (
    <button
      ref={setNodeRef}
      data-item-id={item.id}
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
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 手機返回手勢＝關閉拼貼頁（onClose 走 ref，避免父層 inline function 重跑 effect）。
  // cleanup 的 back() 延遲執行、重掛載時取消：StrictMode 的「掛載→清理→再掛載」
  // 會讓立即 back() 觸發 popstate 把剛開的 overlay 關掉（實機閃退）
  useEffect(() => {
    let closedByPop = false;
    if (pendingCollageBack) {
      clearTimeout(pendingCollageBack);
      pendingCollageBack = null;
    } else {
      window.history.pushState({ portfolioOverlay: 'collage' }, '');
    }
    const onPop = () => {
      closedByPop = true;
      onCloseRef.current?.();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (!closedByPop) {
        pendingCollageBack = setTimeout(() => {
          pendingCollageBack = null;
          window.history.back();
        }, 60);
      }
    };
  }, []);
  // 開啟當下判斷一次即可（覆蓋層生命週期短）
  const isMobile = useMemo(() => window.matchMedia('(max-width: 768px)').matches, []);

  // 每次開啟商品排法都不一樣：位置 ±5%、旋轉 ±8°（掛載時算一次）
  const jitters = useMemo(() => {
    const map = {};
    ITEMS.forEach((item) => {
      map[item.id] = {
        dl: (Math.random() - 0.5) * 10,
        dt: (Math.random() - 0.5) * 8,
        dr: (Math.random() - 0.5) * 16,
      };
    });
    return map;
  }, []);

  // 小門檻：避免輕點就觸發拖曳
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const [showHint, setShowHint] = useState(true);

  const handleDragStart = ({ active }) => {
    setShowHint(false);
    zCounter.current += 1;
    setZMap((prev) => ({ ...prev, [active.id]: zCounter.current }));
  };

  const handleDragEnd = ({ active, delta }) => {
    // 拖曳邊界：讓商品至少留一部分在畫面內，不會被甩出去救不回來
    const frame = overlayRef.current?.querySelector('.graphic-overlay__frame');
    const el = overlayRef.current?.querySelector(`[data-item-id="${active.id}"]`);
    setOffsets((prev) => {
      let x = (prev[active.id]?.x || 0) + delta.x;
      let y = (prev[active.id]?.y || 0) + delta.y;
      if (frame && el) {
        const fr = frame.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const margin = 40; // 至少保留 40px 在框內
        // er 已含本次拖曳位移；換算成相對 frame 的可回收範圍
        const overRight = er.left - (fr.right - margin);
        const overLeft = (fr.left + margin) - er.right;
        const overBottom = er.top - (fr.bottom - margin);
        const overTop = (fr.top + margin) - er.bottom;
        if (overRight > 0) x -= overRight;
        if (overLeft > 0) x += overLeft;
        if (overBottom > 0) y -= overBottom;
        if (overTop > 0) y += overTop;
      }
      return { ...prev, [active.id]: { x, y } };
    });
  };

  // 鎖住底下頁面的捲動（iOS 正解 position:fixed，見 scrollLock）——
  // 否則手機拖曳／滑動會讓主頁偷偷捲動，關閉後位置錯亂
  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return undefined;
    const items = overlayRef.current.querySelectorAll('.graphic-overlay__item');
    if (!items.length) return undefined;
    const tween = gsap.from(items, {
      scale: 0,
      opacity: 0,
      duration: 0.36,
      ease: 'back.out(1.7)',
      stagger: 0.022,
      transformOrigin: '50% 50%',
    });
    return () => tween.revert();
  }, []);

  return (
    <div className="graphic-overlay" ref={overlayRef}>
      <button className="graphic-overlay__close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
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
                jitter={jitters[item.id]}
              />
            ))}
          </DndContext>
        </div>
        <img className="graphic-overlay__taskbar" src={assetPath(`${BASE}/bg/go-taskbar.webp`)} alt="" />
      </div>
      {showHint && (
        <div className="graphic-overlay__hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 11V5.5a1.5 1.5 0 013 0V11m0-1.5a1.5 1.5 0 013 0V12m0-1a1.5 1.5 0 013 0v4a5 5 0 01-5 5h-1.5a5 5 0 01-4.3-2.5L6 15a1.6 1.6 0 012.7-1.7l.8.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {isMobile ? '拖拖看商品' : 'Drag the goods around'}
        </div>
      )}
    </div>
  );
}
