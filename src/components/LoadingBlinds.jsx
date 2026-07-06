import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/components/LoadingBlinds.css';

const SLATS = 12;

export default function LoadingBlinds({ ready = true, onDone }) {
  const rootRef = useRef(null);
  const slatsRef = useRef(null);
  const cordRef = useRef(null);
  const loaderRef = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    if (!rootRef.current || !cordRef.current || !slatsRef.current) return undefined;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone?.();
      setGone(true);
    };
    // 失效保險：動畫若因分頁背景／rAF 卡住沒觸發 onComplete，最遲 3.5s 強制放行
    const failsafe = setTimeout(finish, 3500);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finish,
      });
      tl.to(loaderRef.current, { opacity: 0, scale: 0.96, duration: 0.18, ease: 'power1.out' }, 0.48);
      // 0.3s 拉繩微晃
      tl.to(
        cordRef.current,
        { keyframes: { x: [0, 4, -4, 0] }, duration: 0.3, ease: 'power1.inOut' },
        0.3
      );
      // 0.5s 拉繩往下拉（配重塊往下）
      tl.to(cordRef.current, { y: 90, duration: 0.9, ease: 'power2.inOut' }, 0.5);
      // 0.6s 葉片往上收起（整片百葉窗往上收，由下往上露出 Hero）
      tl.to(
        slatsRef.current,
        { scaleY: 0, transformOrigin: 'top center', duration: 0.95, ease: 'power2.inOut' },
        0.6
      );
    }, rootRef.current);
    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
  }, [onDone, ready]);

  if (gone) return null;

  return (
    <div className="loading-blinds" ref={rootRef} aria-hidden="true">
      <div className="loading-blinds__slats" ref={slatsRef}>
        {Array.from({ length: SLATS }).map((_, i) => (
          <div className="loading-blinds__slat" key={i} />
        ))}
      </div>
      <div className="loading-blinds__loader" ref={loaderRef}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span className="loading-blinds__loader-square" style={{ '--loader-index': i }} key={i} />
        ))}
      </div>
      <div className="loading-blinds__cord" ref={cordRef}>
        <span className="loading-blinds__weight" />
      </div>
    </div>
  );
}
