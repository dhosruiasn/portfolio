import { forwardRef, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScramble } from '../utils/TextScramble.js';
import AsciiArt from './AsciiArt.jsx';
import HeroFluid, { fluidSim } from './HeroFluid.jsx';
import ShapeField from './ShapeField.jsx';
import '../styles/components/Hero.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_NAME = 'DORIS KAO';
const NAME_INK = '#fff1d2';
const NAME_ON_BROWN = '#fff572';

function HeroPixelMask({ maskRef }) {
  const canvasRef = useRef(null);
  const cellsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // 觸控裝置整段不啟用（含 sampler）：沒有游標、點擊觸發像 glitch，
    // 且常駐 rAF 迴圈耗電（使用者確認手機移除）
    if (window.matchMedia('(hover: none)').matches) return;
    const ctx = canvas.getContext('2d');
    const cell = 38;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    // Expose a sampler so the ASCII layer can ask "is this viewport point currently
    // covered by an active coffee cell?" — used to flip overlapped glyphs to white.
    if (maskRef) {
      maskRef.current = {
        sample() {
          const rect = canvas.getBoundingClientRect();
          const now = performance.now();
          const cells = cellsRef.current;
          return (vx, vy) => {
            const lx = vx - rect.left;
            const ly = vy - rect.top;
            if (lx < 0 || ly < 0) return false;
            const cx = Math.floor(lx / cell);
            const cy = Math.floor(ly / cell);
            if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return false;
            const active = cells[cy * cols + cx];
            return !!active && now >= active.start && now <= active.end;
          };
        },
      };
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / cell);
      rows = Math.ceil(rect.height / cell);
      cellsRef.current = Array.from({ length: cols * rows }, () => ({ start: 0, end: 0 }));
    };

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const cells = cellsRef.current;
      const pointer = pointerRef.current;
      if (pointer.active) {
        const now = performance.now();
        const radius = 170;
        const cx = Math.floor(pointer.x / cell);
        const cy = Math.floor(pointer.y / cell);
        const range = Math.ceil(radius / cell);

        if (cx >= 0 && cy >= 0 && cx < cols && cy < rows) {
          cells[cy * cols + cx] = {
            start: now,
            end: now + 1400,
          };
        }

        for (let y = cy - range; y <= cy + range; y++) {
          for (let x = cx - range; x <= cx + range; x++) {
            if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
            const centerX = x * cell + cell / 2;
            const centerY = y * cell + cell / 2;
            const dist = Math.hypot(centerX - pointer.x, centerY - pointer.y);
            if (dist <= radius) {
              const strength = 1 - dist / radius;
              const index = y * cols + x;
              if (Math.random() < 0.18 + strength * 0.65) {
                const delay = Math.random() * 140 + (1 - strength) * 90;
                const hold = 800 + strength * 650 + Math.random() * 420;
                cells[index] = {
                  start: now + delay,
                  end: now + delay + hold,
                };
              }
            }
          }
        }
      }

      const now = performance.now();
      ctx.fillStyle = '#6b3415';
      for (let i = 0; i < cells.length; i++) {
        const active = cells[i];
        if (now < active.start || now > active.end) continue;
        const x = i % cols;
        const y = Math.floor(i / cols);
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const syncPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointerRef.current = {
        x,
        y,
        active: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
      };
    };
    const handlePointerMove = (event) => syncPointer(event);
    const handlePointerDown = (event) => syncPointer(event);
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('click', handlePointerDown);
    window.addEventListener('pointerleave', handlePointerLeave);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (maskRef) maskRef.current = null;
    };
  }, [maskRef]);

  return (
    <canvas
      className="hero__pixel-mask"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}

const Hero = forwardRef(function Hero({ started = true }, ref) {
  const nameRef = useRef(null); // scramble target (text only, no ®)
  const nameWrapRef = useRef(null); // parallax target (whole h1)
  const nameFluidRef = useRef(null); // 流體光暈 clone（游標靠近時浮現）
  const nameLightRef = useRef(null); // 與 hero 斜光同步的文字反射 clone
  const maskRef = useRef(null); // pixel-mask sampler shared with the ASCII layer
  const exitProgressRef = useRef(0); // 名字 parallax 退場進度（0=未捲動），供流體層降載用

  // Text Scramble 解碼（等百葉窗載入結束後才解碼，® 保持橘色不被覆寫）
  useEffect(() => {
    if (!started || !nameRef.current) return;
    let cancelled = false;
    let rafId = 0;
    const renderNameGlyphs = () => {
      if (!nameRef.current) return;
      nameRef.current.replaceChildren(
        ...HERO_NAME.split('').map((char, index) => {
          const span = document.createElement('span');
          span.className = char === ' ' ? 'hero__name-char hero__name-space' : 'hero__name-char';
          span.textContent = char === ' ' ? '\u00a0' : char;
          span.dataset.char = char;
          span.style.color = NAME_INK;
          span.setAttribute('aria-hidden', 'true');
          span.dataset.index = String(index);
          return span;
        })
      );
      nameRef.current.setAttribute('aria-label', HERO_NAME);
    };

    // 失效保險：scramble 若被中斷（切分頁/語言切換），4s 後重建正確字形。
    // 必須用 renderNameGlyphs()（含兩行需要的 space span），不能寫純 textContent，
    // 否則會把已完成的兩行名字塌回一行。比對時把 nbsp 正規化成一般空格。
    const failsafe = setTimeout(() => {
      if (cancelled || !nameRef.current) return;
      const text = nameRef.current.textContent.replace(/\u00a0/g, ' ');
      if (text !== HERO_NAME) renderNameGlyphs();
    }, 4000);

    const sampleRect = (sampleBrown, rect) => {
      const x1 = rect.left;
      const x2 = rect.right;
      const y1 = rect.top;
      const y2 = rect.bottom;
      const cx = x1 + rect.width / 2;
      const cy = y1 + rect.height / 2;
      return (
        sampleBrown(cx, cy) ||
        sampleBrown(x1 + rect.width * 0.22, cy) ||
        sampleBrown(x2 - rect.width * 0.22, cy) ||
        sampleBrown(cx, y1 + rect.height * 0.22) ||
        sampleBrown(cx, y2 - rect.height * 0.22)
      );
    };

    const updateNameColors = () => {
      const sampleBrown = maskRef.current?.sample?.();
      const chars = nameRef.current?.querySelectorAll('.hero__name-char');
      if (sampleBrown && chars?.length) {
        chars.forEach((char) => {
          if (char.dataset.char === ' ') return;
          const rect = char.getBoundingClientRect();
          char.style.color = sampleRect(sampleBrown, rect) ? NAME_ON_BROWN : NAME_INK;
        });
      }
      rafId = requestAnimationFrame(updateNameColors);
    };

    const fx = new TextScramble(nameRef.current);
    fx.setText(HERO_NAME).then(() => {
      if (cancelled) return;
      renderNameGlyphs();
      updateNameColors();
    });

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      cancelAnimationFrame(rafId);
      fx.destroy();
    };
  }, [started]);

  // 名字對「流體場」反應（不只游標）：blob／游標液滴（位置來自 fluidSim，與 shader
  // 同時鐘同公式）漂到名字附近時——(1) 字內浮現流體光暈（clone + background-clip:text，
  // 每個熱點一顆 radial-gradient，透明度＝熱度）；clone 本身的 drop-shadow 只沿著
  // 實際亮起的字形區域發光，不會讓整個字元一起變亮。游標離開後 blob 互動仍持續。
  useEffect(() => {
    const host = ref?.current;
    const fluidEl = nameFluidRef.current;
    const lightEl = nameLightRef.current;
    if (!host || !fluidEl || !lightEl) return undefined;
    let raf = 0;
    let inView = true;

    const syncGlyphs = () => {
      const src = nameRef.current;
      if (!src) return;
      const key = src.textContent;
      [fluidEl, lightEl].forEach((clone) => {
        if (clone.dataset.sync === key) return;
        clone.innerHTML = src.innerHTML;
        clone.dataset.sync = key;
      });
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!inView || document.hidden) return;

      // 名字退場（parallax 縮小上移）時，SVG displacement filter＋blend 的兩層 clone
      // 每幀跟著重新光柵化會拖垮捲動 → 一開始捲動就快速淡出、完全退場時整層停畫
      const exitFade = 1 - Math.min(exitProgressRef.current * 4, 1);
      lightEl.style.opacity = String(exitFade);
      if (exitFade <= 0) {
        fluidEl.style.opacity = '0';
        return;
      }

      syncGlyphs();
      const heroRect = host.getBoundingClientRect();
      if (heroRect.width < 1 || heroRect.height < 1) return;
      const rect = fluidEl.getBoundingClientRect();

      // WebGL 斜光以 8 秒為一輪；反光 clone 共用同一個起始時鐘，讓亮帶掃過
      // 背景與字面時不會各播各的。亮帶本體由 CSS 做成暖白核心＋橘色暈光。
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const sweepProgress = reducedMotion
        ? 0.38
        : (((performance.now() - fluidSim.start) / 1000) % 8) / 8;
      lightEl.style.backgroundPosition = `${-115 + sweepProgress * 330}% 50%`;

      // 熱點＝三顆 blob ＋ 游標液滴＋殘影（螢幕座標）
      const spots = fluidSim.blobs(heroRect.width, heroRect.height).map((b) => ({
        x: heroRect.left + b.x,
        y: heroRect.top + b.y,
        r: b.r,
        s: 1,
      }));
      const addDrop = (d, k) => {
        if (d.s < 0.03) return;
        spots.push({
          x: heroRect.left + d.x * heroRect.width,
          y: heroRect.top + (1 - d.y) * heroRect.height,
          r: Math.sqrt(Math.max(k / 0.78 - 0.002, 0)) * heroRect.height,
          s: d.s,
        });
      };
      addDrop(fluidSim.mouse, 0.018);
      addDrop(fluidSim.trail, 0.011);

      // 只留對名字有影響的熱點（到名字盒的距離 < 半徑）
      const active = [];
      spots.forEach((sp) => {
        const dx = Math.max(rect.left - sp.x, 0, sp.x - rect.right);
        const dy = Math.max(rect.top - sp.y, 0, sp.y - rect.bottom);
        const d = Math.hypot(dx, dy);
        const heat = Math.max(0, 1 - d / sp.r) * sp.s;
        if (heat > 0.03) active.push({ ...sp, heat });
      });

      // (1) 五瓣只負責 alpha density；色彩每個熱點只畫一次。每瓣由中心一路
      // 平滑衰減到透明，重疊處的 alpha 會連續累加成同一團 metaball，避免用
      // 五個近乎實心橢圓 union 時，在交界留下明顯尖角。
      if (active.length) {
        const morphT = ((performance.now() - fluidSim.start) / 1000) * 0.105;
        const colorLayers = [];
        const maskLayers = [];
        active.forEach((sp, index) => {
            const gx = Math.round(sp.x - rect.left);
            const gy = Math.round(sp.y - rect.top);
            const a = sp.heat;
            // 上色半徑放大到視覺 blob 邊緣：sp.r 是模擬 kernel 半徑，shader 的密度場
            // 暈開後看起來大得多——照 kernel 畫會出現「流體明明蓋住字、卻只亮一小塊」
            const R = sp.r * 1.45;
            const phase = morphT + index * 1.73;
            const lobes = [
              { ox: Math.sin(phase * 0.9) * 0.06, oy: Math.cos(phase * 0.7) * 0.05, rx: 0.64, ry: 0.50, alpha: 1.00 },
              { ox: 0.29 + Math.cos(phase * 1.1) * 0.06, oy: -0.12 + Math.sin(phase * 0.8) * 0.06, rx: 0.57, ry: 0.41, alpha: 0.78 },
              { ox: -0.27 + Math.sin(phase * 0.75) * 0.06, oy: 0.17 + Math.cos(phase) * 0.05, rx: 0.49, ry: 0.57, alpha: 0.74 },
              { ox: -0.08 + Math.cos(phase * 0.62) * 0.05, oy: -0.29 + Math.sin(phase * 0.92) * 0.05, rx: 0.55, ry: 0.42, alpha: 0.70 },
              { ox: 0.16 + Math.sin(phase * 0.68) * 0.05, oy: 0.28 + Math.cos(phase * 0.82) * 0.05, rx: 0.50, ry: 0.45, alpha: 0.68 },
            ];
            colorLayers.push(
              `radial-gradient(ellipse ${Math.max(1, Math.round(R * 1.08))}px ${Math.max(1, Math.round(R * 0.92))}px at ${gx}px ${gy}px, rgba(255,246,207,${(0.98 * a).toFixed(3)}) 0%, rgba(255,218,114,${(0.96 * a).toFixed(3)}) 43%, rgba(255,139,28,${(0.94 * a).toFixed(3)}) 61%, rgba(237,54,17,${(0.94 * a).toFixed(3)}) 78%, rgba(165,33,16,0) 96%)`
            );
            lobes.forEach((lobe) => {
              const lx = Math.round(gx + R * lobe.ox);
              const ly = Math.round(gy + R * lobe.oy);
              const rx = Math.max(1, Math.round(R * lobe.rx));
              const ry = Math.max(1, Math.round(R * lobe.ry));
              const alpha = lobe.alpha;
              maskLayers.push(
                `radial-gradient(ellipse ${rx}px ${ry}px at ${lx}px ${ly}px, rgba(0,0,0,${alpha.toFixed(3)}) 0%, rgba(0,0,0,${(alpha * 0.94).toFixed(3)}) 34%, rgba(0,0,0,${(alpha * 0.68).toFixed(3)}) 60%, rgba(0,0,0,${(alpha * 0.34).toFixed(3)}) 78%, rgba(0,0,0,${(alpha * 0.10).toFixed(3)}) 91%, transparent 100%)`
              );
            });
          });
        fluidEl.style.backgroundImage = colorLayers.join(', ');
        fluidEl.style.webkitMaskImage = maskLayers.join(', ');
        fluidEl.style.maskImage = maskLayers.join(', ');
        fluidEl.style.opacity = String(exitFade);
      } else {
        fluidEl.style.backgroundImage = 'none';
        fluidEl.style.webkitMaskImage = 'none';
        fluidEl.style.maskImage = 'none';
        fluidEl.style.opacity = '0';
      }

    };

    // 注意：不能 observe 空的 fluidEl（0×0 永遠不 intersect），要 observe 有尺寸的 h1
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(nameWrapRef.current || fluidEl);
    syncGlyphs(); // 先同步一次，clone 立刻有字形（也讓 IO 有尺寸可觀察）
    raf = requestAnimationFrame(frame);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  // 名字 parallax 上移 + 縮小。scrub 給 0.4s 平滑：滾輪的階梯式 delta 直接映射
  // transform 會一格一格跳（退場卡卡的主因之一），讓 GSAP 內插補平。
  useEffect(() => {
    if (!ref?.current || !nameWrapRef.current) return undefined;
    const tween = gsap.to(nameWrapRef.current, {
      yPercent: -40,
      scale: 0.7,
      ease: 'none',
      transformOrigin: 'left bottom',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
        onUpdate: (self) => {
          exitProgressRef.current = self.progress;
        },
      },
    });
    return () => {
      exitProgressRef.current = 0;
      tween.revert();
    };
  }, [ref]);

  return (
    <section className="hero" id="hero" ref={ref}>
      {/* 動態液體背景（WebGL 密度場，見 HeroFluid.jsx）：單一場＝融合無縫、
          noise 域扭曲＝形狀不規則持續變形、連續 color ramp＝內緣暈染、滑鼠＝小液滴可互動 */}
      <HeroFluid />
      {/* 馬賽克游標效果（HeroPixelMask）依使用者要求關閉；ASCII 的 maskRef 取樣是
          optional chaining，維持 null 安全。要復原把下行解註即可。 */}
      {/* <HeroPixelMask maskRef={maskRef} /> */}
      {/* 幾何圖形物理場：墜落堆在名字上方（名字=底座），游標推開像球一樣彈動 */}
      <ShapeField floorRef={nameWrapRef} start={started} />
      {/* ASCII 松鼠依使用者要求移除（元件保留在 AsciiArt.jsx，要復原把下段解註）
      <div className="hero__ascii">
        <AsciiArt maskRef={maskRef} started={started} />
      </div> */}
      <h1 className="hero__name" ref={nameWrapRef}>
        <span className="hero__name-text" ref={nameRef}>
          DORIS<span className="hero__name-space" aria-hidden="true"> </span>KAO
        </span>
        {/* 流體光暈 clone：游標靠近時字內浮現橘金暈（字形由 JS 從原字同步） */}
        <span className="hero__name-text hero__name-fluid" ref={nameFluidRef} aria-hidden="true" />
        {/* 背景斜光掃過時，字面同步產生一條乾淨的高光反射。 */}
        <span className="hero__name-text hero__name-light" ref={nameLightRef} aria-hidden="true" />
        <span className="hero__reg">®</span>
      </h1>
    </section>
  );
});

export default Hero;
