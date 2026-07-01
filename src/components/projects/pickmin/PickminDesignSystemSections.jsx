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

function PickminMediaBlock({ media, label, placeholder }) {
  if (!media?.src) return <PlaceholderBlock label={label} placeholder={placeholder} />;

  return (
    <div className="pickmin-media-block">
      {media.type === 'video' ? (
        <video src={assetPath(media.src)} muted loop autoPlay playsInline preload="metadata" aria-label={media.alt || label} />
      ) : (
        <img src={assetPath(media.src)} alt={media.alt || ''} loading="lazy" />
      )}
    </div>
  );
}

export function ProductComplexitySection({ content }) {
  return (
    <div className="pickmin-complexity">
      <article className="case-panel pickmin-complexity__copy">
        <h3>{content.title}</h3>
        <p>{content.body}</p>
      </article>
      <div className="pickmin-complexity__grid">
        {content.items.map((item) => (
          <div className="case-metric" key={item.id}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
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
            <img src={assetPath(item.image)} alt="" loading="lazy" width="604" height="344" />
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
  return (
    <div className="pickmin-interaction-flow">
      <SectionIntro>{content.intro}</SectionIntro>
      <div className="pickmin-interaction-flow__grid">
        {content.steps.map((step) => (
          <article className="pickmin-flow-step" key={step.id}>
            <h3>{step.label}</h3>
            <dl>
              <div><dt>Action</dt><dd>{step.action}</dd></div>
              <div><dt>State</dt><dd>{step.state}</dd></div>
              <div><dt>Feedback</dt><dd>{step.feedback}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <PickminMediaBlock label="Collection flow screen" media={content.media} placeholder={content.placeholder} />
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
              <img src={assetPath(screen.image)} alt={`${screen.title} product screen`} loading="lazy" width="3024" height="1724" />
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
      </a>
    </div>
  );
}
