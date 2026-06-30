import { useEffect, useRef } from 'react';
import { assetPath } from '../utils/assetPath.js';

const CHARS = '$%#@?*+;:,.'.split('');
const SCRAMBLE = '$%#@?*+;:,./\\|=<>[]{}'.split('');
const WIDTH = 640;
const HEIGHT = 820;
const RADIUS = 120;
const SAMPLE = 6;
const FONT_SIZE = 7;
const DECODE_DURATION = 1.4; // seconds for the full decrypt-in

export default function AsciiArt({ src = '/images/hero-character.png' }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const startRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    let rafId;
    const img = new Image();
    // 同源圖不需要 crossOrigin；設了反而在一般快取 reload 時會 CORS 失敗 → 掉到 fallback
    img.src = assetPath(src);

    const makeParticle = (x, y, char) => ({
      homeX: x,
      homeY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      char,
      flick: SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
      revealAt: Math.random() * DECODE_DURATION, // when it locks to its real char
    });

    const buildParticles = () => {
      const off = document.createElement('canvas');
      off.width = WIDTH;
      off.height = HEIGHT;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(img, 0, 0, WIDTH, HEIGHT);
      const { data } = offCtx.getImageData(0, 0, WIDTH, HEIGHT);
      const particles = [];
      for (let y = 0; y < HEIGHT; y += SAMPLE) {
        for (let x = 0; x < WIDTH; x += SAMPLE) {
          const i = (y * WIDTH + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (data[i + 3] > 50 && brightness < 220) {
            const charIndex = Math.min(
              CHARS.length - 1,
              Math.floor((brightness / 255) * CHARS.length)
            );
            particles.push(makeParticle(x, y, CHARS[charIndex]));
          }
        }
      }
      particlesRef.current = particles;
      startRef.current = performance.now();
    };

    const drawFallback = () => {
      const particles = [];
      for (let y = 0; y < HEIGHT; y += SAMPLE) {
        for (let x = 0; x < WIDTH; x += SAMPLE) {
          const dist = Math.hypot(x - WIDTH / 2, (y - HEIGHT / 2) * 0.8);
          if (dist < 180 && Math.random() > 0.3) {
            particles.push(makeParticle(x, y, CHARS[Math.floor(Math.random() * CHARS.length)]));
          }
        }
      }
      particlesRef.current = particles;
      startRef.current = performance.now();
    };

    img.onload = buildParticles;
    img.onerror = drawFallback;

    const animate = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.fillStyle = '#1A1A1A';

      const { x: mx, y: my } = mouseRef.current;
      const elapsed = (performance.now() - startRef.current) / 1000;

      for (const p of particlesRef.current) {
        // cursor repulsion + spring back
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && dist > 0) {
          const force = (RADIUS - dist) / RADIUS;
          p.vx += (dx / dist) * force * 4;
          p.vy += (dy / dist) * force * 4;
        }
        p.vx += (p.homeX - p.x) * 0.05;
        p.vy += (p.homeY - p.y) * 0.05;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        // decode intro: flicker random chars then lock to real char
        if (elapsed >= p.revealAt) {
          ctx.globalAlpha = 1;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          if (Math.random() < 0.35) {
            p.flick = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          }
          ctx.globalAlpha = 0.55;
          ctx.fillText(p.flick, p.x, p.y);
        }
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (WIDTH / rect.width),
        y: (e.clientY - rect.top) * (HEIGHT / rect.height),
      };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, [src]);

  return <canvas ref={canvasRef} className="ascii-art" />;
}
