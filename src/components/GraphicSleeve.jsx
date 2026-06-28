import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/GraphicSleeve.css';

gsap.registerPlugin(ScrollTrigger);

const NOTCH_R = 34;

export default function GraphicSleeve() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  // 橘色紙套：Dotrice 點陣字挖孔 + 底部半圓開口（高度 = wrap 的 86vh）
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');
    let cancelled = false;

    const draw = async () => {
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
      ctx.font = `${fs}px Dotrice`;
      ctx.letterSpacing = `${Math.round(fs * 0.1)}px`;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillText('GRAPHIC', W / 2, H * 0.38);
      ctx.fillText('WORK', W / 2, H * 0.66);
      ctx.beginPath();
      ctx.arc(W / 2, H, NOTCH_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrap);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  // 定住：卡片抽出 = 孔洞露白到第二排，到那才停（之後整塊往上捲走、接續 BrandSection）
  useEffect(() => {
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
