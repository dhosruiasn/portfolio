import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/ProjectDetailPage.css';

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_DETAIL_EDIT = !!params && params.has('detailEdit');

const DEFAULT_DETAIL_TUNE = {
  titleY: -9,
  titleSize: 7.2,
  titleLine: 1.01,
  titleMax: 139,
};

const DETAIL_TUNE_BY_PROJECT = {
  'shopee-archive': {
    titleY: -9,
    titleSize: 6.2,
    titleLine: 1.01,
    titleMax: 139,
  },
};

const getDetailTune = (project) => ({
  ...DEFAULT_DETAIL_TUNE,
  ...(project ? DETAIL_TUNE_BY_PROJECT[project.id] : null),
});

const NO_BREAK_TERMS = [
  'Pikmin Bloom',
  'Web App',
  'VibeCoding',
  'Figma',
  'Claude Code Plugin',
  'JavaScript',
  'HTML/CSS',
  'GOOGOOlii',
  '品牌網站',
  '角色世界觀',
  '商品瀏覽',
  '購物流程',
  '逛街體驗',
  '品牌視覺系統',
  '首頁互動場景',
  '拖曳入籃購物',
  '3D 結帳輸送帶',
  'A24 風格標題卡過場',
  'Web Audio',
  '會員與金流串接規劃',
  'React Three Fiber',
  'GSAP',
  'dnd-kit',
  'Firebase',
  'ECPay',
  'AI 工具',
  '自動化歸檔工具',
  '工作流程效率問題',
];

const noBreakPattern = new RegExp(`(${NO_BREAK_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

function TuneRow({ label, value, min, max, step = 0.1, unit = '', onChange }) {
  return (
    <label className="detail-tune__row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <input type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <em>{unit}</em>
    </label>
  );
}

function DetailTunePanel({ tune, setTune }) {
  const set = (key) => (value) => setTune((current) => ({ ...current, [key]: value }));
  return (
    <div className="detail-tune">
      <strong>Detail 標題調整</strong>
      <TuneRow label="Y" value={tune.titleY} min={-80} max={80} step={1} unit="px" onChange={set('titleY')} />
      <TuneRow label="字級" value={tune.titleSize} min={4} max={10} step={0.1} unit="vw" onChange={set('titleSize')} />
      <TuneRow label="行高" value={tune.titleLine} min={0.7} max={1.1} step={0.01} onChange={set('titleLine')} />
      <TuneRow label="最大" value={tune.titleMax} min={80} max={170} step={1} unit="px" onChange={set('titleMax')} />
      <textarea readOnly value={JSON.stringify(tune)} />
    </div>
  );
}

function renderInfoText(item) {
  return String(item)
    .split(noBreakPattern)
    .filter(Boolean)
    .map((chunk, index) =>
      NO_BREAK_TERMS.includes(chunk) ? (
        <span className="detail-page__term" key={`${chunk}-${index}`}>
          {chunk}
        </span>
      ) : (
        chunk
      )
    );
}

export default function ProjectDetailPage({ project, onClose }) {
  const { lang, t } = useLanguage();
  const pageRef = useRef(null);
  const [tune, setTune] = useState(DEFAULT_DETAIL_TUNE);

  useEffect(() => {
    setTune(getDetailTune(project));
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;

    // lock the underlying page scroll while keeping its position
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      gsap.from(pageRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(
        '.detail-page__name',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.72, delay: 0.05, ease: 'power3.out' }
      );
      gsap.from('.detail-page__left > *', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.1,
        ease: 'power2.out',
      });
      gsap.from('.detail-page__media', {
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
        delay: 0.15,
        ease: 'power2.out',
      });
    }, pageRef);

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;
  const content = project[lang];
  const isVideo = project.mediaType === 'video';
  const infoItems = [
    content.about,
    content.deliverables,
    content.status,
    content.note,
  ].filter(Boolean);
  const detailTitle = project.detailTitle?.[lang] || project.detailTitle;
  const title = detailTitle || (project.id === 'ui-tweaker' ? `${project.name} - skill` : project.name);

  return (
    <div
      className={`detail-page detail-page--${project.id}`}
      ref={pageRef}
      style={{
        '--detail-title-y': `${tune.titleY}px`,
        '--detail-title-size': `${tune.titleSize}vw`,
        '--detail-title-line': tune.titleLine,
        '--detail-title-max': `${tune.titleMax}px`,
      }}
    >
      <button className="detail-page__close" onClick={onClose} aria-label="close">
        ✕
      </button>
      {SHOW_DETAIL_EDIT && <DetailTunePanel tune={tune} setTune={setTune} />}

      <div className="detail-page__inner">
        <div className="detail-page__name-mask">
          <h1 className="detail-page__name">{title}</h1>
        </div>

        <div className="detail-page__left">
          <div className="detail-page__pill">{content.role}</div>
          <div className="detail-page__pill detail-page__pill--wide">{content.tech}</div>

          <section
            className={`detail-page__info-card${project.link ? ' detail-page__info-card--with-link' : ''}`}
            aria-label="Information"
          >
            <h2>INFORMATION</h2>
            <div className="detail-page__info-copy">
              {infoItems.map((item, index) => (
                <p key={`${project.id}-info-${index}`}>{renderInfoText(item)}</p>
              ))}
            </div>
            {project.link && (
              <a className="detail-page__visit" href={project.link} target="_blank" rel="noreferrer" aria-label={t.detail.visit}>
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M15 12h21v21" />
                  <path d="M36 12 12 36" />
                </svg>
              </a>
            )}
          </section>
        </div>

        <div className="detail-page__media">
          {project.media && isVideo && (
            <video src={project.media} controls autoPlay muted loop playsInline aria-label={project.name} />
          )}
          {project.media && !isVideo && (
            <img
              src={project.media}
              alt={project.name}
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
