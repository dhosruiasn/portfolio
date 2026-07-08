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
// top 可保留原本構圖的負值，但渲染時會依商品尺寸夾進 canvas；
// mTop 為手機版覆寫，避免高個子商品把橫幅標題整個蓋住。
const ITEMS = [
  { id: 'tee-best', src: 'items/tee-best.webp', alt: 'BEST tee', left: 2, top: -18.5, mLeft: 2, mTop: 6, mWidth: 32, width: 29, rot: -6 },
  { id: 'mirro', src: 'items/mirro.webp', alt: 'Mirror', left: 36, top: -19, mLeft: 36, mTop: 4, mWidth: 30.5, width: 28, rot: -4 },
  { id: 'tee-pushover', src: 'items/tee-pushover.webp', alt: 'PUSHOVER tee', left: 70, top: -20, mLeft: 70, mTop: 6, mWidth: 27.5, width: 25, rot: 5 },
  { id: 'stickers-1', src: 'items/stickers-1.webp', alt: 'Stickers', left: 5, top: 42, mLeft: 4, mTop: 37, mWidth: 16.5, width: 11, rot: 8 },
  { id: 'keyring-cat', src: 'items/keyring-cat.webp', alt: 'Cat keyring', left: 23, top: 45, mLeft: 24, mTop: 42, mWidth: 13, width: 10.5, rot: -7 },
  { id: 'birthday-cake', src: 'items/birthday-cake.webp', alt: 'Birthday cake', left: 38, top: 22, mLeft: 36, mTop: 27, mWidth: 36, width: 30, rot: 3 },
  { id: 'keyring-car', src: 'items/keyring-car.webp', alt: 'Car keyring', left: 78, top: 57, mLeft: 78, mTop: 54, mWidth: 20, width: 18, rot: 7 },
  { id: 'lighter-long', src: 'items/lighter-long.webp', alt: 'Lighter', left: 2, top: 60, mLeft: 2, mTop: 58, mWidth: 7.5, width: 6.5, rot: -14 },
  { id: 'keyring-dog', src: 'items/keyring-dog.webp', alt: 'Dog keyring', left: 16, top: 69, mLeft: 15, mTop: 59, mWidth: 15.5, width: 12.5, rot: 6 },
  { id: 'stickers-7', src: 'items/stickers-7.webp', alt: 'Stickers', left: 39, top: 58, mLeft: 38, mTop: 51, mWidth: 20, width: 16, rot: 5 },
  { id: 'stickers-2', src: 'items/stickers-2.webp', alt: 'Stickers', left: 62, top: 61, mLeft: 61, mTop: 55, mWidth: 23.5, width: 19, rot: -5 },
  { id: 'grip-hotdog', src: 'items/grip-hotdog.webp', alt: 'Hotdog grip', left: 89, top: 72, mLeft: 88, mTop: 68, mWidth: 10.5, width: 8.5, rot: 12 },
  { id: 'stickers-3', src: 'items/stickers-3.webp', alt: 'Stickers', left: 5, top: 88, mLeft: 4, mTop: 82, mWidth: 23.5, width: 19, rot: -6 },
  { id: 'stickers-4', src: 'items/stickers-4.webp', alt: 'Stickers', left: 30, top: 86, mLeft: 30, mTop: 81, mWidth: 13, width: 10.5, rot: 9 },
  { id: 'stickers-5', src: 'items/stickers-5.webp', alt: 'Stickers', left: 47, top: 84, mLeft: 48, mTop: 78, mWidth: 13, width: 10.5, rot: -8 },
  { id: 'stickers-6', src: 'items/stickers-6.webp', alt: 'Stickers', left: 66, top: 87, mLeft: 66, mTop: 83, mWidth: 24, width: 20, rot: 6 },
  { id: 'lighter-short', src: 'items/lighter-short.webp', alt: 'Lighter', left: 93, top: 91, mLeft: 92, mTop: 86, mWidth: 7.6, width: 6.2, rot: 10 },
];

const ITEM_ASPECTS = {
  'tee-best': 1600 / 824,
  mirro: 884 / 907,
  'tee-pushover': 1600 / 623,
  'stickers-1': 891 / 634,
  'keyring-cat': 947 / 430,
  'birthday-cake': 1263 / 1600,
  'keyring-car': 685 / 884,
  'lighter-long': 1274 / 299,
  'keyring-dog': 880 / 533,
  'stickers-7': 785 / 1003,
  'stickers-2': 562 / 1078,
  'grip-hotdog': 623 / 480,
  'stickers-3': 562 / 1077,
  'stickers-4': 878 / 633,
  'stickers-5': 897 / 631,
  'stickers-6': 355 / 870,
  'lighter-short': 774 / 280,
};

// 給 BrandSection 在使用者滑到門之前預載，點門進來才不會等圖
export const COLLAGE_ASSETS = [
  `${BASE}/bg/go-header.webp`,
  `${BASE}/bg/go-taskbar.webp`,
  ...ITEMS.map((item) => `${BASE}/${item.src}`),
].map((path) => assetPath(path));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function DraggableItem({ item, offset, z, isMobile, jitter, canvasSize }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const imageSrc = assetPath(`${BASE}/${item.src}`);
  const isSticker = item.id.startsWith('stickers-');
  const stickerIndex = isSticker ? Number(item.id.replace('stickers-', '')) || 0 : 0;
  // 已存下的位移 + 這次拖曳的即時位移
  const x = offset.x + (transform?.x || 0);
  const y = offset.y + (transform?.y || 0);
  const baseTop = isMobile && item.mTop !== undefined ? item.mTop : item.top;
  // 手機版使用獨立 mWidth 放大商品；不再往中央收攏（那會讓商品橫向擠成一團），
  // 保留原本橫跨整個畫布的分佈，並交給下方邊界夾住避免出界。
  const width = isMobile ? (item.mWidth ?? item.width) : item.width;
  const baseLeft = isMobile && item.mLeft !== undefined ? item.mLeft : item.left;
  const baseTopSpread = isMobile ? baseTop * 1.08 : baseTop;
  const edgeGap = isMobile ? 5 : 4.5;
  const bottomGap = isMobile ? 5.8 : 6.2;
  const canvasRatio = canvasSize?.width && canvasSize?.height
    ? canvasSize.width / canvasSize.height
    : 3024 / 2697;
  const itemHeight = width * (ITEM_ASPECTS[item.id] || 1) * canvasRatio;
  // 每次開啟的隨機抖動（left/top/rot），但保留工作列與四邊安全距離。
  const left = clamp(baseLeft + (jitter?.dl || 0), edgeGap, Math.max(edgeGap, 100 - width - edgeGap));
  const top = clamp(
    baseTopSpread + (jitter?.dt || 0),
    edgeGap,
    Math.max(edgeGap, 100 - itemHeight - bottomGap),
  );

  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${item.rot + (jitter?.dr || 0)}deg)`,
    zIndex: z,
    '--item-mask': `url("${imageSrc}")`,
    '--sticker-film-delay': `${-(stickerIndex * 0.72).toFixed(2)}s`,
  };

  return (
    <button
      ref={setNodeRef}
      data-item-id={item.id}
      className={`graphic-overlay__item${isSticker ? ' graphic-overlay__item--sticker' : ''}${isDragging ? ' is-dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <span className="graphic-overlay__item-shell">
        <img src={imageSrc} alt={item.alt} draggable="false" />
      </span>
    </button>
  );
}

export default function GraphicOverlay({ onClose }) {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const [offsets, setOffsets] = useState({}); // 每件商品拖曳後保留的位移 (px)
  const [zMap, setZMap] = useState({}); // 拖過的商品浮到最上層
  const [canvasSize, setCanvasSize] = useState(null);
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

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const updateCanvasSize = () => {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };
    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // 每次開啟商品排法都不一樣：位置 ±5%、旋轉 ±8°（掛載時算一次）
  const jitters = useMemo(() => {
    const map = {};
    ITEMS.forEach((item) => {
      map[item.id] = {
        dl: (Math.random() - 0.5) * 3,
        dt: (Math.random() - 0.5) * 3,
        dr: (Math.random() - 0.5) * 10,
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
    const canvas = overlayRef.current?.querySelector('.graphic-overlay__canvas');
    const el = overlayRef.current?.querySelector(`[data-item-id="${active.id}"]`);
    setOffsets((prev) => {
      let x = (prev[active.id]?.x || 0) + delta.x;
      let y = (prev[active.id]?.y || 0) + delta.y;
      if (canvas && el) {
        const fr = canvas.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const margin = 8;
        // er 已含本次拖曳位移；放手後完整收回藍色 canvas，避開下方工作列。
        const overRight = er.right - (fr.right - margin);
        const overLeft = (fr.left + margin) - er.left;
        const overBottom = er.bottom - (fr.bottom - margin);
        const overTop = (fr.top + margin) - er.top;
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
        <img className="graphic-overlay__header" src={assetPath(`${BASE}/bg/go-header.webp`)} alt="GOOGOO STORE" />
        <div className="graphic-overlay__canvas" ref={canvasRef}>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {ITEMS.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                offset={offsets[item.id] || { x: 0, y: 0 }}
                z={zMap[item.id] || index + 1}
                isMobile={isMobile}
                jitter={jitters[item.id]}
                canvasSize={canvasSize}
              />
            ))}
          </DndContext>
        </div>
        <img className="graphic-overlay__taskbar" src={assetPath(`${BASE}/bg/go-taskbar.webp`)} alt="" />
        {/* 均勻顆粒：放在 frame 尾端 → 畫在藍底 canvas 之後（蓋得到藍），
            z-index:0 讓商品(z≥1)仍在其上。含版頭、藍底、工作列一致上顆粒。 */}
        <div className="graphic-overlay__noise" aria-hidden="true" />
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
