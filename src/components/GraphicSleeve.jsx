import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/GraphicSleeve.css';

gsap.registerPlugin(ScrollTrigger);

const NOTCH_R = 34;
const BOLD_SWEEP_DURATION = 1500;
const BOLD_SWEEP_PAUSE = 80;

export default function GraphicSleeve() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  // 橘色紙套：Dotrice 點陣字挖孔 + 底部半圓開口（高度 = wrap 的 86vh）
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let cancelled = false;
    let frameId = 0;
    let metrics = null;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const drawTextMask = (layout, offsetX = 0, offsetY = 0) => {
      const { W, H, fs, portrait } = layout;
      ctx.fillText('GRAPHIC', W / 2 + offsetX, H * (portrait ? 0.42 : 0.38) + offsetY);
      ctx.fillText('WORK', W / 2 + offsetX, H * (portrait ? 0.58 : 0.66) + offsetY);
      ctx.beginPath();
      ctx.arc(W / 2, H, NOTCH_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${fs}px Dotrice`;
    };

    const drawFrame = (time = 0) => {
      if (!metrics) return;
      const { W, H, fs } = metrics;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#ec5b2b';
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fs}px Dotrice`;
      ctx.letterSpacing = `${Math.round(fs * 0.1)}px`;
      ctx.globalCompositeOperation = 'destination-out';
      drawTextMask(metrics);

      if (!reduceMotion) {
        const cycle = BOLD_SWEEP_DURATION * 2 + BOLD_SWEEP_PAUSE;
        const cycleTime = time % cycle;
        const isThinning = cycleTime > BOLD_SWEEP_DURATION;
        const phaseTime = isThinning ? cycleTime - BOLD_SWEEP_DURATION : cycleTime;
        const progress = Math.min(phaseTime / BOLD_SWEEP_DURATION, 1);
        const clipY = isThinning ? progress * H : 0;
        const clipHeight = isThinning ? H - clipY : progress * H;
        const boldOffset = Math.min(5.5, Math.max(1.8, fs * 0.016));
        const diagonalOffset = boldOffset * 0.72;
        const offsets = [
          [boldOffset, 0],
          [-boldOffset, 0],
          [0, boldOffset],
          [0, -boldOffset],
          [diagonalOffset, diagonalOffset],
          [-diagonalOffset, diagonalOffset],
          [diagonalOffset, -diagonalOffset],
          [-diagonalOffset, -diagonalOffset],
        ];

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, clipY, W, clipHeight);
        ctx.clip();
        offsets.forEach(([x, y]) => drawTextMask(metrics, x, y));
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    const animate = (time) => {
      if (cancelled) return;
      drawFrame(time);
      if (!reduceMotion) frameId = window.requestAnimationFrame(animate);
    };

    const setup = async () => {
      window.cancelAnimationFrame(frameId);
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (!W || !H) return;
      const fsTarget = Math.min(280, W * 0.22);
      try {
        await document.fonts.load(`${fsTarget}px Dotrice`);
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
      if (cancelled) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#ec5b2b';
      ctx.fillRect(0, 0, W, H);

      // 盡量放大，但 GRAPHIC 若超寬就自動縮到剛好置中不裁切
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fsTarget}px Dotrice`;
      ctx.letterSpacing = `${Math.round(fsTarget * 0.1)}px`;
      const maxW = W * 0.9;
      const tw = ctx.measureText('GRAPHIC').width;
      const fs = tw > maxW ? Math.floor((fsTarget * maxW) / tw) : fsTarget;
      // 直式手機：字級受寬度限制而偏小，兩行拉近往中間靠，避免大片空橘
      const portrait = H > W * 1.2;
      metrics = { W, H, fs, portrait };
      if (reduceMotion) drawFrame();
      else frameId = window.requestAnimationFrame(animate);
    };

    setup();
    const ro = new ResizeObserver(() => setup());
    ro.observe(wrap);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, []);

  // 定住：卡片抽出 = 孔洞露白到第二排，到那才停（之後整塊往上捲走、接續 BrandSection）
  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        {
          clipPath: 'inset(68% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="graphic-sleeve" ref={sectionRef} id="graphic-works">
      <div className="graphic-sleeve__stage">
        <div className="graphic-sleeve__hole-backdrop" />
        <div className="graphic-sleeve__card" ref={cardRef} />
        <div className="graphic-sleeve__wrap" ref={wrapRef}>
          <canvas className="graphic-sleeve__canvas" ref={canvasRef} />
        </div>
      </div>
    </section>
  );
}
