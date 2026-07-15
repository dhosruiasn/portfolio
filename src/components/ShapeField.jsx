import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { SHAPE_MATERIALS } from '../data/shapeMaterials.js';
import '../styles/components/ShapeField.css';

// 圖二材質：深色飽和核心 → 明亮中間色 → 柔亮外緣。
// 四個配色保留原本藍／紫／橘／綠的識別，但共享同一種發光軟材質。
const cssMaterial = ([core, deep, mid, edge, glow]) =>
  `radial-gradient(ellipse at 50% 46%, ${core} 0%, ${deep} 30%, ${mid} 56%, ${edge} 82%, ${glow} 100%)`;

const svgGradient = (id, [core, deep, mid, edge, glow]) =>
  `<defs><radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="100" cy="92" r="136"><stop offset="0%" stop-color="${core}"/><stop offset="30%" stop-color="${deep}"/><stop offset="56%" stop-color="${mid}"/><stop offset="82%" stop-color="${edge}"/><stop offset="100%" stop-color="${glow}"/></radialGradient></defs>`;

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
const STAR = (material) =>
  `<svg viewBox="0 0 200 200" width="100%" height="100%">${svgGradient('star-material', material)}<polygon fill="url(#star-material)" points="${starPoints(20, 98, 74, 100, 100)}"/></svg>`;

// 扇貝花形（多個同色圓重疊）
const FLOWER = (material) => {
  const n = 7;
  const R = 52;
  const pr = 46;
  let circles = '<circle cx="100" cy="100" r="60" fill="url(#flower-material)"/>';
  for (let i = 0; i < n; i++) {
    const a = i * ((2 * Math.PI) / n) - Math.PI / 2;
    circles += `<circle cx="${(100 + Math.cos(a) * R).toFixed(1)}" cy="${(
      100 +
      Math.sin(a) * R
    ).toFixed(1)}" r="${pr}" fill="url(#flower-material)"/>`;
  }
  return `<svg viewBox="0 0 200 200" width="100%" height="100%">${svgGradient('flower-material', material)}${circles}</svg>`;
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
      { kind: 'svglabel', className: 'shape--label shape--svglabel shape--material', size: 210, svg: STAR, material: SHAPE_MATERIALS.blue, fg: '#fff', text: labels[0] },
      { kind: 'rect', className: 'shape--label shape--pill shape--material', h: 104, material: SHAPE_MATERIALS.purple, fg: '#f4eaff', text: labels[1] },
      { kind: 'rect', className: 'shape--label shape--rect shape--material', h: 108, material: SHAPE_MATERIALS.orange, fg: '#fff1df', text: labels[2] },
      { kind: 'svglabel', className: 'shape--label shape--svglabel shape--material', size: 210, svg: FLOWER, material: SHAPE_MATERIALS.green, fg: '#f0f6cf', text: labels[3] },
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

      // 手機縮小到 72%：形狀是內容標籤要保留，但原尺寸會蓋住 ASCII 主視覺
      // 手機縮更小（0.58）：形狀並排落地一層，不會堆高壓到 ASCII 主視覺
      const compact = W < 700;
      const k = compact ? 0.58 : 1;
      defs.forEach((d, i) => {
        let el;
        if (d.svg) {
          el = makeEl(d.className);
          el.style.width = Math.round(d.size * k) + 'px';
          el.style.height = Math.round(d.size * k) + 'px';
          el.innerHTML =
            d.svg(d.material) +
            (d.text ? `<span class="shape__text">${d.text}</span>` : '');
        } else {
          el = makeEl(d.className, d.html);
          if (d.text) el.textContent = d.text;
          if (d.size) {
            el.style.width = Math.round(d.size * k) + 'px';
            el.style.height = Math.round(d.size * k) + 'px';
          }
          if (d.w) el.style.width = Math.round(d.w * k) + 'px';
          if (d.h) el.style.height = Math.round(d.h * k) + 'px';
          if (d.material) el.style.background = cssMaterial(d.material);
        }
        if (d.fg) el.style.color = d.fg;

        const w = el.offsetWidth || d.w || d.size || 80;
        const h = el.offsetHeight || d.h || d.size || 44;

        // 手機平均分佈落點（並排一層）；桌面沿用錯落
        const startX = compact
          ? (W / (defs.length + 1)) * (i + 1)
          : 80 + ((i * 137) % Math.max(W - 160, 200));
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

        // 同步先把元素移到落點（畫面上方外）：否則第一次 afterUpdate 前元素沒有
        // transform，會被畫在容器左上角 (0,0) 閃一格（手機尤其明顯），才跳上去掉落。
        el.style.transform = `translate(${startX - w / 2}px, ${startY - h / 2}px) rotate(${opts.angle}rad)`;
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
    // 低階機保護：matter-js 初始化延到主線程空檔再跑，不擋首屏渲染
    let idleId = null;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => build(), { timeout: 800 });
    } else {
      idleId = setTimeout(build, 120);
    }

    // 背景分頁暫停物理運算：rAF 被節流時 delta 積累，切回來形狀會噴飛
    const onVisibility = () => {
      if (!runner) return;
      if (document.hidden) {
        Runner.stop(runner);
      } else {
        Runner.run(runner, engine);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ro.disconnect();
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      document.removeEventListener('visibilitychange', onVisibility);
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
