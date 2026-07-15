import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects.js';
import { assetPath } from '../utils/assetPath.js';
import { warmProjectMedia } from '../utils/projectMediaPreload.js';
import ProjectCard from './ProjectCard.jsx';
import ProjectDetailPage from './ProjectDetailPage.jsx';
import '../styles/components/DigitalWorks.css';

gsap.registerPlugin(ScrollTrigger);

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_DIGITAL_EDIT = import.meta.env.DEV && !!params && params.has('digitalEdit');
const SHOW_CARD_EDIT = import.meta.env.DEV && !!params && params.has('cardEdit');
const DEFAULT_DIGITAL_TUNE = {
  titleBottom: 5.8,
  titleSize: 14.2,
  titleGap: 1.5,
  mobileTitleBottom: 9.8,
  mobileTitleSize: 23,
  mobileTitleGap: 4.7,
  lightOpacity: 1,
  arcLeftY: 35,
  arcCenterY: 211,
  arcRightY: 36,
  arcControlX: 850,
  flowOrbRx: 460,
  flowOrbRy: 300,
  flowDuration: 14,
  flowOpacity: 0.9,
};

const DEFAULT_PICKMIN_CARD_TUNE = {
  videoScale: 2.66,
  videoX: 0,
  videoY: 2,
};

const DEFAULT_WORK_ORDER_CARD_TUNE = {
  // 新封面 work-order-cover-full.png 已含完整視窗與留白，不需再縮放位移
  imageScale: 1,
  imageX: 0,
  imageY: 0,
};

function TuneRow({ label, value, min, max, step = 0.1, unit = '%', onChange }) {
  return (
    <label className="digital-tune__row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <input type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <em>{unit}</em>
    </label>
  );
}

function DigitalTunePanel({ tune, setTune }) {
  const set = (key) => (value) => setTune((current) => ({ ...current, [key]: value }));
  const copyRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  const arcTune = {
    arcLeftY: tune.arcLeftY,
    arcCenterY: tune.arcCenterY,
    arcRightY: tune.arcRightY,
    arcControlX: tune.arcControlX,
    flowOrbRx: tune.flowOrbRx,
    flowOrbRy: tune.flowOrbRy,
    flowDuration: tune.flowDuration,
    flowOpacity: tune.flowOpacity,
  };
  const pathPayload = JSON.stringify(arcTune, null, 2);

  const copyPathPayload = () => {
    copyRef.current?.focus();
    copyRef.current?.select();
    setCopyStatus('已選取數值，請按 ⌘C');
    let copied = false;

    try {
      // 先在使用者點擊事件內同步複製；in-app browser 對此通常比 Clipboard API 穩定。
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    if (copied) {
      setCopyStatus('已複製光源路徑參數');
      return;
    }

    navigator.clipboard?.writeText(pathPayload)
      .then(() => setCopyStatus('已複製光源路徑參數'))
      .catch(() => {});
  };
  return (
    <div className="digital-tune">
      <strong>Digital 調整</strong>
      <TuneRow label="字底" value={tune.titleBottom} min={0} max={22} onChange={set('titleBottom')} />
      <TuneRow label="字級" value={tune.titleSize} min={8} max={18} step={0.2} unit="vw" onChange={set('titleSize')} />
      <TuneRow label="行距" value={tune.titleGap} min={0} max={4} step={0.1} unit="vw" onChange={set('titleGap')} />
      <TuneRow label="手機底" value={tune.mobileTitleBottom} min={0} max={28} onChange={set('mobileTitleBottom')} />
      <TuneRow label="手機字" value={tune.mobileTitleSize} min={10} max={28} step={0.2} unit="vw" onChange={set('mobileTitleSize')} />
      <TuneRow label="手機距" value={tune.mobileTitleGap} min={0} max={6} step={0.1} unit="vw" onChange={set('mobileTitleGap')} />
      <TuneRow label="光" value={tune.lightOpacity} min={0.4} max={1} step={0.05} unit="" onChange={set('lightOpacity')} />
      <span className="digital-tune__section">弧形光線（原圖座標 1672×941）</span>
      <TuneRow label="左端Y" value={tune.arcLeftY} min={0} max={100} step={1} unit="px" onChange={set('arcLeftY')} />
      <TuneRow label="中央Y" value={tune.arcCenterY} min={140} max={280} step={1} unit="px" onChange={set('arcCenterY')} />
      <TuneRow label="右端Y" value={tune.arcRightY} min={0} max={100} step={1} unit="px" onChange={set('arcRightY')} />
      <TuneRow label="控制X" value={tune.arcControlX} min={650} max={1020} step={1} unit="px" onChange={set('arcControlX')} />
      <TuneRow label="光寬" value={tune.flowOrbRx} min={120} max={460} step={2} unit="px" onChange={set('flowOrbRx')} />
      <TuneRow label="光高" value={tune.flowOrbRy} min={70} max={300} step={2} unit="px" onChange={set('flowOrbRy')} />
      <TuneRow label="單程秒數" value={tune.flowDuration} min={8} max={48} step={1} unit="s" onChange={set('flowDuration')} />
      <TuneRow label="流光" value={tune.flowOpacity} min={0.1} max={1} step={0.05} unit="" onChange={set('flowOpacity')} />
      <button
        type="button"
        className="digital-tune__copy"
        onClick={copyPathPayload}
      >
        {copyStatus || '複製光源路徑參數'}
      </button>
      <textarea
        ref={copyRef}
        readOnly
        value={pathPayload}
        aria-label="光源路徑參數；點一下會選取全部"
        onClick={(event) => event.currentTarget.select()}
      />
    </div>
  );
}

function PickminCardTunePanel({ tune, setTune }) {
  const set = (key) => (value) => setTune((current) => ({ ...current, [key]: value }));
  return (
    <div className="digital-tune digital-tune--pickmin-card">
      <strong>Pickmin 卡片影片</strong>
      <TuneRow label="比例" value={tune.videoScale} min={0.9} max={3.2} step={0.01} unit="x" onChange={set('videoScale')} />
      <TuneRow label="X" value={tune.videoX} min={-180} max={180} step={1} unit="px" onChange={set('videoX')} />
      <TuneRow label="Y" value={tune.videoY} min={-240} max={240} step={1} unit="px" onChange={set('videoY')} />
      <textarea readOnly value={JSON.stringify(tune)} />
    </div>
  );
}

function WorkOrderCardTunePanel({ tune, setTune }) {
  const set = (key) => (value) => setTune((current) => ({ ...current, [key]: value }));
  return (
    <div className="digital-tune digital-tune--work-order-card">
      <strong>Work-Order 封面</strong>
      <TuneRow label="比例" value={tune.imageScale} min={0.6} max={2.4} step={0.01} unit="x" onChange={set('imageScale')} />
      <TuneRow label="X" value={tune.imageX} min={-220} max={220} step={1} unit="px" onChange={set('imageX')} />
      <TuneRow label="Y" value={tune.imageY} min={-260} max={260} step={1} unit="px" onChange={set('imageY')} />
      <textarea readOnly value={JSON.stringify(tune)} />
    </div>
  );
}

export default function DigitalWorks() {
  const [active, setActive] = useState(null);
  const [openingProjectId, setOpeningProjectId] = useState(null);
  const [tune, setTune] = useState(DEFAULT_DIGITAL_TUNE);
  const [pickminCardTune, setPickminCardTune] = useState(DEFAULT_PICKMIN_CARD_TUNE);
  const [workOrderCardTune, setWorkOrderCardTune] = useState(DEFAULT_WORK_ORDER_CARD_TUNE);
  const handleOpenProject = useCallback((project) => {
    warmProjectMedia(project);
    setOpeningProjectId(project.id);
    setActive(project);
  }, []);
  const handlePrepareOpenProject = useCallback((project) => {
    warmProjectMedia(project);
    setOpeningProjectId(project.id);
  }, []);
  const handleClose = useCallback(() => {
    setActive(null);
    setOpeningProjectId(null);
  }, []);
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const lightRef = useRef(null);
  const raysRef = useRef(null);
  const finalFieldRef = useRef(null);
  const heroFlowRef = useRef(null);
  const heroMotionRef = useRef(null);
  const fixtureRef = useRef(null);
  const lampOffRef = useRef(null);
  const lampOnRef = useRef(null);
  const chainRef = useRef(null); // 珠珠鏈（已從燈 PNG 拆成獨立圖層，可拉伸回彈）
  const chainOffRef = useRef(null); // 關燈珠鏈；開燈時需完整退場，避免與亮燈珠鏈重影
  const chainOnRef = useRef(null); // 開燈狀態的鏈子（吃到暖光），與 lampOn 同步淡入
  const chainPatchRef = useRef(null); // 只修補關燈素材的燈罩缺口，亮燈時必須同步退場
  const titleRef = useRef(null);
  const titleRevealRef = useRef(null);
  const titleSheenRef = useRef(null);
  const cordRef = useRef(null);
  const switchTlRef = useRef(null);
  const lampInteractiveReadyRef = useRef(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const handleResumeProjectOpen = (event) => {
      const projectId = event.detail?.projectId;
      const project = projects.find((item) => item.id === projectId);
      if (!project) return;
      handleOpenProject(project);
      rootRef.current?.scrollIntoView({ block: 'start' });
    };

    window.addEventListener('portfolio:open-project', handleResumeProjectOpen);
    return () => window.removeEventListener('portfolio:open-project', handleResumeProjectOpen);
  }, [handleOpenProject]);

  useEffect(() => {
    if (
      !lightRef.current ||
      !raysRef.current ||
      !finalFieldRef.current ||
      !heroFlowRef.current ||
      !heroMotionRef.current ||
      !fixtureRef.current ||
      !lampOffRef.current ||
      !lampOnRef.current ||
      !chainRef.current ||
      !chainOffRef.current ||
      !chainOnRef.current ||
      !chainPatchRef.current ||
      !titleRef.current ||
      !titleRevealRef.current ||
      !titleSheenRef.current ||
      !cordRef.current ||
      !rootRef.current ||
      !gridRef.current
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const startArcFlow = () => heroMotionRef.current?.beginElement();

      rootRef.current.classList.remove('digital-works--lit');
      gsap.set([lightRef.current, finalFieldRef.current, heroFlowRef.current, titleRef.current], {
        opacity: 0,
      });
      gsap.set(titleRevealRef.current, { WebkitMaskSize: '0% 125%', maskSize: '0% 125%' });
      gsap.set(titleSheenRef.current, { opacity: 0 });
      gsap.set(fixtureRef.current, {
        opacity: 0,
        y: '-56vh',
        rotation: -8,
        transformOrigin: '50% 0%',
      });
      gsap.set([lampOffRef.current, chainOffRef.current, chainPatchRef.current], { opacity: 1 });
      gsap.set([lampOnRef.current, chainOnRef.current], { opacity: 0 });
      gsap.set(chainRef.current, { scaleY: 1, transformOrigin: '50% 0%' });

      switchTlRef.current = gsap
        .timeline({
          paused: true,
          onComplete: () => {
            lampInteractiveReadyRef.current = true;
          },
        })
        .call(() => {
          lampInteractiveReadyRef.current = false;
          rootRef.current?.classList.remove('digital-works--lit');
        }, null, 0)
        .set([lightRef.current, finalFieldRef.current, heroFlowRef.current, titleRef.current], { opacity: 0 }, 0)
        .set(titleRevealRef.current, { WebkitMaskSize: '0% 125%', maskSize: '0% 125%' }, 0)
        .set(titleSheenRef.current, { opacity: 0 }, 0)
        .set(fixtureRef.current, { opacity: 0, y: '-56vh', rotation: -8 }, 0)
        .set([lampOffRef.current, chainOffRef.current, chainPatchRef.current], { opacity: 1 }, 0)
        .set([lampOnRef.current, chainOnRef.current], { opacity: 0 }, 0)
        .set(chainRef.current, { scaleY: 1 }, 0)
        // 整組燈具從上方落下：先越過定位點，再以逐次縮小的角度阻尼擺動。
        .to(fixtureRef.current, { opacity: 1, y: 18, rotation: -4, duration: 0.72, ease: 'power2.in' }, 0)
        .to(fixtureRef.current, { y: -8, rotation: 7, duration: 0.28, ease: 'power2.out' }, 0.72)
        .to(fixtureRef.current, { y: 4, rotation: -3.5, duration: 0.3, ease: 'power1.inOut' }, 1)
        .to(fixtureRef.current, { y: 0, rotation: 1.5, duration: 0.3, ease: 'power1.inOut' }, 1.3)
        .to(fixtureRef.current, { rotation: 0, duration: 0.42, ease: 'power2.out' }, 1.6)
        // 拉珠珠鏈：頂端固定在燈罩、往下拉伸再彈回（鏈子已拆成獨立圖層）
        .to(chainRef.current, { scaleY: 1.3, duration: 0.16, ease: 'power2.out' }, 1.24)
        .to(chainRef.current, { scaleY: 1, duration: 0.95, ease: 'elastic.out(1.2, 0.24)' }, 1.4)
        // 關／開燈素材的珠鏈起點不同，必須整組交叉淡化，不能讓兩條鏈與關燈補片同時存在。
        .to([lampOffRef.current, chainOffRef.current, chainPatchRef.current], { opacity: 0, duration: 0.16, ease: 'none' }, 1.45)
        .to([lampOnRef.current, chainOnRef.current], { opacity: 1, duration: 0.16, ease: 'none' }, 1.45)
        .to(lightRef.current, { opacity: tune.lightOpacity, duration: 0.14, ease: 'none' }, 1.46)
        // 燈亮後牆面空間浮現；整張字圖用單一斜向柔邊 mask 顯影。
        .to(finalFieldRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.62)
        .call(() => rootRef.current?.classList.add('digital-works--lit'), null, 1.7)
        .call(startArcFlow, null, 1.7)
        .to(heroFlowRef.current, { opacity: 1, duration: 1.15, ease: 'power2.out' }, 1.72)
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
          1.7
        )
        .fromTo(
          titleRevealRef.current,
          { WebkitMaskSize: '0% 125%', maskSize: '0% 125%' },
          { WebkitMaskSize: '126% 125%', maskSize: '126% 125%', duration: 1.15, ease: 'power2.inOut' },
          1.72
        )
        .to(titleSheenRef.current, { opacity: 1, duration: 0.32, ease: 'power1.out' }, 2.62);

      const restartIfUnlit = () => {
        if (rootRef.current?.classList.contains('digital-works--lit')) return;
        switchTlRef.current?.restart();
      };

      const trigger = SHOW_DIGITAL_EDIT
        ? null
        : ScrollTrigger.create({
            trigger: rootRef.current,
            start: 'top top',
            end: '+=80%',
            onEnter: restartIfUnlit,
            onEnterBack: restartIfUnlit,
            onLeaveBack: () => {
              lampInteractiveReadyRef.current = false;
              rootRef.current?.classList.remove('digital-works--lit');
              switchTlRef.current?.pause(0);
            },
          });

      // 對齊模式直接停在完整亮燈畫面，控制者不用先觸發捲動時間軸。
      if (SHOW_DIGITAL_EDIT) {
        switchTlRef.current.progress(1);
        gsap.set(heroFlowRef.current, { opacity: 1 });
      }

      return () => {
        rootRef.current?.classList.remove('digital-works--lit');
        trigger?.kill();
      };
    }, rootRef.current);

    return () => ctx.revert();
  }, [tune.flowDuration, tune.lightOpacity]);

  // 精細游標碰到燈罩時，將移動方向／速度轉成角速度；彈簧與阻尼讓燈具自由回正。
  // 光束旋轉、中央光池位移使用同一個 angle，避免燈罩與光線各自運動。
  useEffect(() => {
    const scene = sceneRef.current;
    const fixture = fixtureRef.current;
    const rays = raysRef.current;
    const light = lightRef.current;
    if (!scene || !fixture || !rays || !light) return undefined;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduceMotion.matches) return undefined;

    let raf = 0;
    let angle = 0;
    let velocity = 0;
    let chainAngle = 0;
    let chainVelocity = 0;
    let touchingShade = false;
    let touchingChain = false;
    let previousX = null;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const onPointerMove = (event) => {
      const rect = fixture.getBoundingClientRect();
      const chainRect = chainRef.current?.getBoundingClientRect();
      const dx = previousX === null ? 0 : event.clientX - previousX;
      previousX = event.clientX;

      // PNG 是方形透明畫布；只把實際可見燈罩範圍視為碰撞區。
      const inShade =
        event.clientX >= rect.left + rect.width * 0.1 &&
        event.clientX <= rect.right - rect.width * 0.1 &&
        event.clientY >= rect.top + rect.height * 0.28 &&
        event.clientY <= rect.top + rect.height * 0.74;

      const inChain = !!chainRect &&
        event.clientX >= chainRect.left - 12 &&
        event.clientX <= chainRect.right + 12 &&
        event.clientY >= chainRect.top - 8 &&
        event.clientY <= chainRect.bottom + 10;

      if (!lampInteractiveReadyRef.current) {
        touchingShade = false;
        touchingChain = false;
        return;
      }

      if (inShade) {
        const side = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const entryImpulse = touchingShade ? 0 : (Math.abs(side) > 0.12 ? side : (dx >= 0 ? 0.8 : -0.8)) * 1.35;
        velocity = clamp(velocity + dx * 0.055 + side * 0.16 + entryImpulse, -4.8, 4.8);
        touchingShade = true;
      } else {
        touchingShade = false;
      }

      if (inChain) {
        const direction = dx === 0 ? (event.clientX < chainRect.left + chainRect.width / 2 ? -1 : 1) : Math.sign(dx);
        const entryImpulse = touchingChain ? 0 : direction * 2.1;
        chainVelocity = clamp(chainVelocity + dx * 0.095 + entryImpulse, -7.2, 7.2);
        // 拉動鏈子會把一小部分動量傳回燈罩，但不會像直接推燈罩那麼大。
        velocity = clamp(velocity + dx * 0.014 + direction * 0.08, -4.8, 4.8);
        touchingChain = true;
      } else {
        touchingChain = false;
      }
    };

    const onPointerLeave = () => {
      previousX = null;
      touchingShade = false;
      touchingChain = false;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!lampInteractiveReadyRef.current) {
        angle = 0;
        velocity = 0;
        chainAngle = 0;
        chainVelocity = 0;
        gsap.set(chainRef.current, { rotation: 0 });
        return;
      }

      const previousAngle = angle;
      velocity += -angle * 0.022;
      velocity *= 0.944;
      angle += velocity;

      // 鏈子是燈罩上的第二個鐘擺：燈罩加速時因慣性反向延遲，之後自行回正。
      const lampDelta = angle - previousAngle;
      chainVelocity += -chainAngle * 0.034 - lampDelta * 0.46;
      chainVelocity *= 0.938;
      chainAngle += chainVelocity;

      if (Math.abs(angle) < 0.015 && Math.abs(velocity) < 0.015) {
        angle = 0;
        velocity = 0;
      }
      if (Math.abs(chainAngle) < 0.02 && Math.abs(chainVelocity) < 0.02) {
        chainAngle = 0;
        chainVelocity = 0;
      }

      if (angle > 12) {
        angle = 12;
        velocity *= -0.28;
      } else if (angle < -12) {
        angle = -12;
        velocity *= -0.28;
      }
      if (chainAngle > 20) {
        chainAngle = 20;
        chainVelocity *= -0.24;
      } else if (chainAngle < -20) {
        chainAngle = -20;
        chainVelocity *= -0.24;
      }

      gsap.set(fixture, { rotation: angle, transformOrigin: '50% 0%' });
      gsap.set(chainRef.current, { rotation: chainAngle, transformOrigin: '50% 0%' });
      gsap.set(rays, { rotation: angle * 0.72, xPercent: angle * -0.1 });
      // 正角度＝燈罩順時針；開口法線與地面光池會往左，所以位移符號必須相反。
      light.style.setProperty('--lamp-light-shift', `${angle * -0.48}%`);
    };

    scene.addEventListener('pointermove', onPointerMove, { passive: true });
    scene.addEventListener('pointerleave', onPointerLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      scene.removeEventListener('pointermove', onPointerMove);
      scene.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(raf);
      light.style.removeProperty('--lamp-light-shift');
      gsap.set(rays, { clearProps: 'transform' });
    };
  }, []);

  useEffect(() => {
    if (!lightRef.current) return;
    if (parseFloat(gsap.getProperty(lightRef.current, 'opacity')) > 0) {
      gsap.set(lightRef.current, { opacity: tune.lightOpacity });
    }
  }, [tune.lightOpacity]);

  const replaySwitch = useCallback(() => {
    lampInteractiveReadyRef.current = false;
    switchTlRef.current?.restart();
  }, []);

  // 滑動時逐張翻開（橘色背面 → 作品正面），scrub + stagger = 一步翻一張
  useEffect(() => {
    if (!gridRef.current) return undefined;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.project-card__flip');
      if (!cards?.length) return;
      // 手機單欄卡片很高：翻卡提早完成，避免使用者停住時卡在半翻的橘背面
      const compact = window.matchMedia('(max-width: 900px)').matches;
      gsap.to(cards, {
        rotateY: 180,
        ease: 'none',
        stagger: compact ? 0.35 : 0.6,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 96%',
          end: compact ? 'top 58%' : 'top 34%',
          scrub: true,
        },
      });
    }, gridRef.current);
    return () => ctx.revert();
  }, []);

  const arcControlY = 2 * tune.arcCenterY - (tune.arcLeftY + tune.arcRightY) / 2;
  const arcMidX = tune.arcControlX / 2 + 418;
  const arcCurvePath = `M 0 ${tune.arcLeftY} Q ${tune.arcControlX} ${arcControlY} 1672 ${tune.arcRightY}`;

  return (
    <section
      className="digital-works"
      id="digital-works"
      ref={rootRef}
      style={{
        '--digital-title-bottom': `${tune.titleBottom}%`,
        '--digital-title-size': `${tune.titleSize}vw`,
        '--digital-title-gap': `${tune.titleGap}vw`,
        '--digital-mobile-title-bottom': `${tune.mobileTitleBottom}%`,
        '--digital-mobile-title-size': `${tune.mobileTitleSize}vw`,
        '--digital-mobile-title-gap': `${tune.mobileTitleGap}vw`,
        '--digital-light-opacity': tune.lightOpacity,
        '--pickmin-card-video-scale': pickminCardTune.videoScale,
        '--pickmin-card-video-x': `${pickminCardTune.videoX}px`,
        '--pickmin-card-video-y': `${pickminCardTune.videoY}px`,
        '--work-order-card-image-scale': workOrderCardTune.imageScale,
        '--work-order-card-image-x': `${workOrderCardTune.imageX}px`,
        '--work-order-card-image-y': `${workOrderCardTune.imageY}px`,
      }}
    >
      <div className="digital-works__intro">
        <div className="digital-works__scene" ref={sceneRef}>
          <div className="digital-works__art">
            <div className="digital-works__light" ref={lightRef} aria-hidden="true">
              <div className="digital-works__rays" ref={raysRef} />
              <div className="digital-works__final-field" ref={finalFieldRef} />
            </div>
            <svg
              ref={heroFlowRef}
              className="digital-works__flow digital-works__flow--hero"
              viewBox="0 0 1672 941"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="digital-flow-below-arc">
                  <path d={`${arcCurvePath} L 1672 1100 L 0 1100 Z`} />
                </clipPath>
                <radialGradient id="digital-flow-hero-orb" cx="50%" cy="50%" r="40%">
                  <stop offset="0" stopColor="#ffd23b" stopOpacity="0.96" />
                  <stop offset="0.22" stopColor="#ffb018" stopOpacity="0.84" />
                  <stop offset="0.48" stopColor="#ff7a00" stopOpacity="0.5" />
                  <stop offset="0.68" stopColor="#ff5a00" stopOpacity="0.14" />
                  <stop offset="0.82" stopColor="#ff4a00" stopOpacity="0" />
                  <stop offset="1" stopColor="#ff4a00" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g clipPath="url(#digital-flow-below-arc)">
                <g className="digital-works__flow-orb digital-works__flow-orb--hero">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={tune.flowOrbRx}
                    ry={tune.flowOrbRy}
                    fill="url(#digital-flow-hero-orb)"
                    opacity={tune.flowOpacity}
                  />
                  <animateMotion
                    ref={heroMotionRef}
                    begin="indefinite"
                    dur={`${tune.flowDuration * 2}s`}
                    repeatCount="indefinite"
                    rotate="0"
                    calcMode="spline"
                    keyPoints="0;1;0"
                    keyTimes="0;0.5;1"
                    keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                    path={arcCurvePath}
                  />
                </g>
              </g>
            </svg>
            {SHOW_DIGITAL_EDIT && (
              <svg
                className="digital-works__arc-editor"
                viewBox="0 0 1672 941"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <g className="digital-works__arc-guide">
                  <path d={arcCurvePath} />
                  <circle cx="0" cy={tune.arcLeftY} r="9" />
                  <circle cx={arcMidX} cy={tune.arcCenterY} r="9" />
                  <circle cx="1672" cy={tune.arcRightY} r="9" />
                </g>
              </svg>
            )}
            <div className="digital-works__headline" ref={titleRef} role="img" aria-label="Digital works">
              <div className="digital-works__headline-stack">
                <div className="digital-works__headline-reveal" ref={titleRevealRef}>
                  <img
                    className="digital-works__headline-art"
                    src={assetPath('images/graphic/digital-work/digital-works-title-white.png')}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                {/* 光澤掃過：拿字圖自身當遮罩，亮帶只在筆畫裡跑 */}
                <span
                  className="digital-works__headline-sheen"
                  ref={titleSheenRef}
                  style={{
                    WebkitMaskImage: `url(${assetPath('images/graphic/digital-work/digital-works-title-white.png')})`,
                    maskImage: `url(${assetPath('images/graphic/digital-work/digital-works-title-white.png')})`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="digital-works__fixture" ref={fixtureRef}>
              <img
                className="digital-works__lamp-art digital-works__lamp-art--off"
                ref={lampOffRef}
                src={assetPath('images/graphic/digital-work/digital-lamp-off-nochain.png')}
                alt=""
              />
              <img
                className="digital-works__lamp-art digital-works__lamp-art--on"
                ref={lampOnRef}
                src={assetPath('images/graphic/digital-work/digital-lamp-on-nochain.png')}
                alt=""
              />
              <div className="digital-works__lamp-chain-patch" ref={chainPatchRef} aria-hidden="true">
                <img src={assetPath('images/graphic/digital-work/digital-lamp-chain-off.png')} alt="" />
              </div>
              <div className="digital-works__chain" ref={chainRef} aria-hidden="true">
                <img
                  className="digital-works__chain-art digital-works__chain-art--off"
                  ref={chainOffRef}
                  src={assetPath('images/graphic/digital-work/digital-lamp-chain-off.png')}
                  alt=""
                />
                <img
                  className="digital-works__chain-art digital-works__chain-art--on"
                  ref={chainOnRef}
                  src={assetPath('images/graphic/digital-work/digital-lamp-chain-on.png')}
                  alt=""
                />
              </div>
              <button
                type="button"
                className="digital-works__cord"
                ref={cordRef}
                onClick={replaySwitch}
                aria-label="拉下燈繩，重新播放開燈效果"
              >
              </button>
            </div>
          </div>
          {SHOW_DIGITAL_EDIT && <DigitalTunePanel tune={tune} setTune={setTune} />}
        </div>
      </div>
      {SHOW_CARD_EDIT && <PickminCardTunePanel tune={pickminCardTune} setTune={setPickminCardTune} />}
      {SHOW_CARD_EDIT && <WorkOrderCardTunePanel tune={workOrderCardTune} setTune={setWorkOrderCardTune} />}

      <div className="digital-works__projects">
        <div className="container digital-works__grid" ref={gridRef}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPrepareOpen={handlePrepareOpenProject}
              onOpen={handleOpenProject}
              isOpening={openingProjectId === project.id}
            />
          ))}
        </div>
      </div>
      <ProjectDetailPage project={active} onClose={handleClose} />
    </section>
  );
}
