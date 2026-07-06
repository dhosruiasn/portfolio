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

// Entrance: an irregular debris burst from a few random cores that springs back and
// converges into the image, glyphs locking to their real char as the picture focuses
// in, with a warm pulse at the moment most of them meet.
const BURST_SPEED = 22; // base explosion speed
const BURST_MIN = 0.12; // slowest debris (fraction of BURST_SPEED)
const BURST_TAIL = 2.2; // heavy-tailed extra speed → a few shards fly far, most drift near
const ORIGIN_SEEDS = 6; // irregular burst cores so the start isn't a clean circle
const ORIGIN_SPREAD = 48; // how far those cores sit from the centre (px)
const ORIGIN_JITTER = 20; // extra scatter of each glyph around its core (px)
const SPRING = 0.05; // pull toward home (steady-state value)
const DAMP = 0.85; // velocity damping
const BURST_TIME = 0.3; // seconds of near-free explosion before the spring engages
const SPRING_RAMP = 0.55; // seconds for the spring to ramp to full
const LOCK_BASE = 0.5; // earliest a central glyph locks to its real char
const LOCK_SPREAD = 0.85; // extra delay for the outermost glyphs → focus-in wave
const FLASH_FRACTION = 0.8; // fire the convergence pulse once this share has locked
const FLASH_DUR = 0.5; // pulse fade time (seconds)
const ASCII_3D_START = 2.1; // seconds after entrance; begins once the figure has mostly settled
const ASCII_3D_FADE = 0.45;
const ASCII_3D_CYCLE = 4.8;
const ASCII_3D_MAX_TILT = 0.78;

const INK = [26, 26, 26]; // #1A1A1A
const ON_BROWN = [255, 245, 114]; // #fff572 (glyph over a coffee cell)
const PULSE = [232, 150, 74]; // warm convergence highlight
const rgbStr = (c) => `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`;
const mixRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export default function AsciiArt({ src = '/images/hero-character.png', maskRef, started = true }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const startRef = useRef(0); // 0 = entrance not begun yet (waiting for reveal)
  const startedRef = useRef(started);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    let rafId;
    let flashStart = -1; // performance.now() when the convergence pulse fires (-1 = not yet)
    // 同源圖不需要 crossOrigin；設了反而在一般快取 reload 時會 CORS 失敗 → 掉到 fallback。
    // img 的建立與 src 指定移到 onload/onerror 綁定之後（見下方），否則「快取圖在綁 onload
    // 前就載完」會錯過 load 事件 → 松鼠不出現，要刷新好幾次才好（使用者實機回報）。
    const img = new Image();

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

    const drawRotatingAsciiCloud = (particles, elapsed, opacity, sampleBrown, rect, scaleX, scaleY, pulse) => {
      const cycleT = ((elapsed - ASCII_3D_START) % ASCII_3D_CYCLE) / ASCII_3D_CYCLE;
      const rotation = Math.sin(cycleT * Math.PI * 2) * ASCII_3D_MAX_TILT;
      const cos = Math.max(0.2, Math.cos(rotation));
      const direction = Math.sin(rotation);

      ctx.save();
      ctx.font = `${FONT_SIZE}px monospace`;

      for (const p of particles) {
        if (!p.locked) continue;
        const rx = p.x - WIDTH / 2;
        const ry = p.y - HEIGHT / 2;
        const rowNorm = ry / (HEIGHT / 2);
        const depth = (rx / (WIDTH / 2)) * direction;
        const wave = Math.sin(ry * 0.04 + cycleT * Math.PI * 2) * Math.abs(direction) * 10;
        const x = WIDTH / 2 + rx * cos + rowNorm * direction * 74 + wave;
        const y = HEIGHT / 2 + ry * (1 + Math.abs(direction) * 0.08) + rowNorm * Math.abs(direction) * 28;
        const overBrown = sampleBrown
          ? sampleBrown(rect.left + x * scaleX, rect.top + y * scaleY)
          : false;
        const base = overBrown ? ON_BROWN : INK;
        const alpha = opacity * (0.82 + Math.max(0, depth) * 0.14 + (1 - cos) * 0.04);

        ctx.globalAlpha = Math.min(1, Math.max(0.55, alpha));
        ctx.fillStyle = pulse > 0 ? rgbStr(mixRgb(base, PULSE, pulse * 0.55)) : rgbStr(base);
        ctx.fillText(p.char, x, y);
      }

      ctx.restore();
    };

    // Scatter every glyph across a few irregular burst cores with chaotic, heavy-tailed
    // debris velocities (no clean circle), then stagger when each locks to its real char
    // by distance from the centre so the picture focuses in as it converges.
    const initEntrance = (particles) => {
      if (!particles.length) return;
      const TAU = Math.PI * 2;
      let cx = 0;
      let cy = 0;
      for (const p of particles) {
        cx += p.homeX;
        cy += p.homeY;
      }
      cx /= particles.length;
      cy /= particles.length;
      let maxD = 1;
      for (const p of particles) {
        const d = Math.hypot(p.homeX - cx, p.homeY - cy);
        if (d > maxD) maxD = d;
      }
      // a handful of off-centre cores so the origin reads as irregular shrapnel, not a disc
      const seeds = [];
      for (let s = 0; s < ORIGIN_SEEDS; s++) {
        const a = Math.random() * TAU;
        const r = Math.pow(Math.random(), 0.6) * ORIGIN_SPREAD;
        seeds.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      for (const p of particles) {
        const norm = Math.hypot(p.homeX - cx, p.homeY - cy) / maxD; // 0 (centre) → 1 (edge)
        const seed = seeds[(Math.random() * seeds.length) | 0];
        p.x = seed[0] + (Math.random() - 0.5) * ORIGIN_JITTER;
        p.y = seed[1] + (Math.random() - 0.5) * ORIGIN_JITTER;
        // fully random direction + heavy-tailed speed → uneven, jagged debris field
        const ang = Math.random() * TAU;
        const spd = BURST_SPEED * (BURST_MIN + Math.pow(Math.random(), 2.2) * BURST_TAIL);
        p.vx = Math.cos(ang) * spd;
        p.vy = Math.sin(ang) * spd;
        p.revealAt = LOCK_BASE + norm * LOCK_SPREAD + Math.random() * 0.2;
        p.locked = false;
      }
      flashStart = -1;
    };

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
      startRef.current = 0; // entrance begins once the hero is revealed (see animate)
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
      startRef.current = 0; // entrance begins once the hero is revealed (see animate)
    };

    img.onload = buildParticles;
    img.onerror = drawFallback;
    // 綁好 handler 後才設 src；若圖已在快取（complete 且有寬度）直接建 particles，
    // 因為此時 load 事件可能已錯過、不會再觸發
    img.src = assetPath(src);
    if (img.complete && img.naturalWidth > 0) buildParticles();

    const animate = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.font = `${FONT_SIZE}px monospace`;

      // Hold the burst until the hero is revealed, then kick it off so the whole
      // big-bang → converge plays in view rather than behind the loading blinds.
      if (!startRef.current) {
        if (startedRef.current && particlesRef.current.length) {
          initEntrance(particlesRef.current);
          startRef.current = performance.now();
        } else {
          rafId = requestAnimationFrame(animate);
          return;
        }
      }

      const now = performance.now();
      const { x: mx, y: my } = mouseRef.current;
      const elapsed = (now - startRef.current) / 1000;

      // Spring engages only after the initial burst, then ramps to full — so the
      // explosion reads first and the convergence follows.
      const springK = SPRING * Math.min(1, Math.max(0, (elapsed - BURST_TIME) / SPRING_RAMP));

      // Convergence pulse: a brief warm flash the frame after most glyphs have locked.
      let pulse = 0;
      if (flashStart >= 0) {
        const ft = (now - flashStart) / 1000;
        pulse = ft < FLASH_DUR ? 1 - ft / FLASH_DUR : 0;
      }

      // When a coffee pixel-mask cell sits behind a glyph, draw that glyph light so
      // it stays legible on the brown. Map particle (internal) coords → viewport coords.
      const sampleBrown = maskRef?.current?.sample?.() || null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / WIDTH;
      const scaleY = rect.height / HEIGHT;

      const particles = particlesRef.current;
      let lockedCount = 0;
      const ascii3dOpacity = Math.min(1, Math.max(0, (elapsed - ASCII_3D_START) / ASCII_3D_FADE));
      const particleOpacity = 1 - ascii3dOpacity;

      for (const p of particles) {
        // cursor repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && dist > 0) {
          const force = (RADIUS - dist) / RADIUS;
          p.vx += (dx / dist) * force * 4;
          p.vy += (dy / dist) * force * 4;
        }
        // spring home (ramped during entrance) + damping
        p.vx += (p.homeX - p.x) * springK;
        p.vy += (p.homeY - p.y) * springK;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx;
        p.y += p.vy;

        if (!p.locked && elapsed >= p.revealAt) p.locked = true;
        if (p.locked) lockedCount++;

        const overBrown = sampleBrown
          ? sampleBrown(rect.left + p.x * scaleX, rect.top + p.y * scaleY)
          : false;
        const base = overBrown ? ON_BROWN : INK;
        ctx.fillStyle = pulse > 0 ? rgbStr(mixRgb(base, PULSE, pulse * 0.7)) : rgbStr(base);

        // flicker random chars until locked, then hold the real char
        if (p.locked) {
          ctx.globalAlpha = particleOpacity;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          if (Math.random() < 0.35) {
            p.flick = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          }
          ctx.globalAlpha = 0.55 * Math.max(particleOpacity, 0.35);
          ctx.fillText(p.flick, p.x, p.y);
        }
      }
      ctx.globalAlpha = 1;

      if (ascii3dOpacity > 0) {
        drawRotatingAsciiCloud(particles, elapsed, ascii3dOpacity, sampleBrown, rect, scaleX, scaleY, pulse);
      }

      // Fire the convergence pulse the first time the image mostly meets.
      if (flashStart < 0 && particles.length && lockedCount / particles.length >= FLASH_FRACTION) {
        flashStart = now;
      }

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
  }, [src, maskRef]);

  return <canvas ref={canvasRef} className="ascii-art" />;
}
