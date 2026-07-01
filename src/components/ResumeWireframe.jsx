import '../styles/components/ResumeWireframe.css';

const expertise = [
  ['01', 'Brand Identity & Visual Systems', '品牌識別與視覺系統'],
  ['02', 'Visual Concept & Art Direction', '視覺概念與設計方向'],
  ['03', 'Digital Campaign Design', '數位活動與社群視覺'],
  ['04', 'UI & Interaction Design', 'UI 與互動設計'],
  ['05', 'Motion & Digital Experience', '動態與數位體驗'],
  ['06', 'AI-assisted Design & VibeCoding', 'AI 輔助設計與 VibeCoding'],
];

const projects = [
  {
    title: 'PICKMIN POSTCARDS',
    meta: 'Product Design / Design System / VibeCoding',
    description:
      '為 Pikmin Bloom 玩家設計並實作多語系明信片收藏 Web App，涵蓋資訊架構、視覺系統、UI、互動、動態、資料管理與前端部署。',
  },
  {
    title: 'UI TWEAKER',
    meta: 'Tool Design / Interaction Design / AI Plugin',
    description:
      '針對 AI 輔助開發過程中視覺微調不直覺的問題，設計可即時調整介面並輸出結構化指令的設計工具。',
  },
  {
    title: 'GOOGOOLII',
    meta: 'Brand Strategy / E-commerce / Interactive Experience',
    description:
      '為自有插畫 IP 品牌規劃互動式電商網站，將角色世界觀延伸至商店頁、拖曳購物、動態過場與 3D 結帳流程。',
  },
];

const experienceNotes = [
  '負責品牌、電商與活動視覺設計，涵蓋活動主視覺、Banner、社群素材、EDM、影片與動態內容。',
  '參與品牌合作、IP 商品、包裝與周邊設計，將品牌視覺延伸至不同媒介與使用情境。',
  '主導大型公益活動視覺，負責主視覺、場地輸出、活動地圖、手環、角色立牌與周邊印刷物。',
  '負責蝦皮店到店全台服務據點的線下視覺設計，確保不同尺寸與場域中的品牌一致性。',
  '同時管理 SPX、CSR、HR 等多類型專案，進行需求釐清、時程規劃與跨部門協作。',
  '運用 AI 與 VibeCoding 開發內部自動化工具，改善檔案歸檔與團隊工作流程。',
];

const designTools = [
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Adobe After Effects',
  'Figma',
];

const aiTools = ['Claude', 'Cursor', 'Codex', 'React', 'Vite', 'Next.js', 'Supabase', 'Firebase', 'Git'];

const contacts = [
  ['Email', '［你的 Email］'],
  ['Portfolio', '［作品集網址］'],
  ['LinkedIn', '［LinkedIn 網址］'],
  ['GitHub', '［GitHub 網址］'],
  ['Instagram', '［Instagram 帳號］'],
  ['Location', 'Taipei, Taiwan'],
];

function SectionLabel({ children }) {
  return <p className="resume-wireframe__label">{children}</p>;
}

function WireBlock({ className = '', children }) {
  return <div className={`resume-wireframe__block ${className}`}>{children}</div>;
}

export default function ResumeWireframe() {
  return (
    <section className="section resume-wireframe" id="resume-wireframe" aria-label="Resume wireframe">
      <div className="container resume-wireframe__inner">
        <header className="resume-wireframe__hero">
          <div className="resume-wireframe__portrait">
            <span className="resume-wireframe__sticker resume-wireframe__sticker--top">AI</span>
            <span className="resume-wireframe__sticker resume-wireframe__sticker--mid">UI</span>
            <span className="resume-wireframe__sticker resume-wireframe__sticker--low">CV</span>
            <div className="resume-wireframe__placeholder">
              <span />
              <p>Portrait / brand visual</p>
            </div>
          </div>

          <div className="resume-wireframe__intro">
            <p className="resume-wireframe__kicker">Resume Wireframe</p>
            <h2>DORIS KAO</h2>
            <h3>Brand Visual Designer with Digital & AI-driven Practice</h3>
            <p className="resume-wireframe__summary">
              品牌視覺設計師，專注於品牌系統、數位介面與互動體驗。
            </p>
            <div className="resume-wireframe__hero-meta">
              <span>Taipei, Taiwan</span>
              <span>Brand / UI / AI Workflow</span>
            </div>
          </div>
        </header>

        <div className="resume-wireframe__grid">
          <WireBlock className="resume-wireframe__profile">
            <SectionLabel>PROFILE</SectionLabel>
            <div className="resume-wireframe__profile-layout">
              <div className="resume-wireframe__mini-portrait" aria-hidden="true" />
              <div>
                <p>
                  具備近 5 年品牌與視覺設計經驗，曾於蝦皮購物負責數位素材、品牌合作、IP
                  商品與大型線下活動視覺。擅長將品牌概念轉化為可跨媒介延展的視覺語言，並從設計策略、視覺系統一路延伸至數位介面與互動體驗。
                </p>
                <p>
                  近期透過 AI 與 VibeCoding 工作流程，實際完成 Web App、設計工具與品牌電商網站，持續探索品牌、動態、互動與技術之間的可能性。
                </p>
              </div>
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__experience">
            <SectionLabel>EXPERIENCE</SectionLabel>
            <div className="resume-wireframe__job">
              <div>
                <h4>SHOPEE TAIWAN</h4>
                <p>Graphic Designer</p>
                <span>2022.08 — 2026.06</span>
                <p>Design Intern</p>
                <span>2021.10 — 2022.08</span>
              </div>
              <ul>
                {experienceNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__expertise">
            <SectionLabel>CORE EXPERTISE</SectionLabel>
            <div className="resume-wireframe__expertise-grid">
              {expertise.map(([number, title, zh]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h4>{title}</h4>
                  <p>{zh}</p>
                  <div className="resume-wireframe__thumb" aria-hidden="true" />
                </article>
              ))}
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__projects">
            <SectionLabel>SELECTED PROJECTS</SectionLabel>
            <div className="resume-wireframe__project-list">
              {projects.map((project, index) => (
                <article key={project.title} className="resume-wireframe__project">
                  <span className="resume-wireframe__project-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4>{project.title}</h4>
                    <p className="resume-wireframe__project-meta">{project.meta}</p>
                    <p>{project.description}</p>
                  </div>
                  <div className="resume-wireframe__media-row" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              ))}
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__tools">
            <SectionLabel>TOOLS</SectionLabel>
            <div className="resume-wireframe__tool-columns">
              <div>
                <h4>DESIGN</h4>
                <div className="resume-wireframe__tool-list">
                  {designTools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4>AI & DEVELOPMENT</h4>
                <div className="resume-wireframe__tool-list">
                  {aiTools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__education">
            <SectionLabel>EDUCATION</SectionLabel>
            <div className="resume-wireframe__split-row">
              <div className="resume-wireframe__square" aria-hidden="true" />
              <div>
                <h4>［學校名稱］</h4>
                <p>［科系名稱］</p>
                <span>［入學年份］—［畢業年份］</span>
              </div>
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__beyond">
            <SectionLabel>BEYOND WORK</SectionLabel>
            <div className="resume-wireframe__beyond-list">
              <span>Illustration</span>
              <span>Character Design</span>
              <span>Independent Brand</span>
              <span>Interactive Experiments</span>
            </div>
          </WireBlock>

          <WireBlock className="resume-wireframe__contact">
            <SectionLabel>CONTACT</SectionLabel>
            <div className="resume-wireframe__contact-grid">
              {contacts.map(([label, value]) => (
                <p key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </p>
              ))}
            </div>
            <a className="resume-wireframe__download" href="/portfolio/cv.pdf" download>
              DOWNLOAD CV
              <span>下載完整 PDF 履歷</span>
            </a>
          </WireBlock>
        </div>
      </div>
    </section>
  );
}
