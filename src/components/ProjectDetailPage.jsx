import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
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
import '../styles/components/ProjectDetailPage.css';

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_DETAIL_EDIT = !!params && params.has('detailEdit');

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
    titleSize: 6.2,
    titleLine: 1.01,
    titleMax: 139,
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

function PhotoSlot({ label, compact = false, src, alt = '', className = '' }) {
  return (
    <div className={`case-photo-slot${compact ? ' case-photo-slot--compact' : ''}${src ? ' case-photo-slot--image' : ''}${className ? ` ${className}` : ''}`}>
      {src ? (
        <img src={assetPath(src)} alt={alt} />
      ) : (
        <>
          <span className="case-photo-slot__mark">DK®</span>
          <span className="case-photo-slot__label">{label}</span>
        </>
      )}
    </div>
  );
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
        ✕
      </button>
      {SHOW_DETAIL_EDIT && <DetailTunePanel tune={tune} setTune={setTune} />}

      {showSystem ? (
        <GoogooliiSystemPage caseStudy={caseStudy} onBack={() => setShowSystem(false)} />
      ) : (
      <article className="case-study googoolii-case">
        <header className="googoolii-hero">
          <div className="googoolii-hero__copy">
            <img className="googoolii-hero__logo" src={assetPath(caseStudy.logoImage)} alt="GOOGOOLii logo" />
            <div className="detail-page__name-mask">
              <h1 className="detail-page__name">{title}</h1>
            </div>
            <p className="googoolii-hero__subtitle">{renderInfoText(caseStudy.subtitle)}</p>
            <p className="googoolii-hero__summary">{renderInfoText(caseStudy.summary)}</p>
            <div className="googoolii-role-list" aria-label="My role">
              {caseStudy.roleItems.map((item) => (
                <span key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
          </div>
          <div className="googoolii-hero__stage">
            {caseStudy.heroVideo ? (
              <video
                className="googoolii-hero__screen"
                src={assetPath(caseStudy.heroVideo)}
                poster={assetPath(caseStudy.heroImage)}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                aria-label={caseStudy.heroAlt}
              />
            ) : (
              <img className="googoolii-hero__screen" src={assetPath(caseStudy.heroImage)} alt={caseStudy.heroAlt} />
            )}
          </div>

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
                  <img src={assetPath(item.image)} alt={`${item.title} screenshot`} />
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

        <div className="googoolii-cta">
          <button className="googoolii-cta__button" type="button" onClick={() => setShowSystem(true)}>
            {caseStudy.systemCtaLabel || 'View design system'}
            <ExternalArrowIcon />
          </button>
        </div>
      </article>
      )}
    </div>
  );
}

function CaseStudyPage({ project, content, caseStudy, title, visitLabel, tune, setTune, imageTune, setImageTune, flowTune, setFlowTune, flowCopy, setFlowCopy, pageRef, onClose }) {
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
    goals: '設計目標',
    implementation: '從設計到可上線產品',
    security: '資料可信度與安全設計',
    outcome: '最終成果',
    ...caseStudy.panelTitles,
  };
  const hasFallingArchitectureChips = project.id === 'googoolii' || project.id === 'pickmin';

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
        ✕
      </button>
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
            <PhotoSlot src={caseStudy.heroImage} alt={caseStudy.heroAlt || `${project.name} hero mockup`} label="HERO MOCKUP / 手機或桌機主視覺" />
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

        <div className="case-metrics" aria-label="Project metrics">
          {caseStudy.metrics.map((item) => (
            <div className="case-metric" key={`${item.value}-${item.label}`}>
              <strong>{renderInfoText(item.value)}</strong>
              <span>{renderInfoText(item.label)}</span>
            </div>
          ))}
        </div>

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
                <h3>{renderInfoText(panelTitles.goals)}</h3>
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
                  <PhotoSlot src={item.image} alt={item.slot} label={item.slot} compact className={item.imageFocus} />
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
                ['Visual Principles', caseStudy.designSystem.principles],
                ['Color System', caseStudy.designSystem.colors],
                ['Typography', caseStudy.designSystem.typography],
                ['Interaction States', caseStudy.designSystem.states],
              ].map(([panelTitle, panelBody], index) => (
                <article className={`case-panel ${DESIGN_SYSTEM_TONES[index]}`} key={panelTitle}>
                  <h3>{renderInfoText(panelTitle)}</h3>
                  {panelBody.slice(0, 2).map((item) => (
                    <p key={item}>{renderInfoText(item)}</p>
                  ))}
                </article>
              ))}
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
                <h3>{renderInfoText(panelTitles.implementation)}</h3>
                <p>{renderInfoText(caseStudy.implementation.body)}</p>
                <ul className="case-list">
                  {caseStudy.implementation.items.map((item) => (
                    <li key={item}>{renderInfoText(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="case-panel">
                <h3>{renderInfoText(panelTitles.security)}</h3>
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
              <h3>{renderInfoText(panelTitles.outcome)}</h3>
              <p>{renderInfoText(caseStudy.outcome.body)}</p>
            </div>
            <div className="case-chip-cloud case-chip-cloud--stacked">
              {caseStudy.outcome.items.map((item, index) => (
                <span className={OUTCOME_TONES[index]} key={item}>{renderInfoText(item)}</span>
              ))}
            </div>
          </div>
          {isPickmin && <OutcomeReflection content={caseStudy.outcome} />}
        </CaseSection>

        {isPickmin && (
          <CaseSection title="CTA" className="case-section--cta">
            <ProjectCTA content={caseStudy.cta} liveHref={project.link} />
          </CaseSection>
        )}
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
    setTune(getDetailTune(project));
    setImageTune(DEFAULT_IMAGE_TUNE);
  }, [project?.id]);

  useEffect(() => {
    const nextCaseStudy = project?.caseStudy?.[lang] || project?.caseStudy?.zh;
    setFlowTune(DEFAULT_FLOW_TUNE);
    setFlowCopy(nextCaseStudy?.flow?.note || '');
  }, [project?.id, lang]);

  useEffect(() => {
    if (!project || !pageRef.current) return;

    // lock the underlying page scroll while keeping its position
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let caseObserver;
    let fallingChipObserver;

    const ctx = gsap.context(() => {
      const page = pageRef.current;
      const nameEl = page?.querySelector('.detail-page__name');
      if (!page) return;

      gsap.from(page, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      if (nameEl) {
        gsap.fromTo(
          nameEl,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.72, delay: 0.05, ease: 'power3.out' }
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
      const fallingChipClouds = caseStudy ? Array.from(caseStudy.querySelectorAll('.case-chip-cloud--falling')) : [];
      if (caseStudy && !reduceMotion) {
        const revealGroups = Array.from(caseStudy.querySelectorAll('.case-card-grid, .case-flow, .case-decision-list, .case-design-system, .case-component-strip, .case-chip-cloud--stacked, .pickmin-complexity__grid, .pickmin-ds-intro__map, .pickmin-principles, .pickmin-foundations__colors, .pickmin-core-components, .pickmin-product-components, .pickmin-interaction-flow__grid, .pickmin-motion__grid, .pickmin-localization__grid, .pickmin-system-product__screens, .pickmin-reflection__next, .googoolii-concept-grid, .googoolii-visual-list, .googoolii-color-grid, .googoolii-type-grid, .googoolii-flow-list, .googoolii-interaction-grid'));
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
          { root: pageRef.current, threshold: 0.2 }
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
      document.body.style.overflow = prevOverflow;
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
  const title = detailTitle || (project.id === 'ui-tweaker' ? `${project.name} - skill` : project.name);

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
                <ExternalArrowIcon />
              </a>
            )}
          </section>
        </div>

        <div className="detail-page__media">
          {project.media && isVideo && (
            <video src={assetPath(project.media)} controls autoPlay muted loop playsInline aria-label={project.name} />
          )}
          {project.media && !isVideo && (
            <img
              src={assetPath(project.media)}
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
