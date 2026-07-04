import { useState } from 'react';
import { assetPath } from '../../../utils/assetPath.js';
import ProductComponentShowcase from './ProductComponentShowcase.jsx';

function SectionIntro({ children }) {
  return <p className="pickmin-section-intro">{children}</p>;
}

function PlaceholderBlock({ label, placeholder }) {
  return (
    <div className="pickmin-placeholder">
      <strong>{label}</strong>
      <span>Replace with:</span>
      <code>{placeholder.filename}</code>
      <span>Recommended: {placeholder.size}</span>
      <span>{placeholder.format}</span>
    </div>
  );
}

function getOptimizedImageSources(src) {
  if (!src?.endsWith('.png')) return null;
  return {
    avif: src.replace(/\.png$/, '.avif'),
    webp: src.replace(/\.png$/, '.webp'),
  };
}

function PickminImage({ src, alt = '', loading = 'lazy', width, height }) {
  const sources = getOptimizedImageSources(src);
  if (!sources) return <img src={assetPath(src)} alt={alt} loading={loading} width={width} height={height} />;

  return (
    <picture>
      <source srcSet={assetPath(sources.avif)} type="image/avif" />
      <source srcSet={assetPath(sources.webp)} type="image/webp" />
      <img src={assetPath(src)} alt={alt} loading={loading} width={width} height={height} />
    </picture>
  );
}

function PickminMediaBlock({ media, label, placeholder }) {
  if (!media?.src) return <PlaceholderBlock label={label} placeholder={placeholder} />;

  return (
    <div className="pickmin-media-block">
      {media.type === 'video' ? (
        <video src={assetPath(media.src)} muted loop autoPlay playsInline preload="metadata" aria-label={media.alt || label} />
      ) : (
        <PickminImage src={media.src} alt={media.alt || ''} />
      )}
    </div>
  );
}

function StepLabel({ label }) {
  const match = label.match(/^(\d{2})\s+(.+)$/);
  if (!match) return label;

  return (
    <>
      <span className="pickmin-step-label__number">{match[1]}</span>
      {' '}
      <span className="pickmin-step-label__text">{match[2]}</span>
    </>
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

export function ProductComplexitySection({ content }) {
  return (
    <div className="pickmin-complexity">
      <article className="case-panel pickmin-complexity__copy">
        <h3>{content.title}</h3>
        <p>{content.body}</p>
      </article>
      {content.items?.length > 0 && (
      <div className="pickmin-complexity__grid">
        {content.items.map((item) => (
          <div className="case-metric" key={item.id}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export function DesignSystemIntroSection({ content }) {
  return (
    <div className="pickmin-ds-intro">
      <article className="case-panel pickmin-ds-intro__copy">
        <p>{content.body}</p>
      </article>
      <div className="pickmin-ds-intro__map">
        <div>
          <h3>{content.beforeTitle}</h3>
          {content.before.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="pickmin-ds-intro__arrow" aria-hidden="true">→</div>
        <div>
          <h3>{content.responseTitle}</h3>
          {content.response.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}

export function DesignPrinciplesSection({ items }) {
  return (
    <div className="pickmin-principles">
      {items.map((item) => (
        <article className="pickmin-principle-card" key={item.id}>
          <div className="pickmin-principle-card__media">
            <PickminImage src={item.image} alt="" width="604" height="344" />
          </div>
          <div className="pickmin-principle-card__copy">
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function VisualFoundationsSection({ content }) {
  const tokenMap = Object.fromEntries(content.colorTokens.map((token) => [token.id, token.value]));

  return (
    <div className="pickmin-foundations">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-foundations__colors">
        {content.colors.map((item) => (
          <article className="pickmin-token-card" key={item.id}>
            <span className="pickmin-token-card__swatch" style={{ background: tokenMap[item.id] }} />
            <div>
              <span>{item.group}</span>
              <h3>{item.name}</h3>
              <code>{tokenMap[item.id]}</code>
              <p>{item.usage}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="pickmin-foundations__type">
        <article className="case-panel">
          <h3>Typography</h3>
          <p>{content.typographyNote}</p>
          <div className="pickmin-type-scale">
            {content.typography.map((item) => (
              <div className={`pickmin-type-scale__row pickmin-type-scale__row--${item.id}`} key={item.id}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="case-panel pickmin-spacing-model">
          <h3>Spacing / Radius / Touch</h3>
          <div className="pickmin-spacing-model__card">
            <span>{content.touchTarget}</span>
            <div className="pickmin-spacing-model__surface">
              <strong>Postcard Card</strong>
              <em>Card padding · Element gap · Radius</em>
            </div>
          </div>
          <div className="pickmin-spacing-model__tokens">
            {[...content.spacing, ...content.radius].map((item) => (
              <span key={item.id}>{item.id}: {item.value}</span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export function CoreComponentShowcase({ content }) {
  return (
    <div className="pickmin-core-components">
      <SectionIntro>{content.intro}</SectionIntro>
      {content.items.map((item) => (
        <article className={`pickmin-core-component pickmin-core-component--${item.id}`} key={item.id}>
          <h3>{item.name}</h3>
          <div className="pickmin-core-component__states">
            {item.states.map((state) => (
              <span className={`pickmin-core-state pickmin-core-state--${state.toLowerCase().replace(/[^a-z]+/g, '-')}`} key={state}>
                {state}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProductComponentsSection({ content }) {
  return <ProductComponentShowcase content={content} />;
}

export function InteractionFlowSection({ content }) {
  const [activeStepId, setActiveStepId] = useState(content.steps[0]?.id || 'select');
  const activeIndex = Math.max(0, content.steps.findIndex((step) => step.id === activeStepId));
  const activeStep = content.steps[activeIndex] || content.steps[0];
  const isSheetOpen = activeIndex >= 1;
  const isFolderSelected = activeIndex >= 2;
  const isSaving = activeStepId === 'save';
  const isComplete = activeStepId === 'feedback';

  const nextStep = () => {
    const nextIndex = activeIndex >= content.steps.length - 1 ? 0 : activeIndex + 1;
    setActiveStepId(content.steps[nextIndex].id);
  };

  return (
    <div className="pickmin-interaction-flow">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-interaction-flow__controls" aria-label="Collection flow controls">
        {content.steps.map((step) => (
          <button
            className={step.id === activeStepId ? 'is-active' : ''}
            type="button"
            key={step.id}
            onClick={() => setActiveStepId(step.id)}
            aria-pressed={step.id === activeStepId}
            aria-label={step.label}
          >
            <StepLabel label={step.label} />
          </button>
        ))}
      </div>
      <div className="pickmin-interaction-demo">
        <div className="pickmin-interaction-demo__stage">
          <div className={`pickmin-demo-phone${isSheetOpen ? ' pickmin-demo-phone--sheet-open' : ''}`}>
            <div className="pickmin-demo-phone__bar" />
            <div className="pickmin-demo-screen">
              <div className="pickmin-demo-screen__top">
                <span>Browse</span>
                <strong>Tokyo Tower</strong>
              </div>
              <button
                className={`pickmin-demo-card${activeStepId !== 'select' ? ' is-selected' : ''}`}
                type="button"
                onClick={() => setActiveStepId('open-sheet')}
              >
                <span className="pickmin-demo-card__image" />
                <span className="pickmin-demo-card__copy">
                  <strong>Tokyo Tower Postcard</strong>
                  <em>Minato City · Owned</em>
                </span>
              </button>
              <div className="pickmin-demo-list" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              {isSheetOpen && (
                <div className={`pickmin-demo-sheet${isSaving ? ' is-saving' : ''}${isComplete ? ' is-complete' : ''}`}>
                  <span className="pickmin-demo-sheet__handle" />
                  <div className="pickmin-demo-sheet__head">
                    <strong>Save to collection</strong>
                    <span>{isSaving ? 'Saving' : isComplete ? 'Saved' : 'Select folder'}</span>
                  </div>
                  <div className="pickmin-demo-folders">
                    {['Favorites', 'Tokyo Trip', 'Rare Finds'].map((folder, index) => (
                      <button
                        className={isFolderSelected && index === 1 ? 'is-selected' : ''}
                        type="button"
                        key={folder}
                        onClick={() => setActiveStepId('choose-folder')}
                      >
                        <strong>{folder}</strong>
                        <span>{index === 1 ? '12 postcards' : `${index + 3} postcards`}</span>
                      </button>
                    ))}
                  </div>
                  <button className="pickmin-demo-save" type="button" onClick={() => setActiveStepId(isFolderSelected ? 'save' : 'choose-folder')} disabled={isSaving}>
                    {isSaving ? 'Saving...' : isComplete ? 'Saved' : 'Save postcard'}
                  </button>
                </div>
              )}
              {isComplete && <div className="pickmin-demo-toast">Added to Tokyo Trip</div>}
            </div>
          </div>
        </div>
        <article className="pickmin-flow-step pickmin-flow-step--active">
          <h3>
            <StepLabel label={activeStep.label} />
          </h3>
          <dl>
            <div><dt>Action</dt><dd>{activeStep.action}</dd></div>
            <div><dt>State</dt><dd>{activeStep.state}</dd></div>
            <div><dt>Feedback</dt><dd>{activeStep.feedback}</dd></div>
          </dl>
          <button type="button" onClick={nextStep}>
            {activeIndex >= content.steps.length - 1 ? 'Reset flow' : 'Next state'}
          </button>
        </article>
      </div>
    </div>
  );
}

export function MotionShowcase({ content }) {
  return (
    <div className="pickmin-motion">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-motion__grid">
        {content.items.map((item) => (
          <article className="pickmin-motion-card" key={item.id}>
            <PickminMediaBlock
              label={`MOTION: ${item.name.toUpperCase()}`}
              media={{ type: 'video', src: item.video, alt: `${item.name} motion example` }}
              placeholder={item.placeholder}
            />
            <div className="pickmin-motion-card__copy">
              <h3>{item.name}</h3>
              <p>{item.context}</p>
              <ul>
                <li>Behavior: {item.behavior}</li>
                <li>Duration: {item.duration}</li>
                <li>Easing: {item.easing}</li>
                <li>Reduced Motion: {item.reducedMotion}</li>
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function LocalizationComparison({ content }) {
  return (
    <div className="pickmin-localization">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-localization__grid">
        {content.samples.map((sample) => (
          <article className="pickmin-locale-card" lang={sample.lang} key={sample.id}>
            <span>{sample.label}</span>
            <h3>{sample.title}</h3>
            <p>{sample.meta}</p>
            <button type="button">{sample.action}</button>
          </article>
        ))}
      </div>
      <div className="pickmin-localization__rules">
        {content.rules.map((rule) => <span key={rule}>{rule}</span>)}
      </div>
    </div>
  );
}

export function SystemToProductSection({ content }) {
  return (
    <div className="pickmin-system-product">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-system-product__layers" aria-label="System layers">
        {content.layers.map((layer) => <span key={layer}>{layer}</span>)}
      </div>
      <div className="pickmin-system-product__screens">
        {content.screens.map((screen) => (
          <article className="pickmin-product-screen" key={screen.id}>
            <div className="pickmin-product-screen__media">
              <PickminImage src={screen.image} alt={`${screen.title} product screen`} width="3024" height="1724" />
            </div>
            <div className="pickmin-product-screen__labels">
              <h3>{screen.title}</h3>
              {screen.labels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </article>
        ))}
      </div>
      {content.missing?.map((item) => (
        <PlaceholderBlock key={item.filename} label="Missing product screen" placeholder={item} />
      ))}
    </div>
  );
}

export function OutcomeReflection({ content }) {
  return (
    <div className="pickmin-reflection">
      <article className="case-panel">
        <h3>Reflection</h3>
        <p>{content.reflection}</p>
      </article>
      <div className="pickmin-reflection__next">
        {content.next.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

export function ProjectCTA({ content, liveHref }) {
  return (
    <div className="pickmin-cta">
      <a className="pickmin-cta__button" href={liveHref} target="_blank" rel="noreferrer">
        {content.live}
        <ExternalArrowIcon />
      </a>
    </div>
  );
}
