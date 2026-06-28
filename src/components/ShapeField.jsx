import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/ShapeField.css';

// dusendusen 風配色（圖四參考）
const PALETTE = {
  yellow: '#E9C84A',
  green: '#daef68',
  red: '#D9533B',
  blue: '#5B7FBF',
  purple: '#B3A0D6',
  pink: '#E89BB8',
  orange: '#ec5b2b',
};

// 鋸齒星爆
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
  `<svg viewBox="0 0 200 200" width="100%" height="100%"><polygon fill="${fill}" points="${starPoints(20, 98, 74, 100, 100)}"/></svg>`;

// 扇貝花形（多個同色圓重疊）
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

export default function ShapeField({ floorRef, start = true }) {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !start) return; // 等百葉窗結束才掉落
    const {
      Engine,
      Runner,
      Bodies,
      Body,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    let engine, runner, mc, mouseMove, started = false;
    const items = []; // { body, el, w, h }
    const labels = t.hero.capsule;

    const floorY = () => {
      const cRect = container.getBoundingClientRect();
      const nameEl = floorRef?.current;
      if (nameEl) return nameEl.getBoundingClientRect().top - cRect.top;
      return container.clientHeight;
    };

    // 先建立 DOM、量測真實尺寸，再依尺寸建立物理 body
    const makeEl = (className, html) => {
      const el = document.createElement('div');
      el.className = `shape ${className}`;
      if (html) el.innerHTML = html;
      container.appendChild(el);
      return el;
    };

    const defs = [
      // 只保留 4 個標籤 = 4 個大幾何圖形（字在圖形裡）
      { kind: 'svglabel', className: 'shape--label shape--svglabel', size: 210, svg: STAR, color: PALETTE.blue, fg: '#fff', text: labels[0] }, // 品牌 → 藍星爆
      { kind: 'rect', className: 'shape--label shape--pill', h: 104, color: PALETTE.purple, fg: '#fff', text: labels[1] }, // UI · 互動
      { kind: 'rect', className: 'shape--label shape--rect', h: 108, color: PALETTE.orange, fg: '#fff', text: labels[2] }, // VibeCoding
      { kind: 'svglabel', className: 'shape--label shape--svglabel', size: 210, svg: FLOWER, color: PALETTE.green, fg: '#1A1A1A', text: labels[3] }, // 平面設計 → 扇貝花形(亮綠底深字)
    ];

    const build = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (started || W < 50 || H < 50) return;
      started = true;

      engine = Engine.create();
      engine.gravity.y = 1.1;
      const world = engine.world;

      const fy = floorY();
      const wall = { isStatic: true };
      Composite.add(world, [
        Bodies.rectangle(W / 2, fy + 50, W + 400, 100, wall), // 底座 = 名字上緣
        Bodies.rectangle(-50, H / 2, 100, H * 3, wall),
        Bodies.rectangle(W + 50, H / 2, 100, H * 3, wall),
      ]);

      defs.forEach((d, i) => {
        let el;
        if (d.svg) {
          el = makeEl(d.className);
          el.style.width = d.size + 'px';
          el.style.height = d.size + 'px';
          el.innerHTML =
            d.svg(d.color) +
            (d.text ? `<span class="shape__text">${d.text}</span>` : '');
        } else {
          el = makeEl(d.className, d.html);
          if (d.text) el.textContent = d.text;
          if (d.size) {
            el.style.width = d.size + 'px';
            el.style.height = d.size + 'px';
          }
          if (d.w) el.style.width = d.w + 'px';
          if (d.h) el.style.height = d.h + 'px';
          if (d.color) el.style.background = d.color;
        }
        if (d.fg) el.style.color = d.fg;

        const w = el.offsetWidth || d.w || d.size || 80;
        const h = el.offsetHeight || d.h || d.size || 44;

        const startX = 80 + ((i * 137) % Math.max(W - 160, 200));
        const startY = -120 - Math.random() * 500; // 從上方錯落墜落

        const opts = {
          restitution: 0.68,
          friction: 0.25,
          frictionAir: 0.015,
          angle: (Math.random() - 0.5) * 0.6,
        };
        let body;
        if (d.kind === 'circle' || d.kind === 'svg' || d.kind === 'svglabel') {
          body = Bodies.circle(startX, startY, (Math.max(w, h) / 2) * 0.92, opts);
        } else {
          // pill = 全圓角；rect/square = 小圓角（不要變成圓）
          const chamfer = d.kind === 'square' ? 20 : d.className.includes('shape--pill') ? h / 2 : 16;
          body = Bodies.rectangle(startX, startY, w, h, { ...opts, chamfer: { radius: chamfer } });
        }
        Composite.add(world, body);
        items.push({ body, el, w, h });
      });

      // 游標推力：靠近的圖形被像球一樣推開
      const mouse = Mouse.create(container);
      mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.12, render: { visible: false } },
      });
      Composite.add(world, mc);

      // matter 預設會攔截滾輪/觸控事件並 preventDefault → 會卡住整頁捲動。移除這些監聽。
      mouse.element.removeEventListener('wheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      mouse.element.removeEventListener('touchstart', mouse.mousedown);
      mouse.element.removeEventListener('touchmove', mouse.mousemove);
      mouse.element.removeEventListener('touchend', mouse.mouseup);

      mouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const R = 150;
        for (const { body } of items) {
          const dx = body.position.x - mx;
          const dy = body.position.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.5) {
            const f = (1 - dist / R) * 0.05;
            Body.applyForce(body, body.position, {
              x: (dx / dist) * f,
              y: (dy / dist) * f,
            });
          }
        }
      };
      container.addEventListener('mousemove', mouseMove);

      Events.on(engine, 'afterUpdate', () => {
        for (const { body, el, w, h } of items) {
          el.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        }
      });

      runner = Runner.create();
      Runner.run(runner, engine);
    };

    const ro = new ResizeObserver(() => build());
    ro.observe(container);
    build();

    return () => {
      ro.disconnect();
      if (mouseMove) container.removeEventListener('mousemove', mouseMove);
      if (runner) Runner.stop(runner);
      if (engine) {
        Events.off(engine);
        Engine.clear(engine);
      }
      items.forEach(({ el }) => el.remove());
    };
  }, [t, start]);

  return <div className="hero__shapefield" ref={containerRef} aria-hidden="true" />;
}
