import { forwardRef, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScramble } from '../utils/TextScramble.js';
import AsciiArt from './AsciiArt.jsx';
import ShapeField from './ShapeField.jsx';
import '../styles/components/Hero.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_NAME = 'DORIS KAO';
const NAME_INK = '#1A1A1A';
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
  const maskRef = useRef(null); // pixel-mask sampler shared with the ASCII layer

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

  // 名字 parallax 上移 + 縮小
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
        scrub: true,
      },
    });
    return () => tween.revert();
  }, [ref]);

  return (
    <section className="hero" id="hero" ref={ref}>
      <HeroPixelMask maskRef={maskRef} />
      {/* 幾何圖形物理場：墜落堆在名字上方（名字=底座），游標推開像球一樣彈動 */}
      <ShapeField floorRef={nameWrapRef} start={started} />
      <div className="hero__ascii">
        <AsciiArt maskRef={maskRef} started={started} />
      </div>
      <h1 className="hero__name" ref={nameWrapRef}>
        <span className="hero__name-text" ref={nameRef}>
          DORIS<span className="hero__name-space" aria-hidden="true"> </span>KAO
        </span>
        <span className="hero__reg">®</span>
      </h1>
    </section>
  );
});

export default Hero;
