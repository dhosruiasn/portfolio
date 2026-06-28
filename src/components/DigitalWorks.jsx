import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import ProjectDetailPage from './ProjectDetailPage.jsx';
import '../styles/components/DigitalWorks.css';

gsap.registerPlugin(ScrollTrigger);

const DIGITAL_ASSET_BASE = '/images/graphic/digital work';
const ARROW_ORIGINS = {
  left: { x: 15.14, y: 84.22 },
  right: { x: 84.83, y: 84.22 },
};
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_DIGITAL_EDIT = !!params && params.has('digitalEdit');
const DEFAULT_DIGITAL_TUNE = {
  titleBottom: 5.8,
  titleSize: 14.2,
  titleGap: 1.5,
  mobileTitleBottom: 9.8,
  mobileTitleSize: 23,
  mobileTitleGap: 4.7,
  lightOpacity: 1,
  arrowOpacity: 1,
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
      <TuneRow label="箭頭" value={tune.arrowOpacity} min={0.4} max={1} step={0.05} unit="" onChange={set('arrowOpacity')} />
      <textarea readOnly value={JSON.stringify(tune)} />
    </div>
  );
}

export default function DigitalWorks() {
  const [active, setActive] = useState(null);
  const [tune, setTune] = useState(DEFAULT_DIGITAL_TUNE);
  const handleClose = useCallback(() => setActive(null), []);
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const lightRef = useRef(null);
  const titleRef = useRef(null);
  const cordRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const switchTlRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([lightRef.current, titleRef.current, leftArrowRef.current, rightArrowRef.current], {
        opacity: 0,
      });
      gsap.set(titleRef.current, { y: 20 });
      gsap.set([leftArrowRef.current, rightArrowRef.current], { scale: 0.94 });

      switchTlRef.current = gsap
        .timeline({ paused: true })
        .to(cordRef.current, { y: 44, duration: 0.18, ease: 'power2.out' }, 0)
        .to(cordRef.current, { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' }, 0.18)
        .to(lightRef.current, { opacity: 1, duration: 0.12, ease: 'none' }, 0.22)
        .fromTo(lightRef.current, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)', duration: 0.35 }, 0.26)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0.3)
        .to(
          [leftArrowRef.current, rightArrowRef.current],
          { opacity: 1, scale: 1, duration: 0.34, stagger: 0.05, ease: 'back.out(1.5)' },
          0.4
        );

      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=80%',
        onEnter: () => switchTlRef.current?.restart(),
        onEnterBack: () => switchTlRef.current?.restart(),
        onLeaveBack: () => switchTlRef.current?.pause(0),
      });

      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!lightRef.current || !leftArrowRef.current || !rightArrowRef.current) return;
    if (parseFloat(gsap.getProperty(lightRef.current, 'opacity')) > 0) {
      gsap.set(lightRef.current, { opacity: tune.lightOpacity });
    }
    if (parseFloat(gsap.getProperty(leftArrowRef.current, 'opacity')) > 0) {
      gsap.set([leftArrowRef.current, rightArrowRef.current], { opacity: tune.arrowOpacity });
    }
  }, [tune.lightOpacity, tune.arrowOpacity]);

  const handleSceneMove = useCallback((event) => {
    const scene = sceneRef.current;
    if (!scene || !leftArrowRef.current || !rightArrowRef.current) return;

    const rect = scene.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateTowardPointer = (origin, baseOffset = 0) => {
      const angle = Math.atan2(py - origin.y, px - origin.x) * (180 / Math.PI);
      return Math.max(-16, Math.min(16, angle + baseOffset));
    };

    gsap.to(leftArrowRef.current, {
      rotation: rotateTowardPointer(ARROW_ORIGINS.left, 48),
      duration: 0.35,
      ease: 'power2.out',
      transformOrigin: `${ARROW_ORIGINS.left.x}% ${ARROW_ORIGINS.left.y}%`,
    });
    gsap.to(rightArrowRef.current, {
      rotation: rotateTowardPointer(ARROW_ORIGINS.right, 132),
      duration: 0.35,
      ease: 'power2.out',
      transformOrigin: `${ARROW_ORIGINS.right.x}% ${ARROW_ORIGINS.right.y}%`,
    });
  }, []);

  const replaySwitch = useCallback(() => {
    switchTlRef.current?.restart();
  }, []);

  // 滑動時逐張翻開（橘色背面 → 作品正面），scrub + stagger = 一步翻一張
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.project-card__flip', {
        rotateY: 180,
        ease: 'none',
        stagger: 0.6,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 96%',
          end: 'top 34%',
          scrub: true,
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

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
        '--digital-arrow-opacity': tune.arrowOpacity,
      }}
    >
      <div className="digital-works__intro">
        <div className="digital-works__scene" ref={sceneRef} onMouseMove={handleSceneMove}>
          <div className="digital-works__art">
            <img className="digital-works__light" ref={lightRef} src={`${DIGITAL_ASSET_BASE}/light.png`} alt="" />
            <div className="digital-works__headline" ref={titleRef} aria-label="Digital works">
              <span>DIGITAL</span>
              <span>WORKS</span>
            </div>
            <img
              className="digital-works__arrow digital-works__arrow--left"
              ref={leftArrowRef}
              src={`${DIGITAL_ASSET_BASE}/左箭頭.png`}
              alt=""
            />
            <img
              className="digital-works__arrow digital-works__arrow--right"
              ref={rightArrowRef}
              src={`${DIGITAL_ASSET_BASE}/右箭頭.png`}
              alt=""
            />
            <img className="digital-works__lamp" src={`${DIGITAL_ASSET_BASE}/燈罩.png`} alt="" />
            <img
              className="digital-works__cord"
              ref={cordRef}
              src={`${DIGITAL_ASSET_BASE}/燈線.png`}
              alt="拉燈線"
              onClick={replaySwitch}
            />
          </div>
          {SHOW_DIGITAL_EDIT && <DigitalTunePanel tune={tune} setTune={setTune} />}
        </div>
      </div>

      <div className="digital-works__projects">
        <div className="container digital-works__grid" ref={gridRef}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={setActive} />
          ))}
        </div>
      </div>
      <ProjectDetailPage project={active} onClose={handleClose} />
    </section>
  );
}
