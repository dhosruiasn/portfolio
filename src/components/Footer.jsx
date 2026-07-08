import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Footer.css';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_PALETTE = {
  green: '#daef68',
  blue: '#5B7FBF',
  purple: '#B3A0D6',
  orange: '#ec5b2b',
  cream: '#EDE4D0',
  dark: '#1A1A1A',
};

const starPoints = (spikes, outer, inner, cx, cy) => {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * (Math.PI / spikes) - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ');
};

const STAR = (fill) =>
  `<svg viewBox="0 0 200 200" width="100%" height="100%"><polygon fill="${fill}" points="${starPoints(
    18,
    98,
    72,
    100,
    100
  )}"/></svg>`;

const FLOWER = (fill) => {
  const n = 7;
  const R = 52;
  const pr = 46;
  let circles = `<circle cx="100" cy="100" r="60" fill="${fill}"/>`;
  for (let i = 0; i < n; i++) {
    const a = i * ((2 * Math.PI) / n) - Math.PI / 2;
    circles += `<circle cx="${(100 + Math.cos(a) * R).toFixed(1)}" cy="${(
      100 +
      Math.sin(a) * R
    ).toFixed(1)}" r="${pr}" fill="${fill}"/>`;
  }
  return `<svg viewBox="0 0 200 200" width="100%" height="100%">${circles}</svg>`;
};

function FooterShapeField({ play }) {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !play) return;

    const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;
    const engine = Engine.create();
    const runner = Runner.create();
    const items = [];
    let pointerMove;
    let started = false;

    const makeEl = (def) => {
      const el = document.createElement(def.href ? 'a' : 'div');
      el.className = `footer-shape footer-shape--${def.kind}`;
      el.setAttribute('aria-label', def.label);
      if (def.href) el.href = def.href;
      if (def.target) {
        el.target = def.target;
        el.rel = 'noreferrer';
      }
      if (def.svg) {
        el.innerHTML = def.svg(def.color);
        const span = document.createElement('span');
        span.className = 'footer-shape__text';
        span.textContent = def.text;
        el.appendChild(span);
      } else {
        el.textContent = def.text;
      }
      if (def.w) el.style.width = `${def.w}px`;
      if (def.h) el.style.height = `${def.h}px`;
      if (def.size) {
        el.style.width = `${def.size}px`;
        el.style.height = `${def.size}px`;
      }
      if (def.color && !def.svg) el.style.background = def.color;
      if (def.fg) el.style.color = def.fg;
      container.appendChild(el);
      return el;
    };

    const build = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (started || W < 100 || H < 120) return;
      started = true;
      engine.gravity.y = 2.35;

      const floorY = H - 18;
      const wall = { isStatic: true, restitution: 0.4, friction: 0.35 };
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, floorY + 42, W + 360, 84, wall),
        Bodies.rectangle(-56, H / 2, 112, H * 3, wall),
        Bodies.rectangle(W + 56, H / 2, 112, H * 3, wall),
      ]);

      const compact = W < 720;
      const mailWidth = compact ? Math.min(286, W * 0.86) : 340;
      const wixWidth = compact ? Math.min(218, W * 0.76) : 260;
      const badgeHeight = compact ? 58 : 72;
      const orbSize = compact ? 112 : 142;
      const starSize = compact ? 118 : 150;

      const defs = [
        {
          kind: 'pill',
          label: 'mail',
          text: 'hi.doriskao@gmail.com',
          href: 'mailto:hi.doriskao@gmail.com',
          color: FOOTER_PALETTE.orange,
          fg: '#fff',
          w: mailWidth,
          h: badgeHeight,
        },
        {
          kind: 'flower',
          label: 'instagram',
          text: 'IG',
          svg: FLOWER,
          href: 'https://www.instagram.com/goo.goo.lii_/',
          target: '_blank',
          color: FOOTER_PALETTE.purple,
          fg: '#fff',
          size: orbSize,
        },
        {
          kind: 'rect',
          label: 'wix portfolio',
          text: t.footer.wix,
          href: 'https://ning888ning3050.wixsite.com/dorisme/mybrand',
          target: '_blank',
          color: FOOTER_PALETTE.dark,
          fg: FOOTER_PALETTE.cream,
          w: wixWidth,
          h: badgeHeight + 4,
        },
        {
          kind: 'star',
          label: 'arrow',
          text: '→',
          svg: STAR,
          color: FOOTER_PALETTE.blue,
          fg: '#fff',
          size: starSize,
        },
      ];

      defs.forEach((def, i) => {
        const el = makeEl(def);
        const w = el.offsetWidth || def.w || def.size || 80;
        const h = el.offsetHeight || def.h || def.size || 80;
        const spread = W / (defs.length + 1);
        const startX = spread * (i + 1) + (Math.random() - 0.5) * 90;
        const startY = -90 - i * 42 - Math.random() * 110;
        const opts = {
          restitution: 0.56,
          friction: 0.28,
          frictionAir: 0.014,
          angle: (Math.random() - 0.5) * 0.45,
        };
        const isRound = def.svg || def.kind === 'flower' || def.kind === 'star';
        const body = isRound
          ? Bodies.circle(startX, startY, Math.max(w, h) * 0.45, opts)
          : Bodies.rectangle(startX, startY, w, h, {
              ...opts,
              chamfer: { radius: def.kind === 'pill' ? h / 2 : 18 },
            });

        Composite.add(engine.world, body);
        items.push({ body, el, w, h });
      });

      pointerMove = (event) => {
        const rect = container.getBoundingClientRect();
        const mx = event.clientX - rect.left;
        const my = event.clientY - rect.top;
        const radius = 150;
        for (const { body } of items) {
          const dx = body.position.x - mx;
          const dy = body.position.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.5) {
            const force = (1 - dist / radius) * 0.035;
            Body.applyForce(body, body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            });
          }
        }
      };
      container.addEventListener('mousemove', pointerMove);

      Events.on(engine, 'afterUpdate', () => {
        for (const { body, el, w, h } of items) {
          el.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        }
      });

      Runner.run(runner, engine);
    };

    const ro = new ResizeObserver(build);
    ro.observe(container);
    build();

    return () => {
      ro.disconnect();
      if (pointerMove) container.removeEventListener('mousemove', pointerMove);
      Runner.stop(runner);
      Events.off(engine);
      Engine.clear(engine);
      items.forEach(({ el }) => el.remove());
    };
  }, [play, t.footer.wix]);

  return <div className="footer__shape-field" ref={containerRef} aria-hidden={!play} />;
}

export default function Footer() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [playShapes, setPlayShapes] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 82%',
      once: true,
      onEnter: () => setPlayShapes(true),
    });
    return () => trigger.kill();
  }, []);

  return (
    <footer className="section footer" id="contact" ref={sectionRef}>
      <div className="container footer__inner">
        <FooterShapeField play={playShapes} />
        <p className="footer__copyright">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
