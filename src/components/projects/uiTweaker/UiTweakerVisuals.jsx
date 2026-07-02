import '../../../styles/components/UiTweakerVisuals.css';

function PanelVisual() {
  return (
    <div className="ut-visual ut-panel" role="img" aria-label="UI Tweaker property panel with sliders and preview">
      <div className="ut-panel__sidebar">
        {['Type', 'Space', 'Radius', 'Shadow'].map((item, index) => (
          <span className={index === 1 ? 'is-active' : ''} key={item}>{item}</span>
        ))}
      </div>
      <div className="ut-panel__main">
        <div className="ut-panel__preview">
          <span className="ut-panel__badge">Preview</span>
          <div className="ut-panel__card">
            <strong>Primary CTA</strong>
            <em>Hover / focus state</em>
          </div>
        </div>
        <div className="ut-panel__controls">
          {[
            ['Gap', '24'],
            ['Radius', '18'],
            ['Shadow', '0.18'],
          ].map(([label, value]) => (
            <label key={label}>
              <span>{label}</span>
              <i />
              <code>{value}</code>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesVisual() {
  const items = ['Typography', 'Spacing', 'Sizing', 'Radius', 'Shadow', 'Position', 'State', 'Color', 'Output'];
  return (
    <div className="ut-visual ut-categories" role="img" aria-label="Nine UI tuning categories arranged as controls">
      {items.map((item, index) => (
        <span className={`ut-categories__chip ut-categories__chip--${index % 5}`} key={item}>{item}</span>
      ))}
    </div>
  );
}

function HandoffVisual() {
  return (
    <div className="ut-visual ut-handoff" role="img" aria-label="Structured output copied from UI Tweaker to AI workflow">
      <div className="ut-handoff__code">
        <span>{'{'}</span>
        <span>&nbsp;&nbsp;"category": "spacing",</span>
        <span>&nbsp;&nbsp;"property": "gap",</span>
        <span>&nbsp;&nbsp;"value": "24px",</span>
        <span>&nbsp;&nbsp;"intent": "more breathing room"</span>
        <span>{'}'}</span>
      </div>
      <div className="ut-handoff__arrow">→</div>
      <div className="ut-handoff__target">
        <strong>Claude Code</strong>
        <span>Apply targeted UI refinement</span>
      </div>
    </div>
  );
}

const VISUALS = {
  panel: PanelVisual,
  categories: CategoriesVisual,
  handoff: HandoffVisual,
};

export default function UiTweakerVisual({ id, compact = false }) {
  const Cmp = VISUALS[id];
  if (!Cmp) return null;
  return (
    <div className={`ut-visual-slot${compact ? ' ut-visual-slot--compact' : ''}`}>
      <Cmp />
    </div>
  );
}
