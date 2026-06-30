import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/ProjectCard.css';

export default function ProjectCard({ project, onOpen }) {
  const { lang, t } = useLanguage();
  const isVideo = project.mediaType === 'video';
  const cardHeight = typeof project.height === 'number' ? `${project.height}px` : project.height;
  const cardOffset = typeof project.marginTop === 'number' ? `${project.marginTop}px` : project.marginTop || '0px';

  return (
    <div
      className={`project-card project-card--${project.id}`}
      style={{
        '--project-card-default-height': cardHeight,
        '--project-card-offset': cardOffset,
      }}
    >
      <button
        className="project-card__media"
        onClick={() => onOpen(project)}
      >
        <div className="project-card__flip">
          {/* 預設背面：橘色 */}
          <div className="project-card__face project-card__back">
            <span className="project-card__back-mark">DK®</span>
          </div>
          {/* 翻開後正面：作品 */}
          <div className="project-card__face project-card__front">
            {project.media &&
              (isVideo ? (
                <video
                  src={assetPath(project.media)}
                  poster={project.poster ? assetPath(project.poster) : undefined}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={project.name}
                />
              ) : (
                <img
                  src={assetPath(project.media)}
                  alt={project.name}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ))}
            <span className="project-card__pill">{t.viewProject}</span>
          </div>
        </div>
      </button>
      <div className="project-card__meta">
        <span className="project-card__name">{project.name}</span>
        <span className="project-card__category">— {project.category[lang]}</span>
      </div>
    </div>
  );
}
