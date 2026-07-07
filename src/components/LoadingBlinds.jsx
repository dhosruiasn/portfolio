import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/components/LoadingBlinds.css';

const SLATS = 12;

export default function LoadingBlinds({ ready = true, onDone }) {
  const rootRef = useRef(null);
  const slatsRef = useRef(null);
  const cordRef = useRef(null);
  const [gone, setGone] = useState(false);
  const [releaseStarted, setReleaseStarted] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    if (!rootRef.current || !cordRef.current || !slatsRef.current) return undefined;
    const cord = cordRef.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone?.();
      setGone(true);
    };
    const currentTransform = window.getComputedStyle(cord).transform;
    cord.style.animation = 'none';
    if (currentTransform && currentTransform !== 'none') {
      cord.style.transform = currentTransform;
    }
    setReleaseStarted(true);
    // 失效保險：動畫若因分頁背景／rAF 卡住沒觸發 onComplete，最遲 4s 強制放行
    const failsafe = setTimeout(finish, 4000);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finish,
      });
      // 先從目前擺盪角度收回中心，再往下拉開，避免 ready 時瞬間跳正。
      tl.to(
        cord,
        { x: 0, rotation: 0, duration: 0.24, ease: 'sine.out' },
        0
      );
      // 拉繩往下拉（配重塊往下）
      tl.to(cord, { y: 90, duration: 0.62, ease: 'power2.inOut' }, 0.2);
      // 葉片往上收起（整片百葉窗往上收，由下往上露出 Hero）
      tl.to(
        slatsRef.current,
        { scaleY: 0, transformOrigin: 'top center', duration: 0.95, ease: 'power2.inOut' },
        0.36
      );
      // 拉桿跟著收起方向離場並淡出，避免拉開後直接消失。
      tl.to(cord, { y: -120, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.86);
    }, rootRef.current);
    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
  }, [onDone, ready]);

  if (gone) return null;

  return (
    <div className={`loading-blinds${releaseStarted ? ' loading-blinds--releasing' : ''}`} ref={rootRef} aria-hidden="true">
      <div className="loading-blinds__slats" ref={slatsRef}>
        {Array.from({ length: SLATS }).map((_, i) => (
          <div className="loading-blinds__slat" key={i} />
        ))}
      </div>
      <div className="loading-blinds__cord-swing" ref={cordRef}>
        <div className="loading-blinds__cord">
          <span className="loading-blinds__weight" />
        </div>
      </div>
    </div>
  );
}
