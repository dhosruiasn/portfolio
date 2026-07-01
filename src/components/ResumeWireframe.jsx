import { useLanguage } from '../context/LanguageContext.jsx';
import { resumeData } from '../data/resume.js';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/ResumeWireframe.css';

function SectionLabel({ children, id }) {
  return (
    <h2 className="resume-wireframe__label" id={id}>
      {children}
    </h2>
  );
}

function ContactItem({ item, lang }) {
  const value = typeof item.value === 'object' ? item.value[lang] : item.value;

  return (
    <li className={`resume-wireframe__contact-item${item.disabled ? ' resume-wireframe__contact-item--disabled' : ''}`}>
      <span>{item.label[lang]}</span>
      {item.href ? (
        <a
          href={assetPath(item.href)}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={`${item.label[lang]}: ${value}`}
        >
          {value}
        </a>
      ) : (
        <em aria-disabled={item.disabled ? 'true' : undefined}>{value}</em>
      )}
    </li>
  );
}

function CvActions({ cv }) {
  const cvHref = `${import.meta.env.BASE_URL}${cv.file}`;

  return (
    <div className="resume-wireframe__cv-actions" aria-label="CV actions">
      <a
        className="resume-wireframe__cv-button resume-wireframe__cv-button--primary"
        href={cvHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cv.viewLabel}
      </a>
      <a
        className="resume-wireframe__cv-button resume-wireframe__cv-button--secondary"
        href={cvHref}
        download
      >
        {cv.downloadLabel}
      </a>
    </div>
  );
}

function ExperienceSection({ content }) {
  return (
    <section className="resume-wireframe__experience" aria-labelledby="resume-experience-title">
      <SectionLabel id="resume-experience-title">{content.labels.experience}</SectionLabel>
      <div className="resume-wireframe__company">{content.experience.companyHeading}</div>
      <div className="resume-wireframe__experience-list">
        {content.experience.roles.map((role) => (
          <article className="resume-wireframe__experience-item" key={role.id}>
            <time>{role.period}</time>
            <div className="resume-wireframe__experience-copy">
              <h3>{role.title}</h3>
              <ul>
                {role.responsibilities.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ content, onProjectOpen }) {
  return (
    <section className="resume-wireframe__projects" aria-labelledby="resume-projects-title">
      <SectionLabel id="resume-projects-title">{content.labels.projects}</SectionLabel>
      <div className="resume-wireframe__project-list">
        {content.projects.map((project) => (
          <a
            key={project.id}
            className="resume-wireframe__project"
            href="#digital-works"
            onClick={(event) => onProjectOpen(event, project.id)}
            aria-label={`${content.labels.viewProject.replace(' ↗', '')}: ${project.title}`}
          >
            <span className="resume-wireframe__project-number">{project.number}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.meta}</p>
            </div>
            <strong>{content.labels.viewProject}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function ResumeWireframe() {
  const { lang } = useLanguage();
  const content = resumeData[lang];
  const cv = resumeData.cv[lang];
  const visibleLinks = resumeData.links.filter((item) => item.href);

  const handleProjectOpen = (event, projectId) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId } }));
  };

  return (
    <section className="section resume-wireframe" id="resume-wireframe" aria-label={content.ariaLabel}>
      <div className="container resume-wireframe__inner">
        <div className="resume-wireframe__poster">
          <aside className="resume-wireframe__visual">
            <div className="resume-wireframe__portrait">
              <span className="resume-wireframe__sticker resume-wireframe__sticker--top" aria-hidden="true">
                Brand
              </span>
              <span className="resume-wireframe__sticker resume-wireframe__sticker--mid" aria-hidden="true">
                AI
              </span>
              <div className="resume-wireframe__placeholder">
                <img src={assetPath(resumeData.portrait.src)} alt={content.portraitAlt} />
              </div>
              <div className="resume-wireframe__caption">
                <span>{content.role}</span>
                <span>{content.location}</span>
              </div>
            </div>

            <div className="resume-wireframe__contact">
              <SectionLabel>{content.labels.contact}</SectionLabel>
              <ul>
                {resumeData.contact.map((item) => (
                  <ContactItem key={item.id} item={item} lang={lang} />
                ))}
              </ul>
            </div>

            <div className="resume-wireframe__links">
              <SectionLabel>{content.labels.links}</SectionLabel>
              <ul>
                {visibleLinks.map((item) => (
                  <ContactItem key={item.id} item={item} lang={lang} />
                ))}
              </ul>
            </div>
          </aside>

          <main className="resume-wireframe__main">
            <header className="resume-wireframe__intro">
              <h1 className="resume-wireframe__title">{content.title}</h1>
              <p className="resume-wireframe__positioning">{content.positioning}</p>
              <p className="resume-wireframe__intro-line">{content.intro}</p>
              <CvActions cv={cv} />
            </header>

            <section className="resume-wireframe__profile" aria-labelledby="resume-profile-title">
              <SectionLabel id="resume-profile-title">{content.labels.profile}</SectionLabel>
              <p>{content.profile}</p>
            </section>
          </main>

          <aside className="resume-wireframe__side">
            <section className="resume-wireframe__skills" aria-labelledby="resume-expertise-title">
              <SectionLabel id="resume-expertise-title">{content.labels.expertise}</SectionLabel>
              <div className="resume-wireframe__expertise-grid">
                {content.expertise.map((item) => (
                  <article key={item.id}>
                    <span>{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="resume-wireframe__tools" aria-labelledby="resume-tools-title">
              <SectionLabel id="resume-tools-title">{content.labels.tools}</SectionLabel>
              <div className="resume-wireframe__tool-groups">
                {content.tools.map((group) => (
                  <div className="resume-wireframe__tool-group" key={group.id}>
                    <h3>{group.title}</h3>
                    <div className="resume-wireframe__tool-list">
                      {group.items.map((tool) => (
                        <span className={tool.note ? 'resume-wireframe__tool-pill resume-wireframe__tool-pill--stacked' : 'resume-wireframe__tool-pill'} key={tool.id}>
                          <strong>{tool.label}</strong>
                          {tool.note ? <em>{tool.note}</em> : null}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <div className="ResumeLowerGrid resume-wireframe__lower">
            <ProjectsSection content={content} onProjectOpen={handleProjectOpen} />
            <ExperienceSection content={content} />
          </div>
        </div>
      </div>
    </section>
  );
}
