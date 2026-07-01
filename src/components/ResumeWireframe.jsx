import { assetPath } from '../utils/assetPath.js';
import '../styles/components/ResumeWireframe.css';

const expertise = [
  ['01', 'Brand Identity', '品牌識別與系統'],
  ['02', 'Art Direction', '視覺概念與方向'],
  ['03', 'Campaign Design', '數位活動視覺'],
  ['04', 'UI & Interaction', 'UI 與互動設計'],
  ['05', 'Motion Experience', '動態與數位體驗'],
  ['06', 'AI-assisted Design', 'AI 輔助 / VibeCoding'],
];

const projects = [
  ['PICKMIN POSTCARDS', 'Product Design / Design System / VibeCoding'],
  ['UI TWEAKER', 'Tool Design / Interaction Design / AI Plugin'],
  ['GOOGOOLII', 'Brand Strategy / E-commerce / Interactive Experience'],
];

const tools = ['Ai', 'Ps', 'Ae', 'Fi', 'React', 'Vite', 'Next', 'AI', 'Git'];

function SectionLabel({ children }) {
  return <p className="resume-wireframe__label">{children}</p>;
}

export default function ResumeWireframe() {
  return (
    <section className="section resume-wireframe" id="resume-wireframe" aria-label="Resume wireframe">
      <div className="container resume-wireframe__inner">
        <div className="resume-wireframe__poster">
          <aside className="resume-wireframe__visual" aria-label="Portrait placeholder">
            <span className="resume-wireframe__sticker resume-wireframe__sticker--top">Brand</span>
            <span className="resume-wireframe__sticker resume-wireframe__sticker--mid">AI</span>
            <div className="resume-wireframe__placeholder">
              <div />
              <p>Portrait / brand visual</p>
            </div>
            <div className="resume-wireframe__caption">
              <span>Brand Visual Designer</span>
              <span>Taipei, Taiwan</span>
            </div>
          </aside>

          <main className="resume-wireframe__main">
            <header className="resume-wireframe__intro">
              <h2>DORIS KAO</h2>
              <h3>Brand Visual Designer with Digital & AI-driven Practice</h3>
              <p>品牌視覺設計師，專注於品牌系統、數位介面與互動體驗。</p>
              <a className="resume-wireframe__download" href={assetPath('/cv.pdf')} download>
                DOWNLOAD CV
                <span>下載完整 PDF 履歷</span>
              </a>
            </header>

            <section className="resume-wireframe__profile">
              <SectionLabel>PROFILE</SectionLabel>
              <p>
                具備近 5 年品牌與視覺設計經驗，曾於蝦皮購物負責數位素材、品牌合作、IP
                商品與大型線下活動視覺。擅長將品牌概念轉化為可跨媒介延展的視覺語言。
              </p>
              <p>
                近期透過 AI 與 VibeCoding 實際完成 Web App、設計工具與品牌電商網站，持續探索品牌、動態、互動與技術之間的可能性。
              </p>
            </section>

            <section className="resume-wireframe__projects">
              <SectionLabel>SELECTED PROJECTS</SectionLabel>
              <div className="resume-wireframe__project-list">
                {projects.map(([title, meta], index) => (
                  <article key={title} className="resume-wireframe__project">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4>{title}</h4>
                      <p>{meta}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="resume-wireframe__side">
            <section className="resume-wireframe__skills">
              <SectionLabel>CORE EXPERTISE</SectionLabel>
              <div className="resume-wireframe__expertise-grid">
                {expertise.map(([number, title, zh]) => (
                  <article key={number}>
                    <span>{number}</span>
                    <h4>{title}</h4>
                    <p>{zh}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="resume-wireframe__tools">
              <SectionLabel>TOOLS</SectionLabel>
              <div className="resume-wireframe__tool-grid">
                {tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </section>

            <section className="resume-wireframe__experience">
              <SectionLabel>EXPERIENCE</SectionLabel>
              <div className="resume-wireframe__job">
                <h4>SHOPEE TAIWAN</h4>
                <p>Graphic Designer</p>
                <span>2022.08 — 2026.06</span>
                <p>Design Intern</p>
                <span>2021.10 — 2022.08</span>
              </div>
              <ul>
                <li>Brand / Campaign / IP visual</li>
                <li>Offline event & retail touchpoints</li>
                <li>AI workflow tools</li>
              </ul>
            </section>

            <section className="resume-wireframe__mini">
              <SectionLabel>EDUCATION / BEYOND</SectionLabel>
              <p>［學校名稱］ / ［科系名稱］</p>
              <p>Illustration / Character Design / Independent Brand</p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
