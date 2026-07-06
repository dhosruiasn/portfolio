import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import { warmProjectMedia } from '../utils/projectMediaPreload.js';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock.js';
import { projects } from '../data/projects.js';
import {
  CoreComponentShowcase,
  DesignPrinciplesSection,
  DesignSystemIntroSection,
  InteractionFlowSection,
  LocalizationComparison,
  MotionShowcase,
  OutcomeReflection,
  ProductComponentsSection,
  ProductComplexitySection,
  ProjectCTA,
  SystemToProductSection,
  VisualFoundationsSection,
} from './projects/pickmin/PickminDesignSystemSections.jsx';
import ShopeeVisual from './projects/shopeeArchive/ShopeeArchiveVisuals.jsx';
import UiTweakerVisual from './projects/uiTweaker/UiTweakerVisuals.jsx';
import '../styles/components/ProjectDetailPage.css';

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_DETAIL_EDIT = import.meta.env.DEV && !!params && params.has('detailEdit');

// StrictMode 安全的 history 清理：cleanup 排程 back()，重掛載時取消
let pendingDetailBack = null;

const DEFAULT_DETAIL_TUNE = {
  titleY: -9,
  titleSize: 7.2,
  titleLine: 1.01,
  titleMax: 139,
};

const DEFAULT_IMAGE_TUNE = {
  search: {
    scale: 2.06,
    x: 13,
    y: 40,
  },
  dashboard: {
    scale: 2.2,
    x: -4,
    y: 38,
  },
};

const DEFAULT_FLOW_TUNE = {
  diagramMax: 1400,
  gapX: 42,
  gapY: 44,
  nodeHeight: 92,
  nodeScale: 1,
  noteMax: 1110,
  noteX: -27,
  noteY: -4,
  notePadding: 24,
};

const DETAIL_TUNE_BY_PROJECT = {
  'shopee-archive': {
    titleY: -9,
    titleSize: 5.2,
    titleLine: 1.01,
    titleMax: 108,
  },
};

const getDetailTune = (project) => ({
  ...DEFAULT_DETAIL_TUNE,
  ...(project ? DETAIL_TUNE_BY_PROJECT[project.id] : null),
});

const PROBLEM_TONES = ['case-tone--discovery', 'case-tone--structure', 'case-tone--ownership', 'case-tone--trust'];
const USER_TONES = ['case-tone--ownership', 'case-tone--discovery', 'case-tone--trust'];
const DESIGN_SYSTEM_TONES = ['case-tone--principle', 'case-tone--structure', 'case-tone--discovery', 'case-tone--system'];
const OUTCOME_TONES = ['case-tone--implementation', 'case-tone--discovery', 'case-tone--trust', 'case-tone--discovery', 'case-tone--implementation', 'case-tone--implementation'];
const FLOW_TONES = [
  'case-tone--discovery',
  'case-tone--discovery',
  'case-tone--structure',
  'case-tone--ownership',
  'case-tone--ownership',
  'case-tone--trust',
  'case-tone--trust',
  'case-tone--implementation',
];

const FALLING_CHIP_COLORS = ['#fff', '#ff9ec8', '#a8d8ff', '#d9ef7d', '#81c996', '#d9cda2', '#ffd66b', '#c7b6ff', '#fff'];
const FALLING_CHIP_ROTATIONS = [-3, 2, -2, 3, -4, 2.5, -2.5, 1.5, -1];
const FALLING_CHIP_START_ROTATIONS = [-14, 12, -10, 16, -18, 13, -12, 10, -9];
const PICKMIN_PRELOAD_IMAGES = [
  '/images/projects/pickmin/Hero%20mockup.avif',
  '/images/projects/pickmin/home-public-browse.avif',
  '/images/projects/pickmin/search-owned-status.avif',
  '/images/projects/pickmin/upload-admin-review.avif',
  '/images/projects/pickmin/multilingual-comparison.avif',
  '/images/projects/pickmin/map-system-screen.avif',
];

const NO_BREAK_TERMS = [
  '插畫 IP 品牌網站',
  '插畫 IP',
  'IP 品牌',
  'IP 世界',
  '品牌網站概念',
  'Pikmin Bloom',
  'Web App',
  'VibeCoding',
  'Figma',
  'Claude Code Plugin',
  'JavaScript',
  'HTML/CSS',
  'GOOGOOlii',
  'GOOGOOLii',
  '品牌網站',
  '品牌電商',
  '品牌體驗',
  '互動電商',
  '互動結帳',
  '互動原型',
  '核心互動',
  '核心流程',
  '結帳小劇場',
  '結帳過場',
  '結帳掃碼',
  '結帳畫面',
  '收件資料',
  '商品購物頁',
  '商品選購',
  '復古玩具店',
  '小劇場式購物流程',
  'Brand System',
  'Interactive Checkout Concept',
  'Interactive Commerce',
  'Core Shopping & Checkout Flow',
  'checkout scene',
  'checkout screen',
  'checkout ritual',
  'Meow Map',
  'Brand commerce',
  'Product Design',
  'Design System',
  'Cloudflare R2',
  'Supabase',
  'PWA',
  'i18n',
  '明信片收藏',
  '明信片追蹤',
  '明信片管理',
  '玩家收藏',
  '公開資料',
  '個人資料',
  '個人收藏',
  '收藏狀態',
  '圖片上傳',
  '管理後台',
  '多語系',
  '行動裝置',
  '角色世界觀',
  '角色世界',
  '商品瀏覽',
  '購物流程',
  '購物籃',
  '結帳流程',
  '逛街體驗',
  '品牌世界觀',
  '品牌視覺系統',
  '首頁互動場景',
  '拖曳入籃購物',
  '拖曳入籃',
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
  '品牌擁有者',
  '架構規劃',
  '前端原型',
  '上線產品',
  '產品設計',
  '收藏痛點',
  '資料庫',
  '收銀台',
  '小劇場',
  '世界觀',
  '設計',
  '原型',
  '電商',
  '插畫',
  '品牌',
  '網站',
  '商品',
  '購物',
  '結帳',
  '付款',
  '互動',
  '玩家',
  '收藏',
  '痛點',
  '產品',
  '資料',
  '管理',
  '搜尋',
  '比對',
  '記錄',
  '上傳',
  '審核',
];

const noBreakTermsByLength = [...NO_BREAK_TERMS].sort((a, b) => b.length - a.length);
const noBreakPattern = new RegExp(`(${noBreakTermsByLength.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

function preloadPickminImages() {
  if (typeof document === 'undefined') return;

  PICKMIN_PRELOAD_IMAGES.forEach((src) => {
    const href = assetPath(src);
    if (!href || document.head.querySelector(`link[data-pickmin-preload="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.type = 'image/avif';
    link.href = href;
    link.dataset.pickminPreload = href;
    document.head.appendChild(link);

    const image = new Image();
    image.decoding = 'async';
    image.src = href;
  });
}

function preloadHeroMedia(caseStudy) {
  if (typeof document === 'undefined' || !caseStudy) return;
  [
    { src: caseStudy.heroImage, key: 'detailHeroImage' },
    { src: caseStudy.heroVideo, key: 'detailHeroVideo', as: 'video', type: 'video/mp4' },
  ].forEach(({ src, key, as = 'image', type }) => {
    if (!src) return;
    const href = assetPath(src);
    if (!href) return;
    if (document.head.querySelector(`link[data-${key}="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    if (type) link.type = type;
    link.href = href;
    link.dataset[key] = href;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

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

function ImageTunePanel({ imageTune, setImageTune }) {
  const set = (target, key) => (value) =>
    setImageTune((current) => ({
      ...current,
      [target]: {
        ...current[target],
        [key]: value,
      },
    }));

  return (
    <div className="detail-tune detail-tune--images">
      <strong>Case 圖片調整</strong>
      <span className="detail-tune__group">搜尋頁</span>
      <TuneRow label="縮放" value={imageTune.search.scale} min={1} max={2.2} step={0.01} onChange={set('search', 'scale')} />
      <TuneRow label="X" value={imageTune.search.x} min={-40} max={40} step={1} unit="%" onChange={set('search', 'x')} />
      <TuneRow label="Y" value={imageTune.search.y} min={-40} max={40} step={1} unit="%" onChange={set('search', 'y')} />
      <span className="detail-tune__group">管理審核</span>
      <TuneRow label="縮放" value={imageTune.dashboard.scale} min={1} max={2.2} step={0.01} onChange={set('dashboard', 'scale')} />
      <TuneRow label="X" value={imageTune.dashboard.x} min={-40} max={40} step={1} unit="%" onChange={set('dashboard', 'x')} />
      <TuneRow label="Y" value={imageTune.dashboard.y} min={-40} max={40} step={1} unit="%" onChange={set('dashboard', 'y')} />
      <textarea readOnly value={JSON.stringify(imageTune)} />
    </div>
  );
}

function FlowTunePanel({ flowTune, setFlowTune, flowCopy, setFlowCopy }) {
  const set = (key) => (value) => setFlowTune((current) => ({ ...current, [key]: value }));
  return (
    <div className="detail-tune detail-tune--flow">
      <strong>User Flow 調整</strong>
      <span className="detail-tune__group">流程圖形</span>
      <TuneRow label="圖寬" value={flowTune.diagramMax} min={720} max={1400} step={10} unit="px" onChange={set('diagramMax')} />
      <TuneRow label="X距" value={flowTune.gapX} min={16} max={84} step={1} unit="px" onChange={set('gapX')} />
      <TuneRow label="Y距" value={flowTune.gapY} min={16} max={92} step={1} unit="px" onChange={set('gapY')} />
      <TuneRow label="節點高" value={flowTune.nodeHeight} min={62} max={132} step={1} unit="px" onChange={set('nodeHeight')} />
      <TuneRow label="縮放" value={flowTune.nodeScale} min={0.78} max={1.22} step={0.01} onChange={set('nodeScale')} />
      <span className="detail-tune__group">文案卡片</span>
      <TuneRow label="文寬" value={flowTune.noteMax} min={520} max={1240} step={10} unit="px" onChange={set('noteMax')} />
      <TuneRow label="文X" value={flowTune.noteX} min={-30} max={30} step={1} unit="%" onChange={set('noteX')} />
      <TuneRow label="文Y" value={flowTune.noteY} min={-60} max={60} step={1} unit="px" onChange={set('noteY')} />
      <TuneRow label="內距" value={flowTune.notePadding} min={14} max={48} step={1} unit="px" onChange={set('notePadding')} />
      <textarea className="detail-tune__copy" value={flowCopy} onChange={(event) => setFlowCopy(event.target.value)} />
      <textarea readOnly value={JSON.stringify({ flowTune, flowCopy })} />
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

function getPickminOptimizedImageSources(src) {
  if (!src?.includes('/images/projects/pickmin/') || !src.endsWith('.png')) return null;
  return {
    avif: src.replace(/\.png$/, '.avif'),
    webp: src.replace(/\.png$/, '.webp'),
  };
}

function ProjectImage({ src, alt = '', loading = 'lazy' }) {
  const sources = getPickminOptimizedImageSources(src);
  if (!sources) return <img src={assetPath(src)} alt={alt} loading={loading} decoding="async" />;

  return (
    <picture>
      <source srcSet={assetPath(sources.avif)} type="image/avif" />
      <source srcSet={assetPath(sources.webp)} type="image/webp" />
      <img src={assetPath(src)} alt={alt} loading={loading} decoding="async" />
    </picture>
  );
}

function LazyAutoVideo({ src, alt = '', className = '', poster }) {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const play = () => {
      if (document.visibilityState === 'visible') video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          play();
        }
      },
      { rootMargin: '180px 0px', threshold: 0.05 }
    );

    observer.observe(video);
    video.load();
    play();
    video.addEventListener('loadeddata', play);
    video.addEventListener('canplay', play);
    document.addEventListener('visibilitychange', play);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={shouldLoad ? assetPath(src) : undefined}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      poster={poster ? assetPath(poster) : undefined}
      aria-label={alt}
    />
  );
}

function PhotoSlot({ label, compact = false, src, alt = '', className = '' }) {
  return (
    <div className={`case-photo-slot${compact ? ' case-photo-slot--compact' : ''}${src ? ' case-photo-slot--image' : ''}${className ? ` ${className}` : ''}`}>
      {src ? (
        <ProjectImage src={src} alt={alt} />
      ) : (
        <>
          <span className="case-photo-slot__mark">DK®</span>
          <span className="case-photo-slot__label">{label}</span>
        </>
      )}
    </div>
  );
}

function VideoSlot({ src, alt = '', className = '', poster }) {
  return (
    <div className={`case-photo-slot case-photo-slot--image case-photo-slot--video${className ? ` ${className}` : ''}`}>
      <LazyAutoVideo src={src} alt={alt} poster={poster} />
    </div>
  );
}

function ProjectCaseVisual({ projectId, id, compact = false }) {
  if (projectId === 'ui-tweaker') return <UiTweakerVisual id={id} compact={compact} />;
  return <ShopeeVisual id={id} compact={compact} />;
}

function CaseSection({ title, className = '', children }) {
  return (
    <section className={`case-section ${className}`}>
      <div className="case-section__heading">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function normalizeHeadingText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => (word.endsWith('s') ? word.slice(0, -1) : word))
    .filter(Boolean);
}

function isRedundantPanelTitle(sectionTitle, panelTitle) {
  const sectionWords = normalizeHeadingText(sectionTitle);
  const panelWords = normalizeHeadingText(panelTitle);
  if (!sectionWords.length || !panelWords.length) return false;

  const sectionJoined = sectionWords.join('');
  const panelJoined = panelWords.join('');
  if (sectionJoined === panelJoined || sectionJoined.includes(panelJoined) || panelJoined.includes(sectionJoined)) {
    return true;
  }

  const fillerWords = new Set(['design', 'tool', 'data', 'visual']);
  const corePanelWords = panelWords.filter((word) => !fillerWords.has(word));
  return corePanelWords.length === 1 && sectionWords.includes(corePanelWords[0]);
}

function renderPanelTitle(sectionTitle, panelTitle) {
  if (!panelTitle || isRedundantPanelTitle(sectionTitle, panelTitle)) return null;
  return <h3>{renderInfoText(panelTitle)}</h3>;
}

function TextPanel({ title, body, className = '' }) {
  return (
    <article className={`case-panel${className ? ` ${className}` : ''}`}>
      {title && <h3>{renderInfoText(title)}</h3>}
      {Array.isArray(body) ? body.map((item) => <p key={item}>{renderInfoText(item)}</p>) : <p>{renderInfoText(body)}</p>}
    </article>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M10 7h7v7" />
    </svg>
  );
}

function GoogooliiSection({ eyebrow, title, className = '', children }) {
  return (
    <section className={`googoolii-section${className ? ` ${className}` : ''}`}>
      <div className="googoolii-section__heading">
        <h2>{renderInfoText(title)}</h2>
      </div>
      {children}
    </section>
  );
}

function GoogooliiSystemPage({ caseStudy, onBack }) {
  const s = caseStudy.systemSnapshot;
  return (
    <div className="googoolii-system-page">
      <button className="googoolii-system-page__back" type="button" onClick={onBack}>
        ← {caseStudy.systemBackLabel || 'Back to case study'}
      </button>
      <header className="googoolii-system-page__head">
        <span>Design System</span>
        <h2>{renderInfoText(caseStudy.systemPageTitle || 'GOOGOOLii Design System')}</h2>
        {caseStudy.systemPageIntro && <p>{renderInfoText(caseStudy.systemPageIntro)}</p>}
      </header>

      <section className="googoolii-system-page__block">
        <h3>Color</h3>
        <div className="googoolii-color-grid">
          {s.colors.map((c) => (
            <article className="googoolii-token" key={c.name}>
              <span className="googoolii-token__swatch" style={{ '--token-color': c.hex }} />
              <div>
                <h3>{c.name}</h3>
                <code>{c.hex}</code>
                <p>{renderInfoText(c.use)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="googoolii-system-page__block">
        <h3>Typography</h3>
        <div className="googoolii-type-grid">
          {s.typography.map((t) => (
            <article className="googoolii-type-row" key={t.name}>
              <span>{t.name}</span>
              <strong>{t.value}</strong>
              <p>{renderInfoText(t.use)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="googoolii-system-page__block">
        <h3>Treatment</h3>
        <div className="googoolii-system-strip">
          {s.treatment.map((t) => (
            <span key={t}>{renderInfoText(t)}</span>
          ))}
        </div>
      </section>

      <section className="googoolii-system-page__block">
        <h3>Components</h3>
        <div className="googoolii-component-grid">
          {s.components.map((c) => (
            <span key={c}>{renderInfoText(c)}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function GoogooliiHeroMedia({ caseStudy }) {
  const hasVideo = !!caseStudy.heroVideo;
  const posterSrc = caseStudy.heroImage ? assetPath(caseStudy.heroImage) : null;
  const desktopVideoSrc = hasVideo ? assetPath(caseStudy.heroVideo) : null;
  const mobileVideoSrc = caseStudy.heroMobileVideo ? assetPath(caseStudy.heroMobileVideo) : null;
  // <source media> 只有 Safari 認得，Chrome 會直接播第一個來源；
  // 改用 matchMedia 在 JS 端選檔（開啟當下判斷一次即可）
  const videoSrc = useMemo(() => {
    if (!hasVideo) return null;
    if (mobileVideoSrc && window.matchMedia('(max-width: 900px)').matches) return mobileVideoSrc;
    return desktopVideoSrc;
  }, [hasVideo, mobileVideoSrc, desktopVideoSrc]);

  // 比照 ui-tweaker 的 VideoSlot：純 video、不疊 poster/opacity 門檻。
  // 之前的「播放才顯示」機制在實機上讓整塊沒畫面（ui-tweaker 純 video 反而正常）
  return (
    <div className="googoolii-hero__stage googoolii-hero__stage--video-ready">
      {hasVideo ? (
        <video
          className="googoolii-hero__screen"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          poster={posterSrc || undefined}
          onClick={(e) => e.currentTarget.play().catch(() => {})}
          aria-label={caseStudy.heroAlt}
          src={videoSrc}
        />
      ) : (
        <img className="googoolii-hero__screen" src={posterSrc} alt={caseStudy.heroAlt} loading="eager" decoding="async" />
      )}
    </div>
  );
}

/* UI 符號一律用 SVG（unicode ✕/☰ 在部分行動裝置會以 emoji 或不一致字形渲染） */
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="0.9em" height="0.9em" aria-hidden="true" focusable="false">
      <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 16 14" width="14" height="12" aria-hidden="true" focusable="false">
      <path d="M1 2h14M1 7h14M1 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* 內頁底部「下一個專案」：透過既有的 portfolio:open-project 事件切換，串聯瀏覽 */
function NextProjectLink({ project }) {
  const { lang } = useLanguage();
  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects[(index + 1) % projects.length];
  if (!next || next.id === project.id) return null;
  return (
    <button
      type="button"
      className="case-next"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId: next.id } }));
      }}
    >
      <span className="case-next__label">{lang === 'zh' ? '下一個專案' : 'NEXT PROJECT'}</span>
      <strong className="case-next__name">
        {next.name}
        <svg viewBox="0 0 16 16" width="0.8em" height="0.8em" aria-hidden="true" focusable="false">
          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </strong>
    </button>
  );
}

/* 案例圖片點擊放大檢視（手機上截圖文字小、原本無法細看） */
function CaseLightbox({ pageRef }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const onClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.closest('button, a')) return;
      if ((target.naturalWidth || 0) < 300) return; // 略過小圖示
      setImg({ src: target.currentSrc || target.src, alt: target.alt || '' });
    };
    page.addEventListener('click', onClick);
    return () => page.removeEventListener('click', onClick);
  }, [pageRef]);

  // lightbox 開啟時鎖住內頁捲動，避免快速滑動穿透背景
  useEffect(() => {
    const page = pageRef.current;
    if (!img || !page) return undefined;
    const prev = page.style.overflow;
    page.style.overflow = 'hidden';
    return () => {
      page.style.overflow = prev;
    };
  }, [img, pageRef]);

  // Escape 先關 lightbox（capture + stopPropagation，避免連整個內頁一起關掉）
  useEffect(() => {
    if (!img) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setImg(null);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [img]);

  if (!img) return null;
  return (
    <div className="case-lightbox" role="dialog" aria-modal="true" onClick={() => setImg(null)}>
      <button className="case-lightbox__close" aria-label="Close">
        <IconClose />
      </button>
      <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
    </div>
  );
}

/* 長內頁閱讀輔助：頂部進度條＋章節跳轉（case / googoolii 兩種版型通用） */
function CaseChapterNav({ pageRef }) {
  const { lang } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const sections = Array.from(page.querySelectorAll('.case-section, .googoolii-section'))
      .map((el) => ({ el, label: el.querySelector('h2')?.textContent?.trim() }))
      // offsetParent 為 null＝被 display:none 藏起來的段落，不放進目錄
      .filter((item) => item.label && item.el.offsetParent !== null);
    setChapters(sections);

    const onScroll = () => {
      const max = page.scrollHeight - page.clientHeight;
      setProgress(max > 0 ? Math.min(1, page.scrollTop / max) : 0);
    };
    onScroll();
    page.addEventListener('scroll', onScroll, { passive: true });
    return () => page.removeEventListener('scroll', onScroll);
  }, [pageRef]);

  const jumpTo = (el) => {
    const page = pageRef.current;
    if (!page) return;
    const top = el.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 16;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    page.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    setOpen(false);
  };

  if (!chapters.length) return null;

  return (
    <>
      <div className="case-progress" aria-hidden="true">
        <div className="case-progress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <button
        className="case-chapters__toggle"
        onClick={() => {
          // 開啟時計算目前所在章節（scroll-spy），只在開選單時算、不吃捲動效能
          if (!open) {
            const page = pageRef.current;
            if (page) {
              const pageTop = page.getBoundingClientRect().top;
              let current = -1;
              chapters.forEach((chapter, index) => {
                if (chapter.el.getBoundingClientRect().top - pageTop <= 140) current = index;
              });
              setActiveIndex(current);
            }
          }
          setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        {lang === 'zh' ? '章節' : 'Index'}
        <IconMenu />
      </button>
      {open && (
        <nav className="case-chapters" aria-label={lang === 'zh' ? '章節目錄' : 'Chapter index'}>
          {chapters.map(({ el, label }, index) => (
            <button
              key={`${label}-${index}`}
              className={`case-chapters__link${index === activeIndex ? ' case-chapters__link--active' : ''}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => jumpTo(el)}
            >
              <span className="case-chapters__num">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

function GoogooliiCaseStudyPage({ project, content, caseStudy, title, tune, setTune, pageRef, onClose }) {
  const [showSystem, setShowSystem] = useState(false);
  return (
    <div
      className={`detail-page detail-page--case detail-page--${project.id} detail-page--googoolii-custom`}
      ref={pageRef}
      style={{
        '--detail-title-y': `${tune.titleY}px`,
        '--detail-title-size': `${tune.titleSize}vw`,
        '--detail-title-line': tune.titleLine,
        '--detail-title-max': `${tune.titleMax}px`,
      }}
    >
      <button className="detail-page__close" onClick={onClose} aria-label="close">
        <IconClose />
      </button>
      {!showSystem && <CaseChapterNav pageRef={pageRef} />}
      {!showSystem && <CaseLightbox pageRef={pageRef} />}
      {SHOW_DETAIL_EDIT && <DetailTunePanel tune={tune} setTune={setTune} />}

      {showSystem ? (
        <GoogooliiSystemPage caseStudy={caseStudy} onBack={() => setShowSystem(false)} />
      ) : (
      <article className="case-study googoolii-case">
        <header className="googoolii-hero">
          <div className="googoolii-hero__copy">
            <div className="googoolii-hero__brand-block">
              <img className="googoolii-hero__logo" src={assetPath(caseStudy.logoImage)} alt="GOOGOOLii logo" loading="lazy" decoding="async" />
              <div className="detail-page__name-mask">
                <h1 className="detail-page__name">{title}</h1>
              </div>
            </div>
            <div className="googoolii-hero__intro-block">
              <p className="googoolii-hero__subtitle">{renderInfoText(caseStudy.subtitle)}</p>
              <p className="googoolii-hero__summary">{renderInfoText(caseStudy.summary)}</p>
              <div className="googoolii-role-list" aria-label="My role">
                {caseStudy.roleItems.map((item) => (
                  <span key={item}>{renderInfoText(item)}</span>
                ))}
              </div>
            </div>
          </div>
          <GoogooliiHeroMedia caseStudy={caseStudy} />

          <div className="case-meta-grid googoolii-meta-grid">
            {caseStudy.meta.map((item) => (
              <div className="case-meta" key={item.label}>
                <span>{item.label}</span>
                <strong>{renderInfoText(item.value)}</strong>
              </div>
            ))}
          </div>
        </header>

        <GoogooliiSection eyebrow="02" title="Project Concept" className="googoolii-section--concept">
          <div className="googoolii-concept-grid">
            <article className="googoolii-panel googoolii-panel--ink">
              <span>Problem</span>
              <p>{renderInfoText(caseStudy.concept.problem)}</p>
            </article>
            <article className="googoolii-panel googoolii-panel--yellow">
              <span>Concept</span>
              <p>{renderInfoText(caseStudy.concept.concept)}</p>
            </article>
            <div className="googoolii-focus-list">
              {caseStudy.concept.focus.map((item) => (
                <span key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
          </div>
        </GoogooliiSection>

        <GoogooliiSection eyebrow="03" title="Visual Direction" className="googoolii-section--visual">
          <div className="googoolii-visual-list">
            {caseStudy.visualDirection.map((item, index) => (
              <article className="googoolii-visual-card" key={item.concept}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{renderInfoText(item.concept)}</h3>
                <p>{renderInfoText(item.translation)}</p>
              </article>
            ))}
          </div>
        </GoogooliiSection>

        <GoogooliiSection eyebrow="04" title="System Snapshot" className="googoolii-section--system-snapshot">
          <div className="googoolii-system">
            <div className="googoolii-color-grid">
              {caseStudy.systemSnapshot.colors.map((item) => (
                <article className="googoolii-token" key={item.name}>
                  <span className="googoolii-token__swatch" style={{ '--token-color': item.hex }} />
                  <div>
                    <h3>{item.name}</h3>
                    <code>{item.hex}</code>
                    <p>{renderInfoText(item.use)}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="googoolii-type-grid">
              {caseStudy.systemSnapshot.typography.map((item) => (
                <article className="googoolii-type-row" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                  <p>{renderInfoText(item.use)}</p>
                </article>
              ))}
            </div>
            <div className="googoolii-system-strip">
              {caseStudy.systemSnapshot.treatment.map((item) => (
                <span key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
            <div className="googoolii-component-grid">
              {caseStudy.systemSnapshot.components.map((item) => (
                <span key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
          </div>
        </GoogooliiSection>

        <GoogooliiSection eyebrow="05" title="Core Shopping & Checkout Flow" className="googoolii-section--flow">
          <div className="googoolii-flow-list">
            {caseStudy.coreFlow.map((item) => (
              <article className="googoolii-flow-card" key={item.title}>
                <div className="googoolii-flow-card__media">
                  <img src={assetPath(item.image)} alt={`${item.title} screenshot`} loading="lazy" decoding="async" />
                </div>
                <div className="googoolii-flow-card__copy">
                  <span>{item.number}</span>
                  <h3>{renderInfoText(item.title)}</h3>
                  <p>{renderInfoText(item.body)}</p>
                  <div>
                    {item.tags.map((tag) => (
                      <span key={tag}>{renderInfoText(tag)}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </GoogooliiSection>

        <GoogooliiSection eyebrow="06" title="Interaction Details" className="googoolii-section--interaction">
          <div className="googoolii-interaction-grid">
            {caseStudy.interactionDetails.map((item) => (
              <article className="googoolii-panel" key={item.title}>
                <h3>{renderInfoText(item.title)}</h3>
                <p>{renderInfoText(item.body)}</p>
              </article>
            ))}
          </div>
        </GoogooliiSection>

        <GoogooliiSection eyebrow="07" title="Next Iteration & Takeaway" className="googoolii-section--takeaway">
          <div className="googoolii-takeaway">
            <article className="googoolii-panel googoolii-panel--blue">
              <p>{renderInfoText(caseStudy.nextIteration.body)}</p>
              <ul className="case-list">
                {caseStudy.nextIteration.items.map((item) => (
                  <li key={item}>{renderInfoText(item)}</li>
                ))}
              </ul>
            </article>
            <article className="googoolii-panel googoolii-panel--yellow">
              <span>Takeaway</span>
              <p>{renderInfoText(caseStudy.nextIteration.takeaway)}</p>
            </article>
          </div>
        </GoogooliiSection>

        <NextProjectLink project={project} />
      </article>
      )}
    </div>
  );
}

function CaseStudyPage({ project, content, caseStudy, caseStudyLang, title, visitLabel, tune, setTune, imageTune, setImageTune, flowTune, setFlowTune, flowCopy, setFlowCopy, pageRef, onClose }) {
  const isPickmin = project.id === 'pickmin';
  const sectionTitles = {
    problem: 'PROBLEM',
    goals: 'GOAL & USERS',
    flow: 'USER FLOW',
    architecture: 'INFORMATION ARCHITECTURE',
    decisions: 'KEY DESIGN DECISIONS',
    designSystem: project.id === 'pickmin' ? 'PICKMIN DESIGN SYSTEM' : 'DESIGN SYSTEM',
    trust: 'IMPLEMENTATION & TRUST',
    outcome: 'OUTCOME',
    ...caseStudy.sectionTitles,
  };
  const panelTitles = {
    ...(caseStudyLang === 'en'
      ? {
          goals: 'Design goals',
          implementation: 'From design to a shippable product',
          security: 'Data trust & security design',
          outcome: 'Outcome',
        }
      : {
          goals: '設計目標',
          implementation: '從設計到可上線產品',
          security: '資料可信度與安全設計',
          outcome: '最終成果',
        }),
    ...caseStudy.panelTitles,
  };
  const hasFallingArchitectureChips = project.id === 'googoolii' || project.id === 'pickmin' || project.id === 'shopee-archive' || project.id === 'ui-tweaker';

  return (
    <div
      className={`detail-page detail-page--case detail-page--${project.id}`}
      ref={pageRef}
      style={{
        '--detail-title-y': `${tune.titleY}px`,
        '--detail-title-size': `${tune.titleSize}vw`,
        '--detail-title-line': tune.titleLine,
        '--detail-title-max': `${tune.titleMax}px`,
        '--case-search-scale': imageTune.search.scale,
        '--case-search-x': `${imageTune.search.x}%`,
        '--case-search-y': `${imageTune.search.y}%`,
        '--case-dashboard-scale': imageTune.dashboard.scale,
        '--case-dashboard-x': `${imageTune.dashboard.x}%`,
        '--case-dashboard-y': `${imageTune.dashboard.y}%`,
        '--case-flow-max': `${flowTune.diagramMax}px`,
        '--case-flow-gap-x': `${flowTune.gapX}px`,
        '--case-flow-gap-y': `${flowTune.gapY}px`,
        '--case-flow-node-height': `${flowTune.nodeHeight}px`,
        '--case-flow-node-scale': flowTune.nodeScale,
        '--case-flow-note-max': `${flowTune.noteMax}px`,
        '--case-flow-note-x': `${flowTune.noteX}%`,
        '--case-flow-note-y': `${flowTune.noteY}px`,
        '--case-flow-note-padding': `${flowTune.notePadding}px`,
      }}
    >
      <button className="detail-page__close" onClick={onClose} aria-label="close">
        <IconClose />
      </button>
      <CaseChapterNav pageRef={pageRef} />
      <CaseLightbox pageRef={pageRef} />
      {SHOW_DETAIL_EDIT && <DetailTunePanel tune={tune} setTune={setTune} />}
      {SHOW_DETAIL_EDIT && <ImageTunePanel imageTune={imageTune} setImageTune={setImageTune} />}
      {SHOW_DETAIL_EDIT && <FlowTunePanel flowTune={flowTune} setFlowTune={setFlowTune} flowCopy={flowCopy} setFlowCopy={setFlowCopy} />}

      <article className="case-study">
        <header className="case-hero">
          <div className="detail-page__name-mask">
            <h1 className="detail-page__name">{title}</h1>
          </div>

          <div className="case-hero__grid">
            <div className="case-hero__copy">
              <p className="case-hero__subtitle">{renderInfoText(caseStudy.subtitle)}</p>
              <p className="case-hero__summary">{renderInfoText(caseStudy.summary)}</p>
              <div className="case-hero__pills">
                <span>{content.role}</span>
                <span>{content.tech}</span>
              </div>
              {project.link && (
                <a className="case-hero__visit" href={project.link} target="_blank" rel="noreferrer" aria-label={visitLabel}>
                  {visitLabel}
                  <ExternalArrowIcon />
                </a>
              )}
            </div>
            {caseStudy.heroVideo ? (
              <VideoSlot src={caseStudy.heroVideo} alt={caseStudy.heroAlt || `${project.name} demo video`} poster={caseStudy.heroImage || project.poster} />
            ) : caseStudy.heroVisual ? (
              <div className="case-hero__visual">
                <ProjectCaseVisual projectId={project.id} id={caseStudy.heroVisual} />
              </div>
            ) : (
              <PhotoSlot src={caseStudy.heroImage} alt={caseStudy.heroAlt || `${project.name} hero mockup`} label="HERO MOCKUP / 手機或桌機主視覺" />
            )}
          </div>

          <div className="case-meta-grid">
            {caseStudy.meta.map((item) => (
              <div className="case-meta" key={item.label}>
                <span>{item.label}</span>
                <strong>{renderInfoText(item.value)}</strong>
              </div>
            ))}
          </div>
        </header>

        {caseStudy.metrics?.length > 0 && (
          <div className="case-metrics" aria-label="Project metrics">
            {caseStudy.metrics.map((item) => (
              <div className="case-metric" key={`${item.value}-${item.label}`}>
                <strong>{renderInfoText(item.value)}</strong>
                <span>{renderInfoText(item.label)}</span>
              </div>
            ))}
          </div>
        )}

        <CaseSection title="OVERVIEW" className="case-section--overview">
          <TextPanel title={caseStudy.overview.title} body={caseStudy.overview.body} />
        </CaseSection>

        {isPickmin && (
          <CaseSection title={caseStudy.complexity.title} className="case-section--complexity">
            <ProductComplexitySection content={caseStudy.complexity} />
          </CaseSection>
        )}

        <CaseSection title={sectionTitles.problem} className="case-section--problem">
          <div className="case-card-grid case-card-grid--four">
            {caseStudy.problems.map((item, index) => (
              <article className={`case-panel ${PROBLEM_TONES[index]}`} key={item.title}>
                <h3>{renderInfoText(item.title)}</h3>
                <p>{renderInfoText(item.body)}</p>
              </article>
            ))}
          </div>
        </CaseSection>

        {!isPickmin && (
          <CaseSection title={sectionTitles.goals} className="case-section--users">
            <div className="case-split">
              <div className="case-panel">
                {renderPanelTitle(sectionTitles.goals, panelTitles.goals)}
                <ul className="case-list">
                  {caseStudy.goals.map((item) => (
                    <li key={item}>{renderInfoText(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="case-card-grid">
                {caseStudy.users.map((item, index) => (
                  <article className={`case-panel ${USER_TONES[index]}`} key={item.title}>
                    <h3>{renderInfoText(item.title)}</h3>
                    <p>{renderInfoText(item.body)}</p>
                  </article>
                ))}
              </div>
            </div>
          </CaseSection>
        )}

        {!isPickmin && (
          <CaseSection title={sectionTitles.flow} className="case-section--flow-section">
            <TextPanel body={flowCopy || caseStudy.flow.note} className="case-flow-note" />
            <div className="case-flow">
              {caseStudy.flow.steps.map((step, index) => (
                <div className={`case-flow__item ${FLOW_TONES[index]}`} key={step}>
                  <strong>{renderInfoText(step)}</strong>
                </div>
              ))}
            </div>
          </CaseSection>
        )}

        <CaseSection title={sectionTitles.architecture} className="case-section--architecture">
          <div className="case-architecture">
            <TextPanel body={caseStudy.architecture.note} />
            <div className={`case-chip-cloud${hasFallingArchitectureChips ? ' case-chip-cloud--falling' : ''}`}>
              {caseStudy.architecture.items.map((item, index) => (
                <span
                  key={item}
                  style={
                    hasFallingArchitectureChips
                      ? {
                          '--chip-index': index,
                          '--chip-rotate': `${FALLING_CHIP_ROTATIONS[index % FALLING_CHIP_ROTATIONS.length]}deg`,
                          '--chip-start-rotate': `${FALLING_CHIP_START_ROTATIONS[index % FALLING_CHIP_START_ROTATIONS.length]}deg`,
                          '--chip-bg': FALLING_CHIP_COLORS[index % FALLING_CHIP_COLORS.length],
                        }
                      : undefined
                  }
                >
                  <span>{renderInfoText(item)}</span>
                </span>
              ))}
            </div>
          </div>
        </CaseSection>

        {!isPickmin && (
          <CaseSection title={sectionTitles.decisions} className="case-section--decisions">
            <div className="case-decision-list">
              {caseStudy.decisions.map((item) => (
                <article className="case-decision" key={item.title}>
                  <div className="case-decision__copy">
                    <h3>{renderInfoText(item.title)}</h3>
                    <p>{renderInfoText(item.body)}</p>
                  </div>
                  {item.image ? (
                    <PhotoSlot src={item.image} alt={item.slot} label={item.slot} compact className={item.imageFocus} />
                  ) : item.visual ? (
                    <div className="case-decision__visual">
                      <ProjectCaseVisual projectId={project.id} id={item.visual} compact />
                    </div>
                  ) : (
                    <PhotoSlot alt={item.slot} label={item.slot} compact className={item.imageFocus} />
                  )}
                </article>
              ))}
            </div>
          </CaseSection>
        )}

        {isPickmin ? (
          <>
            <CaseSection title={caseStudy.whyDesignSystem.title} className="case-section--why-system">
              <DesignSystemIntroSection content={caseStudy.whyDesignSystem} />
            </CaseSection>

            <CaseSection title="DESIGN PRINCIPLES" className="case-section--principles">
              <DesignPrinciplesSection items={caseStudy.designPrinciples} />
            </CaseSection>

            <CaseSection title={caseStudy.foundations.title} className="case-section--foundations">
              <VisualFoundationsSection content={caseStudy.foundations} />
            </CaseSection>

            <CaseSection title={caseStudy.coreComponents.title} className="case-section--core-components">
              <CoreComponentShowcase content={caseStudy.coreComponents} />
            </CaseSection>

            <CaseSection title={caseStudy.productComponents.title} className="case-section--product-components">
              <ProductComponentsSection content={caseStudy.productComponents} />
            </CaseSection>

            <CaseSection title={caseStudy.collectionFlow.title} className="case-section--interaction-patterns">
              <InteractionFlowSection content={caseStudy.collectionFlow} />
            </CaseSection>

            <CaseSection title={caseStudy.motionSystem.title} className="case-section--motion">
              <MotionShowcase content={caseStudy.motionSystem} />
            </CaseSection>

            <CaseSection title={caseStudy.localization.title} className="case-section--localization">
              <LocalizationComparison content={caseStudy.localization} />
            </CaseSection>

            <CaseSection title={caseStudy.systemToProduct.title} className="case-section--system-product">
              <SystemToProductSection content={caseStudy.systemToProduct} />
            </CaseSection>
          </>
        ) : (
          <CaseSection title={sectionTitles.designSystem} className="case-section--system">
            <div className="case-design-system">
              {[
                [caseStudy.designSystem.principlesLabel || 'Visual Principles', caseStudy.designSystem.principles],
                [caseStudy.designSystem.colorsLabel || 'Color System', caseStudy.designSystem.colors],
                [caseStudy.designSystem.typographyLabel || 'Typography', caseStudy.designSystem.typography],
                [caseStudy.designSystem.statesLabel || 'Interaction States', caseStudy.designSystem.states],
              ].map(([panelTitle, panelBody], index) => (
                <article className={`case-panel ${DESIGN_SYSTEM_TONES[index]}`} key={panelTitle}>
                  {renderPanelTitle(sectionTitles.designSystem, panelTitle)}
                  {panelBody.slice(0, 2).map((item) => (
                    <p key={item}>{renderInfoText(item)}</p>
                  ))}
                </article>
              ))}
              <p className="case-component-strip__label">
                {caseStudyLang === 'zh' ? '流程關鍵元件' : 'Flow keywords'}
              </p>
              <div className="case-component-strip">
                {caseStudy.designSystem.components.slice(0, 8).map((item) => (
                  <span key={item}>{renderInfoText(item)}</span>
                ))}
              </div>
            </div>
          </CaseSection>
        )}

        {!isPickmin && (
          <CaseSection title={sectionTitles.trust} className="case-section--trust">
            <div className="case-split">
              <div className="case-panel">
                {renderPanelTitle(sectionTitles.trust, panelTitles.implementation)}
                <p>{renderInfoText(caseStudy.implementation.body)}</p>
                <ul className="case-list">
                  {caseStudy.implementation.items.map((item) => (
                    <li key={item}>{renderInfoText(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="case-panel">
                {renderPanelTitle(sectionTitles.trust, panelTitles.security)}
                <p>{renderInfoText(caseStudy.security.body)}</p>
                <ul className="case-list">
                  {caseStudy.security.items.map((item) => (
                    <li key={item}>{renderInfoText(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CaseSection>
        )}

        <CaseSection title={sectionTitles.outcome} className="case-section--outcome">
          <div className="case-split">
            <div className="case-panel">
              {renderPanelTitle(sectionTitles.outcome, panelTitles.outcome)}
              <p>{renderInfoText(caseStudy.outcome.body)}</p>
            </div>
            <div className="case-chip-cloud case-chip-cloud--stacked case-chip-cloud--outcome" aria-label={caseStudyLang === 'zh' ? '成果重點' : 'Outcome highlights'}>
              {caseStudy.outcome.items.map((item, index) => (
                <span className={OUTCOME_TONES[index]} key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
          </div>
          {isPickmin && <OutcomeReflection content={caseStudy.outcome} />}
        </CaseSection>

        {isPickmin && (
          <section className="case-section case-section--cta" aria-label="Project link">
            <ProjectCTA content={caseStudy.cta} liveHref={project.link} />
          </section>
        )}

        {!isPickmin && project.id === 'ui-tweaker' && project.link && (
          <section className="case-section case-section--cta" aria-label="Project link">
            <a className="case-end-cta" href={project.link} target="_blank" rel="noreferrer">
              {caseStudyLang === 'zh' ? '前往網站' : 'VISIT SITE'}
              <ExternalArrowIcon />
            </a>
          </section>
        )}
        <NextProjectLink project={project} />
      </article>
    </div>
  );
}

export default function ProjectDetailPage({ project, onClose }) {
  const { lang, t } = useLanguage();
  const pageRef = useRef(null);
  const [tune, setTune] = useState(DEFAULT_DETAIL_TUNE);
  const [imageTune, setImageTune] = useState(DEFAULT_IMAGE_TUNE);
  const [flowTune, setFlowTune] = useState(DEFAULT_FLOW_TUNE);
  const [flowCopy, setFlowCopy] = useState('');

  useEffect(() => {
    warmProjectMedia(project);
    setTune(getDetailTune(project));
    setImageTune(DEFAULT_IMAGE_TUNE);
    if (project?.id === 'pickmin') preloadPickminImages();
  }, [project?.id]);

  useEffect(() => {
    const nextCaseStudy = project?.caseStudy?.[lang] || project?.caseStudy?.zh;
    setFlowTune(DEFAULT_FLOW_TUNE);
    setFlowCopy(nextCaseStudy?.flow?.note || '');
    preloadHeroMedia(nextCaseStudy);
  }, [project?.id, lang]);

  // 手機返回手勢／返回鍵＝關閉內頁，而不是直接離開網站。
  // deps 用「是否開啟」而非 project：用「下一個專案」切換時不要 back/push 折騰 history。
  // cleanup 的 back() 延遲執行、重掛載時取消：StrictMode 下立即 back() 會觸發
  // popstate 把剛開的頁面關掉（實機閃退）
  const detailOpen = !!project;
  useEffect(() => {
    if (!detailOpen) return undefined;
    let closedByPop = false;
    if (pendingDetailBack) {
      clearTimeout(pendingDetailBack);
      pendingDetailBack = null;
    } else {
      window.history.pushState({ portfolioOverlay: 'project' }, '');
    }
    const onPop = () => {
      closedByPop = true;
      onClose();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // 用 ✕ 或 Escape 關閉時，把剛剛推入的 history 消化掉
      if (!closedByPop) {
        pendingDetailBack = setTimeout(() => {
          pendingDetailBack = null;
          window.history.back();
        }, 60);
      }
    };
  }, [detailOpen, onClose]);

  // 切換專案（下一個專案）時回到內頁頂部
  useEffect(() => {
    pageRef.current?.scrollTo?.({ top: 0 });
  }, [project?.id]);

  useEffect(() => {
    if (!project || !pageRef.current) return;

    // 鎖住背景捲動（iOS 正解 position:fixed，見 scrollLock）——避免關閉後背景亂捲
    lockBodyScroll();
    let caseObserver;
    let fallingChipObserver;

    const ctx = gsap.context(() => {
      const page = pageRef.current;
      const nameEl = page?.querySelector('.detail-page__name');
      if (!page) return;

      // Keep the overlay itself opaque from the first paint. Fading the whole
      // fixed page exposes the Digital Works grid underneath on mobile taps.
      const compactEntrance = window.matchMedia('(max-width: 900px)').matches;
      gsap.set(page, { opacity: 1 });
      if (nameEl) {
        gsap.fromTo(
          nameEl,
          { yPercent: 110 },
          { yPercent: 0, duration: compactEntrance ? 0.45 : 0.72, delay: 0.03, ease: 'power3.out' }
        );
      }
      const standardLeftItems = gsap.utils.toArray('.detail-page__left > *');
      if (standardLeftItems.length) {
        gsap.from(standardLeftItems, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.1,
          ease: 'power2.out',
        });
      }
      const standardMedia = gsap.utils.toArray('.detail-page__media');
      if (standardMedia.length) {
        gsap.from(standardMedia, {
          opacity: 0,
          scale: 0.96,
          duration: 0.6,
          delay: 0.15,
          ease: 'power2.out',
        });
      }
      const caseHeroItems = gsap.utils.toArray('.case-hero__copy, .case-photo-slot--image, .case-meta');
      if (caseHeroItems.length) {
        gsap.from(caseHeroItems, {
          y: 28,
          opacity: 0,
          duration: 0.58,
          stagger: 0.06,
          delay: 0.12,
          ease: 'power3.out',
        });
      }

      const caseStudy = pageRef.current?.querySelector('.case-study');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const compactViewport = window.matchMedia('(max-width: 900px)').matches;
      const fallingChipClouds = caseStudy ? Array.from(caseStudy.querySelectorAll('.case-chip-cloud--falling')) : [];
      if (caseStudy && !reduceMotion && !compactViewport) {
        const revealGroups = Array.from(caseStudy.querySelectorAll('.case-card-grid, .case-flow, .case-decision-list, .case-design-system, .case-component-strip, .case-chip-cloud--stacked, .pickmin-complexity__grid, .pickmin-ds-intro__map, .pickmin-principles, .pickmin-foundations__colors, .pickmin-core-components, .pickmin-product-components, .pickmin-interaction-flow__controls, .pickmin-interaction-demo, .pickmin-motion__grid, .pickmin-localization__grid, .pickmin-system-product__screens, .pickmin-reflection__next, .googoolii-concept-grid, .googoolii-visual-list, .googoolii-color-grid, .googoolii-type-grid, .googoolii-flow-list, .googoolii-interaction-grid'));
        revealGroups.forEach((group) => {
          const children = Array.from(group.children);
          if (children.length) gsap.set(children, { y: 32, opacity: 0 });
        });

        caseObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const children = Array.from(entry.target.children);
              if (children.length) {
                gsap.to(children, {
                  y: 0,
                  opacity: 1,
                  duration: 0.56,
                  stagger: 0.08,
                  ease: 'power3.out',
                  overwrite: true,
                });
              }
              caseObserver.unobserve(entry.target);
            });
          },
          { root: pageRef.current, rootMargin: '0px 0px -8% 0px', threshold: 0.03 }
        );
        revealGroups.forEach((group) => caseObserver.observe(group));
      }

      if (fallingChipClouds.length) {
        if (reduceMotion) {
          fallingChipClouds.forEach((group) => group.classList.add('is-in-view'));
        } else {
          fallingChipObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in-view');
                fallingChipObserver.unobserve(entry.target);
              });
            },
            { root: pageRef.current, rootMargin: '180px 0px', threshold: 0.08 }
          );
          fallingChipClouds.forEach((group) => fallingChipObserver.observe(group));
        }
      }
    }, pageRef.current);

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      caseObserver?.disconnect();
      fallingChipObserver?.disconnect();
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      unlockBodyScroll();
    };
  }, [project, onClose]);

  if (!project) return null;
  const caseStudy = project.caseStudy?.[lang] || project.caseStudy?.zh;
  const caseStudyLang = project.caseStudy?.[lang] ? lang : project.caseStudy?.zh ? 'zh' : lang;
  const content = project[caseStudy ? caseStudyLang : lang];
  const visitLabel = caseStudy && caseStudyLang === 'zh' ? '前往網站' : t.detail.visit;
  const isVideo = project.mediaType === 'video';
  const infoItems = [
    content.about,
    content.deliverables,
    content.status,
    content.note,
  ].filter(Boolean);
  const detailTitle = project.detailTitle?.[lang] || project.detailTitle;
  const title = detailTitle || project.name;

  if (caseStudy) {
    if (caseStudy.variant === 'googoolii-concept') {
      return (
        <GoogooliiCaseStudyPage
          project={project}
          content={content}
          caseStudy={caseStudy}
          title={title}
          tune={tune}
          setTune={setTune}
          pageRef={pageRef}
          onClose={onClose}
        />
      );
    }

    return (
      <CaseStudyPage
        project={project}
        content={content}
        caseStudy={caseStudy}
        caseStudyLang={caseStudyLang}
        title={title}
        visitLabel={visitLabel}
        tune={tune}
        setTune={setTune}
        imageTune={imageTune}
        setImageTune={setImageTune}
        flowTune={flowTune}
        setFlowTune={setFlowTune}
        flowCopy={flowCopy}
        setFlowCopy={setFlowCopy}
        pageRef={pageRef}
        onClose={onClose}
      />
    );
  }

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
        <IconClose />
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
                <ExternalArrowIcon />
              </a>
            )}
          </section>
        </div>

        <div className="detail-page__media">
          {project.media && isVideo && (
            <video src={assetPath(project.media)} controls muted loop playsInline preload="metadata" aria-label={project.name} />
          )}
          {project.media && !isVideo && (
            <img
              src={assetPath(project.media)}
              alt={project.name}
              loading="lazy"
              decoding="async"
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
