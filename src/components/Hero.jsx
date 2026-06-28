import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScramble } from '../utils/TextScramble.js';
import AsciiArt from './AsciiArt.jsx';
import ShapeField from './ShapeField.jsx';
import '../styles/components/Hero.css';

gsap.registerPlugin(ScrollTrigger);

function HeroPixelMask() {
  const canvasRef = useRef(null);
  const cellsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cell = 38;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

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
    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointerRef.current = {
        x,
        y,
        active: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
      };
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

  // Text Scramble 解碼（等百葉窗載入結束後才解碼，® 保持橘色不被覆寫）
  useEffect(() => {
    if (!started || !nameRef.current) return;
    const fx = new TextScramble(nameRef.current);
    fx.setText('DORIS KAO');
    return () => fx.destroy();
  }, [started]);

  // 名字 parallax 上移 + 縮小
  useEffect(() => {
    if (!ref?.current) return;
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
    <section className="hero" ref={ref}>
      <HeroPixelMask />
      {/* 幾何圖形物理場：墜落堆在名字上方（名字=底座），游標推開像球一樣彈動 */}
      <ShapeField floorRef={nameWrapRef} start={started} />
      <div className="hero__ascii">
        <AsciiArt />
      </div>
      <h1 className="hero__name" ref={nameWrapRef}>
        <span className="hero__name-text" ref={nameRef}>
          DORIS KAO
        </span>
        <span className="hero__reg">®</span>
      </h1>
    </section>
  );
});

export default Hero;
